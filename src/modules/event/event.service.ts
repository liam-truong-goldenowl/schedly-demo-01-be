import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Event } from '@/database/entities';
import { generateSlug } from '@/utils/helpers/strings';
import { UUIDService } from '@/modules/uuid/uuid.service';

@Injectable()
export class EventService {
  constructor(
    private em: EntityManager,
    private uuidService: UUIDService,
  ) {}

  async generateUniqueSlugForUser({
    name,
    userId,
  }: {
    name: string;
    userId: number;
  }) {
    const baseSlug = generateSlug(name);
    let candidateSlug = baseSlug;

    const slugExists = await this.em.count(Event, {
      user: userId,
      slug: candidateSlug,
    });

    if (slugExists > 0) {
      const suffix = await this.uuidService.generate();
      candidateSlug = `${baseSlug}-${suffix}`;
    }

    return candidateSlug;
  }
}
