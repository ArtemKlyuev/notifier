# @notifierjs/react

[![npm (scoped)](https://img.shields.io/npm/v/@notifierjs/react?style=for-the-badge)](https://www.npmjs.com/package/@notifierjs/react)
[![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@notifierjs/react?style=for-the-badge)](https://bundlephobia.com/package/@notifierjs/react)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=for-the-badge)](http://commitizen.github.io/cz-cli/)

[`@notifierjs/core`](../core) binding for [`react`](https://github.com/facebook/react)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [State managers](#state-managers)
- [Hooks](#hooks)
  - [useCreateNotifier](#usecreatenotifier)
  - [useNotifierContext](#usenotifiercontext)
  - [useNotifier](#usenotifier)
  - [useNotifierTimer](#usenotifiertimer)
- [Components](#components)
  - [NotifierTimer](#notifiertimer)
  - [withNotifierTimer](#withnotifiertimer)
- [Maintaining](#maintaining)
  - [Scripts](#scripts)

## Installation

`@notifierjs/react` required [`@notifierjs/core`](../core) as a peer dependency, make sure to
install it.

Using npm:

```sh
npm install @notifierjs/core @notifierjs/react
```

Using yarn:

```sh
yarn add @notifierjs/core @notifierjs/react
```

## Usage

First of all we need to create a [`Notifier`](../core/src/Notifier/types.ts#L42) instance. For that use [`useCreateNotifier`](#usecreatenotifier) hook.

```ts
import { useCreateNotifier } from '@notifierjs/react';

const notifier = useCreateNotifier();
```

Next you should wrap your app(or part of it) with [`NotifierProvider`](#notifierprovider)
and pass `Notifier` instance to it.

```tsx
import { NotifierProvider, useCreateNotifier } from '@notifierjs/react';

import { App } from './App';

export const App = () => {
  const notifier = useCreateNotifier<string>();

  return (
    <NotifierProvider value={notifier}>
      <App />
    </NotifierProvider>
  );
};
```

Then create your notifications render container, where your notifications will be
displayed, you can get notifier instance passed to provider by using
[`useNotifier`](#usenotifier) hook. For handling timer here we use [`NotifierTimer`](#notifiertimer) component:

```tsx
import { useNotifier, NotifierTimer } from '@notifierjs/react';

import { Notification } from './Notification';

export const NotificationsContainer = () => {
  const notifier = useNotifier<string>();

  return (
    <>
      {notifier.notifications.map((notification) => (
        <NotifierTimer notification={notification}>
          {(time) => (
            <Notification
              onClose={() => notifier.remove(notification.id)}
              onHover={() => notification.info.timer?.pause()}
              onBlur={() => notification.info.timer?.start()}
              initialTime={notification.options.autoRemoveTimeout}
              time={time}
            >
              {notification.payload}
            </Notification>
          )}
        </NotifierTimer>
      ))}
    </>
  );
};
```

Now you only need to add notification and you're done!

```ts
notifier.add({ id: 1, payload: 'Lorem ipsum' });
```

See complete working example [here](../../examples/react-spring)

## Examples

Check [live demo](https://codesandbox.io/s/notifierjs-react-react-spring-example-q6o1u3?file=/src/App.tsx)

Check out [examples](../../examples) folder for more complete examples!

## State managers

Check [this](../../examples/react-mobx) example to see how to connect [`@notifierjs/core`](../core) with [`mobx`](https://github.com/mobxjs/mobx) state manager.

## Hooks

### useCreateNotifier

Create memoized instance of [`Notifier`](../core/src/Notifier/types.ts#L42) interface.

Can receive optional object with [`options`](../core/src/Notifier/types.ts#L30) relative to [`Notifier`](../core/src/Notifier/types.ts#L42)

```tsx
import { useCreateNotifier } from '@notifierjs/react';

export const App = () => {
  const notifier = useCreateNotifier();

  return (
    // ...
  );
};
```

### useNotifierContext

Returns current context value.

```tsx
import { useNotifierContext } from '@notifierjs/react';

export const App = () => {
  const notifier = useNotifierContext();

  return (
    // ...
  );
};
```

### useNotifier

Returns binded to react [`Notifier`](../core/src/Notifier/types.ts#L42) instance.

```tsx
import { useNotifier, NotifierTimer } from '@notifierjs/react';

import { Notification } from './Notification';

export const NotificationsContainer = () => {
  const notifier = useNotifier();

  return (
    <>
      {notifier.notifications.map((notification) => (
        <NotifierTimer notification={notification}>
          {(time) => (
            <Notification
              onClose={() => notifier.remove(notification.id)}
              onHover={() => notification.info.timer?.pause()}
              onBlur={() => notification.info.timer?.start()}
              initialTime={notification.options.autoRemoveTimeout}
              time={time}
            >
              {notification.payload}
            </Notification>
          )}
        </NotifierTimer>
      ))}
    </>
  );
};
```

### useNotifierTimer

Receiving notification with a timer as input, returns its binded to react value.

```tsx
import { LaunchedNotification } from '@notifierjs/core';
import { useNotifierTimer } from '@notifierjs/react';

interface Props<Payload> {
  children: (time?: number) => React.ReactElement;
  notification: LaunchedNotification<Payload>;
}

export const NotifierTimer = <Payload,>({
  children,
  notification,
}: Props<Payload>): React.ReactElement => {
  const time = useNotifierTimer(notification);

  return (
    // ...
  )
};
```

## Components

### NotifierTimer

Component that receive notification and return render prop with timer that you can use to
create notification progress bar.

**Props:**

| Name           | Type                                                                   | Required | Default |
| -------------- | ---------------------------------------------------------------------- | -------- | ------- |
| `notification` | [`LaunchedNotification<Payload>[]`](,,/core/src/Notifier/types.ts#L12) | yes      | —       |

```tsx
import { useNotifier, NotifierTimer } from '@notifierjs/react';

import { Notification } from './Notification';

export const NotificationsContainer = () => {
  const notifier = useNotifier<string>();

  return (
    <>
      {notifier.notifications.map((notification) => (
        <NotifierTimer notification={notification}>
          {(time) => (
            <Notification
              onClose={() => notifier.remove(notification.id)}
              onHover={() => notification.info.timer?.pause()}
              onBlur={() => notification.info.timer?.start()}
              initialTime={notification.options.autoRemoveTimeout}
              time={time}
            >
              {notification.payload}
            </Notification>
          )}
        </NotifierTimer>
      ))}
    </>
  );
};
```

### withNotifierTimer

Same as [`NotifierTimer`](#notifiertimer) but in HOC format. To use it your component
should receive `time` prop with type `number | undefined`.

**Props:**

| Name           | Type                                                                   | Required | Default |
| -------------- | ---------------------------------------------------------------------- | -------- | ------- |
| `notification` | [`LaunchedNotification<Payload>[]`](,,/core/src/Notifier/types.ts#L12) | yes      | —       |

And other props that your wrapped component receive.

```tsx
import { useNotifier, withNotifierTimer } from '@notifierjs/react';

import { Notification } from './Notification';

const TimerNotification = withNotifierTimer(Notification);

export const NotificationsContainer = () => {
  const notifier = useNotifier<string>();

  return (
    <>
      {notifier.notifications.map((notification) => (
        <TimerNotification
          notification={notification}
          onClose={() => notifier.remove(notification.id)}
          onHover={() => notification.info.timer?.pause()}
          onBlur={() => notification.info.timer?.start()}
          initialTime={notification.options.autoRemoveTimeout}
        >
          {notification.payload}
        </TimerNotification>
      ))}
    </>
  );
};
```

## Maintaining

### Scripts

List of available scripts to run:

- `build` — build library
- `typecheck` — run typescript to check types
- `test` — run all tests
- `test:watch` — run all tests in `watch` mode
- `test:coverage` — run all tests with code coverage output
