import { Response } from 'express';
import {
  FingerprintedRequest,
  ClientFingerprint,
  ConnectionFingerprint,
  ServerFingerprint
} from '@ch1/browser-dna-express';
import { SqlDb } from '@ch1/sql-tables';
import { DbSchema, Referrers, ClientFingerprints } from './typegen';
import { Fingerprint } from '@ch1/browser-dna-express';

export function fingerprintStore<T extends DbSchema>(sqlDb: SqlDb<T>) {
  return (req: FingerprintedRequest, res: Response, next: Function) => {
    if (!req.fingerprint) {
      next(new Error('browser-dna-express middleware not installed'));
      return;
    }
    trackFingerprint(sqlDb, req.fingerprint)
      .then(() => next())
      .catch((err: Error) => next(err));
  };
}

function trackFingerprint(sql: SqlDb<DbSchema>, fp: Fingerprint) {
  return storeFingerprints(sql, fp).then(results => {
    return sql.tables.Hits.insert(results);
  });
}

type FPIndex = {
  server_fp_index: number;
  connection_fp_index: number;
  client_fp_index?: number;
};

function storeFingerprints(
  sql: SqlDb<DbSchema>,
  fp: Fingerprint
): Promise<FPIndex> {
  return Promise.all([
    storeServerFingerprint(sql, fp.server),
    storeConnectionFingerprint(sql, fp.connection)
  ]).then((results: number[]) => {
    if (fp.client) {
      return storeClientFingerprint(sql, fp.client, results[0]).then(
        (client_fp_index: number) => {
          return {
            server_fp_index: results[0],
            connection_fp_index: results[1],
            client_fp_index
          } as FPIndex;
        }
      );
    }

    return {
      server_fp_index: results[0],
      connection_fp_index: results[1]
    } as FPIndex;
  });
}

function storeServerFingerprint(sql: SqlDb<DbSchema>, fp: ServerFingerprint) {
  return Promise.all([
    selectIndexOrInsert(sql, 'Languages', ['csLocales'], [fp.language]),
    selectIndexOrInsert(sql, 'UserAgents', ['string'], [fp.userAgent])
  ])
    .then(results => {
      const cols = ['language_index', 'user_agent_index', 'usesDnt'];
      const vals: any = [results[0], results[1], fp.usesDnt];
      return selectIndexOrInsert(sql, 'ServerFingerprints', cols, vals).then(
        () => {
          return sql.tables.ServerFingerprints.selectWhere(cols, vals);
        }
      );
    })
    .then(pluckIndexOrThrow);
}

function storeConnectionFingerprint(
  sql: SqlDb<DbSchema>,
  fp: ConnectionFingerprint
) {
  return Promise.all([
    selectIndexOrInsert(sql, 'Referrers', ['referrer'], [fp.referrer]),
    selectIndexOrInsert(sql, 'Ipv4', ['ip'], [fp.ip]),
    selectIndexOrInsert(sql, 'HttpVerbs', ['verb'], [fp.method])
  ])
    .then(results => ({
      referrer_index: results[0],
      ip_index: results[1],
      verb_index: results[2]
    }))
    .then(results => {
      const cols = ['referrer_index', 'ip_index', 'verb_index'];
      const vals = [
        results.referrer_index,
        results.ip_index,
        results.verb_index
      ];
      return selectIndexOrInsert(
        sql,
        'ConnectionFingerprints',
        cols,
        vals
      ).then(() => {
        return sql.tables.ConnectionFingerprints.selectWhere(cols, vals);
      });
    })
    .then(pluckIndexOrThrow);
}

function storeClientFingerprint(
  sql: SqlDb<DbSchema>,
  fp: ClientFingerprint,
  serverFingerprintIndex: number
) {
  return Promise.all([
    selectIndexOrInsert(
      sql,
      'BrowserViews',
      ['depth', 'height', 'width'],
      [fp.browserDepth, fp.browserHeight, fp.browserWidth]
    ),
    selectIndexOrInsert(sql, 'Systems', ['osString'], [fp.os]),
    selectIndexOrInsert(
      sql,
      'PluginDescs',
      ['csDescs'],
      [JSON.stringify(fp.plugins)]
    )
  ])
    .then(([browser_view_index, os_index, plugin_index]) => {
      const cols = [
        'browser_view_index',
        'os_index',
        'plugin_index',
        'concurrency',
        'server_fp_index',
        'tzOffset',
        'usesCookies',
        'usesTouch'
      ];
      const vals = [
        browser_view_index,
        os_index,
        plugin_index,
        fp.concurrency,
        serverFingerprintIndex,
        fp.tzOffset,
        fp.usesCookies,
        fp.usesTouch
      ];

      return selectIndexOrInsert(sql, 'ClientFingerprints', cols, vals).then(
        () => {
          return sql.tables.ClientFingerprints.selectWhere(cols, vals as any);
        }
      );
    })
    .then(pluckIndexOrThrow);
}

function selectIndexOrInsert(
  sql: SqlDb<DbSchema>,
  table: string,
  cols: string[],
  vals: any[]
): Promise<number> {
  return sql.selectWhere(table, cols, vals).then((things: any[]) => {
    if (things.length) {
      return things[0].index;
    }

    return sql
      .insert(table, cols, vals)
      .then(() => selectIndexOrInsert(sql, table, cols, vals));
  });
}

function pluckIndexOrThrow(results: any[]) {
  if (results.length) {
    return results[0].index;
  }

  throw new Error('unexpected lack of results');
}
