import * as crypto from 'crypto';
import { Decipher } from 'crypto';
import CryptoService from '../../../src/services/crypto.service';

describe('CryptoService', () => {
  let cryptoService: CryptoService;
  let encryptedData: string
  let content: string;
  let secret: string;
  let iv: string;
  let algorithm: string;

  beforeEach(() => {
    content = 'test';
    secret = 'JAVON6SIy5URTjJeYZrhHxHPAGDEVM6z';
    iv = '9Nh1AHT9SVbtpxa8';
    algorithm = 'aes-256-cbc';
    cryptoService = new CryptoService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('encrypt', () => {
    test('Should return encryptData', async () => {
      const secretKey: Buffer = Buffer.from(secret, 'utf-8');
      const initVector: Buffer = Buffer.from(iv, 'utf-8');
      const cipher: Decipher = crypto.createCipheriv(algorithm, secretKey, initVector);
      encryptedData = cipher.update(content, 'utf-8', 'hex');
      encryptedData += cipher.final('hex');
      const result = cryptoService.encrypt(content, secret, iv);

      expect(result).toBe(encryptedData);
    });
  });

  describe('decrypt', () => {
    test('Should return decryptData', async () => {
      const secretKey: Buffer = Buffer.from(secret, 'utf-8');
      const initVector: Buffer = Buffer.from(iv, 'utf-8');
      const decipher: Decipher = crypto.createDecipheriv(algorithm, secretKey, initVector);
      let decryptedData: string = decipher.update(encryptedData, 'hex', 'utf-8');
      decryptedData += decipher.final('utf-8');
      const result = cryptoService.decrypt(encryptedData, secret, iv);

      expect(result).toBe(decryptedData);
    });
  });
});
