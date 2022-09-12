import { LaunchedNotification, TimerEvents } from '@notifier/core';
import { useEffect, useState } from 'react';

const events: TimerEvents[] = ['start', 'tick', 'pause', 'end'];

export const useNotifierTimer = <Payload>(
  notification: LaunchedNotification<Payload>,
): number | undefined => {
  const [time, setTime] = useState(notification.info.timer?.timeLeft);

  useEffect(() => {
    const updateTime = () => setTime(notification.info.timer?.timeLeft);

    const disposers = events.map((event) => notification.info.timer?.subscribe(event, updateTime));

    return () => {
      disposers.map((disposer) => disposer?.());
    };
  }, []);

  return time;
};
