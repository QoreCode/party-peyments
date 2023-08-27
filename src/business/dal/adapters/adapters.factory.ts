import { Utils } from '@utils/index';
import ApiAdapter from '@business/dal/api/api.adapter';
import FirebaseAdapter from '@business/dal/firebase/firebase.adapter';
import { EntityKey } from '@business/dal/adapters/entities.list';
import IDataAdapter from '@business/dal/data-adapter.interface';

export enum AdapterType {
  API,
  FIREBASE,
}

export default class AdaptersFactory {
  public createAdapter(type: AdapterType, entityKey: EntityKey): IDataAdapter {
    switch (type) {
      case AdapterType.API:
        return new ApiAdapter(entityKey);
      case AdapterType.FIREBASE:
        return new FirebaseAdapter(entityKey);
      default:
        throw Utils.generateSwitchSyntaxError(type);
    }
  }
}
