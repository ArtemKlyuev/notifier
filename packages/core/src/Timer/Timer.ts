import { EventEmitter } from '../EventEmitter';

type TimerEvents = 'start' | 'tick' | 'pause' | 'end';
type EventListener = () => void;
type Disposep = () => void;

export class Timer {
  #interval: NodeJS.Timer | null = null;
  #countInterval = 10;
  #countdownTime: number;
  #eventEmitter = new EventEmitter();

  /**
   * @param countdownTime countdown time in milliseconds
   */
  constructor(countdownTime: number) {
    this.#countdownTime = countdownTime;
  }

  #clearInterval(): void {
    clearInterval(this.#interval!);
    this.#interval = null;
  }

  #tick(): void {
    if (this.#countdownTime > 0) {
      this.#countdownTime -= this.#countInterval;
      this.#eventEmitter.emit('tick');
      return;
    }

    this.#eventEmitter.emit('end');

    this.#clearInterval();
  }

  start() {
    this.#eventEmitter.emit('start');

    this.#interval = setInterval(this.#tick, this.#countInterval);
  }

  pause(): void {
    this.#eventEmitter.emit('pause');

    this.#clearInterval();
  }

  subscribe(event: TimerEvents, listener: EventListener): Disposep {
    const dispose = () => this.#eventEmitter.subscribe(event, listener);

    return dispose;
  }

  get timeLeft(): number {
    return this.#countdownTime;
  }
}
