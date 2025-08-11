import { EntityManager } from '@mikro-orm/core';
import { Injectable, PipeTransform, NotFoundException } from '@nestjs/common';

import { User } from '@/database/entities/user.entity';

@Injectable()
export class GetUserFromSlugPipe implements PipeTransform {
  constructor(private em: EntityManager) {}

  async transform(slug: string) {
    const user = await this.em.findOne(User, { publicSlug: slug });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
