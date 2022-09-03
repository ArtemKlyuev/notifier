interface Notification {
  id: string | number;
  payload: any;
  options: BaseOptions;
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
export class Notifier {
  readonly #queue: Notification[] = [];
  #notificationsPool: Notification[] = [];
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
    return this.#notificationsPool.length === this.#options.poolSize;
  }

  #scheduleRemove(notification: Notification): void {
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

  add(notification: Notification): void {
    this.#validateOptions(notification.options);

    if (this.#isNotificationsPoolFilled()) {
      this.#queue.push(notification);
      return;
    }

    this.#notificationsPool.push(notification);
    this.#scheduleRemove(notification);
  }

  remove = (id: string | number): void => {
    this.#notificationsPool = this.#notificationsPool.filter(
      (notification) => notification.id !== id,
    );

    if (this.#queue.length > 0) {
      const notification = this.#queue.shift()!;
      this.add(notification);
    }
  };

  get notifications(): Notification[] {
    return this.#notificationsPool;
  }
}
