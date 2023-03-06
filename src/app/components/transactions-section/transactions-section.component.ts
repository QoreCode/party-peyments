import { Component } from '@angular/core';
import ApplicationStateService from '@business/services/application-state.service';

@Component({
  selector: 'app-transactions-section',
  templateUrl: './transactions-section.component.html',
  styleUrls: ['./transactions-section.component.scss']
})
export class TransactionsSectionComponent {

  constructor(public applicationStateService: ApplicationStateService) {
  }

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedEventUid());
  }
}
