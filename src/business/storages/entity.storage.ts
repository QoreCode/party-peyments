import { IEntityStorage } from '@business/storages/entity-storage.interface';
import { BehaviorSubject, Subscription } from 'rxjs';
import Model from '@business/core/entity-model';
import StorageMessageBus from '@business/storages/message-bus/storage-message.bus';
import { StorageMessageActions } from '@business/storages/message-bus/storage-message.enum';

export default class EntityStorage<TEntity extends Model> implements IEntityStorage<TEntity> {
  protected _entities: BehaviorSubject<Map<string, TEntity>> = new BehaviorSubject(new Map());
  private static _messageBus: StorageMessageBus = new StorageMessageBus();

  constructor() {
  }

  protected get messageBus(): StorageMessageBus {
    return EntityStorage._messageBus;
  }

  public set(entity: TEntity): void {
    const entitiesMap = this.entities.getValue();
    if (entitiesMap.has(entity.uid)) {
      throw new Error(`Entity with uid ${ entity.uid } already exist`);
    }

    entitiesMap.set(entity.uid, entity);
    this.entities.next(entitiesMap);

    this.messageBus.emit(StorageMessageActions.set, entity);
  }

  public setList(entities: TEntity[]): void {
    const entitiesMap = this.entities.getValue();
    const newEntities = [];
    for (const entity of entities) {
      if (entitiesMap.has(entity.uid)) {
        throw new Error(`Entity with uid ${ entity.uid } already exist`);
      }

      newEntities.push(entity);
      entitiesMap.set(entity.uid, entity);
    }

    this.entities.next(entitiesMap);

    for (const entity of newEntities) {
      this.messageBus.emit(StorageMessageActions.set, entity);
    }
  }

  public update(entity: TEntity): void {
    const entitiesMap = this.entities.getValue();
    if (!entitiesMap.has(entity.uid)) {
      throw new Error(`Entity with uid ${ entity.uid } isn't exist`);
    }

    entitiesMap.set(entity.uid, entity);
    this.entities.next(entitiesMap);

    this.messageBus.emit(StorageMessageActions.update, entity);
  }

  public delete(entityUid: string): void {
    const entitiesMap = this.entities.getValue();
    const entityToDelete = entitiesMap.get(entityUid);

    entitiesMap.delete(entityUid);

    this.entities.next(entitiesMap);

    if (entityToDelete !== undefined) {
      this.messageBus.emit(StorageMessageActions.delete, entityToDelete);
    }
  }

  public deleteByParams(params: Partial<TEntity>): void {
    const entitiesMap = this.entities.getValue();
    const entities = Array.from(entitiesMap.values());
    let entityToDelete = undefined;
    for (const entity of entities) {
      for (const [key, value] of Object.entries(params)) {
        if (entity.checkPropertyValue(key, value)) {
          entitiesMap.delete(entity.uid);
        }
      }
    }

    this.entities.next(entitiesMap);

    if (entityToDelete !== undefined) {
      this.messageBus.emit(StorageMessageActions.delete, entityToDelete);
    }
  }

  public deleteAll(): void {
    this.entities.next(new Map());
  }

  public getAll(): TEntity[] {
    return this.getEntities();
  }

  public getById(entityUid: string): TEntity | undefined {
    const entitiesMap = this.entities.getValue();
    return entitiesMap.get(entityUid);
  }

  public getByParam(param: keyof TEntity, value: any): TEntity[] {
    return this.getEntities().filter((entity: TEntity) => entity.checkPropertyValue(param as string, value));
  }

  public getByParams(params: Partial<TEntity>): TEntity[] {
    return this.getEntities().filter((entity: TEntity) => {
      for (const [key, value] of Object.entries(params)) {
        if (!entity.checkPropertyValue(key, value)) {
          return false;
        }
      }

      return true;
    });
  }

  public getByFilter(filter: (entity: TEntity) => boolean): TEntity[] {
    return this.getEntities().filter((entity: TEntity) => filter(entity));
  }

  public subscribe(onChange: (entities: Map<string, TEntity>) => void): Subscription {
    return this.entities.subscribe({ next: onChange });
  }

  protected get entities(): BehaviorSubject<Map<string, TEntity>> {
    return this._entities;
  }

  protected getEntities(): TEntity[] {
    return Array.from(this._entities.getValue().values());
  }
}
