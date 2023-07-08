import { EntityNameList } from '@business/core/entity-list';
import User from '@business/modules/user/user.model';
import PartyEvent from '@business/modules/party-event/party-event.model';
import Payment from '@business/modules/payment/payment.model';
import Transaction from '@business/modules/transaction/transaction.model';
import ExcludeModification from '@business/modules/exclude-modification/exclude-modification.model';
import CalculationModification from '@business/modules/calculation-modification/models/calculation-modification.model';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';

export type EntityStorageMapping = {
  [EntityNameList.user]: User,
  [EntityNameList.partyEvent]: PartyEvent,
  [EntityNameList.payment]: Payment,
  [EntityNameList.transaction]: Transaction,
  [EntityNameList.excludeModification]: ExcludeModification,
  [EntityNameList.calculationModification]: CalculationModification,
  [EntityNameList.userEventProperties]: UserEventProperties,
};
