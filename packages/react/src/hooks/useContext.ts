import { useContext } from 'react';
import { Notifier } from '@notifier/core';

import { NotifierContext } from '../Context';

export const useNotifierContext = <Payload>(): Notifier<Payload> => useContext(NotifierContext);
