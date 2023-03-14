export default abstract class Model {
  protected _uid: string;

  protected constructor(uid: string) {
    this._uid = uid;
  }

  public get uid(): string {
    return this._uid;
  };

  public abstract toJson(): Record<string, any>;
}
