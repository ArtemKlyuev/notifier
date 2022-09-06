import { EventBus, EventEmitter } from '../EventEmitter';
import { Timekeeper, Timer, TimerEvents } from '../Timer';
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

export const DEFAULT_OPTIONS: Options = {
  autoRemove: true,
  autoRemoveTimeout: 5000,
  size: 5,
  persist: false,
};

type TimerConstructor = new (
  eventEmitter: EventEmitter<TimerEvents>,
  countdownTime: number,
) => Timer<TimerEvents>;

export class Informer<Payload> implements Notifier<Payload> {
  // readonly #eventEmitter: EventEmitter<NotificationEvent | TimerEvents> = new EventBus();
  readonly #eventEmitter: EventEmitter<NotificationEvent | TimerEvents>;
  readonly #TimerConstructor: TimerConstructor;
  readonly #queue: PreparedNotification<Payload>[] = [];
  #notifications: LaunchedNotification<Payload>[] = [];
  #options: Options;

  constructor(
    eventEmitter: EventEmitter<NotificationEvent | TimerEvents>,
    TimerConstructor: TimerConstructor,
    options?: Partial<Options>,
  ) {
    if (options) {
      this.#validateOptions(options);
    }

    this.#eventEmitter = eventEmitter;
    this.#TimerConstructor = TimerConstructor;

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

  #mergeOptions(prevOptions: Options, newOptions?: Partial<Options>): Options {
    return { ...prevOptions, ...newOptions };
  }

  #setupTimer(id: string | number, timeout: number): Timer<TimerEvents> {
    // const timer = new Timekeeper(this.#eventEmitter, timeout);
    const timer = new this.#TimerConstructor(this.#eventEmitter, timeout);
    timer.subscribe('end', () => this.remove(id));
    timer.start();

    return timer;
  }

  #getLaunchedNotificationOptions(notificatonOptions?: Partial<BaseOptions>): BaseOptions {
    const { size, ...options } = this.#options;

    if (!notificatonOptions) {
      return options;
    }

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

  setOptions = (options: Partial<Options>): void => {
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

  get options(): Options {
    return this.#options;
  }
}
