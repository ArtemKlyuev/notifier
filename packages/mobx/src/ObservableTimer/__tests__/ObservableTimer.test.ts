/* eslint-disable @typescript-eslint/no-empty-function */

import { Timer, TimerEvents } from '@notifierjs/core';

import { ObservableTimer } from '../ObservableTimer';

jest.mock('mobx');

const COUNTDOWN_TIME = 1000;

describe('ObservableTimer', () => {
  jest.useFakeTimers();

  let observableTimer: Timer<TimerEvents>;
  let coreTimerMock: Timer<TimerEvents>;

  beforeEach(() => {
    jest.clearAllMocks();

    coreTimerMock = jest.fn<Timer<TimerEvents>, any>((timeLeft: number) => ({
      start: jest.fn(),
      pause: jest.fn(),
      clear: jest.fn(),
      subscribe: () => () => {},
      timeLeft,
    }))(COUNTDOWN_TIME);

    observableTimer = new ObservableTimer(coreTimerMock);
  });

  it('should return countdown time', () => {
    expect(observableTimer.timeLeft).toBe(COUNTDOWN_TIME);
  });

  it('should start timer', () => {
    expect(coreTimerMock.start).not.toHaveBeenCalled();
    observableTimer.start();
    expect(coreTimerMock.start).toHaveBeenCalled();
  });

  it('should pause timer', () => {
    expect(coreTimerMock.pause).not.toHaveBeenCalled();
    observableTimer.pause();
    expect(coreTimerMock.pause).toHaveBeenCalled();
  });

  it('should subscribe to "start" events', () => {
    const spy = jest.spyOn(coreTimerMock, 'subscribe');
    const listener = jest.fn();

    expect(spy).not.toHaveBeenCalled();
    observableTimer.subscribe('start', listener);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith('start', listener);
  });

  it('should subscribe to "pause" events', () => {
    const spy = jest.spyOn(coreTimerMock, 'subscribe');
    const listener = jest.fn();

    expect(spy).not.toHaveBeenCalled();
    observableTimer.subscribe('pause', listener);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith('pause', listener);
  });

  it('should subscribe to "tick" events', () => {
    const spy = jest.spyOn(coreTimerMock, 'subscribe');
    const listener = jest.fn();

    expect(spy).not.toHaveBeenCalled();
    observableTimer.subscribe('tick', listener);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith('tick', listener);
  });

  it('should subscribe to "end" events', () => {
    const spy = jest.spyOn(coreTimerMock, 'subscribe');
    const listener = jest.fn();

    expect(spy).not.toHaveBeenCalled();
    observableTimer.subscribe('end', listener);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toBeCalledWith('end', listener);
  });

  it('should clear timer', () => {
    expect(coreTimerMock.clear).not.toHaveBeenCalled();
    observableTimer.clear();
    expect(coreTimerMock.clear).toHaveBeenCalled();
  });
});
