import { useState, useEffect } from 'react';
import { LaunchedNotification, NotificationEvent } from '@notifier/core';

import { useNotifierContext } from './useContext';

const notifierEvents: NotificationEvent[] = ['add', 'remove'];

export const useNotifier = <Payload>() => {
  const notifier = useNotifierContext<Payload>();

  const [notifications, setNotifications] = useState<LaunchedNotification<Payload>[]>([]);

  useEffect(() => {
    const updateNotififcations = () => setNotifications([...notifier.notifications]);

    const disposers = notifierEvents.map((event) =>
      notifier.subscribe(event, updateNotififcations),
    );

    return () => {
      disposers.forEach((dispose) => dispose());
    };
  }, []);

  return { notifications, add: notifier.add, remove: notifier.remove };
};
