import * as crypto from 'crypto';
import { Decipher } from 'crypto';

export default class CryptoService {
  constructor(private algorithm: string = 'aes-256-cbc') {}

  public encrypt(content: string, secret: string, iv: string): string {
    const secretKey: Buffer = Buffer.from(secret, 'utf-8');
    const initVector: Buffer = Buffer.from(iv, 'utf-8');

    const cipher: Decipher = crypto.createCipheriv(
      this.algorithm,
      secretKey,
      initVector,
    );
    let encryptedData: string = cipher.update(content, 'utf-8', 'hex');
    encryptedData += cipher.final('hex');

    return encryptedData;
  }

  public decrypt(encryptContent: string, secret: string, iv: string): string {
    const secretKey: Buffer = Buffer.from(secret, 'utf-8');
    const initVector: Buffer = Buffer.from(iv, 'utf-8');

    const decipher: Decipher = crypto.createDecipheriv(
      this.algorithm,
      secretKey,
      initVector,
    );
    let decryptedData: string = decipher.update(encryptContent, 'hex', 'utf-8');
    decryptedData += decipher.final('utf-8');

    return decryptedData;
  }
}
