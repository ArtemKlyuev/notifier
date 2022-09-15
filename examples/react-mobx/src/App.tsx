import { loremIpsum } from 'lorem-ipsum';
import { nanoid } from 'nanoid';
import { useMemo } from 'react';

import './App.css';

import { NotificationsContainer } from './components';
import { NotificationManager } from './services';

export const App = () => {
  const notificationManager = useMemo(() => new NotificationManager(), []);

  const handleAdd = () => notificationManager.add({ id: nanoid(), payload: loremIpsum() });

  return (
    <>
      <button onClick={handleAdd} className="Generate-button">
        Generate notification
      </button>
      <NotificationsContainer notificationManager={notificationManager} />
    </>
  );
};
