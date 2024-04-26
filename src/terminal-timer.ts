import { setInterval } from 'node:timers/promises';
import { EventEmitter } from 'node:events';

import { log } from './utils.js';
import { setupTerminal, restoreTerminal, moveCursor } from './terminal.js';
import { repeat, bell } from './sound.js';


const DIGITAL_CLOCK = [
  '     ╭──────────╮',
  '     │ %s:%s:%s │',
  '     ╰──────────╯'
].join('\r\n');

const to7Seg: Record<string, string> = {
  '0': '\u{1fbf0}',
  '1': '\u{1fbf1}',
  '2': '\u{1fbf2}',
  '3': '\u{1fbf3}',
  '4': '\u{1fbf4}',
  '5': '\u{1fbf5}',
  '6': '\u{1fbf6}',
  '7': '\u{1fbf7}',
  '8': '\u{1fbf8}',
  '9': '\u{1fbf9}',
};

const to2Dig = (x: number, no7Seg?: boolean) => {
  if (no7Seg) {
    return x < 10 ? `0${x}` : x.toString();
  }
  const stringified = x < 10 ? `0${x}` : x.toString();
  return stringified.split('').map((x: string) => to7Seg[x]).join('');
};

export interface TimerOptions {
  duration: number;
  captureTTY?: boolean;
  no7Seg?: boolean;
}

export class TerminalTimer extends EventEmitter {
  static INSTANCES = new Set();
  private killed: boolean;
  private seconds: number;
  private abortController: AbortController;
  private captureTTY: boolean;
  private no7Seg: boolean;

  constructor(options: TimerOptions) {
    super();
    if (TerminalTimer.INSTANCES.size !== 0) throw new Error('Can only have one instance active at a time');
    TerminalTimer.INSTANCES.add(this);

    this.no7Seg = options.no7Seg ?? false;
    this.killed = false;
    this.seconds = options.duration;
    this.abortController = new AbortController();
    this.captureTTY = options.captureTTY ?? true;
  }

  async run(): Promise<void> {
    if (this.captureTTY)
      setupTerminal(this);
    try {
      for await (const _ of setInterval(1000, undefined, { signal: this.abortController.signal })) {
        if (this.killed) return;
        if (this.seconds === -1) { // Timer successfully expired
          break;
        }

        try {
          const hours = Math.trunc(this.seconds / 3600);
          const minutes = Math.trunc((this.seconds % 3600) / 60);
          const seconds = (this.seconds) % 60;
          if (this.captureTTY) {
            log(DIGITAL_CLOCK + '\r', to2Dig(hours, this.no7Seg), to2Dig(minutes, this.no7Seg), to2Dig(seconds, this.no7Seg));
            await moveCursor(0, -3);
          }

          this.seconds--;
        } catch {
          return await this.kill();
        }
      }
    } catch {
      // Do nothing with abort error
    }

    await repeat(5, 100, bell, { signal: this.abortController.signal });
    return await this.kill();
  }

  /**
    * Kill the timer and restore previous terminal settings
    * */
  async kill(): Promise<void> {
    TerminalTimer.INSTANCES.delete(this);
    this.killed = true;

    if (this.captureTTY)
      await restoreTerminal();

    this.abortController.abort();
    this.emit('expire');
  }
}
