import {
  Property,
  PrimaryKey,
  BaseEntity as MikroOrmBase,
} from '@mikro-orm/core';

export abstract class BaseEntity extends MikroOrmBase {
  @PrimaryKey()
  id!: number;

  @Property({ name: 'created_at', onCreate: () => new Date() })
  createdAt = new Date();

  @Property({ name: 'updated_at', onUpdate: () => new Date() })
  updatedAt = new Date();
}
