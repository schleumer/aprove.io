const hasPosition = async (db, { table, column = 'position', groupWhere = null }) => {
  const triggerFnName = `fn_set_${table}_${column}_position`
  const triggerName = `trg_fn_set_${table}_${column}_position`

  const reorderTriggerFnName = `fn_reorder_${table}_${column}_position`
  const reorderTriggerName = `trg_fn_reorder_${table}_${column}_position`

  const indexName = `${table}.${column}`

  await db.runSql(`
    CREATE OR REPLACE FUNCTION "${triggerFnName}"()
      RETURNS TRIGGER AS
    $$
    DECLARE
      row "${table}";
    BEGIN
      row := new;
      RAISE INFO 'triggering:${triggerFnName} %', TG_OP;

      new.position = (
        SELECT coalesce(max(actual."${column}"), 0)
        FROM "${table}" as actual
        ${groupWhere ? `WHERE ${groupWhere}` : ''}
      ) + 1;

      RETURN new;
    END
    $$
    LANGUAGE 'plpgsql';

    CREATE OR REPLACE FUNCTION "${reorderTriggerFnName}"()
      RETURNS TRIGGER AS
    $$
    DECLARE
      row "${table}";
    BEGIN
      row := old;
      RAISE INFO 'triggering:${reorderTriggerFnName} %', TG_OP;

      UPDATE "${table}" AS actual
      SET position = position - 1
      WHERE position >= row."${column}"
      ${groupWhere ? `AND ${groupWhere}` : ''};

      RETURN old;
    END
    $$
    LANGUAGE 'plpgsql';

    DROP TRIGGER IF EXISTS "${triggerName}"
    ON "${table}";
    CREATE TRIGGER "${triggerName}"
      BEFORE INSERT
      ON "${table}"
      FOR EACH ROW EXECUTE PROCEDURE ${triggerFnName}();

    DROP TRIGGER IF EXISTS "${reorderTriggerName}"
    ON "${table}";
    CREATE TRIGGER "${reorderTriggerName}"
      AFTER DELETE
      ON "${table}"
      FOR EACH ROW EXECUTE PROCEDURE ${reorderTriggerFnName}();
  `)
}

const requiresSequence = async (db, table, column) => {
  const triggerFnName = `fn_set_${table}_${column}`
  const triggerName = `trg_fn_set_${table}_${column}`
  const indexName = `${table}.${column}`

  await db.runSql(`
    CREATE OR REPLACE FUNCTION ${triggerFnName}()
      RETURNS TRIGGER AS
    $$
    DECLARE
    BEGIN
      RAISE INFO 'triggering:${triggerFnName} %', TG_OP;
      IF (new.${column} IS NULL)
      THEN
        IF (new.instance_id IS NULL)
        THEN
          RAISE EXCEPTION '[${triggerFnName}:${table}:${column}] Você precisa referenciar um instance_id.';
        ELSE
          new.${column} := fn_next_instance_seq(new.instance_id, '${indexName}');
        END IF;
      END IF;

      RETURN new;
    END
    $$
    LANGUAGE 'plpgsql';
  `)

  await db.runSql(`
    DROP TRIGGER IF EXISTS ${triggerName}
    ON ${table};

    CREATE TRIGGER ${triggerName}
    BEFORE INSERT ON ${table}
    FOR EACH ROW EXECUTE PROCEDURE ${triggerFnName}();
  `)
}

module.exports = { requiresSequence, hasPosition }
