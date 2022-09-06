import { eventEmitterMock } from '../../EventEmitter/__mocks__';

import { Timekeeper } from '../../Timer';
// import { timerMock } from '../../Timer/__mocks__';

import { Informer, DEFAULT_OPTIONS } from '../Notifier';
import { Notifier } from '../types';

// jest.mock('../../Timer/Timer.ts', () => jest.fn());
jest.mock('../../Timer/Timer.ts');
// jest.mock('../../Timer/Timer.ts', function () {
//   return jest.fn();
// });

console.log('Timekeeper', Timekeeper);

// Timekeeper.mockImplementation(function () {
//   return {
//     start: jest.fn(),
//   };
// });
describe('Notifier', () => {
  let notifier: Notifier<any>;

  beforeEach(() => {
    // TODO: mock timer
    notifier = new Informer(
      eventEmitterMock,
      Timekeeper,
      // Timekeeper.mockImplementation(function () {
      //   return {
      //     start: jest.fn(),
      //   };
      // }),
    );
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

  it('should add notification', () => {
    const notification = { id: 1, payload: 'Notification' };

    notifier.add(notification);

    expect(notifier.notifications).toHaveLength(1);
    console.log('notifier.notifications[0]', notifier.notifications[0]);
    console.log('typeof notifier.notifications[0]', typeof notifier.notifications[0]);
    expect(notifier.notifications[0]).toStrictEqual({
      ...notification,
      options: {
        autoRemove: true,
        autoRemoveTimeout: 5000,
        persist: false,
      },
      info: { timer: new Timekeeper(eventEmitterMock) },
      // info: { timer: new Timekeeper(eventEmitterMock, 5000) },
      // info: { timer: new Timekeeper(eventEmitterMock, 300) },
    });
  });
});
