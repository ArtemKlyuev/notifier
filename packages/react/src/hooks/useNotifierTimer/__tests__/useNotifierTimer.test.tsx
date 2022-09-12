import React from 'react';
import { createNotifier } from '@notifier/core';
import { act, renderHook } from '@testing-library/react';

import { NotifierProvider } from '../../../Context';

import { useNotifier } from '../../useNotifier';

import { useNotifierTimer } from '../useNotifierTimer';

interface WrapperProps {
  children: React.ReactElement;
}

describe('useNotifierTimer', () => {
  jest.useFakeTimers();

  const wrapper = ({ children }: WrapperProps) => (
    <NotifierProvider value={createNotifier()}>{children}</NotifierProvider>
  );

  it('should update timer', () => {
    const { result: useNotifierResult } = renderHook(() => useNotifier<string>(), { wrapper });

    act(() => {
      useNotifierResult.current.add({ id: 1, payload: 'Notification' });
    });

    const { result: useNotifierTimerResult } = renderHook(() =>
      useNotifierTimer(useNotifierResult.current.notifications[0]),
    );

    expect(useNotifierTimerResult.current).toBe(
      useNotifierResult.current.options.autoRemoveTimeout,
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(useNotifierTimerResult.current).toBe(
      useNotifierResult.current.options.autoRemoveTimeout - 500,
    );
  });

  it('should pause timer', () => {
    const { result: useNotifierResult } = renderHook(() => useNotifier<string>(), { wrapper });

    act(() => {
      useNotifierResult.current.add({ id: 1, payload: 'Notification' });
    });

    const { result: useNotifierTimerResult } = renderHook(() =>
      useNotifierTimer(useNotifierResult.current.notifications[0]),
    );

    expect(useNotifierTimerResult.current).toBe(
      useNotifierResult.current.options.autoRemoveTimeout,
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      useNotifierResult.current.notifications[0].info.timer?.pause();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(useNotifierTimerResult.current).toBe(
      useNotifierResult.current.options.autoRemoveTimeout - 500,
    );
  });

  it('should resume timer', () => {
    const { result: useNotifierResult } = renderHook(() => useNotifier<string>(), { wrapper });

    act(() => {
      useNotifierResult.current.add({ id: 1, payload: 'Notification' });
    });

    const { result: useNotifierTimerResult } = renderHook(() =>
      useNotifierTimer(useNotifierResult.current.notifications[0]),
    );

    expect(useNotifierTimerResult.current).toBe(
      useNotifierResult.current.options.autoRemoveTimeout,
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      useNotifierResult.current.notifications[0].info.timer?.pause();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(useNotifierTimerResult.current).toBe(
      useNotifierResult.current.options.autoRemoveTimeout - 500,
    );

    act(() => {
      useNotifierResult.current.notifications[0].info.timer?.start();
    });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(useNotifierTimerResult.current).toBe(
      useNotifierResult.current.options.autoRemoveTimeout - 1000,
    );
  });
});
