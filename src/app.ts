import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import logger from './logger';
import setupRoutes from './routes/index';
import { HttpError } from './utils/errors/http.error';
import { FailureResult } from './utils/result';

const app: express.Express = express();
app.use(express.json());

app.use(
  cors({
    origin: '*',
  })
);

setupRoutes(app);

app.use(
  (
    error: HttpError,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (error.status >= 500) {
      logger.error(error.toString());
    }

    new FailureResult({
      msg: error.msg ?? error.message,
      msgCode: error.msgCode,
      code: error.status,
    }).handle(res);
  }
);

export default app;
