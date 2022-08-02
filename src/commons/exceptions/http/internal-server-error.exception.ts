import HttpException from './http.exception';
import { HttpStatusCode } from '../../enums/http-startus-code.enum';

export default class InternalServerErrorException extends HttpException {
  public status: HttpStatusCode;
  public message: string;

  constructor(message: string) {
    super('Internal Server Error.');
    Object.setPrototypeOf(this, InternalServerErrorException.prototype);
    this.status = HttpStatusCode.INTERNAL_SERVER_ERROR;
    this.message = message;
  }

  serializeErrors() {
    return { status: this.status, error: this.message };
  }
}
