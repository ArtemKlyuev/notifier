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
  autoRemove: boolean;
  autoRemoveTimeout: number;
  persist: boolean;
}

export interface Options extends BaseOptions {
  size: number;
}

export type NotificationEvent = 'add' | 'remove';

export type Disposer = () => void;
export type Handler = () => void;

export interface Notifier<Payload> {
  readonly notifications: LaunchedNotification<Payload>[];
  setOptions: (options: Options) => void;
  add: (notification: PreparedNotification<Payload>) => void;
  remove: (id: string | number) => void;
  subscribe: (event: NotificationEvent, handler: Handler) => Disposer;
}
