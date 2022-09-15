import { useNotifier, NotifierTimer } from '@notifierjs/react';
import { useTransition } from '@react-spring/web';
import { useMemo } from 'react';

import { AnimatedNotification } from './Notification';

import styles from './NotificationsContainer.module.css';

export const NotificationsContainer = () => {
  const notifier = useNotifier<string>();

  const refs = useMemo<{ [key: string]: { cancel: () => void; height: number } }>(() => ({}), []);

  const transitions = useTransition(notifier.notifications, {
    from: { opacity: 0, height: 0 },
    keys: (item) => item.id,
    enter: (item) => async (next, cancel) => {
      refs[item.id] = { ...refs[item.id], cancel };
      await next({ opacity: 1, height: refs[item.id].height });
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    config: () => () => {
      return { tension: 125, friction: 20, precision: 0.1 };
    },
  });

  return (
    <div className={styles.Container}>
      {transitions((styles, item) => (
        <NotifierTimer notification={item}>
          {(time) => (
            <AnimatedNotification
              ref={(ref) => ref && (refs[item.id] = { ...refs[item.id], height: ref.offsetHeight })}
              initialTime={item.options.autoRemoveTimeout}
              time={time}
              onHover={() => {
                item.info.timer?.pause();
              }}
              onBlur={() => item.info.timer?.start()}
              onClose={() => {
                refs[item.id].cancel();
                notifier.remove(item.id);
              }}
              style={styles}
            >
              {item.payload}
            </AnimatedNotification>
          )}
        </NotifierTimer>
      ))}
    </div>
  );
};
