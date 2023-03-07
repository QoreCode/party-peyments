import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import User from '@business/models/user.model';
import {
  faChevronDown,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import EventService from '@business/services/event.service';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import ApplicationStateService from '@business/services/application-state.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import UserService from '@business/services/user.service';
import PartyEvent from '@business/models/party-event.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnDestroy, OnInit {
  @Input() user!: User;
  public closeIcon = faXmark;
  public arrowIcon = faChevronDown;
  public isOpened: boolean = false;
  public allUsers: User[] = [];

  public usersSubscription!: Subscription;
  public selectSubscription!: Subscription;
  public userIdsInputControl = new FormControl<string[]>([]);

  constructor(public eventService: EventService,
              public toastr: ToastrService,
              public userService: UserService,
              public applicationStateService: ApplicationStateService,
  ) {
  }

  public async ngOnInit() {
    const event: PartyEvent = await this.getCurrentEvent();
    const eventProperties = event.getUserUserEventPropertiesByUserUid(this.user.uid);
    if (eventProperties === undefined) {
      this.toastr.error(`Event is undefined. Something unbelievable is going on`);
      return;
    }

    this.userIdsInputControl.setValue(eventProperties.payedForUserUids);

    this.usersSubscription = this.userService.subscribe(async (users: Map<string, User>) => {
      this.allUsers = Array.from(users.values());
    });

    this.selectSubscription = this.userIdsInputControl.valueChanges.subscribe(async (value: string[] | null) => {
      eventProperties.setUserUidForPayed(value ?? []);

      const eventServiceFBDec = new FirebaseEntityServiceDecorator(this.eventService);
      await eventServiceFBDec.addOrUpdateEntity(event);
    });
  }

  public get usersToSelect(): User[] {
    return this.allUsers.filter((user: User) => user.uid !== this.user?.uid);
  }

  public async deleteUser(): Promise<void> {
    try {
      if (this.user === undefined) {
        throw new Error(`User is undefined. Something unbelievable is going on`);
      }

      const event = await this.getCurrentEvent();
      await event.removeUserUid(this.user.uid);

      const eventFBDec = new FirebaseEntityServiceDecorator(this.eventService);
      await eventFBDec.addOrUpdateEntity(event);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        console.error(e);
      }
    }
  }

  public async getCurrentEvent(): Promise<PartyEvent> {
    const selectedEventUid = this.applicationStateService.getSelectedEventUid();
    if (selectedEventUid === undefined) {
      throw new Error('No selected events found. Stop breaking my app!');
    }

    const event = await this.eventService.getEntityByUid(selectedEventUid);
    if (event === undefined) {
      throw new Error('Selected event no found. Stop breaking my app!');
    }

    return event;
  }

  public toggleRelatedUsers() {
    this.isOpened = !this.isOpened;
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.selectSubscription.unsubscribe();
  }
}
