import { Injectable } from '@angular/core';
import User from '@business/models/user.model';
import EntityService from '@business/core/entity-service';

@Injectable({
  providedIn: 'root',
})
export default class UserService extends EntityService<User> {
  protected _tableName: string = 'users';

  public createFromJson(data: Record<string, any>): User {
    const uid = this.extractValue(data, 'uid');
    const name = this.extractValue(data, 'name');

    return new User(uid, name);
  }
}
