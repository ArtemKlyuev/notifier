import { eventEmitterMock } from '../../EventEmitter/__mocks__';

import { Timekeeper } from '../../Timer';

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

    notifier = new Informer(eventEmitterMock, Timekeeper);
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should set default options', () => {
    notifier = new Informer(eventEmitterMock, Timekeeper);

    expect(notifier.options).toStrictEqual(DEFAULT_OPTIONS);
  });

  it('should merge constructor options with default options', () => {
    const constructorOptions = {
      autoRemove: false,
      persist: true,
      size: 7,
    };

    notifier = new Informer(eventEmitterMock, Timekeeper, constructorOptions);

    expect(notifier.options).toStrictEqual({ ...DEFAULT_OPTIONS, ...constructorOptions });
  });

  it('should throw when set "autoRemove" and "persist" to "true"', () => {
    const constructorOptions = {
      autoRemove: true,
      persist: true,
      size: 7,
    };

    expect(() => new Informer(eventEmitterMock, Timekeeper, constructorOptions)).toThrowError();
  });

  it('should throw when set "autoRemove" and "persist" to "false"', () => {
    const constructorOptions = {
      autoRemove: false,
      persist: false,
      size: 7,
    };

    expect(() => new Informer(eventEmitterMock, Timekeeper, constructorOptions)).toThrowError();
  });

  it('should set options', () => {
    const newOptions = {
      autoRemove: false,
      persist: true,
      size: 7,
    };

    expect(notifier.options).toStrictEqual(DEFAULT_OPTIONS);

    notifier.setOptions(newOptions);

    expect(notifier.options).toStrictEqual({ ...DEFAULT_OPTIONS, ...newOptions });
  });

  it('should throw when set invalid options', () => {
    const newOptions = {
      autoRemove: false,
      persist: false,
      size: 7,
    };

    expect(() => notifier.setOptions(newOptions)).toThrow();
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
        persist: false,
      },
      info: { timer: new Timekeeper(eventEmitterMock, 5000) },
    });
  });

  it('should emit "add" event when push notification', () => {
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

  it('should validate added notification options', () => {
    const notification = {
      id: 1,
      payload: 'Notification',
      options: { autoRemove: true, persist: true },
    };

    expect(() => notifier.add(notification)).toThrow();
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
    type Listener = () => void;

    const removeListener = jest.fn();

    const endEventListeners: Listener[] = [];
    const removeEventListeners: Listener[] = [];

    eventEmitterMock.subscribe.mockImplementation((event, listener) => {
      if (event === 'end') {
        endEventListeners.push(listener);
      }

      if (event === 'remove') {
        removeEventListeners.push(listener);
      }

      return () => {};
    });

    eventEmitterMock.emit.mockImplementation((event) => {
      if (event === 'end') {
        endEventListeners.forEach((listener) => listener());
      }

      if (event === 'remove') {
        removeEventListeners.forEach((listener) => listener());
      }
    });

    const notification = {
      id: 1,
      payload: 'Notification',
    };

    notifier.subscribe('remove', removeListener);
    notifier.add(notification);

    expect(removeListener).not.toHaveBeenCalled();

    jest.runAllTimers();

    expect(removeListener).toHaveBeenCalledTimes(1);
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
        persist: false,
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
      options: { ...defaultOptions, autoRemove: false, persist: true },
      info: { timer: null },
    });
  });

  it('should set notification "autoRemove" option to "true"', () => {
    const constructorOptions = {
      autoRemove: false,
      persist: true,
      size: 5,
    };

    notifier = new Informer(eventEmitterMock, Timekeeper, constructorOptions);

    const { size, ...defaultOptions } = DEFAULT_OPTIONS;
    const notification = { id: 1, payload: 'Notification', options: { autoRemove: true } };

    notifier.add(notification);

    const [addedNotification] = notifier.notifications;

    expect(addedNotification).toStrictEqual({
      ...notification,
      options: { ...defaultOptions, autoRemove: true, persist: false },
      info: { timer: new Timekeeper(eventEmitterMock, 5000) },
    });
  });

  it('should set notification "persist" option to "true"', () => {
    const { size, ...defaultOptions } = DEFAULT_OPTIONS;
    const notification = { id: 1, payload: 'Notification', options: { persist: true } };

    notifier.add(notification);

    const [addedNotification] = notifier.notifications;

    expect(addedNotification).toStrictEqual({
      ...notification,
      options: { ...defaultOptions, autoRemove: false, persist: true },
      info: { timer: null },
    });
  });

  it('should set notification "persist" option to "false"', () => {
    const constructorOptions = {
      autoRemove: false,
      persist: true,
      size: 5,
    };

    notifier = new Informer(eventEmitterMock, Timekeeper, constructorOptions);

    const { size, ...defaultOptions } = DEFAULT_OPTIONS;
    const notification = { id: 1, payload: 'Notification', options: { persist: false } };

    notifier.add(notification);

    const [addedNotification] = notifier.notifications;

    expect(addedNotification).toStrictEqual({
      ...notification,
      options: { ...defaultOptions, autoRemove: true, persist: false },
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
});
