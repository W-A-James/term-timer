import { setInterval } from 'timers/promises';

export async function repeat(n, delayMS, func) {
  for await (const _ of setInterval(delayMS)) {
    func();
    if (n-- > 1) return;
  }
}

export function bell() {
  process.stdout.write('\x07');
}
