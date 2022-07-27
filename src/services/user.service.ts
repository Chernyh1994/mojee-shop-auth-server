import * as bcrypt from 'bcrypt';
import UserRepository from '../repositories/user.repository';
import ForbiddenException from '../commons/exceptions/http/forbidden.exception';
import { UserEntity } from '../entity/user.entity';

export default class UserService {
  constructor(private userRepository: UserRepository) {}

  public async createUser(createUserDto): Promise<UserEntity> {
    return await this.userRepository.create(createUserDto);
  }

  public async validateExistUser(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email });

    if (user) {
      throw new ForbiddenException('Email is not available.');
    }

    return true;
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }
}
