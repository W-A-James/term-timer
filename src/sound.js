import { setInterval } from 'timers/promises';

/**
  * Repeat a function n times with a delay of delayMS between invocations
  **/
export async function repeat(n, delayMS, func, opts) {
  for await (const _ of setInterval(delayMS, undefined, opts)) {
    func();
    if (n-- === 1) return;
  }
}

/**
  * Ring terminal bell
  */
export function bell() {
  process.stdout.write('\x07');
}
