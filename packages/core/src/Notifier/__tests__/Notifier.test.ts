/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { EventBus } from '../../EventEmitter';
import { eventEmitterMock } from '../../EventEmitter/__mocks__';

import { Timekeeper, createTimer } from '../../Timer';

import { Informer, DEFAULT_OPTIONS } from '../Notifier';
import { Notifier, PreparedNotification } from '../types';

const generateIds = (amount: number): number[] => [...new Array(amount).keys()];

const generateNotificationsWithPayload = (amount: number): PreparedNotification<string>[] =>
  generateIds(amount).map((id) => ({
    id,
    payload: `Notification ${id}`,
  }));

describe('Notifier', () => {
  jest.useFakeTimers();

  let notifier: Notifier<string>;

  beforeEach(() => {
    jest.clearAllMocks();

    notifier = new Informer(eventEmitterMock, createTimer(EventBus));
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should set default options', () => {
    notifier = new Informer(eventEmitterMock, createTimer(EventBus));

    expect(notifier.options).toStrictEqual(DEFAULT_OPTIONS);
  });

  it('should merge constructor options with default options', () => {
    const constructorOptions = {
      autoRemove: false,
      size: 7,
    };

    notifier = new Informer(eventEmitterMock, createTimer(EventBus), constructorOptions);

    expect(notifier.options).toStrictEqual({ ...DEFAULT_OPTIONS, ...constructorOptions });
  });

  it('should set options', () => {
    const newOptions = {
      autoRemove: false,
      size: 7,
    };

    expect(notifier.options).toStrictEqual(DEFAULT_OPTIONS);

    notifier.setOptions(newOptions);

    expect(notifier.options).toStrictEqual({ ...DEFAULT_OPTIONS, ...newOptions });
  });

  it('should add notification', () => {
    const notification = { id: 1, payload: 'Notification' };

    expect(notifier.notifications).toHaveLength(0);

    notifier.add(notification);

    expect(notifier.notifications).toHaveLength(1);
  });

  it('should contain all necessary fields in added notification', () => {
    const notification = { id: 1, payload: 'Notification' };

    notifier.add(notification);

    expect(notifier.notifications[0]).toStrictEqual({
      ...notification,
      options: {
        autoRemove: true,
        autoRemoveTimeout: 5000,
      },
      info: { timer: new Timekeeper(eventEmitterMock, 5000) },
    });
  });

  it('should emit "add" event when push notification happened', () => {
    const notification = { id: 1, payload: 'Notification' };

    expect(eventEmitterMock.emit).not.toHaveBeenCalled();
    notifier.subscribe('add', () => {});
    notifier.add(notification);
    expect(eventEmitterMock.emit).toHaveBeenCalledTimes(1);
    expect(eventEmitterMock.emit).toBeCalledWith('add');
  });

  it('should emit "add" event listener when push notification happened', () => {
    const notification = { id: 1, payload: 'Notification' };
    const addListener = jest.fn();

    eventEmitterMock.emit.mockImplementation((event) => {
      if (event === 'add') {
        addListener();
      }
    });

    notifier.subscribe('add', addListener);
    expect(addListener).not.toHaveBeenCalled();
    notifier.add(notification);
    expect(addListener).toHaveBeenCalledTimes(1);
  });

  it('should dispose event', () => {
    const notification = { id: 1, payload: 'Notification' };
    const addListener = jest.fn();

    let shouldEvaluate = true;

    eventEmitterMock.emit.mockImplementationOnce((event) => {
      if (event === 'add' && shouldEvaluate) {
        addListener();
      }
    });

    eventEmitterMock.subscribe.mockImplementationOnce((event) => {
      if (event === 'add') {
        return () => {
          shouldEvaluate = false;
        };
      }

      return () => {};
    });

    const dispose = notifier.subscribe('add', addListener);

    expect(addListener).not.toHaveBeenCalled();

    dispose();

    notifier.add(notification);

    expect(addListener).not.toHaveBeenCalled();
  });

  it('should queue notifications', () => {
    const { size } = notifier.options;
    const notifications = generateNotificationsWithPayload(size + 1);

    expect(notifier.notifications).toHaveLength(0);

    notifications.forEach((notification) => notifier.add(notification));

    expect(notifier.notifications).toHaveLength(size);
  });

  it('should manually remove notification', () => {
    const notification = {
      id: 1,
      payload: 'Notification',
    };

    expect(notifier.notifications).toHaveLength(0);

    notifier.add(notification);

    expect(notifier.notifications).toHaveLength(1);

    notifier.remove(1);

    expect(notifier.notifications).toHaveLength(0);
  });

  it('should emit "remove" event when manually remove notification', () => {
    const notification = {
      id: 1,
      payload: 'Notification',
    };

    notifier.subscribe('remove', () => {});
    notifier.add(notification);

    expect(eventEmitterMock.emit).not.toHaveBeenCalledWith('remove');

    notifier.remove(1);

    expect(eventEmitterMock.emit).toHaveBeenCalledWith('remove');
  });

  it('should emit "remove" event listener when manually remove notification', () => {
    type Listener = () => void;

    const removeListener = jest.fn();

    const removeEventListeners: Listener[] = [];

    const notification = {
      id: 1,
      payload: 'Notification',
    };

    eventEmitterMock.subscribe.mockImplementation((event, listener) => {
      if (event === 'remove') {
        removeEventListeners.push(listener);
      }

      return () => {};
    });

    eventEmitterMock.emit.mockImplementation((event) => {
      if (event === 'remove') {
        removeEventListeners.forEach((listener) => listener());
      }
    });

    notifier.subscribe('remove', removeListener);
    notifier.add(notification);

    expect(removeListener).not.toHaveBeenCalled();

    notifier.remove(1);

    expect(removeListener).toHaveBeenCalledTimes(1);
  });

  it('should auto remove notification', () => {
    type Listener = () => void;

    const eventListeners: Listener[] = [];

    eventEmitterMock.subscribe.mockImplementation((event, listener) => {
      if (event === 'end') {
        eventListeners.push(listener);
      }

      return () => {};
    });

    eventEmitterMock.emit.mockImplementation((event) => {
      if (event === 'end') {
        eventListeners.forEach((listener) => listener());
      }
    });

    const notification = {
      id: 1,
      payload: 'Notification',
    };

    expect(notifier.notifications).toHaveLength(0);

    notifier.add(notification);

    expect(notifier.notifications).toHaveLength(1);

    jest.runAllTimers();

    expect(notifier.notifications).toHaveLength(0);
  });

  it('should emit "remove" event when auto remove notification', () => {
    const notification = {
      id: 1,
      payload: 'Notification',
    };

    notifier.subscribe('remove', () => {});
    notifier.add(notification);

    expect(eventEmitterMock.emit).not.toHaveBeenCalledWith('remove');

    jest.runAllTimers();

    expect(eventEmitterMock.emit).toHaveBeenCalledWith('remove');
  });

  it('should pick new notification from queue when remove notification', () => {
    const { size } = notifier.options;
    const notifications = generateNotificationsWithPayload(size + 1);

    const [firstNotification] = notifications;
    const lastNotificationInChain = notifications.at(-1)!;

    notifications.forEach((notification) => notifier.add(notification));

    notifier.remove(firstNotification.id);

    const lastNotificationInNotifier = notifier.notifications.at(-1)!;

    expect(lastNotificationInNotifier).toStrictEqual({
      ...lastNotificationInChain,
      options: {
        autoRemove: true,
        autoRemoveTimeout: 5000,
      },
      info: { timer: new Timekeeper(eventEmitterMock, 5000) },
    });
  });

  it('should set notification "autoRemove" option to "false"', () => {
    const { size, ...defaultOptions } = DEFAULT_OPTIONS;
    const notification = { id: 1, payload: 'Notification', options: { autoRemove: false } };

    notifier.add(notification);

    const [addedNotification] = notifier.notifications;

    expect(addedNotification).toStrictEqual({
      ...notification,
      options: { ...defaultOptions, autoRemove: false },
      info: { timer: null },
    });
  });

  it('should set notification "autoRemove" option to "true"', () => {
    const constructorOptions = {
      autoRemove: false,
      size: 5,
    };

    notifier = new Informer(eventEmitterMock, createTimer(EventBus), constructorOptions);

    const { size, ...defaultOptions } = DEFAULT_OPTIONS;
    const notification = { id: 1, payload: 'Notification', options: { autoRemove: true } };

    notifier.add(notification);

    const [addedNotification] = notifier.notifications;

    expect(addedNotification).toStrictEqual({
      ...notification,
      options: { ...defaultOptions, autoRemove: true },
      info: { timer: new Timekeeper(eventEmitterMock, 5000) },
    });
  });

  it('should set notification "autoRemoveTimeout" option', () => {
    const { size, ...defaultOptions } = DEFAULT_OPTIONS;
    const notification = { id: 1, payload: 'Notification', options: { autoRemoveTimeout: 7000 } };

    notifier.add(notification);

    const [addedNotification] = notifier.notifications;

    expect(addedNotification).toStrictEqual({
      ...notification,
      options: { ...defaultOptions, autoRemoveTimeout: 7000 },
      info: { timer: new Timekeeper(eventEmitterMock, 5000) },
    });
  });

  it('should create independent timer for each notification', () => {
    const [first, second] = generateNotificationsWithPayload(2);

    notifier.add(first);

    jest.advanceTimersByTime(100);

    notifier.add(second);

    jest.advanceTimersByTime(100);

    expect(notifier.notifications[0].info.timer?.timeLeft).not.toBe(
      notifier.notifications[1].info.timer?.timeLeft,
    );
  });
});
