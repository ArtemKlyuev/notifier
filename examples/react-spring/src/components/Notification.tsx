import { animated, SpringValue } from '@react-spring/web';
import React from 'react';

import styles from './Notification.module.css';

interface Props {
  time?: number;
  initialTime?: number;
  children: React.ReactNode;
  onClose: () => void;
  onHover?: () => void;
  onBlur?: () => void;
}

interface AnimatedProps extends Props {
  style: { [key: string]: SpringValue<any> };
}

const getTimePercent = (initialTime: number, time: number): number => {
  const diff = initialTime - time;
  return (100 * diff) / initialTime;
};

export const Notification = React.forwardRef<HTMLDivElement, Props>(
  ({ children, time, initialTime, onClose, onHover, onBlur }, ref) => {
    const hasTime = initialTime && typeof time === 'number';

    return (
      <div ref={ref} onMouseEnter={onHover} onMouseLeave={onBlur} className={styles.Wrapper}>
        {hasTime && (
          <div
            style={{ transform: `translateX(-${getTimePercent(initialTime, time)}%)` }}
            className={styles.Timeline}
          />
        )}
        <span onClick={onClose} className={styles.Button}>
          close
        </span>
        <div className={styles.Content}>{children}</div>
      </div>
    );
  },
);

export const AnimatedNotification = React.forwardRef<HTMLDivElement, AnimatedProps>(
  ({ style, ...props }: AnimatedProps, ref) => {
    return (
      <animated.div style={style}>
        <Notification ref={ref} {...props} />
      </animated.div>
    );
  },
);
