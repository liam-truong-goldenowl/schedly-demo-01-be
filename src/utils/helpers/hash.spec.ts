import { verifyHash, generateHash } from './hash';

describe('generateHash', () => {
  it('should generate a hash for a given string', async () => {
    const source = 'password123';
    const hashed = await generateHash({ source });
    expect(typeof hashed).toBe('string');
    expect(hashed).not.toBe(source);
    expect(hashed.length).toBeGreaterThan(0);
  });

  it('should generate different hashes for different inputs', async () => {
    const hash1 = await generateHash({ source: 'foo' });
    const hash2 = await generateHash({ source: 'bar' });
    expect(hash1).not.toBe(hash2);
  });

  it('should generate different hashes for the same input (due to salt)', async () => {
    const source = 'samepassword';
    const hash1 = await generateHash({ source });
    const hash2 = await generateHash({ source });
    expect(hash1).not.toBe(hash2);
  });
});

describe('verifyHash', () => {
  it('should return true for correct password and hash', async () => {
    const source = 'mySecret!';
    const hashed = await generateHash({ source });
    const result = await verifyHash({ source, hash: hashed });
    expect(result).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const source = 'rightPassword';
    const wrongSource = 'wrongPassword';
    const hashed = await generateHash({ source });
    const result = await verifyHash({ source: wrongSource, hash: hashed });
    expect(result).toBe(false);
  });

  it('should return false for completely different hash', async () => {
    const source = 'test';
    const fakeHash = '$2b$10$abcdefghijklmnopqrstuv';
    const result = await verifyHash({ source, hash: fakeHash });
    expect(result).toBe(false);
  });
});
