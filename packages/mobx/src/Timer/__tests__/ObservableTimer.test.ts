/* eslint-disable @typescript-eslint/no-empty-function */

import { Timer, TimerEvents } from '@notifierjs/core';

import { CoreTimerMock } from '../__mocks__';

import { ObservableTimer } from '../Timer';

const COUNTDOWN_TIME = 1000;

describe('ObservableTimer', () => {
  jest.useFakeTimers();

  let observableTimer: Timer<TimerEvents>;
  let coreTimerMock: Timer<TimerEvents>;
  // let coreTimerMock: Timer<TimerEvents> = CoreTimerMock(COUNTDOWN_TIME);

  beforeEach(() => {
    jest.clearAllMocks();

    CoreTimerMock.mockClear();

    // coreTimerMock?.clearAllMocks;

    coreTimerMock = CoreTimerMock(COUNTDOWN_TIME);
    // coreTimerMock = jest.fn<Timer<TimerEvents>, any>().mockImplementation((timeLeft: number) => ({
    //   start: jest.fn(),
    //   pause: jest.fn(),
    //   clear: jest.fn(),
    //   subscribe: jest.fn(),
    //   timeLeft,
    // }))(COUNTDOWN_TIME);
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
    const listener = jest.fn();

    expect(coreTimerMock.subscribe).not.toHaveBeenCalled();
    observableTimer.subscribe('start', listener);

    expect(coreTimerMock.subscribe).toHaveBeenCalledTimes(1);
    expect(coreTimerMock.subscribe).toBeCalledWith('start', listener);
  });

  it('should subscribe to "pause" events', () => {
    const listener = jest.fn();

    expect(coreTimerMock.subscribe).not.toHaveBeenCalled();
    observableTimer.subscribe('pause', listener);

    expect(coreTimerMock.subscribe).toHaveBeenCalledTimes(1);
    expect(coreTimerMock.subscribe).toBeCalledWith('pause', listener);
  });

  it('should subscribe to "tick" events', () => {
    const listener = jest.fn();

    expect(coreTimerMock.subscribe).not.toHaveBeenCalled();
    observableTimer.subscribe('tick', listener);

    expect(coreTimerMock.subscribe).toHaveBeenCalledTimes(1);
    expect(coreTimerMock.subscribe).toBeCalledWith('tick', listener);
  });

  it('should subscribe to "end" events', () => {
    const listener = jest.fn();

    expect(coreTimerMock.subscribe).not.toHaveBeenCalled();
    observableTimer.subscribe('end', listener);

    expect(coreTimerMock.subscribe).toHaveBeenCalledTimes(1);
    expect(coreTimerMock.subscribe).toBeCalledWith('end', listener);
  });

  it('should clear timer', () => {
    expect(coreTimerMock.clear).not.toHaveBeenCalled();
    observableTimer.clear();
    expect(coreTimerMock.clear).toHaveBeenCalled();
  });
});
