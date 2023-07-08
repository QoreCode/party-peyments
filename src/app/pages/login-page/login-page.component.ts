import { Component } from '@angular/core';
import Firebase from '@business/dal/firebase/firebase.connection';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  public firebaseInputControl = new FormControl('');
  public rememberMe: boolean = false;

  public setFirebaseLink(): void {
    try {
      const firebaseLink = this.firebaseInputControl.getRawValue();
      if (firebaseLink === null || firebaseLink === '') {
        this.firebaseInputControl.markAsDirty();
        this.firebaseInputControl.markAsTouched();
        this.firebaseInputControl.setErrors({ empty: true });

        return;
      }

      Firebase.getInstance().initialize(firebaseLink);

      if (this.rememberMe) {
        localStorage.setItem('firebaseLink', firebaseLink);
      }
    } catch (e) {
      if (e instanceof Error) {
        this.firebaseInputControl.markAsDirty();
        this.firebaseInputControl.markAsTouched();
        this.firebaseInputControl.setErrors({ firebase: e.message });
      } else {
        alert(e);
      }
    }
  }
}
