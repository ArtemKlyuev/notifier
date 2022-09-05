import { useEffect, useState } from 'react';

const events = ['start', 'tick', 'pause', 'end'];

export const useNotifierTimer = (notification) => {
  const [timer, setTimer] = useState(notification.info.timer.timeLeft);

  useEffect(() => {
    const updateTime = () => setTimer(notification.info.timer.timeLeft);

    events.forEach((event) => notification.info.timer.subscribe(event, updateTime));
  }, []);

  return timer;
};
