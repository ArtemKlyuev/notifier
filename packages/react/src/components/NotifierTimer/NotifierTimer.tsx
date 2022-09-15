import { LaunchedNotification } from '@notifierjs/core';

import { useNotifierTimer } from '../../hooks';

interface Props<Payload> {
  children: (time?: number) => React.ReactElement;
  notification: LaunchedNotification<Payload>;
}

export const NotifierTimer = <Payload,>({
  children,
  notification,
}: Props<Payload>): React.ReactElement => {
  const time = useNotifierTimer(notification);

  return children(time);
};
