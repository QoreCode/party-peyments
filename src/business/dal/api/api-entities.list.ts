import { EntitiesList, EntityKey } from '@business/dal/adapters/entities.list';

export const apiEntitiesList: EntitiesList = {
  [EntityKey.PARTY_EVENT]: 'party_events',
  [EntityKey.PAYMENT]: 'payments',
  [EntityKey.USER]: 'users',
  [EntityKey.EXCLUDE_MODIFICATION]: 'exclude_modifications',
  [EntityKey.MEMBER]: 'members',
  [EntityKey.CALCULATION_MODIFICATION]: 'calculation_modifications',
};
