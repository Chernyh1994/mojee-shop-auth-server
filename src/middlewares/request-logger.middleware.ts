import { Request, Response, NextFunction } from 'express';
import { logger } from '../commons/toolkit/winston-logger.toolkit';

/**
 * @function Request logging middleware.
 * @param req:Request
 * @param res:Response
 * @param next:NextFunction
 * @return void
 */
export default function requestLoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestMethod: string = req.method;
  const requestBody: any = req.body;
  const requestUrl: string = req.url;
  const copyRequestBody: any = Object.assign({}, requestBody);

  if ('password' in copyRequestBody) {
    copyRequestBody.password = '************';
  }

  const data: string | null = Object.keys(copyRequestBody).length === 0 ? null : JSON.stringify(copyRequestBody);
  const log = `${data} | method: ${requestMethod} | URL: ${requestUrl}`;

  logger.data(log);

  next();
}
