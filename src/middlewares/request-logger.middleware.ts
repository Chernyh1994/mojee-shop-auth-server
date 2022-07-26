import { Request, Response, NextFunction } from 'express';
import WinstonLogger from '../../toolkit/winston-logger.toolkit';

const logger: WinstonLogger = new WinstonLogger();

export default function requestLoggerMiddleware(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  const requestMethod: string = request.method;
  const requestBody: any = request.body;
  const requestUrl: string = request.url;
  const copyRequestBody: any = Object.assign({}, requestBody);

  if ('password' in copyRequestBody) {
    copyRequestBody.password = '************';
  }

  const data: string | null =
    Object.keys(copyRequestBody).length === 0
      ? null
      : JSON.stringify(copyRequestBody);
  const log = `${data} | method: ${requestMethod} | URL: ${requestUrl}`;

  logger.create.data(log);

  next();
}
