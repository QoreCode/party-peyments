import { initializeApp } from "firebase/app";
import { getDatabase, Database } from 'firebase/database';

export default class Firebase {
  private static _instance: Firebase;
  private readonly _database: Database;

  private constructor() {
    const app = initializeApp({
      databaseURL: "https://party-payments-default-rtdb.europe-west1.firebasedatabase.app/",
    });

    this._database = getDatabase(app);
  }

  public static getInstance(): Firebase {
    if (Firebase._instance === undefined) {
      Firebase._instance = new Firebase();
    }

    return Firebase._instance;
  }

  public get db(): Database {
    return this._database;
  }
}
