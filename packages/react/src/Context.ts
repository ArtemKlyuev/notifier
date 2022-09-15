import { createContext } from 'react';
import { Notifier } from '@notifierjs/core';

export const NotifierContext = createContext<Notifier<any>>(null as unknown as Notifier<any>);
export const NotifierProvider = NotifierContext.Provider;
