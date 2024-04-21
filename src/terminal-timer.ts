import { setInterval } from 'node:timers/promises';
import { stdin, stdout } from 'node:process';
import { EventEmitter } from 'node:events';

import { log } from './utils.js';
import { setupTerminal, restoreTerminal } from './terminal.js';
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

const to2Dig = (x: number) => {
  const stringified = x < 10 ? `0${x}` : x.toString();
  return stringified.split('').map((x: string) => to7Seg[x]).join('');
};

export class TerminalTimer extends EventEmitter {
  static INSTANCES = new Set();
  private interruptHandler: (data: string) => void;
  private killed: boolean;
  private seconds: number;
  private abortController: AbortController;
  private captureTTY: boolean;

  constructor(durationS: number, captureTTY = true) {
    super();
    if (TerminalTimer.INSTANCES.size !== 0) throw new Error('Can only have one instance active at a time');
    TerminalTimer.INSTANCES.add(this);

    this.interruptHandler = data => {
      if (data == '\x03') { // handle ctrl-c
        stdout.moveCursor(0, -3, () => {
          if (stdout.clearScreenDown) {
            stdout.clearScreenDown(() => {
              this.kill();
            });
          } else {
            this.kill();
          }
        });
      }
    };
    // Set up interrupt handler
    if (captureTTY)
      stdin.on('data', this.interruptHandler);

    this.killed = false;
    this.seconds = durationS;
    this.abortController = new AbortController();
    this.captureTTY = captureTTY;
  }

  async run(): Promise<void> {
    if (this.captureTTY)
      setupTerminal();
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
            log(DIGITAL_CLOCK + '\r', to2Dig(hours), to2Dig(minutes), to2Dig(seconds));
            stdout.moveCursor(0, -3);
          }

          this.seconds--;
        } catch {
          this.kill();
          return;
        }
      }
    } catch {
      // Do nothing with abort error
    }

    await repeat(5, 100, bell, { signal: this.abortController.signal });
    this.kill();
  }

  /**
    * Kill the timer and restore previous terminal settings
    * */
  kill(): void {
    TerminalTimer.INSTANCES.delete(this);
    this.killed = true;

    if (this.captureTTY) {
      if (stdout.clearScreenDown)
        stdout.clearScreenDown();
      restoreTerminal();
      stdin.off('data', this.interruptHandler);
    }

    this.abortController.abort();
    this.emit('expire');
  }
}
