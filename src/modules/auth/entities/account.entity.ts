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

  @Property({ nullable: true })
  private refreshTokenHash?: string;

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

  /**
   * The refresh token used for JWT refresh.
   */
  private refreshToken: string;

  /**
   * Indicates if the refresh token has been modified since the last hash.
   */
  private refreshTokenDirty = false;

  setRefreshToken(raw: string) {
    this.refreshToken = raw;
    this.refreshTokenDirty = true;
  }

  async hashRefreshToken() {
    if (!this.refreshTokenDirty) {
      return;
    }

    this.refreshTokenHash = await generateHash({ source: this.refreshToken });
    this.refreshTokenDirty = false;
  }

  async verifyRefreshToken(raw: string): Promise<boolean> {
    return verifyHash({ source: raw, hash: this.refreshTokenHash || '' });
  }
}
