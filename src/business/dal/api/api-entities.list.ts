import { EntitiesList, Entity } from '../adapters/entities.list';

export const apiEntitiesList: EntitiesList = {
  [Entity.PARTY_EVENT]: 'party_events',
  [Entity.PAYMENT]: 'payments',
  [Entity.USER]: 'users',
  [Entity.EXCLUDE_MODIFICATION]: 'exclude_modifications',
  [Entity.MEMBER]: 'members',
  [Entity.CALCULATION_MODIFICATION]: 'calculation_modifications',
};
