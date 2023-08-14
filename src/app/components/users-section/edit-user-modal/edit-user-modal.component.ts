import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import User from '@business/modules/user/user.model';
import { ToastrService } from 'ngx-toastr';
import UserController from '@business/modules/user/user.controller';

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
    private userController: UserController,
    private dialogRef: MatDialogRef<EditUserModalComponent>,
    private toastr: ToastrService,
  ) {
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

    await this.userController.update(this.user);

    this.toastr.success('User was successfully created');
    this.dialogRef.close();
  }
}
