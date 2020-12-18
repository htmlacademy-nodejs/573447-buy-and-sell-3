import express from 'express';
import apiRouter from '~/service/api/api';
import { getLogger } from '~/helpers';
import { CliCommandName, HttpCode, LoggerName } from '~/common/enums';
import { API_PREFIX } from '~/common/constants';
import { HttpError } from '~/common/exceptions';
import { Request, Response, NextFunction } from '~/common/types';
import { DEFAULT_PORT } from './common';

const app = express();
const logger = getLogger({
  name: LoggerName.API,
});

app.use(express.json());
app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);

  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
  });

  return next();
});
app.use(API_PREFIX, apiRouter);
app.use((req, res) => {
  logger.error(`Route not found: ${req.url}`);

  return res.status(HttpCode.NOT_FOUND).send(`Not found`);
});

app.use((err: HttpError, _req: Request, _res: Response, _next: NextFunction) => {
  logger.error(`An error occured on processing request: ${err.message}`);
});

export default {
  name: CliCommandName.SERVER,
  run(args: string[]): void {
    const [customPort] = args;
    const port = Number(customPort) || DEFAULT_PORT;

    const server = app.listen(port, () => {
      return logger.info(`Listening to connections on ${port}`);
    });

    server.once(`error`, (err) => {
      return logger.error(
        `An error occured on server creation: ${err.message}`,
      );
    });
  },
};
