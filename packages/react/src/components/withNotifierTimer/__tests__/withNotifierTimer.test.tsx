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
          info: { timer: { subscribe: () => {}, timeLeft: 5000 } },
        }}
      />,
    );

    expect(FakeNotification).toHaveBeenCalledWith({ time: 5000 }, {});
  });
});
