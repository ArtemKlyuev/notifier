import { EventBus } from '../EventEmitter';
import { Notifier, Informer, Options } from '../Notifier';
import { Timekeeper } from '../Timer';

export const createNotifier = <Payload>(options?: Partial<Options>): Notifier<Payload> => {
  return new Informer(new EventBus(), Timekeeper, options);
};
