import { EntityNameList } from '@business/core/entity-list';
import ExcludeModificationStorage from '@business/modules/exclude-modification/exclude-modification.storage';
import UserStorage from '@business/modules/user/user.storage';
import PartyEventStorage from '@business/modules/party-event/party-event.storage';
import PaymentStorage from '@business/modules/payment/payment.storage';
import TransactionStorage from '@business/modules/transaction/transaction.storage';
import CalculationModificationStorage from '@business/modules/calculation-modification/calculation-modification.storage';
import UserEventPropertiesStorage from '@business/modules/user-event-properties/user-event-properties.storage';

export type TEntityStorageList = {
  [EntityNameList.excludeModification]: ExcludeModificationStorage,
  [EntityNameList.user]: UserStorage,
  [EntityNameList.partyEvent]: PartyEventStorage,
  [EntityNameList.payment]: PaymentStorage,
  [EntityNameList.transaction]: TransactionStorage,
  [EntityNameList.calculationModification]: CalculationModificationStorage,
  [EntityNameList.userEventProperties]: UserEventPropertiesStorage,
}
