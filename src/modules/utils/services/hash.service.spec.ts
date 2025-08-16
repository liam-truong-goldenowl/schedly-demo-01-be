import { Test, TestingModule } from '@nestjs/testing';

import { HashService } from './hash.service';

describe('HashService', () => {
  let service: HashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HashService],
    }).compile();

    service = module.get<HashService>(HashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a hash for a given string', async () => {
      const source = 'password123';
      const hashed = await service.generate(source);
      expect(typeof hashed).toBe('string');
      expect(hashed).not.toBe(source);
      expect(hashed.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for different inputs', async () => {
      const hash1 = await service.generate('foo');
      const hash2 = await service.generate('bar');
      expect(hash1).not.toBe(hash2);
    });

    it('should generate different hashes for the same input (due to salt)', async () => {
      const source = 'samepassword';
      const hash1 = await service.generate(source);
      const hash2 = await service.generate(source);
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verify', () => {
    it('should return true for correct password and hash', async () => {
      const source = 'mySecret!';
      const hashed = await service.generate(source);
      const result = await service.verify(source, hashed);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const source = 'rightPassword';
      const wrongSource = 'wrongPassword';
      const hashed = await service.generate(source);
      const result = await service.verify(wrongSource, hashed);
      expect(result).toBe(false);
    });

    it('should return false for completely different hash', async () => {
      const source = 'test';
      const fakeHash = '$2b$10$abcdefghijklmnopqrstuv';
      const result = await service.verify(source, fakeHash);
      expect(result).toBe(false);
    });
  });
});
