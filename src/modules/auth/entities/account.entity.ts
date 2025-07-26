import {
  Entity,
  OneToOne,
  Property,
  BeforeCreate,
  BeforeUpdate,
  EntityRepositoryType,
} from '@mikro-orm/postgresql';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { verifyHash, generateHash } from '@/utils/helpers/hash';

import { AccountRepository } from '../account.repository';

@Entity({ repository: () => AccountRepository })
export class Account extends BaseEntity {
  [EntityRepositoryType]?: AccountRepository;

  @Property()
  private passwordHash: string;

  @OneToOne(() => User)
  user: User;

  /**
   * The raw password provided by the user.
   */
  private password: string;
  /**
   * Indicates if the password has been modified since the last hash.
   */
  private passwordDirty = false;

  setPassword(raw: string) {
    this.password = raw;
    this.passwordDirty = true;
  }

  @BeforeCreate()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.passwordDirty) {
      return;
    }

    this.passwordHash = await generateHash({ source: this.password });
    this.passwordDirty = false;
  }

  async verifyPassword(raw: string): Promise<boolean> {
    return verifyHash({ source: raw, hash: this.passwordHash });
  }
}
