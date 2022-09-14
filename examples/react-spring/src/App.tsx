import { NotifierProvider, useCreateNotifier } from '@notifier/react';
import { loremIpsum } from 'lorem-ipsum';
import { nanoid } from 'nanoid';
import './App.css';

import { NotificationsContainer } from './components';

export const App = () => {
  const notifier = useCreateNotifier<string>();

  const handleAdd = () => notifier.add({ id: nanoid(), payload: loremIpsum() });

  return (
    <>
      <button onClick={handleAdd} className="Generate-button">
        Generate notification
      </button>
      <NotifierProvider value={notifier}>
        <NotificationsContainer />
      </NotifierProvider>
    </>
  );
};
