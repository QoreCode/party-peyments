import { BehaviorSubject, map, Observable } from 'rxjs';
import FirebaseConfiguration from '../models/firebase-configuration';
import { Injectable } from '@angular/core';

type FirebaseConfig = FirebaseConfiguration | undefined;

@Injectable({
  providedIn: 'root',
})
export default class ConfigurationService {
  private readonly _firebase: BehaviorSubject<FirebaseConfig> = new BehaviorSubject<FirebaseConfig>(undefined);

  public setFirebaseConfig(id: string, password: string): void {
    const firebaseConfig = new FirebaseConfiguration(id, password);
    this._firebase.next(firebaseConfig);
  }

  public hasFirebase(): boolean {
    return this._firebase.getValue() !== undefined;
  }

  public hasFirebaseSub(): Observable<boolean> {
    return this._firebase.pipe(
      map((firebaseConfig: FirebaseConfig) => firebaseConfig !== undefined)
    );
  }
}
