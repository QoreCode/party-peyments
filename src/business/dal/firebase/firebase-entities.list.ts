import { EntitiesList, EntityKey } from '@business/dal/adapters/entities.list';

export const firebaseEntitiesList: EntitiesList = {
  [EntityKey.PARTY_EVENT]: 'events',
  [EntityKey.PAYMENT]: 'payments',
  [EntityKey.USER]: 'users',
  [EntityKey.EXCLUDE_MODIFICATION]: 'exclude-modifications',
  [EntityKey.MEMBER]: 'user-event-properties',
  [EntityKey.CALCULATION_MODIFICATION]: 'calculation-modifications',
};
