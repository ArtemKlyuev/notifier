/* eslint-disable @typescript-eslint/no-empty-function */
import { Notifier } from '@notifierjs/core';

import { ObservableNotifier, Destroyable } from '../ObservableNotifier';

// TODO: test observable timer in notification

jest.mock('mobx');

const createNotifierMock = jest.fn<Notifier<string>, any>(() => ({
  options: { size: 5, autoRemove: false, autoRemoveTimeout: 5000 },
  notifications: [],
  subscribe: jest.fn(),
  add: jest.fn(),
  remove: jest.fn(),
  setOptions: jest.fn(),
}));

describe('ObservableNotifier', () => {
  const notifierMock = createNotifierMock();
  let observableNotifier: Notifier<string> & Destroyable;

  beforeEach(() => {
    jest.clearAllMocks();

    observableNotifier = new ObservableNotifier(notifierMock);
  });

  it('should add notification', () => {
    expect(notifierMock.add).not.toHaveBeenCalled();

    observableNotifier.add({ id: 1, payload: 'Notification' });

    expect(notifierMock.add).toHaveBeenCalledTimes(1);
    expect(notifierMock.add).toHaveBeenCalledWith({ id: 1, payload: 'Notification' });
  });

  it('should remove notification', () => {
    expect(notifierMock.remove).not.toHaveBeenCalled();

    observableNotifier.add({ id: 1, payload: 'Notification' });
    observableNotifier.remove(1);

    expect(notifierMock.remove).toHaveBeenCalledTimes(1);
    expect(notifierMock.remove).toHaveBeenCalledWith(1);
  });

  it('should set options', () => {
    expect(notifierMock.setOptions).not.toHaveBeenCalled();

    observableNotifier.setOptions({ autoRemove: true, autoRemoveTimeout: 3000, size: 7 });

    expect(notifierMock.setOptions).toHaveBeenCalledTimes(1);
    expect(notifierMock.setOptions).toHaveBeenCalledWith({
      autoRemove: true,
      autoRemoveTimeout: 3000,
      size: 7,
    });
  });

  it('should subscribe to event', () => {
    const listener = jest.fn();
    const spy = (notifierMock.subscribe as jest.Mock).mockImplementationOnce(() => () => {});

    const disposer = observableNotifier.subscribe('add', listener);

    expect(spy).toHaveBeenCalledWith('add', listener);
    expect(disposer).toEqual(expect.any(Function));

    spy.mockClear();
  });

  it('should destroy subscriptions', () => {
    const disposer = jest.fn();
    (notifierMock.subscribe as jest.Mock).mockImplementation(() => disposer);

    observableNotifier = new ObservableNotifier(notifierMock);

    expect(disposer).not.toHaveBeenCalled();

    observableNotifier.destroy();

    expect(disposer).toHaveBeenCalledTimes(2);
  });
});
