import { Component } from '@angular/core';
import ApplicationStateService from '@business/services/application-state.service';

@Component({
  selector: 'app-payments-section',
  templateUrl: './payments-section.component.html',
  styleUrls: ['./payments-section.component.scss']
})
export class PaymentsSectionComponent {

  constructor(public applicationStateService: ApplicationStateService) {
  }

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedEventUid());
  }
}
