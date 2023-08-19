export enum Entity {
  PARTY_EVENT = 'partyEvent',
  PAYMENT = 'payment',
  USER = 'user',
  EXCLUDE_MODIFICATION = 'excludeModification',
  MEMBER = 'member',
  CALCULATION_MODIFICATION = 'calculationModification',
}

export type EntitiesList = Record<Entity, string>;
