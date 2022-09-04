import { Timer } from './Timer';

interface BaseNotification<Payload> {
  id: string | number;
  payload: Payload;
}

interface PreparedNotification<Payload> extends BaseNotification<Payload> {
  options: BaseOptions;
}

interface LaunchedNotification<Payload> extends BaseNotification<Payload> {
  info: {
    timer: Timer | null;
  };
}

interface BaseOptions {
  autoRemove?: boolean;
  autoRemoveTimeout?: number;
  persist?: boolean;
}

interface Options extends BaseOptions {
  poolSize: number;
}

// @ts-expect-error we don't need `poolSize` in default options
const DEFAULT_OPTIONS: Options = {
  autoRemove: true,
  autoRemoveTimeout: 5000,
};

// TODO: add `subscribe` method
export class Notifier<Payload> {
  readonly #queue: PreparedNotification<Payload>[] = [];
  #notifications: LaunchedNotification<Payload>[] = [];
  #options: Options;

  constructor(options: Options) {
    this.#validateOptions(options);

    this.#options = this.#mergeOptions(DEFAULT_OPTIONS, options);
  }

  // TODO: Split method into `isValid` and `Validate`
  #validateOptions(options: BaseOptions): void {
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

  #isNotificationsPoolFilled(): boolean {
    return this.#notifications.length === this.#options.poolSize;
  }

  #scheduleNotification(
    notification: PreparedNotification<Payload>,
  ): LaunchedNotification<Payload> {
    const { options, ...baseNotification } = notification;

    const shouldRemove = !options.persist && (options.autoRemove || this.#options.autoRemove);

    if (!shouldRemove) {
      return { ...baseNotification, info: { timer: null } };
    }

    const removeTimeout = options.autoRemoveTimeout ?? this.#options.autoRemoveTimeout;

    const timer = new Timer(removeTimeout!);
    timer.subscribe('end', () => this.remove(baseNotification.id));

    return { ...baseNotification, info: { timer } };
  }

  #scheduleRemove(notification: PreparedNotification<Payload>): void {
    const shouldRemove =
      !notification.options.persist &&
      (notification.options.autoRemove || this.#options.autoRemove);

    if (!shouldRemove) {
      return;
    }

    const removeTimeout = notification.options.autoRemoveTimeout ?? this.#options.autoRemoveTimeout;

    setTimeout(this.remove, removeTimeout, notification.id);
  }

  setOptions(options: Options): void {
    this.#validateOptions(options);

    this.#options = this.#mergeOptions(this.#options, options);
  }

  add(notification: PreparedNotification<Payload>): void {
    this.#validateOptions(notification.options);

    if (this.#isNotificationsPoolFilled()) {
      this.#queue.push(notification);
      return;
    }

    // const { options, ...baseNotification } = notification;

    // const launchedNotification = { ...baseNotification };

    const launchedNotification = this.#scheduleNotification(notification);

    this.#notifications.push(launchedNotification);
    // this.#scheduleRemove(notification);
  }

  remove = (id: string | number): void => {
    this.#notifications = this.#notifications.filter((notification) => notification.id !== id);

    if (this.#queue.length > 0) {
      const notification = this.#queue.shift()!;
      this.add(notification);
    }
  };

  get notifications(): LaunchedNotification<Payload>[] {
    return this.#notifications;
  }
}
