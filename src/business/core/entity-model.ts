import { EntityNameList } from '@business/core/entity-list';

export default abstract class Model {
  protected _uid: string;

  protected constructor(uid: string) {
    this._uid = uid;
  }

  public get uid(): string {
    return this._uid;
  };

  public checkPropertyValue(propertyName: string, propertyValue: any): boolean {
    if (!Object.hasOwn(this, propertyName) && !Object.hasOwn(this, `_${ propertyName }`)) {
      return false;
    }

    // @ts-ignore
    return this[propertyName] === propertyValue || this[`_${ propertyName }`] === propertyValue;
  }

  public abstract toJson(): Record<string, any>;

  public abstract get domain(): EntityNameList;
}
