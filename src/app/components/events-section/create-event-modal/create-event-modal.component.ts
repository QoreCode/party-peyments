import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import User from '@business/modules/user/user.model';
import PartyEventController from '@business/modules/party-event/party-event.controller';
import { UserService } from '@services/entity-services/user.service';
import { Observable } from 'rxjs';
import ApplicationStateService from '@services/application-state.service';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss']
})
export class CreateEventModalComponent {
  public userIdsInputControl = new FormControl<string[]>([]);
  public nameInputControl = new FormControl('', [
    Validators.required, Validators.minLength(4), Validators.maxLength(200)
  ]);

  constructor(private partyEventController: PartyEventController,
              private applicationStateService: ApplicationStateService,
              private userService: UserService,
              private dialogRef: MatDialogRef<CreateEventModalComponent>,
              private toastr: ToastrService,
  ) {
  }

  public get users(): Observable<User[]> {
    return this.userService.getAll();
  }

  async createEvent() {
    if (!this.nameInputControl.valid) {
      this.nameInputControl.markAsDirty();
      this.nameInputControl.markAsTouched();
    }

    if (!this.userIdsInputControl.valid) {
      this.userIdsInputControl.markAsDirty();
      this.userIdsInputControl.markAsTouched();
    }

    if (!this.nameInputControl.valid || !this.userIdsInputControl.valid) {
      return;
    }

    const eventName = this.nameInputControl.getRawValue();
    const eventUserIds = this.userIdsInputControl.getRawValue();
    if (eventName === null || eventUserIds === null) {
      this.toastr.error('EventName or EventUserIds is empty. Stop breaking my app!');
      return;
    }

    const partyEvent = await this.partyEventController.create(eventName, eventUserIds);
    this.applicationStateService.setSelectedPartyEventUid(partyEvent.uid);

    this.toastr.success('Event was successfully created');
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
