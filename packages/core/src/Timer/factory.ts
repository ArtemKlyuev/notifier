import { EventEmitter } from '../EventEmitter';
import { Timekeeper, TimerEvents } from './Timer';

type EventEmitterConstructor = new () => EventEmitter<TimerEvents>;

export const createTimer = (EventBus: EventEmitterConstructor) => (timeout: number) =>
  new Timekeeper(new EventBus(), timeout);
