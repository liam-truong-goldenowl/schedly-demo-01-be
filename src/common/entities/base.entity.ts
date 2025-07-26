import {
  Property,
  PrimaryKey,
  OptionalProps,
  BaseEntity as MikroOrmBase,
} from '@mikro-orm/core';

export abstract class BaseEntity<Optional = never> extends MikroOrmBase {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;

  @PrimaryKey()
  id: number;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ nullable: true, onUpdate: () => new Date() })
  updatedAt?: Date;
}
