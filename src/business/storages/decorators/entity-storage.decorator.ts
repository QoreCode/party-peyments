import { IEntityStorage } from '@business/storages/entity-storage.interface';
import Model from '@business/core/entity-model';
import { Subscription } from 'rxjs';

export default class EntityStorageDecorator<TEntity extends Model> implements IEntityStorage<TEntity> {
  protected storage: IEntityStorage<TEntity>;

  public constructor(storage: IEntityStorage<TEntity>) {
    this.storage = storage;
  }

  public set(entity: TEntity): void {
    return this.storage.set(entity);
  }

  public setList(entities: TEntity[]): void {
    return this.storage.setList(entities);
  }

  public update(entity: TEntity): void {
    return this.storage.update(entity);
  }

  public delete(entityUid: string): void {
    return this.storage.delete(entityUid);
  }

  public deleteByParams(params: Partial<TEntity>): void {
    this.storage.deleteByParams(params);
  }

  public deleteAll(): void {
    return this.storage.deleteAll();
  }

  public getAll(): TEntity[] {
    return this.storage.getAll();
  }

  public getById(entityUid: string): TEntity | undefined {
    return this.storage.getById(entityUid);
  }

  public getByParam(param: keyof TEntity, value: any): TEntity[] {
    return this.storage.getByParam(param, value);
  }

  public getByParams(params: Partial<TEntity>): TEntity[] {
    return this.storage.getByParams(params);
  }

  public getByFilter(filter: (entity: TEntity) => boolean): TEntity[] {
    return this.storage.getByFilter(filter)
  }

  public subscribe(onChange: (entities: Map<string, TEntity>) => void): Subscription {
    return this.storage.subscribe(onChange);
  }
}
