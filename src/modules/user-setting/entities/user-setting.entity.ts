import { Enum, Entity, Property, OneToOne } from '@mikro-orm/core';

import { Language } from '@/common/enums';
import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';

@Entity()
export class UserSetting extends BaseEntity {
  @Property({ length: 255 })
  timezone: string;

  @Enum({
    items: () => Language,
    default: Language.EN,
    nativeEnumName: 'language',
  })
  language?: Language;

  @Property({ length: 255, nullable: true })
  country?: string;

  @OneToOne(() => User)
  user: User;
}
