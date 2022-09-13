# @notifier/core

Zero dependencies platform and framework agnostic engine that helps you build your own
notifications system.

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
  - [Queue](#queue)
- [Options](#options)
- [API](#api)
- [Maintaining](#maintaining)
  - [Package manager](#package-manager)
  - [Commits](#commits)
  - [Scripts](#scripts)
  - [pre-commit hook](#pre-commit-hook)

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

To add notification you simply call [`add`](#add) method and pass notification config:

```ts
notifier.add({ id: nanoid(), payload: { titile: 'Notification', body: 'Hello world!' } });
```

This will trigger `add` event and all this event listeners will be executed.

Basicaly, notifications have `autoRemove` options set to `true` as so `autoRemoveTimeout`,
but if you wanna manually remove some notification use [`remove`](#remove) method and
pass notification id to it:

```ts
const notification = { id: nanoid(), payload: { titile: 'Notification', body: 'Hello world!' } };

notifier.add(notification);

// if you wanna to manually remove this notification

notifier.remove(notification.id);
```

When you add notification it will appear on the [`notifications`](#notifications) property
with следующими свойствами:

- `id` - id that you passed to notification in [`add`](#add) method
- `payload` - payload that you passed to notification in [`add`](#add) method
- `options` - опции, которые присущи данному конкретному уведомлению
- `info` - дополнительные данные о вашем уведомлении, содержит таймер обратного отсчёта
  удаления вашего уведомления, если в factory function или опцию уведоления в методе
  [`add`](#add) были переданы следующие опции: `autoRemove: true` и `autoRemoveTimeout` с
  любым числом

### Queue

Notifications that do not fit in size property will be queued and wait for empty slot in
[`notifications`](#notifications) field. You can manage size of the displayed
notifications by passed `size` options to factory function.

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

## API

```

```
