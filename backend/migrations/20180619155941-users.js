'use strict';

var dbm;
var type;
var seed;

const helpers = require('./helpers');

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
  try {
  await db.runSql(`CREATE TYPE user_status AS ENUM('ACTIVE', 'INACTIVE')`)
  await db.runSql(`CREATE TYPE user_type AS ENUM('ROOT', 'ADMIN')`)

  await db.createTable('users', {
    id: { type: 'bigint', primaryKey: true, autoIncrement: true },
    code: { type: 'bigint' },
    type: { type: 'user_type', defaultValue: 'ADMIN', notNull: true },
    status: { type: 'user_status', defaultValue: 'ACTIVE', notNull: true },
    name: { type: 'string' },
    email: { type: 'string' },
    password: { type: 'string' },
    instance_id: {
      type: 'bigint',
      notNull: true,
      foreignKey: {
        name: 'users_instances_id_fk',
        table: 'instances',
        mapping: 'id',
        rules: {
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        }
      }
    },
    created_at: { type: 'timestamp', notNull: true },
    updated_at: { type: 'timestamp' },
    deleted_at: { type: 'timestamp' },
  });

  await helpers.requiresSequence(db, 'users', 'code');

  await db.runSql(`ALTER SEQUENCE users_id_seq RESTART WITH 10000`);

  await db.runSql(`INSERT INTO users VALUES (1, NULL, 'ROOT', 'ACTIVE', '🤖 System User 🤖', 'root@aprove', null, 1, NOW(), NOW())`);
} catch (err) {
  console.error(err)
}
};

exports.down = async function(db) {
  await db.runSql(`DROP TYPE IF EXISTS user_status CASCADE`);
  await db.runSql(`DROP TYPE IF EXISTS user_type CASCADE`);
  await db.dropTable('users', { ifExists: true, cascade: true });
};

exports._meta = {
  "version": 1
};
