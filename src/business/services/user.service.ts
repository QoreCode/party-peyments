import User from '../models/user';
import Service from './service';

export default class UserService extends Service<User> {
  public getEntityByUid(userUid: string): User | undefined {
    return this.entities.getValue().get(userUid);
  }
}
