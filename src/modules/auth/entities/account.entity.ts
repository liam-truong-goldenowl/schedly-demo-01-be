import {
  Entity,
  OneToOne,
  Property,
  BeforeUpdate,
  BeforeCreate,
  EntityRepositoryType,
} from '@mikro-orm/core';

import { BaseEntity } from '@/common/entities/base.entity';
import { User } from '@/modules/user/entities/user.entity';
import { HashHelper } from '@/common/utils/helpers/hash.helper';

import { AccountRepository } from '../repositories/account.repository';

@Entity({ repository: () => AccountRepository })
export class Account extends BaseEntity {
  [EntityRepositoryType]?: AccountRepository;

  @Property({ persist: false })
  password: string;

  @OneToOne(() => User)
  user: User;

  @Property({ nullable: true })
  private passwordHash?: string;

  @Property({ nullable: true })
  private refreshTokenHash?: string;

  @BeforeUpdate()
  @BeforeCreate()
  private async hashPassword() {
    if (this.password) {
      this.passwordHash = await HashHelper.generate(this.password);
    }
  }

  async setPassword(raw: string) {
    this.passwordHash = await HashHelper.generate(raw);
  }

  async verifyPassword(raw: string): Promise<boolean> {
    return HashHelper.verify(raw, this.passwordHash || '');
  }

  async setRefreshToken(raw: string) {
    this.refreshTokenHash = await HashHelper.generate(raw);
  }

  async revokeRefreshToken() {
    this.refreshTokenHash = undefined;
  }

  async verifyRefreshToken(raw: string): Promise<boolean> {
    if (!this.refreshTokenHash) return false;
    return HashHelper.verify(raw, this.refreshTokenHash);
  }
}
