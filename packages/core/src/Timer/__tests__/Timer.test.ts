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

  it('should subscribe to "start" events', () => {
    const listener = jest.fn();

    timer.subscribe('start', listener);

    expect(eventEmitterMock.subscribe).toHaveBeenCalledTimes(1);
    expect(eventEmitterMock.subscribe).toBeCalledWith('start', listener);
  });

  it('should subscribe to "pause" events', () => {
    const listener = jest.fn();

    timer.subscribe('pause', listener);

    expect(eventEmitterMock.subscribe).toHaveBeenCalledTimes(1);
    expect(eventEmitterMock.subscribe).toBeCalledWith('pause', listener);
  });

  it('should subscribe to "tick" events', () => {
    const listener = jest.fn();

    timer.subscribe('tick', listener);

    expect(eventEmitterMock.subscribe).toHaveBeenCalledTimes(1);
    expect(eventEmitterMock.subscribe).toBeCalledWith('tick', listener);
  });

  it('should subscribe to "end" events', () => {
    const listener = jest.fn();

    timer.subscribe('end', listener);

    expect(eventEmitterMock.subscribe).toHaveBeenCalledTimes(1);
    expect(eventEmitterMock.subscribe).toBeCalledWith('end', listener);
  });

  it('should emit "start" event', () => {
    timer.subscribe('start', () => {});

    timer.start();

    expect(eventEmitterMock.emit).toBeCalledWith('start');
  });

  it('should emit "start" event listener', () => {
    const listener = jest.fn();
    eventEmitterMock.emit.mockImplementationOnce((event) => {
      if (event === 'start') {
        listener();
      }
    });

    timer.subscribe('start', listener);

    expect(listener).toBeCalledTimes(0);

    timer.start();

    expect(listener).toBeCalledTimes(1);
  });

  it('should emit "pause" event', () => {
    timer.subscribe('pause', () => {});
    timer.start();

    timer.pause();

    expect(eventEmitterMock.emit).toBeCalledWith('pause');
  });

  it('should emit "pause" event listener', () => {
    const listener = jest.fn();
    eventEmitterMock.emit.mockImplementation((event) => {
      if (event === 'pause') {
        listener();
      }
    });

    timer.subscribe('pause', listener);
    timer.start();

    expect(listener).toBeCalledTimes(0);

    timer.pause();

    expect(listener).toBeCalledTimes(1);
  });

  it('should emit "tick" event', () => {
    timer.subscribe('tick', () => {});
    timer.start();

    jest.advanceTimersByTime(100);

    expect(eventEmitterMock.emit).toBeCalledWith('tick');
  });

  it('should emit "tick" event listener', () => {
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

    expect(listener.mock.calls.length).toBeGreaterThan(2);
  });

  it('should emit "end" event', () => {
    timer.subscribe('end', () => {});
    timer.start();

    jest.runAllTimers();

    expect(eventEmitterMock.emit).toBeCalledWith('end');
  });

  it('should emit "end" event listener', () => {
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

    expect(listener).toBeCalledTimes(1);
  });

  it('should clear timer', () => {
    timer.start();

    jest.advanceTimersByTime(100);

    timer.clear();

    const time1 = timer.timeLeft;

    jest.advanceTimersByTime(100);

    const time2 = timer.timeLeft;

    expect(time1).toBe(time2);
  });
});
