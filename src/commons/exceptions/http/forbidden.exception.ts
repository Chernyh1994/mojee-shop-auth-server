import HttpException from './http.exception';
import { HttpStatusCode } from '../../enums/http-startus-code.enum';

export default class ForbiddenException extends HttpException {
  public status: HttpStatusCode;
  public message: string;

  constructor(message: string) {
    super('Forbidden.');
    Object.setPrototypeOf(this, ForbiddenException.prototype);
    this.status = HttpStatusCode.FORBIDDEN;
    this.message = message;
  }

  serializeErrors() {
    return { status: this.status, error: this.message };
  }
}
