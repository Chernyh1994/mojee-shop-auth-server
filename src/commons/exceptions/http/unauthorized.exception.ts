import HttpException from './http.exception';
import { HttpStatusCode } from '../../enums/http-startus-code.enum';

export default class UnauthorizedException extends HttpException {
  public status: HttpStatusCode;
  public message: string;

  constructor(message: string) {
    super('Unauthorized.');
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
    this.status = HttpStatusCode.UNAUTHORIZED;
    this.message = message;
  }

  serializeErrors() {
    return { status: this.status, error: this.message };
  }
}
