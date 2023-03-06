import { BehaviorSubject, Subscription } from 'rxjs';
import Model from '@business/core/model';
import { Injectable } from '@angular/core';
import IEntityService from '@business/core/entity-service.interface';

@Injectable({
  providedIn: 'root',
})
export default abstract class EntityService<TEntity extends Model> implements IEntityService<TEntity> {
  protected abstract _tableName: string;
  protected _entities: BehaviorSubject<Map<string, TEntity>> = new BehaviorSubject(new Map());

  public addOrUpdateEntities(entities: TEntity[]): void {
    const existedValues = this.entities.getValue();
    entities.forEach((entity: TEntity) => existedValues.set(entity.uid, entity));

    this.entities.next(existedValues);
  }

  public addOrUpdateEntity(entity: TEntity): void {
    const existedValues = this.entities.getValue();
    existedValues.set(entity.uid, entity);

    this.entities.next(existedValues);
  }

  public deleteEntity(entityUid: string): void {
    const existedValues = this.entities.getValue();
    existedValues.delete(entityUid);

    this.entities.next(existedValues);
  }

  public clear(): void {
    this.entities.next(new Map());
  }

  public subscribe(onChange: (entities: Map<string, TEntity>) => void): Subscription {
    return this.entities.subscribe({ next: onChange });
  }

  public getEntities(): Promise<TEntity[]> {
    return Promise.resolve(Array.from(this.entities.getValue().values()));
  }

  public async getEntityByUid(uid: string): Promise<TEntity | undefined> {
    return (await this.getEntities()).find((entity: TEntity) => entity.uid === uid)
  }

  protected get entities(): BehaviorSubject<Map<string, TEntity>> {
    return this._entities;
  }

  public get tableName(): string {
    return this._tableName;
  }

  protected extractValue(data: Record<string, any>, fieldName: string): any {
    const fieldValue = data[fieldName];
    if (fieldValue === undefined) {
      throw new Error(`${ fieldName } is required for model`);
    }

    return fieldValue;
  }

  public abstract createFromJson(data: Record<string, any>): TEntity;
}
