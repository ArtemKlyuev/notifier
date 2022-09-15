import { createNotifier, LaunchedNotification, PreparedNotification } from '@notifier/core';
import { makeAutoObservable } from 'mobx';

import { TimerManager } from './Timer';

type Notification<Payload> = Omit<LaunchedNotification<Payload>, 'info'> & {
  info: { timer: TimerManager | null };
};

export class NotificationManager {
  private notifierNotifications: Notification<string>[] = [];
  private readonly notifier = createNotifier<string>();

  constructor() {
    this.notifier.subscribe('add', () => this.updateNotifications());
    this.notifier.subscribe('remove', () => this.updateNotifications());
    makeAutoObservable(this);
  }

  private updateNotifications() {
    // @ts-expect-error Typescript throwing error on private fields
    this.notifierNotifications = this.notifier.notifications.map((notification) => {
      if (notification.info.timer) {
        return { ...notification, info: { timer: new TimerManager(notification.info.timer) } };
      }

      return notification;
    });
  }

  add(notification: PreparedNotification<string>): void {
    this.notifier.add(notification);
  }

  remove(id: string | number): void {
    this.notifier.remove(id);
  }

  get notifications(): Notification<string>[] {
    return this.notifierNotifications;
  }
}
