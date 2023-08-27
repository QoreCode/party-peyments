import { environment } from '@/environment';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@app/app.module';
import ApiConnection from '@business/dal/api/api.connection';
import Firebase from '@business/dal/firebase/firebase.connection';

ApiConnection.getInstance().initialize(environment.apiUrl);
Firebase.getInstance().initialize(environment.firebaseUrl);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));
