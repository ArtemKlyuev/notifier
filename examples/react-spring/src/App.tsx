import { NotifierProvider, useCreateNotifier } from '@notifierjs/react';
import { loremIpsum } from 'lorem-ipsum';
import { nanoid } from 'nanoid';
import { ChangeEvent, FormEvent, useState } from 'react';

import './App.css';

import { NotificationsContainer } from './components';

export const App = () => {
  const notifier = useCreateNotifier<string>({
    size: 5,
    autoRemove: true,
    autoRemoveTimeout: 5000,
  });

  const [autoRemove, setAutoRemove] = useState(notifier.options.autoRemove);
  const [autoRemoveTimeout, setAutoRemoveTimeout] = useState(notifier.options.autoRemoveTimeout);
  const [payload, setPayload] = useState(loremIpsum());

  const handleAutoRemoveChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAutoRemove(e.target.checked);
  };

  const handleTimeoutChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAutoRemoveTimeout(Number(e.target.value));
  };

  const handlePayloadChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPayload(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    notifier.add({ id: nanoid(), payload, options: { autoRemove, autoRemoveTimeout } });
  };

  return (
    <>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          autoRemove&nbsp;
          <input type="checkbox" checked={autoRemove} onChange={handleAutoRemoveChange} />
        </label>
        <label>
          autoRemoveTimeout(ms)&nbsp;
          <input type="number" value={autoRemoveTimeout} onChange={handleTimeoutChange} />
        </label>
        <div>
          Payload{' '}
          <button type="button" onClick={() => setPayload(loremIpsum())}>
            generate payload
          </button>
        </div>
        <textarea rows={4} value={payload} onChange={handlePayloadChange} />
        <button type="submit">
          <strong>Generate notification</strong>
        </button>
      </form>
      <NotifierProvider value={notifier}>
        <NotificationsContainer />
      </NotifierProvider>
    </>
  );
};
