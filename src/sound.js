import { setInterval } from 'node:timers/promises';

/**
  * Repeat a function n times with a delay of delayMS between invocations
  **/
export async function repeat(n, delayMS, func, opts) {
  try {
    for await (const _ of setInterval(delayMS, undefined, opts)) {
      func();
      if (n-- === 1) return;
    }
  } catch {
    // squelch abort error
  }
}

/**
  * Ring terminal bell
  */
export function bell() {
  process.stdout.write('\x07');
}
