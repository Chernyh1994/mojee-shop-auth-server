import * as bcrypt from 'bcrypt';
import UserRepository from '../repositories/user.repository';
import ForbiddenException from '../commons/exceptions/http/forbidden.exception';
import RoleService from './role.service';
import { UserRoleValue } from '../commons/enums/user-role.enum';
import { RoleEntity } from '../entity/role.entity';
import { CreateUserDto } from '../commons/dto/create-user.dto';
import { UserEntity } from '../entity/user.entity';

export default class UserService {
  constructor(
    private userRepository: UserRepository,
    private roleService: RoleService,
  ) {}

  public async createUser(createUser: CreateUserDto): Promise<any> {
    const user: UserEntity = await this.findUserByEmail(createUser.email);

    if (user) {
      throw new ForbiddenException('Email is not available.');
    }

    const role: RoleEntity = await this.roleService.findOneByNameOrCreate(
      UserRoleValue.USER,
    );

    createUser.password = await UserService.hashPassword(createUser.password);
    createUser.role_id = role.id;

    return await this.userRepository.create(createUser);
  }

  public async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email });
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }
}
