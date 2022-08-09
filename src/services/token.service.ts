import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import TokenRepository from '../repositories/token.repository';
import { authConfig } from '../../config/auth.config';
import { TokenEntity } from '../entity/token.entity';
import CryptoService from './crypto.service';
import { ResponseTokensType } from '../commons/types/response.type';
import UnauthorizedException from '../commons/exceptions/http/unauthorized.exception';
import { UpdateTokenDto } from '../commons/dto/services/token/update-token.dto';
import { CreateTokenDto } from '../commons/dto/services/token/create-token.dto';

/**
 * TokenService class.
 */
export default class TokenService {
  /**
   * @constructor
   */
  constructor(
    /**
     * TokenRepository Dependency Injection.
     *
     * @access private
     * @type TokenRepository
     */
    private tokenRepository: TokenRepository,

    /**
     * CryptoService Dependency Injection.
     *
     * @access private
     * @type CryptoService
     */
    private cryptoService: CryptoService,
  ) {}

  /**
   * @function Generate access token and refresh token.
   * @access public
   * @param userId:number
   * @return Promise<ResponseTokensType>
   */
  public async generateTokens(userId: number): Promise<ResponseTokensType> {
    const accessToken: string = this.generateJwtAccessToken(userId);
    const refreshToken: string = await this.generateRefreshToken(userId);

    return { accessToken, refreshToken };
  }

  /**
   * @function Refresh access token and refresh token.
   * @access public
   * @param encryptRefreshToken:string
   * @return Promise<ResponseTokensType>
   */
  public async refreshTokens(encryptRefreshToken: string): Promise<ResponseTokensType> {
    const oldRefreshToken: string = this.decryptRefreshToken(encryptRefreshToken);
    let token: TokenEntity = await this.validateRefreshToken(oldRefreshToken);

    if (!token) {
      throw new UnauthorizedException('Unauthorized.');
    }

    const tokenData: UpdateTokenDto = {
      refresh_token: uuidv4(),
      expires_in: authConfig.expireInRefresh,
    };

    token = await this.tokenRepository.update(token.id, tokenData);

    const accessToken = this.generateJwtAccessToken(token.user_id);
    const refreshToken = this.encryptRefreshToken(token.refresh_token);

    return { accessToken, refreshToken };
  }

  /**
   * @function Delete token from database.
   * @access public
   * @param encryptRefreshToken:string
   * @return Promise<boolean>
   */
  public async deleteRefreshToken(encryptRefreshToken: string): Promise<boolean> {
    const refreshToken: string = this.decryptRefreshToken(encryptRefreshToken);

    return await this.tokenRepository.delete({ refresh_token: refreshToken });
  }

  /**
   * @function Generate JWT access token.
   * @access private
   * @param userId:number
   * @return string
   */
  private generateJwtAccessToken(userId: number): string {
    return jwt.sign({ sub: userId }, authConfig.secretAccess, { expiresIn: authConfig.expireInAccess });
  }

  /**
   * @function Generate refresh token.
   * @access private
   * @param userId:number
   * @return Promise<string>
   */
  private async generateRefreshToken(userId: number): Promise<string> {
    const tokenData: CreateTokenDto | UpdateTokenDto = {
      user_id: userId,
      refresh_token: uuidv4(),
      expires_in: authConfig.expireInRefresh,
    };
    let token: TokenEntity = await this.tokenRepository.findOne({ user_id: userId });

    if (token) {
      token = await this.tokenRepository.update(token.id, tokenData);

      return this.encryptRefreshToken(token.refresh_token);
    }

    token = await this.tokenRepository.create(tokenData);

    return this.encryptRefreshToken(token.refresh_token);
  }

  /**
   * @function Encrypt refresh token.
   * @access private
   * @param refreshToken:string
   * @return string
   */
  private encryptRefreshToken(refreshToken: string): string {
    return this.cryptoService.encrypt(refreshToken, authConfig.secretRefresh, authConfig.ivRefresh);
  }

  /**
   * @function Decrypt refresh token.
   * @access private
   * @param encryptRefreshToken:string
   * @return string
   */
  private decryptRefreshToken(encryptRefreshToken: string): string {
    return this.cryptoService.decrypt(encryptRefreshToken, authConfig.secretRefresh, authConfig.ivRefresh);
  }

  /**
   * @function Validate refresh token.
   * @access private
   * @param refreshToken:string
   * @return Promise<TokenEntity|null>
   */
  private async validateRefreshToken(refreshToken: string): Promise<TokenEntity | null> {
    const token: TokenEntity = await this.tokenRepository.findOne({ refresh_token: refreshToken });

    if (token || token.expires_in > new Date()) {
      return token;
    }

    return null;
  }
}
