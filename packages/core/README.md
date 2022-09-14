# @notifier/core

Zero dependencies platform and framework agnostic engine that helps you build your own
notifications system.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Creation](#creation)
  - [Subscription](#subscription)
  - [Add notification](#add-notification)
  - [Remove notification](#remove-notification)
  - [Queue](#queue)
- [Options](#options)
  - [autoRemove](#autoremove)
  - [autoRemoveTimeout](#autoremovetimeout)
  - [size](#size)
- [API](#api)
- [Maintaining](#maintaining)
  - [Scripts](#scripts)

## Installation

Using npm:

```sh
npm install @notifier/core
```

Using yarn:

```sh
yarn add @notifier/core
```

## Usage

### Creation

Library exports a single `createNotifier` factory function which return to you instance of
[`Notifier`](/packages/core/src/Notifier/types.ts#L34) interface.

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier();
```

Optionally you can pass some options to it(you can view list of all available options [here](#options)):

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier({ autoRemoveTimeout: 7000 });
```

### Subscription

Then you should subscribe to the two main `notifier` events: `add` and `remove`

```ts
const addListener = () => {
  // some `add` logic here
};

const removeListener = () => {
  // some `remove` logic here
};

notifier.subscribe('add', addListener);
notifier.subscribe('remove', removeListener);
```

This listeners will called whenever `add` or `remove` event happened.

If you want to cancel subscription [`subscribe`](#subscribe) method return `disposer` function.

```ts
const addListener = () => {
  // some `add` logic here
};

const dispose = notifier.subscribe('add', addListener);

// when you don't need `add` event listener anymore

dispose();
```

### Add notification

To add notification you simply call [`add`](#add) method and pass notification config:

```ts
notifier.add({ id: nanoid(), payload: { titile: 'Notification', body: 'Hello world!' } });
```

This will trigger `add` event and all its event listeners will be executed.

When you add notification it will appear on the [`notifications`](#notifications) property
with the folowing properties:

- `id` - id that you passed to notification in [`add`](#add) method
- `payload` - payload that you passed to notification in [`add`](#add) method
- `options` - options that are specific to this particular notification
- `info` - additional data about your notification, contains a countdown timer for removing your notification if the following options were passed to the factory function or the notification option in the [`add`](#add) method: `autoRemove: true` and `autoRemoveTimeout` with any number.

### Remove notification

Usually, notifications have the `autoRemove` option set to `true` as well as `autoRemoveTimeout`,
but if you wanna manually remove some notification use [`remove`](#remove) method and
pass notification id to it:

```ts
const notification = { id: nanoid(), payload: { titile: 'Notification', body: 'Hello world!' } };

notifier.add(notification);

// if you wanna to manually remove this notification

notifier.remove(notification.id);
```

Remove notification(automatically or manually) will trigger `remove` event.

### Queue

If the number of added notifications exceeds the number that was specified in the option
`size` when creating the instance, then they will be added to the queue. You can manage
size of the displayed notifications by passed `size` options to factory function or
[`setOptions`](#setoptions) method.

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier({ size: 3 });

notifier.add(notification1);
notifier.notifications.length; // 1

notifier.add(notification2);
notifier.notifications.length; // 2

notifier.add(notification3);
notifier.notifications.length; // 3

notifier.add(notification4);
// `notification4` will be added to queue
notifier.notifications.length; // 3
```

Or by calling [`setOptions`](#setoptions) method on the
[`Notifier`](/packages/core/src/Notifier/types.ts#L34) instance

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier();

notifier.setOptions({ size: 3 });

notifier.add(notification1);
notifier.notifications.length; // 1

notifier.add(notification2);
notifier.notifications.length; // 2

notifier.add(notification3);
notifier.notifications.length; // 3

notifier.add(notification4);
// `notification4` will be added to queue
notifier.notifications.length; // 3
```

## Options

`createNotifier` factory function can take the following options:

### autoRemove

Determines whether the added notification should be removed automatically.

| Type      | Required | Default |
| --------- | -------- | ------- |
| `boolean` | no       | `true`  |

### autoRemoveTimeout

Determines after what time(in milliseconds) the notification should be removed automatically.

| Type     | Required | Default |
| -------- | -------- | ------- |
| `number` | no       | `5000`  |

### size

Determines how many notifications can be displayed.

| Type     | Required | Default |
| -------- | -------- | ------- |
| `number` | no       | `5`     |

## API

### notifications

> type: [`LaunchedNotification<Payload>[]`](/packages/core/src/Notifier/types.ts#L12)

Contains displayed notifications.

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier<string>();

notifier.add({ id: 1, payload: 'Notification 1' });
notifier.add({ id: 2, payload: 'Notification 2' });

console.log(notifier.notifications); // [LaunchedNotification<string>, LaunchedNotification<string>]
```

### options

> type: [`Options`](/packages/core/src/Notifier/types.ts#L30)

Contains setted options. Read more in [`options`](#options) section.

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier<string>();

console.log(notifier.options); // { autoRemove: true, autoRemoveTimeout: 5000, size: 5 }
```

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier<string>({ autoRemoveTimeout: 7000 });

console.log(notifier.options); // { autoRemove: true, autoRemoveTimeout: 7000, size: 5 }
```

### setOptions

> type: [`(options: Partial<Options>) => void`](/packages/core/src/Notifier/types.ts#L54)

Set options for the current instance.

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier();

notifier.setOptions({ size: 3 });

notifier.add(notification1);
notifier.notifications.length; // 1

notifier.add(notification2);
notifier.notifications.length; // 2

notifier.add(notification3);
notifier.notifications.length; // 3

notifier.add(notification4);
// `notification4` will be added to queue
notifier.notifications.length; // 3
```

### add

> type: [`(notification: PreparedNotification<Payload>) => void`](/packages/core/src/Notifier/types.ts#L58)

Add notification.

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier<string>();

notifier.notifications.length; // 0

notifier.add({ id: 1, payload: 'Notification 1' });

notifier.notifications.length; // 1
```

### remove

> type: [`(id: string | number) => void`](/packages/core/src/Notifier/types.ts#L62)

Remove notification.

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier<string>();

notifier.notifications.length; // 0

notifier.add({ id: 1, payload: 'Notification 1' });

notifier.notifications.length; // 1

notifier.remove(1);

notifier.notifications.length; // 0
```

### subscribe

> type: [`(event: NotificationEvent, handler: Handler) => Disposer`](/packages/core/src/Notifier/types.ts#L66)

Subscribe to notifier events. Return disposer function to unsubscribe from event.

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier<string>();

notifier.subscribe('add', () => {
  console.log('add event triggered!');
});

notifier.subscribe('remove', () => {
  console.log('remove event triggered!');
});

notifier.add({ id: 1, payload: 'Notification 1' });

// 'add event triggered!'

notifier.remove(1);

// 'remove event triggered!'
```

```ts
import { createNotifier } from '@notifier/core';

const notifier = createNotifier<string>();

const unsubscribe = notifier.subscribe('add', () => {
  console.log('add event triggered!');
});

notifier.add({ id: 1, payload: 'Notification 1' });

// 'add event triggered!'

unsubscribe();

notifier.add({ id: 2, payload: 'Notification 2' });

// nothing will be displayed in console
```

## Maintaining

### Scripts

List of available scripts to run:

- `build` — build library
- `typecheck` — run typescript to check types
- `test` — run all tests
- `test:watch` — run all tests in `watch` mode
- `test:coverage` — run all tests with code coverage output
