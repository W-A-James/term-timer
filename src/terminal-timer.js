import { setInterval as setintervalP } from 'timers/promises';

import { log } from './utils.js'
import { setupTerminal, restoreTerminal } from './terminal.js';

import { repeat, bell } from './sound.js';

import { stdin, stdout } from 'process';

const DIGITAL_CLOCK = [
  '     ╭──────────╮',
  '     │ %s:%s:%s │',
  '     ╰──────────╯'
].join('\r\n');

const to7Seg = {
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

const to2Dig = (x) => {
  const stringified = x < 10 ? `0${x}` : x.toString();
  return stringified.split('').map(x => to7Seg[x]).join('');
};

export class TerminalTimer {
  static INSTANCE_COUNT = 0;

  constructor(durationS) {
    if (TerminalTimer.INSTANCE_COUNT !== 0) throw new Error("Can only have one instance active at a time");
    TerminalTimer.INSTANCE_COUNT++;
    setupTerminal();

    this.interruptHandler = data => {
      if (data == '\x03') { // handle ctrl-c
        stdout.moveCursor(0, -3, () => {
          stdout.clearScreenDown(() => {
            this.kill();
          });
        });

      }
    }
    // Set up interrupt handler
    stdin.on('data', this.interruptHandler);

    this.killed = false;
    this.seconds = durationS;
  }

  async run() {
    for await (const _ of setintervalP(1000)) {
      if (this.killed) return;
      if (this.seconds === -1) { // Timer successfully expired
        break;
      }

      try {
        const hours = Math.trunc(this.seconds / 3600);
        const remainingSeconds = this.seconds % 3600;
        log(DIGITAL_CLOCK + '\r', to2Dig(hours), to2Dig(Math.trunc(remainingSeconds / 60)), to2Dig(remainingSeconds % 60));

        this.seconds--;
        process.stdout.moveCursor(0, -3);
      } catch (e) {
        this.kill();
        return;
      }
    }

    await repeat(5, 200, bell);
    this.kill();
  }

  kill() {
    this.killed = true;
    stdout.clearScreenDown();
    restoreTerminal();

    TerminalTimer.INSTANCE_COUNT--;

    stdin.off('data', this.interruptHandler);
  }
}
