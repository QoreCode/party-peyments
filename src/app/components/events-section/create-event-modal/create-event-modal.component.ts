import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import EventService from '@business/services/event.service';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import PartyEvent from '@business/models/party-event.model';
import { ToastrService } from 'ngx-toastr';
import UserService from '@business/services/user.service';
import User from '@business/models/user.model';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss']
})
export class CreateEventModalComponent {
  public nameInputControl = new FormControl('',
    [Validators.required, Validators.minLength(4), Validators.maxLength(200)]);
  public users: User[] = [];
  public userIdsInputControl = new FormControl<string[]>([]);

  constructor(public dialogRef: MatDialogRef<CreateEventModalComponent>,
              public toastr: ToastrService,
              public eventService: EventService,
              public userService: UserService
  ) {
    this.userService.getEntities().then((users: User[]) => this.users = users);
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

    const eventServiceFBDec = new FirebaseEntityServiceDecorator(this.eventService);
    await eventServiceFBDec.addOrUpdateEntity(PartyEvent.create(eventName, eventUserIds));

    this.toastr.success('Event was successfully created');
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
