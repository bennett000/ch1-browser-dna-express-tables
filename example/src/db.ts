import { create as createSql } from '@ch1/sql-tables';
import { randomName } from './names';
import { SqlDb } from '@ch1/sql-tables';
import { DbSchema, schema } from '@ch1/browser-dna-express-tables';

export const schemaName = 'browser-dna-example';

export function create() {
  return createSql<DbSchema>({
    user: schemaName,
    database: schemaName,
    password: 'this-is-dev',
    host: 'postgres',
    port: 5432,
  }, {
    ...schema,
    /** optionally add custom schema here */
  });
}
