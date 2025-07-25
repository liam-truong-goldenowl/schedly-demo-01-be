import { slugify, transliterate } from 'transliteration';

/**
 * Converts a user's full name to a URL-friendly slug.
 * @param fullName The full name to convert.
 * @returns The generated slug.
 */
export function createPublicSlug(fullName: string): string {
  const cleanedName = transliterate(fullName, {
    replace: [[/[_']/g, '']], // replace _ and ' with ''
    trim: true,
  });

  return slugify(cleanedName, {
    lowercase: true,
    separator: '-',
    trim: true,
  });
}
