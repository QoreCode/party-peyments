import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import User from '@business/models/user.model';
import {
  faChevronDown, faInfoCircle, faXmark
} from '@fortawesome/free-solid-svg-icons';
import EventService from '@business/services/event.service';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import ApplicationStateService from '@business/services/application-state.service';
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
  public infoIcon = faInfoCircle;
  public disabledUsers: Set<string> = new Set();

  public usersSubscription!: Subscription;
  public applicationSubscription!: Subscription;
  public eventsSubscription!: Subscription;
  public userIdsInputControl = new FormControl<string[]>([]);

  constructor(public eventService: EventService,
              public toastr: ToastrService,
              public userService: UserService,
              public applicationStateService: ApplicationStateService,
  ) {
  }

  public get usersTitle(): string {
    const selectedUserUidsSet = new Set(this.userIdsInputControl.getRawValue() ?? []);
    const usersToPayFor = this.allUsers.reduce((titleParts: string[], user: User) => {
      if (selectedUserUidsSet.has(user.uid)) {
        titleParts.push(user.name);
      }

      return titleParts;
    }, []);

    if (usersToPayFor.length === 0) {
      return '';
    }

    if (usersToPayFor.length === this.usersToSelect.length) {
      return `You are gonna pay for all users in this event!`;
    }

    return `You are gonna pay for: ${ usersToPayFor.join(', ') }`;
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
      this.setDisabledUsers();
    });

    this.applicationSubscription = this.applicationStateService.subscribe(() => {
      this.setCurrentEvent();
    });

    this.eventsSubscription = this.eventService.subscribe(async () => {
      await this.setCurrentEvent();
      await this.setDisabledUsers();
      this.userIdsInputControl.setValue(eventProperties.payedForUserUids);
    })
  }

  public async addRelatedUser() {
    const eventProperties = this.currentEvent.getUserEventPropertiesByUserUid(this.user.uid);
    if (eventProperties === undefined) {
      this.toastr.error(`Event is undefined. Something unbelievable is going on`);
      return;
    }

    const value = this.userIdsInputControl.getRawValue();
    eventProperties.setUserUidForPayed(value ?? []);

    const eventServiceFBDec = new FirebaseEntityServiceDecorator(this.eventService);
    await eventServiceFBDec.addOrUpdateEntity(this.currentEvent);
  }

  public get usersToSelect(): User[] {
    if (this.currentEvent === undefined) {
      return [];
    }

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

  public setDisabledUsers(): void {
    this.disabledUsers.clear();

    if (this.usersToSelect.length === 0) {
      return;
    }

    this.usersToSelect.forEach((userToSelect: User) => {
      this.currentEvent.usersEventProperties.forEach((eventProperties: UserEventProperties) => {
        // skip current user
        if (eventProperties.userUid === this.user.uid) {
          return;
        }

        // disable users who are payed by someone already
        if (eventProperties.hasPayedUserUid(userToSelect.uid)) {
          this.disabledUsers.add(userToSelect.uid)
        }

        // disable users who are pay for someone already
        if (eventProperties.userUid === userToSelect.uid && eventProperties.payedForUserUids.length > 0) {
          this.disabledUsers.add(userToSelect.uid)
        }

        // disable user (only one possible) who pay for current user
        if (eventProperties.userUid === userToSelect.uid && eventProperties.hasPayedUserUid(this.user.uid)) {
          this.disabledUsers.add(userToSelect.uid)
        }
      });
    });
  }

  public getOptionHelpTitle(userOptionUid: string): string {
    const allUsersEventProperties = this.currentEvent.usersEventProperties;

    for (const eventProperties of allUsersEventProperties) {
      const someonePayForCurrentUser = eventProperties.userUid === userOptionUid && eventProperties.hasPayedUserUid(this.user.uid);
      if (someonePayForCurrentUser) {
        return 'This user is already payed for you';
      }

      if (eventProperties.userUid === userOptionUid && eventProperties.payedForUserUids.length > 0) {
        const allUsersMap = new Map(this.allUsers.map((user) => [user.uid, user.name]));
        const usersNames = eventProperties.payedForUserUids.map((payedForUserUid: string) => allUsersMap.get(payedForUserUid));
        if (usersNames.length > 0) {
          return `This user is already pay for ${ usersNames.join(', ') }`;
        } else {
          return 'This user is already pay for someone';
        }
      }

      const someonePayForOptionUser = eventProperties.hasPayedUserUid(userOptionUid);
      if (someonePayForOptionUser) {
        const user = this.allUsers.find((user: User) => user.uid === eventProperties.userUid);
        if (user !== undefined) {
          return `${ user.name } already payed for this user`;
        } else {
          return 'Someone already payed for this user';
        }
      }
    }

    return `Something went wrong. This user disabled by mistake`
  }

  public isDisabledOption(userOptionUid: string): boolean {
    return this.disabledUsers.has(userOptionUid);
  }

  public get isNobodyToSelect(): boolean {
    if (this.usersToSelect.length === 0) {
      return true;
    }

    return this.usersToSelect.length === this.disabledUsers.size;
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
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
