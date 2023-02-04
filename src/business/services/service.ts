import Model from '../models/model';

export default class Service<TEntity extends Model> {
  protected entities: Map<string, TEntity> = new Map();

  public addEntity(entity: TEntity): void {
    if (this.entities.has(entity.uid)) console.log(`Payment with id ${entity.uid} is override`);

    this.entities.set(entity.uid, entity);
  }

  public getEntities(): TEntity[] {
    return Array.from(this.entities.values());
  }
}
