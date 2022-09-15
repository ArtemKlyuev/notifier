import React from 'react';
import { createNotifier, Options, PreparedNotification } from '@notifier/core';
import { act, renderHook } from '@testing-library/react';

import { NotifierProvider } from '../../../Context';

import { useNotifier } from '../useNotifier';

interface WrapperProps {
  children: React.ReactElement;
}

const generateIds = (amount: number): number[] => [...new Array(amount).keys()];

const generateNotificationsWithPayload = (amount: number): PreparedNotification<string>[] =>
  generateIds(amount).map((id) => ({
    id,
    payload: `Notification ${id}`,
  }));

describe('useNotifier', () => {
  const wrapper = ({ children }: WrapperProps) => (
    <NotifierProvider value={createNotifier()}>{children}</NotifierProvider>
  );

  it('should contain options', () => {
    const { result } = renderHook(() => useNotifier<string>(), { wrapper });

    expect(result.current.options).toStrictEqual<Options>({
      autoRemove: true,
      autoRemoveTimeout: 5000,
      size: 5,
    });
  });

  it('should set options', () => {
    const { result } = renderHook(() => useNotifier<string>(), { wrapper });

    expect(result.current.options).toStrictEqual<Options>({
      autoRemove: true,
      autoRemoveTimeout: 5000,
      size: 5,
    });

    act(() => {
      result.current.setOptions({ size: 6 });
    });

    expect(result.current.options).toStrictEqual<Options>({
      autoRemove: true,
      autoRemoveTimeout: 5000,
      size: 6,
    });
  });

  it('should add notification', () => {
    const { result } = renderHook(() => useNotifier<string>(), { wrapper });

    expect(result.current.notifications).toHaveLength(0);

    act(() => {
      result.current.add({ id: 1, payload: 'Notification' });
    });

    expect(result.current.notifications).toHaveLength(1);
  });

  it('should remove notification', () => {
    const { result } = renderHook(() => useNotifier<string>(), { wrapper });

    act(() => {
      result.current.add({ id: 1, payload: 'Notification' });
    });

    expect(result.current.notifications).toHaveLength(1);

    act(() => {
      result.current.remove(1);
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should add notifications to queue', () => {
    const { result } = renderHook(() => useNotifier<string>(), { wrapper });

    const notifications = generateNotificationsWithPayload(result.current.options.size + 1);

    act(() => {
      notifications.forEach((notification) => result.current.add(notification));
    });

    expect(result.current.notifications).toHaveLength(result.current.options.size);
  });

  it('should invoke "add" event listener', () => {
    const listener = jest.fn();

    const { result } = renderHook(() => useNotifier<string>(), { wrapper });

    result.current.subscribe('add', listener);

    expect(listener).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.add({ id: 1, payload: 'Notification' });
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should invoke disposer function from "subscribe" method', () => {
    const listener = jest.fn();

    const { result } = renderHook(() => useNotifier<string>(), { wrapper });

    const disposer = result.current.subscribe('add', listener);

    expect(listener).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.add({ id: 1, payload: 'Notification' });
    });

    expect(listener).toHaveBeenCalledTimes(1);

    disposer();

    act(() => {
      result.current.add({ id: 2, payload: 'Notificatio2' });
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should invoke "remove" event listener', () => {
    const listener = jest.fn();

    const { result } = renderHook(() => useNotifier<string>(), { wrapper });

    result.current.subscribe('remove', listener);

    act(() => {
      result.current.add({ id: 1, payload: 'Notification' });
    });

    expect(listener).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.remove(1);
    });

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
