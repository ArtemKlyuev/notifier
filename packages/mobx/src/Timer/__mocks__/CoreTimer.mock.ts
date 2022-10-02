import { Timer, TimerEvents } from '@notifierjs/core';

export const CoreTimerMock = jest.fn<Timer<TimerEvents>, any>((timeLeft: number) => ({
  start: jest.fn(),
  pause: jest.fn(),
  clear: jest.fn(),
  subscribe: jest.fn(),
  timeLeft,
}));
