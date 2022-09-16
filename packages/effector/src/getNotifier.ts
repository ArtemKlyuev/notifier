import {
  createNotifier,
  Disposer,
  Handler,
  LaunchedNotification,
  NotificationEvent,
  Options,
  PreparedNotification,
} from '@notifierjs/core';
import { createEvent, createStore, Event, Store } from 'effector';

interface EffectedNotifier<Payload> {
  $notifications: Store<LaunchedNotification<Payload>[]>;
  $options: Store<Options>;
  addNotification: (notification: PreparedNotification<Payload>) => void;
  removeNotification: (id: string | number) => void;
  subscribe: (event: NotificationEvent, handler: Handler) => Disposer;
  setOptions: Event<Partial<Options>>;
}

export const getNotifier = <Payload>(): EffectedNotifier<Payload> => {
  const add = createEvent<LaunchedNotification<Payload>[]>('notifier/add');
  const remove = createEvent<LaunchedNotification<Payload>[]>('notifier/remove');
  const setOptions = createEvent<Partial<Options>>('notifier/options');

  const notifier = createNotifier<Payload>();

  notifier.subscribe('add', () => add(notifier.notifications));
  notifier.subscribe('remove', () => remove(notifier.notifications));

  const updateNotificaions = (
    _: LaunchedNotification<Payload>[],
    notifications: LaunchedNotification<Payload>[],
  ): LaunchedNotification<Payload>[] => [...notifications];

  const updateOptions = (_: Options, options: Partial<Options>): Options => {
    notifier.setOptions(options);

    return {
      ...notifier.options,
    };
  };

  const $notifications = createStore(notifier.notifications)
    .on(add, updateNotificaions)
    .on(remove, updateNotificaions);

  const $options = createStore(notifier.options).on(setOptions, updateOptions);

  const addNotification = notifier.add;
  const removeNotification = notifier.remove;
  const subscribe = notifier.subscribe;

  return { $notifications, $options, addNotification, removeNotification, subscribe, setOptions };
};
