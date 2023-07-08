import StorageMessage from '@business/storages/message-bus/storage-message';
import { ReplaySubject, Subscription } from 'rxjs';
import { StorageMessageActions } from '@business/storages/message-bus/storage-message.enum';
import Model from '@business/core/entity-model';

export default class StorageMessageBus {
  private _messages: StorageMessage<Model>[] = [];
  private _emitter: ReplaySubject<StorageMessage<Model>> = new ReplaySubject();

  public emit(action: StorageMessageActions, entity: Model): void {
    const message = new StorageMessage(action, entity);
    this._messages.push(message);

    this._emitter.next(message);
  }

  public get messages(): StorageMessage<Model>[] {
    return this._messages;
  }

  public subscribe(onChange: <TEntity extends Model>(entity: StorageMessage<TEntity>) => void): Subscription {
    return this._emitter.subscribe({ next: onChange });
  }
}
