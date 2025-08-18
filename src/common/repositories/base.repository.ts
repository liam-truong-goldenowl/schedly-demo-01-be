import {
  AnyEntity,
  EntityDTO,
  FilterQuery,
  FindOneOptions,
  FromEntityType,
  EntityRepository,
  RequiredEntityData,
} from '@mikro-orm/core';

import { NotFoundException } from '@/common/exceptions/app.exception';

export class BaseRepository<E extends AnyEntity> extends EntityRepository<E> {
  async findOneOrThrow<Populate extends string = never>(
    filterQuery: FilterQuery<E>,
    options?: FindOneOptions<E, Populate>,
  ): Promise<E> {
    const entity = await this.findOne(filterQuery, options);
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} not found`);
    }
    return entity;
  }

  async exists(filter: FilterQuery<E>): Promise<boolean> {
    const count = await this.count(filter);
    return count > 0;
  }

  async createEntity(data: RequiredEntityData<E>): Promise<E> {
    const entity = this.create(data);
    await this.em.persistAndFlush(entity);
    return entity;
  }

  async createManyEntities(data: RequiredEntityData<E>[]): Promise<E[]> {
    const entities = data.map((item) => this.create(item));
    await this.em.persistAndFlush(entities);
    return entities;
  }

  async updateEntity(
    filter: FilterQuery<E>,
    data: Partial<EntityDTO<FromEntityType<E>>>,
  ): Promise<E> {
    const entity = await this.findOneOrThrow(filter);
    entity.assign(data);
    await this.em.flush();
    return entity;
  }

  async deleteEntity(filter: FilterQuery<E>): Promise<void> {
    const entity = await this.findOneOrThrow(filter);
    await this.em.removeAndFlush(entity);
  }

  async safeDeleteManyEntities(filter: FilterQuery<E>): Promise<void> {
    const entities = await this.find(filter);
    await this.em.removeAndFlush(entities);
  }

  async upsertEntity(
    filter: FilterQuery<E>,
    data: RequiredEntityData<E>,
  ): Promise<E> {
    let entity = await this.findOne(filter);
    if (entity) {
      entity.assign(data);
    } else {
      entity = this.create(data);
    }
    await this.em.persistAndFlush(entity);
    return entity;
  }
}
