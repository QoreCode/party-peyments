import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import User from '@business/modules/user/user.model';
import UserEventProperties from '@business/modules/user-event-properties/user-event-properties.model';
import { map, Observable, Subscription } from 'rxjs';
import ApplicationStateService from '@services/application-state.service';
import { UserService } from '@services/entity-services/user.service';
import UserController from '@business/modules/user/user.controller';
import { combineLatest } from 'rxjs';
import { UserEventPropertiesService } from '@services/entity-services/user-event-properties.service';
import UserEventPropertiesController from '@business/modules/user-event-properties/user-event-properties.controller';

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

  constructor(private userController: UserController,
              private userEventPropsController: UserEventPropertiesController,
              private applicationStateService: ApplicationStateService,
              private userEventPropsService: UserEventPropertiesService,
              private userService: UserService,
              private toastr: ToastrService,
              private dialogRef: MatDialogRef<CreateUserModalComponent>,
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

    const selectedPartyEventUid = this.applicationStateService.getSelectedPartyEventUid();
    if (selectedPartyEventUid === undefined) {
      this.toastr.error('Selected Event is undefined. Stop breaking my app!');
      return;
    }

    const userName = this.nameInputControl.getRawValue();
    if (userName === null) {
      this.toastr.error('UserName is empty. Stop breaking my app!');
      return;
    }

    const cardNumber = this.cardNumberInputControl.getRawValue() ? String(this.cardNumberInputControl.getRawValue()) : undefined;

    await this.userController.create(selectedPartyEventUid, userName, cardNumber);

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

    const selectedEventUid = this.applicationStateService.getSelectedPartyEventUid();
    if (selectedEventUid === undefined) {
      this.toastr.error('Selected Event is undefined. Stop breaking my app!');
      return;
    }

    await this.userEventPropsController.createIfNotExist(selectedEventUid, selectedUsers);

    this.toastr.success('User was successfully created');
    this.dialogRef.close();
  }

  public ngOnDestroy(): void {
    this.usersSubscription.unsubscribe();
  }

  public ngOnInit(): void {
    this.usersSubscription = this.usersToSelect.subscribe((usersToSelect: User[]) => {
      if (usersToSelect.length === 0) {
        this.isNewUserState = true;
      }

      this.users = usersToSelect;
    })
  }

  public get usersToSelect(): Observable<User[]> {
    return combineLatest([
      this.userService.getByParam('isActive', true),
      this.userEventPropsService.getByParam('eventUid', this.applicationStateService.getSelectedPartyEventUid())
    ]).pipe(
      map(([users, userEventProps]) => {
        const alreadyAttachedUsers = new Set(userEventProps.map((userEventProperties: UserEventProperties) => {
          return userEventProperties.userUid;
        }));

        return users.filter((user: User) => !alreadyAttachedUsers.has(user.uid));
      })
    );
  }
}
