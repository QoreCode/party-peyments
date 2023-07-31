import CalculationModificationMapper from '@business/modules/calculation-modification/calculation-modification.mapper';
import ExcludeModificationMapper from '@business/modules/exclude-modification/exclude-modification.mapper';
import PartyEventMapper from '@business/modules/party-event/party-event.mapper';
import PaymentMapper from '@business/modules/payment/payment.mapper';
import UserEventPropertiesMapper from '@business/modules/user-event-properties/user-event-properties.mapper';
import UserMapper from '@business/modules/user/user.mapper';
import IDataAdapter from '../data-adapter.interface';
import { EntitiesList } from './entities.list';
import ApiAdapter from '../api/api.adapter';
import FirebaseAdapter from '../firebase/firebase.adapter';
import { apiEntitiesList } from '../api/api-entities.list';
import { firebaseEntitiesList } from '../firebase/firebase-entities.list';

enum DataMapperType {
  API,
  FIREBASE,
}

export default class DataMappersFactory {
  private _adapters: Record<
    DataMapperType,
    (tableName: string) => IDataAdapter
  > = {
    [DataMapperType.API]: (tableName) => new ApiAdapter(tableName),
    [DataMapperType.FIREBASE]: (tableName) => new FirebaseAdapter(tableName),
  };
  private _entitiesLists: Record<DataMapperType, EntitiesList> = {
    [DataMapperType.API]: apiEntitiesList,
    [DataMapperType.FIREBASE]: firebaseEntitiesList,
  };

  public createPartyEventMapper(type = DataMapperType.API): PartyEventMapper {
    return new PartyEventMapper(
      this._adapters[type](this._entitiesLists[type].partyEvent)
    );
  }

  public createCalculationModificationMapper(
    type = DataMapperType.API
  ): CalculationModificationMapper {
    return new CalculationModificationMapper(
      this._adapters[type](this._entitiesLists[type].calculationModification)
    );
  }

  public createExcludeModificationMapper(
    type = DataMapperType.API
  ): ExcludeModificationMapper {
    return new ExcludeModificationMapper(
      this._adapters[type](this._entitiesLists[type].excludeModification)
    );
  }

  public createUserEventPropertiesMapper(
    type = DataMapperType.API
  ): UserEventPropertiesMapper {
    return new UserEventPropertiesMapper(
      this._adapters[type](this._entitiesLists[type].member)
    );
  }

  public createPaymentMapper(type = DataMapperType.API): PaymentMapper {
    return new PaymentMapper(
      this._adapters[type](this._entitiesLists[type].payment)
    );
  }

  public createUserMapper(type = DataMapperType.API): UserMapper {
    return new UserMapper(this._adapters[type](this._entitiesLists[type].user));
  }
}
