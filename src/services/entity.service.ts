import UiStorageFactory from '@business/storages/factories/ui-storage.factory';
import { IEntityStorage } from '@business/storages/entity-storage.interface';
import Model from '@business/core/entity-model';
import { map, Observable, Subscriber } from 'rxjs';

export default abstract class EntityService<TEntity extends Model> {
  protected _observer: Observable<TEntity[]>;
  protected _entities: TEntity[] = [];

  protected constructor() {
    const storageFactory = new UiStorageFactory();
    const storage = this.getEntityStorage(storageFactory);

    this._observer = new Observable<TEntity[]>((sub: Subscriber<TEntity[]>) => {
      storage.subscribe((entities: Map<string, TEntity>) => {
        sub.next(Array.from(entities.values()))

        this._entities = Array.from(entities.values());
      });
    })
  }

  public get entities(): TEntity[] {
    return this._entities;
  }

  public getAll(): Observable<TEntity[]> {
    return this._observer;
  }

  public getById(entityUid: string): Observable<TEntity | undefined> {
    return this.getAll().pipe(
      map((stream) => stream.find((entity: TEntity) => entity.uid === entityUid))
    );
  }

  public getByParam<TParam extends keyof TEntity>(param: TParam, value: TEntity[TParam] | undefined): Observable<TEntity[]> {
    return this.getAll().pipe(
      map((stream) => stream.filter((entity: TEntity) => entity[param] === value))
    );
  }

  public getByFilter(filter: (entity: TEntity) => boolean): Observable<TEntity[]> {
    return this.getAll().pipe(map((stream) => stream.filter((entity: TEntity) => filter(entity))));
  }

  public extractByParams<TParam extends keyof TEntity>(param: TParam, value: TEntity[TParam] | undefined): TEntity[] {
    return this.entities.filter((entity: TEntity) => entity[param] === value);
  }

  protected abstract getEntityStorage(storageFactory: UiStorageFactory): IEntityStorage<TEntity>;
}
