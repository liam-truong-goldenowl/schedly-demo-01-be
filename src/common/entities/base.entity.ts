import {
  Property,
  PrimaryKey,
  OptionalProps,
  BaseEntity as MikroOrmBase,
} from '@mikro-orm/core';

export abstract class BaseEntity extends MikroOrmBase {
  [OptionalProps]?: 'createdAt' | 'updatedAt';

  @PrimaryKey()
  id: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ nullable: true, onUpdate: () => new Date() })
  updatedAt?: Date;
}
