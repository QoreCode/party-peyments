import EntityStorage from '@business/storages/entity.storage';
import Model from '@business/core/entity-model';
import StorageMessage from '@business/storages/message-bus/storage-message';
import { StorageMessageActions } from '@business/storages/message-bus/storage-message.enum';
import { EntityNameList } from '@business/core/entity-list';
import ExcludeModification from '@business/modules/exclude-modification/exclude-modification.model';

export default class ExcludeModificationStorage extends EntityStorage<ExcludeModification> {
  constructor() {
    super();

    this.messageBus.subscribe(<TEntity extends Model>(message: StorageMessage<TEntity>) => {
      if (message.isAction(StorageMessageActions.delete) && message.isDomain(EntityNameList.payment)) {
        this.deleteByParams({ paymentUid: message.entity.uid });
      }
    });
  }
}
