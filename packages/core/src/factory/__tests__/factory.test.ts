import { Informer, DEFAULT_OPTIONS } from '../../Notifier';

import { createNotifier } from '../factory';

describe('createNotifier', () => {
  it('should create notifier instance', () => {
    const notifier = createNotifier();

    expect(notifier).toBeInstanceOf(Informer);
  });

  it('should create notifier instance with default options', () => {
    const notifier = createNotifier();

    expect(notifier.options).toStrictEqual(DEFAULT_OPTIONS);
  });

  it('should create notifier instance with options', () => {
    const notifier = createNotifier({ autoRemoveTimeout: 7000, size: 10 });

    expect(notifier.options).toStrictEqual({
      ...DEFAULT_OPTIONS,
      autoRemoveTimeout: 7000,
      size: 10,
    });
  });
});
