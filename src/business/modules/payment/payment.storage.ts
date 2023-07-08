import EntityStorage from '@business/storages/entity.storage';
import Payment from '@business/modules/payment/payment.model';
import StorageMessage from '@business/storages/message-bus/storage-message';
import Model from '@business/core/entity-model';
import { StorageMessageActions } from '@business/storages/message-bus/storage-message.enum';
import { EntityNameList } from '@business/core/entity-list';

export default class PaymentStorage extends EntityStorage<Payment> {
  constructor() {
    super();

    this.messageBus.subscribe(<TEntity extends Model>(message: StorageMessage<TEntity>) => {
      if (message.isAction(StorageMessageActions.delete) && message.isDomain(EntityNameList.partyEvent)) {
        this.deleteByParams({ eventUid: message.entity.uid });
      }
    });
  }
}
