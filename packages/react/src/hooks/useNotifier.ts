import { useState, useMemo, useEffect } from 'react';
import { Notifier, Options, LaunchedNotification } from '@notifier/core';

export const useNotifier = () => {
  const notifier = useMemo(
    () => new Notifier<string>({ poolSize: 5, autoRemove: true, autoRemoveTimeout: 3000 }),
    [],
  );

  const [notifications, setNotifications] = useState<LaunchedNotification<string>[]>([]);

  useEffect(() => {
    notifier.subscribe('add', () => {
      console.log('add');
      setNotifications([...notifier.notifications]);
    });
    notifier.subscribe('remove', () => {
      setNotifications([...notifier.notifications]);
    });
  }, []);

  return { notifications, add: notifier.add, remove: notifier.remove };
};
