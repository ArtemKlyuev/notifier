import { EventEmitter } from '../EventEmitter';

export type TimerEvents = 'start' | 'tick' | 'pause' | 'end';
type Handler = () => void;
type Disposer = () => void;

export interface Timer<Events extends string> {
  readonly timeLeft: number;
  start: () => void;
  pause: () => void;
  clear: () => void;
  subscribe: (event: Events, handler: Handler) => Disposer;
}

export class Timekeeper implements Timer<TimerEvents> {
  #interval!: NodeJS.Timer;
  readonly #countInterval = 10;
  #countdownTime: number;
  readonly #eventEmitter: EventEmitter<TimerEvents>;

  /**
   * @param eventEmitter event emitter
   * @param countdownTime countdown time in milliseconds
   */
  constructor(eventEmitter: EventEmitter<TimerEvents>, countdownTime: number) {
    this.#eventEmitter = eventEmitter;
    this.#countdownTime = countdownTime;
  }

  #clearInterval(): void {
    clearInterval(this.#interval);
  }

  #tick = (): void => {
    if (this.#countdownTime > 0) {
      this.#countdownTime -= this.#countInterval;
      this.#eventEmitter.emit('tick');
      return;
    }

    this.#eventEmitter.emit('end');

    this.#clearInterval();
  };

  start(): void {
    this.#eventEmitter.emit('start');

    this.#interval = setInterval(this.#tick, this.#countInterval);
  }

  pause(): void {
    this.#eventEmitter.emit('pause');

    this.#clearInterval();
  }

  clear(): void {
    this.#clearInterval();
  }

  subscribe(event: TimerEvents, handler: Handler): Disposer {
    const dispose = this.#eventEmitter.subscribe(event, handler);

    return dispose;
  }

  get timeLeft(): number {
    return this.#countdownTime;
  }
}
