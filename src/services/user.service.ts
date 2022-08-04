import * as bcrypt from 'bcrypt';
import UserRepository from '../repositories/user.repository';
import RoleService from './role.service';
import ForbiddenException from '../commons/exceptions/http/forbidden.exception';
import { UserRoleValue } from '../commons/enums/user-role.enum';
import { CreateUserDto } from '../commons/dto/services/user/create-user.dto';
import { RoleEntity } from '../entity/role.entity';
import { UserEntity } from '../entity/user.entity';

/**
 * UserService class.
 */
export default class UserService {
  /**
   * @constructor
   */
  constructor(
    /**
     * UserRepository Dependency Injection.
     *
     * @access private
     * @type UserRepository
     */
    private userRepository: UserRepository,

    /**
     * RoleService Dependency Injection.
     *
     * @access private
     * @type RoleService
     */
    private roleService: RoleService,
  ) {}

  /**
   * @function Create a new user in the database.
   * @access public
   * @param createUser:CreateUserDto
   * @return Promise<UserEntity>
   */
  public async createUser(createUser: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({ email: createUser.email });

    if (user) {
      throw new ForbiddenException('Email is not available.');
    }

    const role: RoleEntity = await this.roleService.findOneByNameOrCreate(UserRoleValue.USER);

    createUser.password = await this.hashPassword(createUser.password);
    createUser.role_id = role.id;

    return await this.userRepository.create(createUser);
  }

  /**
   * @function Get user by email.
   * @access public
   * @param email:string
   * @return Promise<UserEntity>
   */
  public async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email });
  }

  /**
   * @function Activate user.
   * @access public
   * @param id:number
   * @return Promise<UserEntity>
   */
  public async verifyUser(id: number): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({ id });

    if (!user) {
      throw new ForbiddenException('User not found.');
    }

    return await this.userRepository.update(id, { is_verified: true });
  }

  /**
   * @function Change user password in the database.
   * @access public
   * @param id:number
   * @param password:string
   * @return Promise<UserEntity>
   */
  public async changePassword(id: number, password: string): Promise<UserEntity> {
    const user: UserEntity = await this.userRepository.findOne({ id });

    if (!user) {
      throw new ForbiddenException('User not found.');
    }

    const hashPassword: string = await this.hashPassword(password);

    return await this.userRepository.update(id, { password: hashPassword });
  }

  /**
   * @function Hash user password.
   * @access private
   * @param password:string
   * @return Promise<string>
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return bcrypt.hash(password, salt);
  }
}
