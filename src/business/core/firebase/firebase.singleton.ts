import { initializeApp } from "firebase/app";
import { getDatabase, Database } from 'firebase/database';
import { deleteApp } from '@firebase/app';

export default class Firebase {
  private static _instance: Firebase;
  private _database?: Database;

  private constructor() {
  }

  public static getInstance(): Firebase {
    if (Firebase._instance === undefined) {
      Firebase._instance = new Firebase();
    }

    return Firebase._instance;
  }

  public initialize(databaseURL: string): void {
    const app = initializeApp({ databaseURL });

    try {
      this._database = getDatabase(app);
    } catch (e) {
      this._database = undefined;
      deleteApp(app);

      throw e;
    }
  }

  public isInitialized(): boolean {
    return this._database !== undefined;
  }

  public get db(): Database {
    if (this._database === undefined) {
      throw new Error(`DB isn't initialized`);
    }

    return this._database;
  }
}
