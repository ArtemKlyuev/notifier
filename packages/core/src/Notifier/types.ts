import { Timer, TimerEvents } from '../Timer';

interface BaseNotification<Payload> {
  id: string | number;
  payload: Payload;
}

export interface PreparedNotification<Payload> extends BaseNotification<Payload> {
  options?: Partial<BaseOptions>;
}

export interface LaunchedNotification<Payload> extends BaseNotification<Payload> {
  options: BaseOptions;
  info: {
    timer: Timer<TimerEvents> | null;
  };
}

export interface BaseOptions {
  /**
   * Determines whether the added notification should be removed automatically.
   */
  autoRemove: boolean;
  /**
   * Determines after what time(in milliseconds) the notification should be removed automatically.
   */
  autoRemoveTimeout: number;
}

export interface Options extends BaseOptions {
  /**
   * Determines how many notifications can be displayed.
   */
  size: number;
}

export type NotificationEvent = 'add' | 'remove';

export type Disposer = () => void;
export type Handler = () => void;

export interface Notifier<Payload> {
  /**
   * Contains displayed notifications.
   */
  readonly notifications: LaunchedNotification<Payload>[];
  /**
   * Contains setted options.
   */
  readonly options: Options;
  /**
   * Set options for the current instance.
   */
  setOptions: (options: Partial<Options>) => void;
  /**
   * Add notification.
   */
  add: (notification: PreparedNotification<Payload>) => void;
  /**
   * Remove notification.
   */
  remove: (id: string | number) => void;
  /**
   * Subscribe to notifier events. Return disposer function to unsubscribe from event.
   */
  subscribe: (event: NotificationEvent, handler: Handler) => Disposer;
}
