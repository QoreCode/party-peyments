export default class FirebaseConfiguration {
  private readonly _id: string;
  private readonly _password: string;

  constructor(id: string, password: string) {
    this._id = id;
    this._password = password;
  }

  public get id(): string {
    return this._id;
  }

  public get password(): string {
    return this._password;
  }
}
