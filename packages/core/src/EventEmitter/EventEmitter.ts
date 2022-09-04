type EventEmitterListener<T = any> = (value: T) => void;

type EventsStorage = Map<string, Set<EventEmitterListener>>;

export class EventEmitter {
  private events: EventsStorage = new Map();
  private onceEvents: EventsStorage = new Map();

  private emitEventListenersByStorage<T>(
    eventsStorage: EventsStorage,
    event: string,
    value: T,
  ): void {
    const listener = eventsStorage.get(event);
    if (!listener) return;

    const evaluateListener = (listener: EventEmitterListener) => listener(value);
    listener.forEach(evaluateListener);
  }

  emit<T>(event: string, value?: T): void {
    this.emitEventListenersByStorage(this.events, event, value);
    this.emitEventListenersByStorage(this.onceEvents, event, value);

    this.onceEvents.delete(event);
  }

  subscribe<T>(event: string, listener: EventEmitterListener<T>): () => void {
    if (this.events.has(event)) {
      const listenersSet = this.events.get(event)!;
      listenersSet.add(listener);
    } else {
      const listenersSet = new Set<EventEmitterListener<T>>();
      listenersSet.add(listener);

      this.events.set(event, listenersSet);
    }

    return () => this.unsubscribe(event, listener);
  }

  subscribeOnce<T>(event: string, listener: EventEmitterListener<T>): void {
    if (this.onceEvents.has(event)) {
      const listenersSet = this.onceEvents.get(event)!;
      listenersSet.add(listener);
      return;
    }

    const listenersSet = new Set<EventEmitterListener<T>>();
    listenersSet.add(listener);

    this.onceEvents.set(event, listenersSet);
  }

  unsubscribe<T>(event: string, listener: EventEmitterListener<T>): void {
    if (!this.events.has(event)) {
      return;
    }

    const listenersSet = this.events.get(event)!;
    listenersSet.delete(listener);
  }

  hasEvent(event: string): boolean {
    return this.events.has(event);
  }

  hasOnceEvent(event: string): boolean {
    return this.onceEvents.has(event);
  }

  clear(): void {
    this.events.clear();
    this.onceEvents.clear();
  }
}
