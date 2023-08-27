import { Component, OnInit } from '@angular/core';
import ApiConnection from '@business/dal/api/api.connection';
import { environment } from '@/environment';
import Firebase from '@business/dal/firebase/firebase.connection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public get isDBInitialized(): boolean {
    return (
      ApiConnection.getInstance().isInitialized() &&
      Firebase.getInstance().isInitialized()
    );
  }
}
