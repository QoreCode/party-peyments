import axios, { AxiosInstance } from 'axios';

export default class Api {
  private static _instance: Api;
  private _database?: AxiosInstance;
  private _apiURL?: string;

  private constructor() {
  }

  public static getInstance(): Api {
    if (Api._instance === undefined) {
      Api._instance = new Api();
    }

    return Api._instance;
  }

  public get apiURL(): string | undefined {
    return this._apiURL;
  }

  public initialize(apiURL: string): void {
    this._apiURL = apiURL;

    try {
      this._database = axios.create({
        baseURL: apiURL,
      });
    } catch (e) {
      this._database = undefined;

      throw e;
    }
  }

  public isInitialized(): boolean {
    return this._database !== undefined;
  }

  public get db(): AxiosInstance {
    if (this._database === undefined) {
      throw new Error(`DB isn't initialized`);
    }

    return this._database;
  }
}
