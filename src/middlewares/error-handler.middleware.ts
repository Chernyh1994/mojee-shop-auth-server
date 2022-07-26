import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/http/http.exception';
import WinstonLogger from '../../toolkit/winston-logger.toolkit';
import { HttpStatusCode } from '../exceptions/http/enums/http-startus-code.enum';

const logger: WinstonLogger = new WinstonLogger();

export default function errorHandlerMiddleware(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
) {
  let status: HttpStatusCode = HttpStatusCode.INTERNAL_SERVER_ERROR;
  let message: { status: HttpStatusCode; error: string } = {
    status,
    error: 'Internal Server Error.',
  };
  const routeStack: any = request.route.stack;
  const methodName: string = routeStack[routeStack.length - 1].name;
  const requestBody: object = request.body;
  const copyRequestBody: any = Object.assign({}, requestBody);

  if ('password' in copyRequestBody) {
    copyRequestBody.password = '************';
  }

  const data: string | null =
    Object.keys(copyRequestBody).length === 0
      ? null
      : JSON.stringify(copyRequestBody);

  if (error instanceof HttpException) {
    status = error.status;
    message = error.serializeErrors();
  }

  const log = `${JSON.stringify(
    message,
  )} | method: ${methodName} | data: ${data}`;

  logger.create.error(log);

  response.status(status).json(message);
}
