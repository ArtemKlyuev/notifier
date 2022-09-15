import React from 'react';
import { LaunchedNotification } from '@notifierjs/core';

import { useNotifierTimer } from '../../hooks';

interface Notification<Payload> {
  notification: LaunchedNotification<Payload>;
}

interface TimerProps {
  time: number | undefined;
}

export const withNotifierTimer =
  <Props, Payload>(WrappedComponent: React.ComponentType<Props & TimerProps>) =>
  ({ notification, ...props }: Props & Notification<Payload>): React.ReactElement => {
    const time = useNotifierTimer(notification);

    // @ts-expect-error ts(2322) type of props are related
    return <WrappedComponent time={time} {...props} />;
  };
