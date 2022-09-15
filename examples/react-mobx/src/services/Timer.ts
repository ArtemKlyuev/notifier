import { Timer, TimerEvents } from '@notifierjs/core';
import { makeAutoObservable } from 'mobx';

const timerEvents: TimerEvents[] = ['start', 'tick', 'pause', 'end'];

export class TimerManager {
  private time: number;

  constructor(private readonly timer: Timer<TimerEvents>) {
    this.time = this.timer.timeLeft;

    timerEvents.forEach((event) => this.timer.subscribe(event, () => this.updateTime()));

    makeAutoObservable(this);
  }

  private updateTime(): void {
    this.time = this.timer.timeLeft;
  }

  start(): void {
    this.timer.start();
  }

  pause(): void {
    this.timer.pause();
  }

  get timeLeft(): number {
    return this.time;
  }
}
