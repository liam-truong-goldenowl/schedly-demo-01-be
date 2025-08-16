import { UUIDService } from './uuid.service';

describe('UUIDService', () => {
  let service: UUIDService;

  beforeEach(() => {
    service = new UUIDService();
  });

  describe('generate', () => {
    it('should return a string of correct length', async () => {
      const result = await service.generate();
      expect(result.length).toBe(8);
    });

    it('should return a string with only characters from the character set', async () => {
      const result = await service.generate();
      const characterSet =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      expect(
        result.split('').every((char) => characterSet.includes(char)),
      ).toBe(true);
    });

    it('should generate different UUIDs on subsequent calls', async () => {
      const result1 = await service.generate();
      const result2 = await service.generate();
      expect(result1).not.toBe(result2);
    });
  });
});
