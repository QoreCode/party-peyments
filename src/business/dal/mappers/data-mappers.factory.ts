import CalculationModificationMapper from '@business/modules/calculation-modification/calculation-modification.mapper';
import ExcludeModificationMapper from '@business/modules/exclude-modification/exclude-modification.mapper';
import PartyEventMapper from '@business/modules/party-event/party-event.mapper';
import PaymentMapper from '@business/modules/payment/payment.mapper';
import UserEventPropertiesMapper from '@business/modules/user-event-properties/user-event-properties.mapper';
import UserMapper from '@business/modules/user/user.mapper';
import AdaptersFactory, { AdapterType } from '../adapters/adapters.factory';
import { Entity } from '../adapters/entities.list';

export default class DataMappersFactory {
  private _adaptersFactory: AdaptersFactory;

  constructor() {
    this._adaptersFactory = new AdaptersFactory();
  }

  public createPartyEventMapper(type = AdapterType.API): PartyEventMapper {
    return new PartyEventMapper(
      this._adaptersFactory.createAdapter(type, Entity.PARTY_EVENT)
    );
  }

  public createCalculationModificationMapper(
    type = AdapterType.API
  ): CalculationModificationMapper {
    return new CalculationModificationMapper(
      this._adaptersFactory.createAdapter(type, Entity.CALCULATION_MODIFICATION)
    );
  }

  public createExcludeModificationMapper(
    type = AdapterType.API
  ): ExcludeModificationMapper {
    return new ExcludeModificationMapper(
      this._adaptersFactory.createAdapter(type, Entity.EXCLUDE_MODIFICATION)
    );
  }

  public createUserEventPropertiesMapper(
    type = AdapterType.API
  ): UserEventPropertiesMapper {
    return new UserEventPropertiesMapper(
      this._adaptersFactory.createAdapter(type, Entity.MEMBER)
    );
  }

  public createPaymentMapper(type = AdapterType.API): PaymentMapper {
    return new PaymentMapper(
      this._adaptersFactory.createAdapter(type, Entity.PAYMENT)
    );
  }

  public createUserMapper(type = AdapterType.API): UserMapper {
    return new UserMapper(
      this._adaptersFactory.createAdapter(type, Entity.USER)
    );
  }
}
