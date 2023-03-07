import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import User from '@business/models/user.model';
import {
  faChevronDown,
  faXmark
} from '@fortawesome/free-solid-svg-icons';
import EventService from '@business/services/event.service';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import ApplicationStateService, { ApplicationState } from '@business/services/application-state.service';
import { ToastrService } from 'ngx-toastr';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import UserService from '@business/services/user.service';
import PartyEvent from '@business/models/party-event.model';
import UserEventProperties from '@business/models/user-event-properties.model';

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
  public currentEvent!: PartyEvent;

  public usersSubscription!: Subscription;
  public applicationSubscription!: Subscription;
  public selectSubscription!: Subscription;
  public userIdsInputControl = new FormControl<string[]>([]);

  constructor(public eventService: EventService,
              public toastr: ToastrService,
              public userService: UserService,
              public applicationStateService: ApplicationStateService,
  ) {

    // TODO: предусмотреть ситуацию когда юзвери платят друг за друга

  }

  public get usersTitle(): string {
    const selectedUserUidsSet = new Set(this.userIdsInputControl.getRawValue() ?? []);
    const usersToPayFor = this.allUsers.reduce((titleParts: string[], user: User) => {
      if (selectedUserUidsSet.has(user.uid)) {
        titleParts.push(user.name);
      }

      return titleParts;
    }, []).join(', ');

    return `You gonna pay for: ${ usersToPayFor }`;
  }

  public async ngOnInit() {
    await this.setCurrentEvent();

    const eventProperties = this.currentEvent.getUserEventPropertiesByUserUid(this.user.uid);
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
      await eventServiceFBDec.addOrUpdateEntity(this.currentEvent);
    });

    this.applicationSubscription = this.applicationStateService.subscribe(() => this.setCurrentEvent());
  }

  public get usersToSelect(): User[] {
    const involvedUsers = this.currentEvent.usersEventProperties.map((eventProperties: UserEventProperties) => eventProperties.userUid);
    const involvedUsersSet = new Set(involvedUsers);
    return this.allUsers.filter((user: User) => user.uid !== this.user?.uid && involvedUsersSet.has(user.uid));
  }

  public async deleteUser(): Promise<void> {
    try {
      if (this.user === undefined) {
        throw new Error(`User is undefined. Something unbelievable is going on`);
      }

      await this.currentEvent.removeUserUid(this.user.uid);

      const eventFBDec = new FirebaseEntityServiceDecorator(this.eventService);
      await eventFBDec.addOrUpdateEntity(this.currentEvent);
    } catch (e) {
      if (e instanceof Error) {
        this.toastr.error(e.message);
      } else {
        console.error(e);
      }
    }
  }

  public toggleRelatedUsers() {
    this.isOpened = !this.isOpened;
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.selectSubscription.unsubscribe();
    this.applicationSubscription.unsubscribe();
  }

  private async setCurrentEvent() {
    const selectedEventUid = this.applicationStateService.getSelectedEventUid();
    if (selectedEventUid === undefined) {
      this.toastr.error(`No selected events found. Stop breaking my app!`);
      return;
    }

    const event = await this.eventService.getEntityByUid(selectedEventUid);
    if (event === undefined) {
      this.toastr.error(`Selected event no found. Stop breaking my app!`);
      return;
    }

    this.currentEvent = event;
  }
}
