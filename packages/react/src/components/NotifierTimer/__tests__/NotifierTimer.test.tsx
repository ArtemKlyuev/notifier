import React from 'react';
import { render } from '@testing-library/react';

import { NotifierTimer } from '../NotifierTimer';

describe('NotifierTimer', () => {
  it('should pass timer to children', () => {
    const children = jest.fn();

    render(
      <NotifierTimer
        notification={{
          id: 1,
          payload: 'Notification',
          // @ts-expect-error we don't need actual `subscribe` implementation
          info: { timer: { subscribe: () => {}, timeLeft: 5000 } },
        }}
      >
        {children}
      </NotifierTimer>,
    );

    expect(children).toHaveBeenCalledWith(5000);
  });
});
