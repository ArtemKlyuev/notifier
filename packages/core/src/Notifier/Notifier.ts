import { EventBus, EventEmitter } from '../EventEmitter';
import { Timekeeper, TimerEvents } from '../Timer';
import {
  BaseOptions,
  PreparedNotification,
  LaunchedNotification,
  NotificationEvent,
  Options,
  Handler,
  Disposer,
  Notifier,
} from './types';

const DEFAULT_OPTIONS: Options = {
  autoRemove: true,
  autoRemoveTimeout: 5000,
  size: 5,
  persist: false,
};

export class Informer<Payload> implements Notifier<Payload> {
  readonly #eventEmitter: EventEmitter<NotificationEvent | TimerEvents> = new EventBus();
  readonly #queue: PreparedNotification<Payload>[] = [];
  #notifications: LaunchedNotification<Payload>[] = [];
  #options: Options;

  constructor(options: Options) {
    this.#validateOptions(options);

    this.#options = this.#mergeOptions(DEFAULT_OPTIONS, options);
  }

  get #isNotificationsFilled(): boolean {
    return this.#notifications.length === this.#options.size;
  }

  // TODO: Split method into `isValid` and `Validate`
  #validateOptions(options: Partial<Options>): void {
    if (options.autoRemove && options.persist) {
      throw new Error('Notifier: Unable to use "autoRemove" and "persist" options together');
    }

    if (!options.autoRemove && !options.persist) {
      throw new Error('Notifier: Options "autoRemove" and "persist" can\'t be both "false"');
    }
  }

  #mergeOptions(prevOptions: Options, newOptions: Options): Options {
    return { ...prevOptions, ...newOptions };
  }

  #setupTimer(id: string | number, timeout: number): Timekeeper {
    const timer = new Timekeeper(this.#eventEmitter, timeout);
    timer.subscribe('end', () => this.remove(id));
    timer.start();

    return timer;
  }

  #getLaunchedNotificationOptions(notificatonOptions?: Partial<BaseOptions>): BaseOptions {
    if (!notificatonOptions) {
      return this.#options;
    }

    const { size, ...options } = this.#options;

    if (notificatonOptions.autoRemove) {
      return { ...options, ...notificatonOptions, persist: false };
    }

    if (notificatonOptions.persist) {
      return { ...options, ...notificatonOptions, autoRemove: false };
    }

    return { ...this.#options, ...notificatonOptions };
  }

  #setupNotification(notification: PreparedNotification<Payload>): LaunchedNotification<Payload> {
    const { options, ...baseNotification } = notification;

    const finalOptions = this.#getLaunchedNotificationOptions(options);

    if (!finalOptions.autoRemove) {
      return { ...baseNotification, options: finalOptions, info: { timer: null } };
    }

    const timer = this.#setupTimer(baseNotification.id, finalOptions.autoRemoveTimeout);

    return { ...baseNotification, options: finalOptions, info: { timer } };
  }

  setOptions = (options: Options): void => {
    this.#validateOptions(options);

    this.#options = this.#mergeOptions(this.#options, options);
  };

  add = (notification: PreparedNotification<Payload>): void => {
    if (notification.options) {
      this.#validateOptions(notification.options);
    }

    if (this.#isNotificationsFilled) {
      this.#queue.push(notification);
      return;
    }

    const launchedNotification = this.#setupNotification(notification);

    this.#notifications.push(launchedNotification);
    this.#eventEmitter.emit('add');
  };

  remove = (id: string | number): void => {
    this.#notifications = this.#notifications.filter((notification) => notification.id !== id);
    this.#eventEmitter.emit('remove');

    if (this.#queue.length > 0) {
      const notification = this.#queue.shift()!;
      this.add(notification);
    }
  };

  subscribe(event: NotificationEvent, handler: Handler): Disposer {
    const disposer = this.#eventEmitter.subscribe(event, handler);

    return disposer;
  }

  get notifications(): LaunchedNotification<Payload>[] {
    return this.#notifications;
  }
}
