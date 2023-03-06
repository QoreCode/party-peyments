import { Component, Input } from '@angular/core';
import User from '@business/models/user.model';
import {
  faChevronDown,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import EventService from '@business/services/event.service';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import ApplicationStateService from '@business/services/application-state.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  @Input() user!: User;
  public closeIcon = faXmark;
  public arrowIcon = faChevronDown;

  constructor(public eventService: EventService,
              public toastr: ToastrService,
              public applicationStateService: ApplicationStateService,
  ) {
  }

  public async deleteUser(): Promise<void> {
    const selectedEventUid = this.applicationStateService.getSelectedEventUid();
    if (selectedEventUid === undefined) {
      this.toastr.error('No selected events found. Stop breaking my app!');
      return;
    }

    const event = await this.eventService.getEntityByUid(selectedEventUid);
    if (event === undefined) {
      this.toastr.error('Selected event no found. Stop breaking my app!');
      return;
    }

    await event.removeUserUid(this.user.uid);

    const eventFBDec = new FirebaseEntityServiceDecorator(this.eventService);
    await eventFBDec.addOrUpdateEntity(event);
  }
}
