import { useMemo } from 'react';
import { createNotifier, Notifier, Options } from '@notifierjs/core';

export const useCreateNotifier = <Payload>(options?: Partial<Options>): Notifier<Payload> =>
  useMemo(() => createNotifier<Payload>(options), []);
