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
    await db.runSql(
      `CREATE TYPE customer_status AS ENUM('ACTIVE', 'INACTIVE')`)
    await db.runSql(
      `CREATE TYPE customer_type AS ENUM('NATURAL', 'JURIDICAL')`)

    await db.createTable('customers', {
      id: {
        type: 'bigint',
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: 'bigint'
      },
      status: {
        type: 'customer_status',
        notNull: true
      },
      type: {
        type: 'customer_type',
        notNull: true
      },
      name: {
        type: 'string'
      },
      notes: {
        type: 'string'
      },
      document: {
        type: 'string'
      },
      street_name: {
        type: 'string'
      },
      street_number: {
        type: 'string'
      },
      complementary: {
        type: 'string'
      },
      neighborhood: {
        type: 'string'
      },
      city: {
        type: 'string'
      },
      zipcode: {
        type: 'string'
      },
      state: {
        type: 'string'
      },
      instance_id: {
        type: 'bigint',
        notNull: true,
        foreignKey: {
          name: 'customers_instances_id_fk',
          table: 'instances',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        }
      },
      user_id: {
        type: 'bigint',
        notNull: true,
        foreignKey: {
          name: 'users_instances_id_fk',
          table: 'users',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        }
      },
      created_at: {
        type: 'timestamp',
        notNull: true
      },
      updated_at: {
        type: 'timestamp'
      },
      deleted_at: {
        type: 'timestamp'
      },
    });

    await helpers.requiresSequence(db, 'customers', 'code');

    await db.createTable('customer_phones', {
      id: {
        type: 'bigint',
        primaryKey: true,
        autoIncrement: true
      },
      position: {
        type: 'bigint',
        defaultValue: 0
      },
      customer_id: {
        type: 'bigint',
        notNull: true,
        foreignKey: {
          name: 'customer_phones_customers_id_fk',
          table: 'customers',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        }
      },
      phone: {
        type: 'string',
        notNull: true
      },
    });

    await helpers.hasPosition(db, {
      table: 'customer_phones',
      groupWhere: 'actual.customer_id = row.customer_id'
    });

    await db.createTable('customer_emails', {
      id: {
        type: 'bigint',
        primaryKey: true,
        autoIncrement: true
      },
      position: {
        type: 'bigint',
        defaultValue: 0
      },
      customer_id: {
        type: 'bigint',
        notNull: true,
        foreignKey: {
          name: 'customer_emails_customers_id_fk',
          table: 'customers',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        }
      },
      email: {
        type: 'string',
        notNull: true
      },
    });

    await helpers.hasPosition(db, {
      table: 'customer_emails',
      groupWhere: 'actual.customer_id = row.customer_id'
    });

    await db.createTable('customers_users', {
      id: {
        type: 'bigint',
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: 'bigint',
        notNull: true,
        foreignKey: {
          name: 'customers_users_users_id_fk',
          table: 'users',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        }
      },
      customer_id: {
        type: 'bigint',
        notNull: true,
        foreignKey: {
          name: 'customers_users_customers_id_fk',
          table: 'customers',
          mapping: 'id',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
          }
        }
      }
    });
  } catch (err) {
    console.error(err)
  }
};

exports.down = async function(db) {
  await db.runSql(`DROP TYPE IF EXISTS customer_status CASCADE`);
  await db.runSql(`DROP TYPE IF EXISTS customer_type CASCADE`);
  await db.dropTable('customer_phones', {
    ifExists: true
  });
  await db.dropTable('customer_emails', {
    ifExists: true
  });
  await db.dropTable('customers_users', {
    ifExists: true
  });
  await db.dropTable('customers', {
    ifExists: true,
    cascade: true
  });
};

exports._meta = {
  "version": 1
};
