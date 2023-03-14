import { Component, OnInit } from '@angular/core';
import Firebase from '@business/core/firebase/firebase.singleton';
import { ToastrService } from 'ngx-toastr';

// party-payments-default-rtdb.europe-west1

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private toastr: ToastrService) {
  }

  copyLink() {
    const fb = Firebase.getInstance();
    if (!fb.isInitialized()) {
      return;
    }

    const databaseURL = fb.databaseURL;
    if (databaseURL === undefined) {
      return;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('firebaseLink', databaseURL)
    this.copyTextToClipboard(url.href);
  }

  public ngOnInit() {
    try {
      const url = new URL(window.location.href);
      const params = new URLSearchParams(url.search);
      const firebaseParamsLink = params.get('firebaseLink');
      if (firebaseParamsLink !== null) {
        Firebase.getInstance().initialize(firebaseParamsLink);
        localStorage.setItem('firebaseLink', firebaseParamsLink);
        return;
      }

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

  public copyTextToClipboard(text: string): void {
    if (!navigator.clipboard) {
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      console.log('Async: Copying to clipboard was successful!');
      this.toastr.success('Link to this app copied successfully');
    }, () => {
      this.toastr.error(`For some reason can't copy the link to this app`);
    });
  }
}
