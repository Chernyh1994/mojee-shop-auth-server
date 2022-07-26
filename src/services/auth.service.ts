import UserRepository from '../repositories/user.repository';

export default class AuthService {
  constructor(private userRepository: UserRepository) {}

  public async login(): Promise<any> {
    return await this.userRepository.findAll();
  }
}
