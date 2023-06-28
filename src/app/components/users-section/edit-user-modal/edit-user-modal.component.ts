import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import User from '@business/models/user.model';
import FirebaseEntityServiceDecorator from '@business/core/firebase/firebase-entity-service.decorator';
import { ToastrService } from 'ngx-toastr';
import UserService from '@business/services/user.service';

@Component({
  selector: 'app-edit-user-modal',
  templateUrl: './edit-user-modal.component.html',
  styleUrls: ['./edit-user-modal.component.scss']
})
export class EditUserModalComponent {
  public user: User;
  public nameInputControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(200)]
  );
  public cardNumberInputControl = new FormControl<undefined | string>(undefined, [
    Validators.pattern(/^\d{16}$/)
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { user: User },
    public dialogRef: MatDialogRef<EditUserModalComponent>,
    public toastr: ToastrService,
    public userService: UserService) {
    this.user = data.user;

    this.nameInputControl.setValue(this.user.name);
    this.cardNumberInputControl.setValue(this.user.card);
  }

  public onNoClick(): void {
    this.dialogRef.close();
  }

  public async editUser(): Promise<void> {
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

    this.user.card = this.cardNumberInputControl.getRawValue() ? String(this.cardNumberInputControl.getRawValue()) : undefined;
    this.user.name = userName;

    const userServiceFBDec = new FirebaseEntityServiceDecorator(this.userService);
    await userServiceFBDec.addOrUpdateEntity(this.user);

    this.toastr.success('User was successfully created');
    this.dialogRef.close();
  }
}
