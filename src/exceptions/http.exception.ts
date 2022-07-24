import { HttpStatusCode } from './enums/http-startus-code.enum';

export default abstract class HttpException extends Error {
  abstract status: HttpStatusCode;

  protected constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, HttpException.prototype);
  }

  abstract serializeErrors(): {
    error: string;
    status: number;
  };
}
