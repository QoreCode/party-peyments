import axios, { AxiosInstance } from 'axios';

export default class ApiConnection {
  private static _instance: ApiConnection;
  private _axiosInstance?: AxiosInstance;

  public static getInstance(): ApiConnection {
    if (ApiConnection._instance === undefined) {
      ApiConnection._instance = new ApiConnection();
    }

    return ApiConnection._instance;
  }

  public initialize(apiURL: string): void {
    this._axiosInstance = axios.create({
      baseURL: apiURL,
    });
  }

  public isInitialized(): boolean {
    return this._axiosInstance !== undefined;
  }

  public get db(): AxiosInstance {
    if (this._axiosInstance === undefined) {
      throw new Error(`Instance isn't initialized`);
    }

    return this._axiosInstance;
  }
}
