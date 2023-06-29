import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import UserService from '@business/services/user.service';
import User from '@business/models/user.model';
import EventService from '@business/services/event.service';
import ApplicationStateService from '@business/services/application-state.service';
import UserEventProperties from '@business/models/user-event-properties.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html',
  styleUrls: ['./create-user-modal.component.scss']
})
export class CreateUserModalComponent implements OnDestroy, OnInit {
  public isNewUserState: boolean = false;
  public users: User[] = [];

  public usersSubscription!: Subscription;

  public nameInputControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(200)
  ]);
  public userIdsInputControl = new FormControl<string[]>([], [Validators.required]);
  public cardNumberInputControl = new FormControl<undefined | string>(undefined, [
    Validators.pattern(/^\d{16}$/)
  ]);

  constructor(public dialogRef: MatDialogRef<CreateUserModalComponent>,
              public applicationStateService: ApplicationStateService,
              public toastr: ToastrService,
              public eventService: EventService,
              public userService: UserService
  ) {
  }

  public setIsNewUserState(isNewUserState: boolean): void {
    if (isNewUserState === false && this.users.length === 0) {
      return;
    }

    this.isNewUserState = isNewUserState;
  }

  public getExistedUsersTitle(): string {
    if (this.users.length === 0) {
      return 'No users created or all of them already attached to the event';
    }

    return '';
  }

  public async createUser() {
    if (!this.nameInputControl.valid) {
      this.nameInputControl.markAsDirty();
      this.nameInputControl.markAsTouched();
      return;
    }

    if (!this.cardNumberInputControl.valid) {
      this.cardNumberInputControl.markAsDirty();
      this.cardNumberInputControl.markAsTouched();
      return;
    }

    const userName = this.nameInputControl.getRawValue();
    if (userName === null) {
      this.toastr.error('UserName is empty. Stop breaking my app!');
      return;
    }

    const cardNumber = this.cardNumberInputControl.getRawValue() ? String(this.cardNumberInputControl.getRawValue()) : undefined;

    const userServiceFBDec = new FirebaseEntityServiceDecorator(this.userService);
    const user = User.create(userName, cardNumber);
    await userServiceFBDec.addOrUpdateEntity(user);

    const selectedEventUid = this.applicationStateService.getSelectedEventUid();
    if (selectedEventUid === undefined) {
      this.toastr.error('Selected Event is undefined. Stop breaking my app!');
      return;
    }

    const event = await this.eventService.getEntityByUid(selectedEventUid);
    if (event === undefined) {
      this.toastr.error('Event is undefined. Stop breaking my app!');
      return;
    }

    await event.addUserUid(user.uid);

    const eventServiceFBDec = new FirebaseEntityServiceDecorator(this.eventService);
    await eventServiceFBDec.addOrUpdateEntity(event);

    this.toastr.success('User was successfully created');
    this.dialogRef.close();
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async addUsers(): Promise<void> {
    if (!this.userIdsInputControl.valid) {
      this.userIdsInputControl.markAsDirty();
      this.userIdsInputControl.markAsTouched();
      return;
    }

    const selectedUsers = this.userIdsInputControl.getRawValue();
    if (selectedUsers === null || selectedUsers.length === 0) {
      this.toastr.error('No selected users found. Stop breaking my app!');
      return;
    }

    const selectedEventUid = this.applicationStateService.getSelectedEventUid();
    if (selectedEventUid === undefined) {
      this.toastr.error('Selected Event is undefined. Stop breaking my app!');
      return;
    }

    const event = await this.eventService.getEntityByUid(selectedEventUid);
    if (event === undefined) {
      this.toastr.error('Event is undefined. Stop breaking my app!');
      return;
    }

    await event.addUsersUid(selectedUsers);

    const eventServiceFBDec = new FirebaseEntityServiceDecorator(this.eventService);
    await eventServiceFBDec.addOrUpdateEntity(event);

    this.toastr.success('User was successfully created');
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    this.userService.subscribe(async () => {
      const selectedEventUid = this.applicationStateService.getSelectedEventUid();
      if (selectedEventUid === undefined) {
        this.toastr.error('Selected Event is undefined. Stop breaking my app!');
        return;
      }

      const event = await this.eventService.getEntityByUid(selectedEventUid);
      if (event === undefined) {
        this.toastr.error('Event is undefined. Stop breaking my app!');
        return;
      }

      const alreadyAttachedUsers = new Set(event.usersEventProperties.map((userEventProperties: UserEventProperties) => {
        return userEventProperties.userUid;
      }));

      const users = await this.userService.getEntities();
      this.users = users.filter((user: User) => !alreadyAttachedUsers.has(user.uid));

      if (this.users.length === 0) {
        this.isNewUserState = true;
      }
    })
  }
}
