type EventHandler<T = any> = (value: T) => void;

type EventsStorage = Map<string, Set<EventHandler>>;

export interface EventEmitter<Events extends string> {
  emit: <T>(event: Events, value?: T) => void;
  subscribe: <T>(event: Events, listener: EventHandler<T>) => () => void;
  subscribeOnce: <T>(event: Events, listener: EventHandler<T>) => void;
  unsubscribe: <T>(event: Events, listener: EventHandler<T>) => void;
  hasEvent: (event: Events) => boolean;
  hasOnceEvent: (event: Events) => boolean;
  clear: () => void;
}

export class EventBus<Events extends string> implements EventEmitter<Events> {
  readonly #events: EventsStorage = new Map();
  readonly #onceEvents: EventsStorage = new Map();

  #emitEventListenersByStorage<T>(eventsStorage: EventsStorage, event: string, value: T): void {
    const listener = eventsStorage.get(event);

    if (!listener) {
      return;
    }

    const evaluateListener = (listener: EventHandler) => listener(value);
    listener.forEach(evaluateListener);
  }

  emit<T>(event: Events, value?: T): void {
    this.#emitEventListenersByStorage(this.#events, event, value);
    this.#emitEventListenersByStorage(this.#onceEvents, event, value);

    this.#onceEvents.delete(event);
  }

  subscribe<T>(event: Events, listener: EventHandler<T>): () => void {
    if (this.#events.has(event)) {
      const listenersSet = this.#events.get(event)!;
      listenersSet.add(listener);
    } else {
      const listenersSet = new Set<EventHandler<T>>();
      listenersSet.add(listener);

      this.#events.set(event, listenersSet);
    }

    return () => this.unsubscribe(event, listener);
  }

  subscribeOnce<T>(event: Events, listener: EventHandler<T>): void {
    if (this.#onceEvents.has(event)) {
      const listenersSet = this.#onceEvents.get(event)!;
      listenersSet.add(listener);
      return;
    }

    const listenersSet = new Set<EventHandler<T>>();
    listenersSet.add(listener);

    this.#onceEvents.set(event, listenersSet);
  }

  unsubscribe<T>(event: Events, listener: EventHandler<T>): void {
    if (!this.#events.has(event)) {
      return;
    }

    const listenersSet = this.#events.get(event)!;
    listenersSet.delete(listener);
  }

  hasEvent(event: Events): boolean {
    return this.#events.has(event);
  }

  hasOnceEvent(event: Events): boolean {
    return this.#onceEvents.has(event);
  }

  clear(): void {
    this.#events.clear();
    this.#onceEvents.clear();
  }
}
