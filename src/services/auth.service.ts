import { Service } from 'typedi';
import ForbiddenException from '../exceptions/forbidden.exception';

@Service()
export default class AuthService {
  public async login(test): Promise<string> {
    throw new ForbiddenException('test exception.');
    return test + 'test API point';
  }
}
