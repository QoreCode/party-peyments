import EntityMapper from '@business/dal/mappers/entity.mapper';
import User from '@business/modules/user/user.model';

export default class UserMapper extends EntityMapper<User> {
  protected createModelFromJson(data: any): User {
    const uid = this.extractValue(data, 'uid');
    const name = this.extractValue(data, 'name');
    const isActive = this.extractValue(data, 'isActive');
    const card = data.card ? `${ data.card }` : undefined;

    return new User(uid, name, isActive, card);
  }
}
