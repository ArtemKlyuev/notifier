import React from 'react';
import { createNotifier } from '@notifier/core';
import { renderHook } from '@testing-library/react';

import { NotifierProvider } from '../../../Context';
import { useNotifierContext } from '../useContext';

interface WrapperProps {
  children: React.ReactElement;
}

describe('useNotifierContext', () => {
  it('should return notifier instance', () => {
    const wrapper = ({ children }: WrapperProps) => (
      <NotifierProvider value={createNotifier()}>{children}</NotifierProvider>
    );

    const { result } = renderHook(() => useNotifierContext(), { wrapper });

    expect(JSON.stringify(result.current)).toStrictEqual(JSON.stringify(createNotifier()));
  });
});
