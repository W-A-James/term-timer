import { setInterval } from 'node:timers/promises';
import { stdout } from 'node:process';

/**
  * Repeat a function n times with a delay of delayMS between invocations
  **/
export async function repeat(n: number, delayMS: number, func: () => void, opts: { signal: AbortSignal }) {
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
export function bell(): void {
  stdout.write('\x07');
}
