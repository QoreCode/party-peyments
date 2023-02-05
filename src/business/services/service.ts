import { BehaviorSubject, Subscription } from 'rxjs';
import Model from '../models/model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export default class Service<TEntity extends Model> {
  protected _entities: BehaviorSubject<Map<string, TEntity>> = new BehaviorSubject(new Map());

  public addOrUpdateEntity(entity: TEntity): void {
    this.entities.getValue().set(entity.uid, entity);
  }

  public deleteEntity(entityUid: string): void {
    this.entities.getValue().delete(entityUid);
  }

  public subscribe(onChange: (entity: Map<string, TEntity>) => void): Subscription {
    return this.entities.subscribe({ next: onChange });
  }

  public getEntities(): TEntity[] {
    return Array.from(this.entities.getValue().values());
  }

  protected get entities(): BehaviorSubject<Map<string, TEntity>> {
    return this._entities;
  }

  protected set entities(entities: BehaviorSubject<Map<string, TEntity>>) {
    this._entities = entities;
  }
}
