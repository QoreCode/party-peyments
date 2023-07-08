import { StorageMessageActions } from '@business/storages/message-bus/storage-message.enum';
import Model from '@business/core/entity-model';
import { EntityNameList } from '@business/core/entity-list';

export default class StorageMessage<TEntity extends Model> {
  private readonly _action: StorageMessageActions;
  private readonly _entity: TEntity;

  constructor(action: StorageMessageActions, entity: TEntity) {
    this._action = action;
    this._entity = entity;
  }

  public get action(): StorageMessageActions {
    return this._action;
  }

  public get entity(): TEntity {
    return this._entity;
  }

  public isAction(action: StorageMessageActions): boolean {
    return this._action === action;
  }

  public isDomain(domain: EntityNameList): boolean {
    return this.entity.domain === domain;
  }
}
