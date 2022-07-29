import * as bcrypt from 'bcrypt';
import UserService from './user.service';
import TokenService from './token.service';
import MailService from './mail.service';
import { UserEntity } from '../entity/user.entity';
import { CreateUserDto } from '../commons/dto/create-user.dto';
import { LoginUserDto } from '../commons/dto/login-user.dto';
import ForbiddenException from '../commons/exceptions/http/forbidden.exception';

export default class AuthService {
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private mailService: MailService,
  ) {}

  public async registration(
    credentials: CreateUserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user: UserEntity = await this.userService.createUser(credentials);
    const accessToken: string = this.tokenService.generateJwtAccessToken(
      user.id,
    );
    const refreshToken: string = await this.tokenService.generateRefreshToken(
      user.id,
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  public async login(
    credentials: LoginUserDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user: UserEntity = await this.userService.findUserByEmail(
      credentials.email,
    );

    if (!user || user.is_deleted) {
      throw new ForbiddenException('User is not found.');
    }

    const isValidPassword: boolean = await AuthService.checkPassword(
      credentials.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new ForbiddenException('Access denied.');
    }

    const accessToken: string = this.tokenService.generateJwtAccessToken(
      user.id,
    );
    const refreshToken: string = await this.tokenService.generateRefreshToken(
      user.id,
    );

    return { access_token: accessToken, refresh_token: refreshToken };
  }

  public async logout() {
    //check token
    //remove refresh token
    //return true or exception
  }

  public async verifyUser() {
    //check link
    //update user is_verify to true
    //return true or exception
  }

  private static async checkPassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }
}
