import { create as createSql } from '@ch1/sql-tables';
import { DbSchema, schema } from '@ch1/browser-dna-express-tables';
import * as env from './env';

export function create() {
  return createSql<DbSchema>({
    user: env.dbUser,
    database: env.dbName,
    password: env.dbPass,
    host: env.dbHost,
    port: env.dbPort,
  }, {
    ...schema,
    /** optionally add custom schema here */
  });
}
