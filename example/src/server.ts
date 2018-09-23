import * as express from 'express';
import { Request, Response } from 'express';
import { Handler } from './api';
import { fingerprint, FingerprintedRequest } from '@ch1/browser-dna-express';
import { fingerprintStore, DbSchema } from '@ch1/browser-dna-express-tables';
import { SqlDb } from '@ch1/sql-tables';
import * as env from './env';

const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');


export function initServer(sql: SqlDb<DbSchema>, api: Handler[]) {
  const app = express();
  const port = env.apiPort;

  const corsOptions = {
    methods: 'POST,GET',
    // some legacy browsers (IE11, various SmartTVs) choke on 204
    optionsSuccessStatus: 200,
    origin: '*',
  };


  const limiter = new RateLimit({
    max: 15 * 60,               // limit max requests to 1/second
    keyGenerator: (req: FingerprintedRequest) => JSON.stringify(req.fingerprint), // yay rate limits
    windowMs: 15 * 60 * 1000,   // memory duration
  });

  app.disable('x-powered-by');
  app.enable('trust proxy');

//  apply to all requests
  app.use(limiter);

  app.use(bodyParser.json());
  app.use(cors(corsOptions));
  app.use(helmet());

  // setup the logging software
  app.use(fingerprint() as any);
  app.use(fingerprintStore(sql) as any);

  app.get('/favicon.ico', (req: Request, res: Response) => res.sendStatus(200));
  app.get('/status', (req: Request, res: Response) => {
    res.send('Alive');
  });

  api.forEach((h: Handler) => {
    app[h.method](h.route, h.handler);
  });

  app.get('*', (req: Request, res: Response) => {
    res.sendStatus(403);
  });

  app.listen(port, () => console.log(`API Listening on ${port}`));
}
