import { NextFunction, Request, Response } from 'express';
import HttpException from '../commons/exceptions/http/http.exception';
import { HttpStatusCode } from '../commons/enums/http-startus-code.enum';
import { logger } from '../commons/toolkit/winston-logger.toolkit';

/**
 * @function Middleware for global error handlers for the user.
 * @param error:Error
 * @param req:Request
 * @param res:Response
 * @param next:NextFunction
 * @return void
 */
export default function errorHandlerMiddleware(error: Error, req: Request, res: Response, next: NextFunction): void {
  let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  let message: { status: HttpStatusCode; error: string } = {
    status,
    error: 'Internal Server Error.',
  };
  const routeStack: any = req.route.stack;
  const methodName: string = routeStack[routeStack.length - 1].name;
  const requestBody: object = req.body;
  const copyRequestBody: any = Object.assign({}, requestBody);

  if ('password' in copyRequestBody) {
    copyRequestBody.password = '************';
  }

  const data: string | null = Object.keys(copyRequestBody).length === 0 ? null : JSON.stringify(copyRequestBody);

  if (error instanceof HttpException) {
    status = error.status;
    message = error.serializeErrors();
  }

  const log = `${JSON.stringify(message)} | method: ${methodName} | data: ${data}`;

  logger.error(log);

  res.status(status).json(message);
}
