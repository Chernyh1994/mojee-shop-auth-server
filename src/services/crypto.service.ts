import * as crypto from 'crypto';
import { Decipher } from 'crypto';

/**
 * CryptoService class.
 */
export default class CryptoService {
  /**
   * @constructor
   */
  constructor(
    /**
     * Cipher algorithms.
     *
     * @access private
     * @type string
     */
    private algorithm: string = 'aes-256-cbc',
  ) {}

  /**
   * @function Encrypt data.
   * @access public
   * @param content:string
   * @param secret:string
   * @param iv:string
   * @return string
   */
  public encrypt(content: string, secret: string, iv: string): string {
    const secretKey: Buffer = Buffer.from(secret, 'utf-8');
    const initVector: Buffer = Buffer.from(iv, 'utf-8');
    const cipher: Decipher = crypto.createCipheriv(this.algorithm, secretKey, initVector);
    let encryptedData: string = cipher.update(content, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    return encryptedData;
  }

  /**
   * @function Decrypt data.
   * @access public
   * @param encryptContent:string
   * @param secret:string
   * @param iv:string
   * @return string
   */
  public decrypt(encryptContent: string, secret: string, iv: string): string {
    const secretKey: Buffer = Buffer.from(secret, 'utf-8');
    const initVector: Buffer = Buffer.from(iv, 'utf-8');
    const decipher: Decipher = crypto.createDecipheriv(this.algorithm, secretKey, initVector);
    let decryptedData: string = decipher.update(encryptContent, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');

    return decryptedData;
  }
}
