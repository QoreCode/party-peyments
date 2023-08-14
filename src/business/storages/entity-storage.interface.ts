import { Observable, Subscription } from 'rxjs';
import Model from '@business/core/entity-model';

export interface IEntityStorage<TEntity extends Model> {
  set(entity: TEntity): void;

  setList(entities: TEntity[]): void;

  update(entity: TEntity): void;

  delete(entityUid: string): void;

  deleteByParams(params: Partial<TEntity>): void;

  deleteAll(): void;

  getAll(): TEntity[];

  getById(entityUid: string): TEntity | undefined;

  getByParam(param: keyof TEntity, value: any): TEntity[];

  getByParams(params: Partial<TEntity>): TEntity[];

  getByFilter(filter: (entity: TEntity) => boolean): TEntity[];

  subscribe(onChange: (entities: Map<string, TEntity>) => void): Subscription
}
