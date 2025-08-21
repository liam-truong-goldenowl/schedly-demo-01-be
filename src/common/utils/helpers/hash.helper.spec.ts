import * as bcrypt from 'bcrypt';

import { HashHelper } from './hash.helper';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn(),
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('HashHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate a hash with proper salt rounds', async () => {
      const mockSalt = 'generated-salt';
      const mockHash = 'hashed-value';
      const source = 'password123';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const result = await HashHelper.generate(source);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(source, mockSalt);
      expect(result).toBe(mockHash);
    });

    it('should handle empty string', async () => {
      const mockSalt = 'generated-salt';
      const mockHash = 'empty-string-hash';
      const source = '';

      (bcrypt.genSalt as jest.Mock).mockResolvedValue(mockSalt);
      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

      const result = await HashHelper.generate(source);

      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith(source, mockSalt);
      expect(result).toBe(mockHash);
    });

    it('should propagate bcrypt errors', async () => {
      const error = new Error('Bcrypt error');
      (bcrypt.genSalt as jest.Mock).mockRejectedValue(error);

      await expect(HashHelper.generate('password')).rejects.toThrow(
        'Bcrypt error',
      );
    });
  });

  describe('verify', () => {
    it('should return true when hash matches source', async () => {
      const source = 'password123';
      const hashedValue = 'hashed-password';

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await HashHelper.verify(source, hashedValue);

      expect(bcrypt.compare).toHaveBeenCalledWith(source, hashedValue);
      expect(result).toBe(true);
    });

    it('should return false when hash does not match source', async () => {
      const source = 'wrong-password';
      const hashedValue = 'hashed-password';

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await HashHelper.verify(source, hashedValue);

      expect(bcrypt.compare).toHaveBeenCalledWith(source, hashedValue);
      expect(result).toBe(false);
    });

    it('should propagate bcrypt errors during verification', async () => {
      const error = new Error('Verification error');
      (bcrypt.compare as jest.Mock).mockRejectedValue(error);

      await expect(HashHelper.verify('password', 'hash')).rejects.toThrow(
        'Verification error',
      );
    });
  });
});
