import ApiAdapter from '../api/api.adapter';
import IDataAdapter from '../data-adapter.interface';
import FirebaseAdapter from '../firebase/firebase.adapter';
import { Entity } from './entities.list';

export enum AdapterType {
  API,
  FIREBASE,
}

export default class AdaptersFactory {
  public createAdapter(type: AdapterType, entityKey: Entity): IDataAdapter {
    switch (type) {
      case AdapterType.API:
        return new ApiAdapter(entityKey);
      case AdapterType.FIREBASE:
        return new FirebaseAdapter(entityKey);
      default:
        throw new Error(`This type ${type} of adapter does not exist`);
    }
  }
}
