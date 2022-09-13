import React from 'react';
import { render } from '@testing-library/react';

import { withNotifierTimer } from '../withNotifierTimer';

describe('withNotifierTimer', () => {
  it('should pass timer to children', () => {
    const FakeNotification = jest.fn();

    const NotificationWithTimer = withNotifierTimer(FakeNotification);

    render(
      <NotificationWithTimer
        notification={{
          id: 1,
          payload: 'Notification',
          // we don't need actual `subscribe` implementation
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          info: { timer: { subscribe: () => {}, timeLeft: 5000 } },
        }}
      />,
    );

    expect(FakeNotification).toHaveBeenCalledWith({ time: 5000 }, {});
  });
});
