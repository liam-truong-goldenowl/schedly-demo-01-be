import {
  Property,
  PrimaryKey,
  BaseEntity as MikroOrmBase,
} from '@mikro-orm/core';

export abstract class BaseEntity extends MikroOrmBase {
  @PrimaryKey()
  id!: number;

  @Property()
  createdAt = new Date();

  @Property({ nullable: true, onUpdate: () => new Date() })
  updatedAt?: Date;
}
