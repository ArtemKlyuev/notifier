import { createNotifier, Options } from '@notifier/core';
import { renderHook } from '@testing-library/react';

import { useCreateNotifier } from '../useCreateNotifier';

describe('useCreateNotifier', () => {
  it('should create notifier instance', () => {
    const { result } = renderHook(() => useCreateNotifier());

    expect(JSON.stringify(result.current)).toStrictEqual(JSON.stringify(createNotifier()));
  });

  it('should create notifier instance with options', () => {
    const options: Partial<Options> = { size: 7, autoRemoveTimeout: 10000 };

    const { result } = renderHook(() => useCreateNotifier(options));

    expect(result.current.options).toStrictEqual(createNotifier(options).options);
  });
});
