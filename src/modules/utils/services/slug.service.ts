import { Injectable } from '@nestjs/common';
import { slugify, transliterate } from 'transliteration';

import { UUIDService } from './uuid.service';

@Injectable()
export class SlugService {
  constructor(private readonly uuidService: UUIDService) {}

  async generate(name: string): Promise<string> {
    const normalizedName = transliterate(name, {
      trim: true,
      replace: [[/[_']/g, '']],
    });
    return slugify(normalizedName, { lowercase: true, separator: '-' });
  }

  async generateUnique(name: string): Promise<string> {
    const slug = await this.generate(name);
    const uniqueSuffix = await this.uuidService.generate();
    return `${slug}-${uniqueSuffix}`;
  }
}
