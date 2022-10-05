import {
  Notifier,
  LaunchedNotification,
  PreparedNotification,
  Options,
  Disposer,
  Handler,
  NotificationEvent,
} from '@notifierjs/core';
import { makeAutoObservable } from 'mobx';

import { ObservableTimer } from '../ObservableTimer';

export interface Destroyable {
  destroy: () => void;
}

export class ObservableNotifier<Payload> implements Notifier<Payload>, Destroyable {
  private notifierNotifications: LaunchedNotification<Payload>[] = [];
  private observableOptions: Options;
  private readonly disposeAdd: Disposer;
  private readonly disposeRemove: Disposer;

  constructor(private readonly notifier: Notifier<Payload>) {
    this.observableOptions = this.notifier.options;
    this.disposeAdd = this.notifier.subscribe('add', () => this.updateNotifications());
    this.disposeRemove = this.notifier.subscribe('remove', () => this.updateNotifications());
    makeAutoObservable(this);
  }

  private updateNotifications() {
    this.notifierNotifications = this.notifier.notifications.map((notification) => {
      if (notification.info.timer) {
        return { ...notification, info: { timer: new ObservableTimer(notification.info.timer) } };
      }

      return notification;
    });
  }

  add(notification: PreparedNotification<Payload>): void {
    this.notifier.add(notification);
  }

  remove(id: string | number): void {
    this.notifier.remove(id);
  }

  setOptions(options: Partial<Options>): void {
    this.notifier.setOptions(options);
    this.observableOptions = this.notifier.options;
  }

  subscribe(event: NotificationEvent, handler: Handler): Disposer {
    return this.notifier.subscribe(event, handler);
  }

  destroy(): void {
    this.disposeAdd();
    this.disposeRemove();
  }

  get options(): Options {
    return this.observableOptions;
  }

  get notifications(): LaunchedNotification<Payload>[] {
    return this.notifierNotifications;
  }
}
