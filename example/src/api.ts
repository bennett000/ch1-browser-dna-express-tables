import { Request, Response } from 'express';
import { SqlDb } from '@ch1/sql-tables';
import { readFile } from 'fs';
import { join } from 'path';

const files: { [key: string]: string } = {};

export interface Handler {
  handler(req: Request, res: Response, next?: Function): any;
  method: 'delete' | 'get' | 'patch' | 'post' | 'put';
  route: string;
}

export const api: (sql: SqlDb<any>) => Handler[] =
  (sql: SqlDb<any>) => [
    {
      handler: bundleJs,
      method: 'get',
      route: '/bundle.js',
    },
    {
      handler: getLogin,
      method: 'get',
      route: '/login',
    },
    {
      handler: okay200,
      method: 'post',
      route: '/login',
    },
  ];

function okay200(req: Request, res: Response) {
  res.sendStatus(200);
}

function getLogin(req: Request, res: Response) {
  res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Browser DNA Example</title>
    </head>
    <body>
      <script src="/bundle.js"></script>
    </body>
</html>
  `);
}

function bundleJs(req: Request, res: Response) {
  read(join(__dirname, 'bundle.js'))
    .then((result: string) => {
      res.setHeader('Content-Type', 'application/javascript');
      res.send(result);
    })
    .catch((err: Error) => {
      res.status(500);
      res.send(err);
    });
}

function read(path: string) {
  if (files[path]) {
    return Promise.resolve(files[path]);
  }
  return new Promise((resolve, reject) => {
    readFile(path, { encoding: 'utf8' }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        files[path] = result;
        resolve(result);
      }
    })
  });
}
