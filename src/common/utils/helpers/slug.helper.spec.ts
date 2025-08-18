import { slugify, transliterate } from 'transliteration';

import { SlugHelper } from './slug.helper';
import { UUIDHelper } from './uuid.helper';

jest.mock('transliteration', () => ({
  slugify: jest.fn(),
  transliterate: jest.fn(),
}));

jest.mock('./uuid.helper', () => ({
  UUIDHelper: {
    generate: jest.fn(),
  },
}));

describe('SlugHelper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generate', () => {
    it('should generate a slug from a regular string', async () => {
      const name = 'Test String';
      const normalizedName = 'Test String';
      const expectedSlug = 'test-string';

      (transliterate as unknown as jest.Mock).mockReturnValue(normalizedName);
      (slugify as unknown as jest.Mock).mockReturnValue(expectedSlug);

      const result = await SlugHelper.generate(name);

      expect(transliterate).toHaveBeenCalledWith(name, {
        trim: true,
        replace: [[/[_']/g, '']],
      });
      expect(slugify).toHaveBeenCalledWith(normalizedName, {
        lowercase: true,
        separator: '-',
      });
      expect(result).toBe(expectedSlug);
    });

    it('should handle special characters and transliterations', async () => {
      const name = 'Héllò Wörld_test';
      const normalizedName = 'Hello World test';
      const expectedSlug = 'hello-world-test';

      (transliterate as unknown as jest.Mock).mockReturnValue(normalizedName);
      (slugify as unknown as jest.Mock).mockReturnValue(expectedSlug);

      const result = await SlugHelper.generate(name);

      expect(transliterate).toHaveBeenCalledWith(name, {
        trim: true,
        replace: [[/[_']/g, '']],
      });
      expect(slugify).toHaveBeenCalledWith(normalizedName, {
        lowercase: true,
        separator: '-',
      });
      expect(result).toBe(expectedSlug);
    });

    it('should handle empty string', async () => {
      const name = '';
      const normalizedName = '';
      const expectedSlug = '';

      (transliterate as unknown as jest.Mock).mockReturnValue(normalizedName);
      (slugify as unknown as jest.Mock).mockReturnValue(expectedSlug);

      const result = await SlugHelper.generate(name);

      expect(transliterate).toHaveBeenCalledWith(name, {
        trim: true,
        replace: [[/[_']/g, '']],
      });
      expect(slugify).toHaveBeenCalledWith(normalizedName, {
        lowercase: true,
        separator: '-',
      });
      expect(result).toBe(expectedSlug);
    });
  });

  describe('generateUnique', () => {
    it('should generate a unique slug with UUID suffix', async () => {
      const name = 'Test String';
      const slug = 'test-string';
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const expectedUniqueSlug = `${slug}-${uuid}`;

      jest.spyOn(SlugHelper, 'generate').mockResolvedValue(slug);
      (UUIDHelper.generate as jest.Mock).mockResolvedValue(uuid);

      const result = await SlugHelper.generateUnique(name);

      expect(SlugHelper.generate).toHaveBeenCalledWith(name);
      expect(UUIDHelper.generate).toHaveBeenCalled();
      expect(result).toBe(expectedUniqueSlug);
    });

    it('should handle empty string for unique slug generation', async () => {
      const name = '';
      const slug = '';
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const expectedUniqueSlug = `-${uuid}`;

      jest.spyOn(SlugHelper, 'generate').mockResolvedValue(slug);
      (UUIDHelper.generate as jest.Mock).mockResolvedValue(uuid);

      const result = await SlugHelper.generateUnique(name);

      expect(SlugHelper.generate).toHaveBeenCalledWith(name);
      expect(UUIDHelper.generate).toHaveBeenCalled();
      expect(result).toBe(expectedUniqueSlug);
    });
  });
});
