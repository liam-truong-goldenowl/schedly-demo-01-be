import { slugify, transliterate } from 'transliteration';

/**
 * Converts a user's full name to a URL-friendly slug.
 * @param name The full name to convert.
 * @returns The generated slug.
 */
export function generateSlug(name: string): string {
  const CHARACTERS_TO_BE_REPLACED = /[_']/g;
  const CHARACTERS_TO_REPLACE = '';
  const SLUG_SEPARATOR = '-';

  const cleanedName = transliterate(name, {
    trim: true,
    replace: [[CHARACTERS_TO_BE_REPLACED, CHARACTERS_TO_REPLACE]],
  });

  return slugify(cleanedName, { lowercase: true, separator: SLUG_SEPARATOR });
}
