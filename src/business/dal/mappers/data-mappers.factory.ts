import CalculationModificationMapper from '@business/modules/calculation-modification/calculation-modification.mapper';
import ExcludeModificationMapper from '@business/modules/exclude-modification/exclude-modification.mapper';
import PartyEventMapper from '@business/modules/party-event/party-event.mapper';
import PaymentMapper from '@business/modules/payment/payment.mapper';
import UserEventPropertiesMapper from '@business/modules/user-event-properties/user-event-properties.mapper';
import UserMapper from '@business/modules/user/user.mapper';
import AdaptersFactory, { AdapterType } from '@business/dal/adapters/adapters.factory';
import { EntityKey } from '@business/dal/adapters/entities.list';

export default class DataMappersFactory {
  private _adaptersFactory: AdaptersFactory;

  constructor() {
    this._adaptersFactory = new AdaptersFactory();
  }

  public createPartyEventMapper(type = AdapterType.API): PartyEventMapper {
    const adapter = this._adaptersFactory.createAdapter(
      type,
      EntityKey.PARTY_EVENT
    );
    return new PartyEventMapper(adapter);
  }

  public createCalculationModificationMapper(
    type = AdapterType.API
  ): CalculationModificationMapper {
    const adapter = this._adaptersFactory.createAdapter(
      type,
      EntityKey.CALCULATION_MODIFICATION
    );
    return new CalculationModificationMapper(adapter);
  }

  public createExcludeModificationMapper(
    type = AdapterType.API
  ): ExcludeModificationMapper {
    const adapter = this._adaptersFactory.createAdapter(
      type,
      EntityKey.EXCLUDE_MODIFICATION
    );
    return new ExcludeModificationMapper(adapter);
  }

  public createUserEventPropertiesMapper(
    type = AdapterType.API
  ): UserEventPropertiesMapper {
    const adapter = this._adaptersFactory.createAdapter(type, EntityKey.MEMBER);
    return new UserEventPropertiesMapper(adapter);
  }

  public createPaymentMapper(type = AdapterType.API): PaymentMapper {
    const adapter = this._adaptersFactory.createAdapter(type, EntityKey.PAYMENT);
    return new PaymentMapper(adapter);
  }

  public createUserMapper(type = AdapterType.API): UserMapper {
    const adapter = this._adaptersFactory.createAdapter(type, EntityKey.USER);
    return new UserMapper(adapter);
  }
}
