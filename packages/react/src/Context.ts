import { createContext } from 'react';
import { Notifier } from '@notifier/core';

export const NotifierContext = createContext<Notifier<any>>(null as unknown as Notifier<any>);
export const NotifierProvider = NotifierContext.Provider;
