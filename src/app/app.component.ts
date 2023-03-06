import { Component, OnInit } from '@angular/core';
import Firebase from '@business/core/firebase/firebase.singleton';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private toastr: ToastrService) {
  }

  public ngOnInit() {
    try {
      const firebaseLink = localStorage.getItem('firebaseLink');
      if (firebaseLink !== null) {
        Firebase.getInstance().initialize(firebaseLink);
      }
    } catch (e) {
      localStorage.removeItem('firebaseLink');
      this.toastr.error('Link into localStorage is broken. So u need to set it again');
    }
  }

  public get isDBInitialized(): boolean {
    return Firebase.getInstance().isInitialized();
  }
}
