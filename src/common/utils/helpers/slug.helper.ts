import { slugify, transliterate } from 'transliteration';

import { UUIDHelper } from './uuid.helper';

export class SlugHelper {
  static async generate(name: string): Promise<string> {
    const normalizedName = transliterate(name, {
      trim: true,
      replace: [[/[_']/g, '']],
    });
    return slugify(normalizedName, { lowercase: true, separator: '-' });
  }

  static async generateUnique(name: string): Promise<string> {
    const slug = await this.generate(name);
    const uniqueSuffix = await UUIDHelper.generate();
    return `${slug}-${uniqueSuffix}`;
  }
}
