import EntityStorageDecorator from '@business/storages/decorators/entity-storage.decorator';
import Model from '@business/core/entity-model';

export default class EntityStorageUiDecorator<TEntity extends Model> extends EntityStorageDecorator<TEntity> {
  /**
   * @deprecated Do not supported for UI layer
   */
  public override set(entity: TEntity): void {
    throw new Error(`Do not supported for UI layer`);
  }

  /**
   * @deprecated Do not supported for UI layer
   */
  public override setList(entities: TEntity[]): void {
    throw new Error(`Do not supported for UI layer`);
  }

  /**
   * @deprecated Do not supported for UI layer
   */
  public override update(entity: TEntity): void {
    throw new Error(`Do not supported for UI layer`);
  }

  /**
   * @deprecated Do not supported for UI layer
   */
  public override delete(entityUid: string): void {
    throw new Error(`Do not supported for UI layer`);
  }

  /**
   * @deprecated Do not supported for UI layer
   */
  public override deleteByParams(params: Partial<TEntity>): void {
    throw new Error(`Do not supported for UI layer`);
  }
}
