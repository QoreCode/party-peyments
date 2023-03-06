import { Component, OnDestroy } from '@angular/core';
import ApplicationStateService, { ApplicationState } from '@business/services/application-state.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import UserService from '@business/services/user.service';
import User from '@business/models/user.model';
import { Subscription } from 'rxjs';
import EventService from '@business/services/event.service';
import { ToastrService } from 'ngx-toastr';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import UserEventProperties from '@business/models/user-event-properties.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateUserModalComponent } from '@app/components/users-section/create-user-modal/create-user-modal.component';
import PartyEvent from '@business/models/party-event.model';

@Component({
  selector: 'app-users-section',
  templateUrl: './users-section.component.html',
  styleUrls: ['./users-section.component.scss']
})
export class UsersSectionComponent implements OnDestroy {
  public closeIcon = faPlus;
  public users: User[] = [];
  public usersSubscription: Subscription;
  public eventsSubscription: Subscription;

  constructor(public applicationStateService: ApplicationStateService,
              public eventService: EventService,
              public toastr: ToastrService,
              public dialog: MatDialog,
              public userService: UserService) {

    const fbDec = new FirebaseEntityServiceDecorator(this.userService);
    // fbDec.addOrUpdateEntity(new User(`1`, `User 1`));
    // fbDec.addOrUpdateEntity(new User(`2`, `User 2`));
    // fbDec.addOrUpdateEntity(new User(`3`, `User 3`));
    // fbDec.addOrUpdateEntity(new User(`4`, `User 4`));
    fbDec.getEntities();

    this.usersSubscription = this.applicationStateService.subscribe((applicationState: ApplicationState) => {
      const selectedEventUid = applicationState.selectedEventUid;
      if (selectedEventUid === undefined) {
        return;
      }

      this.updateUsers(selectedEventUid);
    });

    this.eventsSubscription = this.eventService.subscribe((allEventsMap: Map<string, PartyEvent>) => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        return;
      }

      this.updateUsers(selectedEventUid);
    })
  }

  public get hasSelectedEvent(): boolean {
    return Boolean(this.applicationStateService.getSelectedEventUid());
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
    this.eventsSubscription.unsubscribe();
  }

  public openDialog(): void {
    this.dialog.open(CreateUserModalComponent);
  }

  private async updateUsers(selectedEventUid: string): Promise<void> {
    const event = await this.eventService.getEntityByUid(selectedEventUid);
    if (event === undefined) {
      return;
    }

    if (event.usersEventProperties.length === 0) {
      this.users = [];
    }

    const allUses = await this.userService.getEntities();
    const allUsersMap = new Map(allUses.map((user: User) => [user.uid, user]));
    this.users = event.usersEventProperties.reduce((users: User[], userEventProperties: UserEventProperties) => {
      const user = allUsersMap.get(userEventProperties.userUid);
      if (user === undefined) {
        this.toastr.error(`Can't find user with id ${ userEventProperties.userUid }`);
        return users;
      }

      users.push(user);
      return users;
    }, []);
  }
}
