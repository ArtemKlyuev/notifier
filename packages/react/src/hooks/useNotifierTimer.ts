import { LaunchedNotification } from '@notifier/core';
import { TimerEvents } from '@notifier/core/dist/typings/Timer';
import { useEffect, useState } from 'react';

const events: TimerEvents[] = ['start', 'tick', 'pause', 'end'];

export const useNotifierTimer = <Payload>(notification: LaunchedNotification<Payload>) => {
  const [timer, setTimer] = useState(notification.info.timer?.timeLeft);

  useEffect(() => {
    const updateTime = () => setTimer(notification.info.timer?.timeLeft);

    const disposers = events.map((event) => notification.info.timer?.subscribe(event, updateTime));

    return () => {
      disposers.map((disposer) => disposer?.());
    };
  }, []);

  return timer;
};
