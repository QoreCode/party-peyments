import { Component, OnInit } from '@angular/core';
import Api from '@business/dal/api/api.connection';
import { environment } from '@/src/environments/environment';
import Firebase from '@business/dal/firebase/firebase.connection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public ngOnInit() {
    Api.getInstance().initialize(environment.apiUrl);
    Firebase.getInstance().initialize(environment.firebaseUrl);
  }

  public get isDBInitialized(): boolean {
    return (
      Api.getInstance().isInitialized() &&
      Firebase.getInstance().isInitialized()
    );
  }
}
