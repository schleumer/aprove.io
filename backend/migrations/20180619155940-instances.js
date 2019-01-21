'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  await db.createTable('instances', {
    id: { type: 'bigint', primaryKey: true, autoIncrement: true },
    name: { type: 'string', notNull: true },
    created_at: { type: 'timestamp', notNull: true },
    updated_at: { type: 'timestamp' },
    deleted_at: { type: 'timestamp' },
  });

  await db.createTable('instance_sequences', {
    id: { type: 'bigint', primaryKey: true, autoIncrement: true },
    key: { type: 'string', notNull: true },
    value: { type: 'bigint' },
    instance_id: {
      type: 'bigint',
      foreignKey: {
        name: 'instance_sequences_instances_id_fk',
        table: 'instances',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
  })

  await db.runSql(`
    CREATE OR REPLACE FUNCTION fn_next_instance_seq(instance BIGINT, sequence_name VARCHAR(150))
      RETURNS BIGINT AS
    $$
    DECLARE
      prev_row INSTANCE_SEQUENCES;
      next_val BIGINT;
    BEGIN
      SELECT *
      FROM instance_sequences
      WHERE "instance_id" = instance AND "key" = sequence_name
      INTO prev_row
      FOR UPDATE;

      next_val := COALESCE(prev_row.value, 0) + 1;

      IF prev_row IS NULL
      THEN
        LOCK TABLE instance_sequences;
        BEGIN
          INSERT INTO instance_sequences ("key", "value", "instance_id") VALUES (sequence_name, 1, instance);
          EXCEPTION WHEN UNIQUE_VIOLATION
          THEN
            RETURN fn_next_instance_seq(instance, sequence_name);
        END;
      ELSE
        UPDATE instance_sequences
        SET "value" = next_val
        WHERE "instance_id" = instance AND "key" = sequence_name;
      END IF;


      RETURN next_val;
    END
    $$
    LANGUAGE 'plpgsql';
  `)

  await db.runSql(`ALTER SEQUENCE instances_id_seq RESTART WITH 10000`)

  await db.runSql(`INSERT INTO instances VALUES (1, '🤖 System Instance 🤖', NOW(), NOW())`)
};

exports.down = async function(db) {
  await db.dropTable('instance_sequences', { ifExists: true });
  await db.dropTable('instances', { ifExists: true });
};

exports._meta = {
  "version": 1
};
