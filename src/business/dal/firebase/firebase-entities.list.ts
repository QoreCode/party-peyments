import { EntitiesList, Entity } from '../adapters/entities.list';

export const firebaseEntitiesList: EntitiesList = {
  [Entity.PARTY_EVENT]: 'events',
  [Entity.PAYMENT]: 'payments',
  [Entity.USER]: 'users',
  [Entity.EXCLUDE_MODIFICATION]: 'exclude-modifications',
  [Entity.MEMBER]: 'user-event-properties',
  [Entity.CALCULATION_MODIFICATION]: 'calculation-modifications',
};
