import { Service } from 'typedi';

@Service()
export default class AuthService {
  public async login(test): Promise<string> {
    return test + 'test API point';
  }
}
