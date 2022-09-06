type EventHandler<T = any> = (value: T) => void;

type EventsStorage = Map<string, Set<EventHandler>>;

type Disposer = () => void;

export interface EventEmitter<Events extends string> {
  emit: <T>(event: Events, value?: T) => void;
  subscribe: <T>(event: Events, listener: EventHandler<T>) => () => void;
  unsubscribe: <T>(event: Events, listener: EventHandler<T>) => void;
  hasEvent: (event: Events) => boolean;
  clear: () => void;
}

export class EventBus<Events extends string> implements EventEmitter<Events> {
  readonly #events: EventsStorage = new Map();

  emit<T>(event: Events, value?: T): void {
    const listener = this.#events.get(event);

    if (!listener) {
      return;
    }

    const evaluateListener = (listener: EventHandler) => listener(value);
    listener.forEach(evaluateListener);
  }

  subscribe<T>(event: Events, listener: EventHandler<T>): Disposer {
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

  clear(): void {
    this.#events.clear();
  }
}
