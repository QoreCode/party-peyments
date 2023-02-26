import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

export interface ApplicationState {
  selectedEventUid?: string;
}

@Injectable({
  providedIn: 'root',
})
export default class ApplicationStateService {
  protected applicationState: BehaviorSubject<ApplicationState> = new BehaviorSubject({});

  public setSelectedEventUid(selectedEventUid: string): void {
    this.applicationState.next({ selectedEventUid });
  }

  public getSelectedEventUid(): string | undefined {
    return this.applicationState.getValue().selectedEventUid;
  }

  public subscribe(onChange: (entity: ApplicationState) => void): Subscription {
    return this.applicationState.subscribe({ next: onChange });
  }
}
