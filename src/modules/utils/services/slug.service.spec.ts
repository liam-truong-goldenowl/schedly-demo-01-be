import { SlugService } from './slug.service';

describe('SlugService', () => {
  let slugService: SlugService;

  beforeEach(() => {
    slugService = new SlugService();
  });

  describe('generate', () => {
    it('should convert a string to a slug format', () => {
      const result = slugService.generate('Hello World');
      expect(result).toBe('hello-world');
    });

    it('should convert to lowercase', () => {
      const result = slugService.generate('UPPER CASE');
      expect(result).toBe('upper-case');
    });

    it('should replace spaces with hyphens', () => {
      const result = slugService.generate('multiple   spaces   here');
      expect(result).toBe('multiple-spaces-here');
    });

    it('should remove special characters', () => {
      const result = slugService.generate('special!@#$%^&*()chars');
      expect(result).toBe('specialchars');
    });

    it('should transliterate non-latin characters', () => {
      const result = slugService.generate('привет мир');
      expect(result).toBe('privet-mir');
    });

    it('should remove apostrophes and underscores', () => {
      const result = slugService.generate("user's_profile");
      expect(result).toBe('users-profile');
    });

    it('should handle mixed characters and formatting correctly', () => {
      const result = slugService.generate('Café au lait & Crème brûlée');
      expect(result).toBe('cafe-au-lait-creme-brulee');
    });

    it('should handle empty strings', () => {
      const result = slugService.generate('');
      expect(result).toBe('');
    });
  });
});
