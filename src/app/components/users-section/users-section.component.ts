import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import User from '@business/modules/user/user.model';
import { combineLatest, map, Observable, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserModalComponent } from '@app/components/users-section/create-user-modal/create-user-modal.component';
import UserController from '@business/modules/user/user.controller';
import { UserService } from '@services/entity-services/user.service';
import { UserEventPropertiesService } from '@services/entity-services/user-event-properties.service';
import ApplicationStateService, { ApplicationState } from '@services/application-state.service';
import PartyEvent from '@business/modules/party-event/party-event.model';
import { PartyEventService } from '@services/entity-services/party-event.service';

@Component({
  selector: 'app-users-section',
  templateUrl: './users-section.component.html',
  styleUrls: ['./users-section.component.scss']
})
export class UsersSectionComponent implements OnDestroy {
  public closeIcon = faPlus;
  public usersSubscription: Subscription;
  public currentEvent?: PartyEvent;

  constructor(private userController: UserController,
              private partyEventService: PartyEventService,
              private applicationStateService: ApplicationStateService,
              private userEventPropertiesService: UserEventPropertiesService,
              private userService: UserService,
              private toastr: ToastrService,
              private dialog: MatDialog
  ) {
    this.usersSubscription = this.applicationStateService.subscribe((applicationState: ApplicationState) => {
      if (applicationState.selectedPartyEventUid === undefined) {
        return;
      }

      const partyEvent = this.partyEventService.entities.find((partyEvent: PartyEvent) => partyEvent.uid === applicationState.selectedPartyEventUid);
      if (partyEvent === undefined) {
        this.toastr.error(`Party Event with id ${ applicationState.selectedPartyEventUid } isn't defined`);
        return;
      }

      this.currentEvent = partyEvent;
    });
  }

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedPartyEventUid());
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  public openDialog(): void {
    this.dialog.open(CreateUserModalComponent);
  }

  public get users(): Observable<User[]> {
    return combineLatest([
      this.userService.getAll(),
      this.userEventPropertiesService.getByParam('eventUid', this.currentEvent?.uid)
    ]).pipe(
      map(([users, userEventProperties]) => {
        if (userEventProperties.length === 0) return [];

        const usersMap = new Map(users.map((user: User) => [user.uid, user]));
        return userEventProperties.reduce((users: User[], userEventProperties: UserEventProperties) => {
          const user = usersMap.get(userEventProperties.userUid);
          if (user === undefined) {
            this.toastr.error(`Can't find user with id 2 ${ userEventProperties.userUid }`);
            return users;
          }

          users.push(user);
          return users;
        }, []);
      })
    )
  }
}
