import { eventEmitterMock } from '../../EventEmitter/__mocks__';

import { Timer, TimerEvents, Timekeeper } from '../Timer';

const COUNTDOWN_TIME = 300;

describe('Timer', () => {
  jest.useFakeTimers();

  let timer: Timer<TimerEvents>;

  beforeEach(() => {
    jest.clearAllMocks();

    timer = new Timekeeper(eventEmitterMock, COUNTDOWN_TIME);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should return initial countdown time', () => {
    expect(timer.timeLeft).toBe(COUNTDOWN_TIME);
  });

  it('should start timer', () => {
    expect(timer.timeLeft).toBe(COUNTDOWN_TIME);

    timer.start();
    jest.advanceTimersByTime(100);

    expect(timer.timeLeft).toBeLessThan(COUNTDOWN_TIME);
  });

  it('should pause timer', () => {
    expect(timer.timeLeft).toBe(COUNTDOWN_TIME);

    timer.start();
    jest.advanceTimersByTime(100);
    timer.pause();

    const timeAfterPause = timer.timeLeft;

    jest.advanceTimersByTime(100);

    expect(timer.timeLeft).toBe(timeAfterPause);
  });

  it('should subscribe to timer events', () => {
    const listener = jest.fn();

    timer.subscribe('start', listener);

    expect(eventEmitterMock.subscribe).toHaveBeenCalledTimes(1);
    expect(eventEmitterMock.subscribe).toBeCalledWith('start', listener);

    timer.subscribe('pause', listener);

    expect(eventEmitterMock.subscribe).toHaveBeenCalledTimes(2);
    expect(eventEmitterMock.subscribe).toBeCalledWith('pause', listener);

    timer.subscribe('tick', listener);

    expect(eventEmitterMock.subscribe).toHaveBeenCalledTimes(3);
    expect(eventEmitterMock.subscribe).toBeCalledWith('start', listener);

    timer.subscribe('end', listener);

    expect(eventEmitterMock.subscribe).toHaveBeenCalledTimes(4);
    expect(eventEmitterMock.subscribe).toBeCalledWith('start', listener);
  });

  it('should emit `start` event', () => {
    const listener = jest.fn();
    eventEmitterMock.emit.mockImplementationOnce((event) => {
      if (event === 'start') {
        listener();
      }
    });

    timer.subscribe('start', listener);

    expect(listener).toBeCalledTimes(0);

    timer.start();

    expect(eventEmitterMock.emit).toBeCalledWith('start');
    expect(listener).toBeCalledTimes(1);
  });

  it('should emit `pause` event', () => {
    const listener = jest.fn();
    eventEmitterMock.emit.mockImplementation((event) => {
      if (event === 'pause') {
        listener();
      }
    });

    timer.subscribe('pause', listener);
    timer.start();

    expect(eventEmitterMock.emit).toBeCalledWith('start');
    expect(listener).toBeCalledTimes(0);

    timer.pause();

    expect(eventEmitterMock.emit).toBeCalledWith('pause');
    expect(listener).toBeCalledTimes(1);
  });

  it('should emit `tick` event', async () => {
    const listener = jest.fn();
    eventEmitterMock.emit.mockImplementation((event) => {
      if (event === 'tick') {
        listener();
      }
    });

    timer.subscribe('tick', listener);
    timer.start();

    expect(listener).toBeCalledTimes(0);

    jest.advanceTimersByTime(100);

    expect(eventEmitterMock.emit).toBeCalledWith('tick');
    expect(listener.mock.calls.length).toBeGreaterThan(2);
  });

  it('should emit `end` event', () => {
    const listener = jest.fn();
    eventEmitterMock.emit.mockImplementation((event) => {
      if (event === 'end') {
        listener();
      }
    });

    timer.subscribe('end', listener);
    timer.start();

    expect(listener).toBeCalledTimes(0);

    jest.runAllTimers();

    expect(eventEmitterMock.emit).toBeCalledWith('end');
    expect(listener).toBeCalledTimes(1);
  });
});
