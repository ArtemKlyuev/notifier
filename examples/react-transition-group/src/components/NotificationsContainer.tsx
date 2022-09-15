import { useNotifier, NotifierTimer } from '@notifier/react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { Notification } from './Notification';

import styles from './NotificationsContainer.module.css';

const notifierAnimationClassNames = {
  enter: styles.notifier_animation_enter,
  enterActive: styles.notifier_animation_enter_active,
  exit: styles.notifier_animation_exit,
  exitActive: styles.notifier_animation_exit_active,
};

export const NotificationsContainer = () => {
  const notifier = useNotifier<string>();

  return (
    <TransitionGroup className={styles.notifications}>
      {notifier.notifications.map((notification) => (
        <CSSTransition key={notification.id} timeout={200} classNames={notifierAnimationClassNames}>
          <NotifierTimer notification={notification}>
            {(time) => (
              <Notification
                onClose={() => notifier.remove(notification.id)}
                onHover={() => notification.info.timer?.pause()}
                onBlur={() => notification.info.timer?.start()}
                initialTime={notification.options.autoRemoveTimeout}
                time={time}
              >
                {notification.payload}
              </Notification>
            )}
          </NotifierTimer>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};
