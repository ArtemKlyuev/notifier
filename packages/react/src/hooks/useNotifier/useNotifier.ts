import { useState, useEffect } from 'react';
import { LaunchedNotification, NotificationEvent, Notifier, Options } from '@notifier/core';

import { useNotifierContext } from '../useContext';
import { areEqualObjects } from './utils';

const notifierEvents: NotificationEvent[] = ['add', 'remove'];

export const useNotifier = <Payload>(): Notifier<Payload> => {
  const notifier = useNotifierContext<Payload>();

  const [notifications, setNotifications] = useState<LaunchedNotification<Payload>[]>([]);
  const [options, setOptions] = useState(notifier.options);

  useEffect(() => {
    const updateNotififcations = () => setNotifications([...notifier.notifications]);

    const disposers = notifierEvents.map((event) =>
      notifier.subscribe(event, updateNotififcations),
    );

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, []);

  const updateOptions = (options: Partial<Options>): void => {
    notifier.setOptions(options);

    if (areEqualObjects(options, notifier.options)) {
      /* istanbul ignore next */
      return;
    }

    setOptions({ ...notifier.options });
  };

  return {
    notifications,
    options,
    add: notifier.add,
    remove: notifier.remove,
    setOptions: updateOptions,
    subscribe: notifier.subscribe,
  };
};
