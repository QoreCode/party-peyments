import FirebaseAdapter from '@business/dal/firebase/firebase.adapter';
import PartyEventMapper from '@business/modules/party-event/party-event.mapper';
import CalculationModificationMapper from '@business/modules/calculation-modification/calculation-modification.mapper';
import ExcludeModificationMapper from '@business/modules/exclude-modification/exclude-modification.mapper';
import PaymentMapper from '@business/modules/payment/payment.mapper';
import UserMapper from '@business/modules/user/user.mapper';
import { FirebaseEntitiesList } from '@business/dal/firebase/firebase-entities.list';
import UserEventPropertiesMapper from '@business/modules/user-event-properties/user-event-properties.mapper';

export default class DataMappersFactory {
  public createPartyEventMapper(): PartyEventMapper {
    const adapter = new FirebaseAdapter(FirebaseEntitiesList.partyEvent);
    return new PartyEventMapper(adapter);
  }

  public createCalculationModificationMapper(): CalculationModificationMapper {
    const adapter = new FirebaseAdapter(FirebaseEntitiesList.calculationModification);
    return new CalculationModificationMapper(adapter);
  }

  public createExcludeModificationMapper(): ExcludeModificationMapper {
    const adapter = new FirebaseAdapter(FirebaseEntitiesList.excludeModification);
    return new ExcludeModificationMapper(adapter);
  }

  public createUserEventPropertiesMapper(): UserEventPropertiesMapper {
    const adapter = new FirebaseAdapter(FirebaseEntitiesList.userEventProperties);
    return new UserEventPropertiesMapper(adapter);
  }

  public createPaymentMapper(): PaymentMapper {
    const adapter = new FirebaseAdapter(FirebaseEntitiesList.payment);
    return new PaymentMapper(adapter);
  }

  public createUserMapper(): UserMapper {
    const adapter = new FirebaseAdapter(FirebaseEntitiesList.user);
    return new UserMapper(adapter);
  }
}
