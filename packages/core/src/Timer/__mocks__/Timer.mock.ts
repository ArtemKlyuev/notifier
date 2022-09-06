import { eventEmitterMock } from '../../EventEmitter/__mocks__';

import { Timer, TimerEvents, Timekeeper } from '../Timer';

jest.mock('../Timer');

export const timerMock = jest.mocked<Timer<TimerEvents>>(
  new Timekeeper(eventEmitterMock, 300),
  true,
);
