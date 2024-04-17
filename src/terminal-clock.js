import { setInterval, clearInterval } from 'timers';

import { log } from './utils.js'
import { setupTerminal, restoreTerminal } from './terminal.js';

const digitalClock = [
  ' _________',
  '/  %s:%s  \\',
  '\\_________/'
].join('\r\n');

const to2Dig = (x) => x < 10 ? `0${x}` : x

export class TerminalClock {
  static INSTANCE_COUNT = 0;

  constructor(durationS) {
    if (TerminalClock.INSTANCE_COUNT !== 0) throw new Error("Can only have one instance active at a time");
    TerminalClock.INSTANCE_COUNT++;
    setupTerminal();

    this.interruptHandler = data => {
      if (data == '\x03') { // handle ctrl-c
        process.stdout.moveCursor(0, -3, () => {
          process.stdout.clearScreenDown(() => {
            restoreTerminal();
            log("Clock stopped");
            this.kill();
          });
        });

      }
    }
    // Set up interrupt handler
    process.stdin.on('data', this.interruptHandler);

    this.killed = false;
    this.seconds = durationS;
    this.tick();
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    if (this.seconds === -1) {
      this.kill();
    }
    try {
      log(digitalClock + '\r', to2Dig(Math.trunc(this.seconds / 60)), to2Dig(this.seconds-- % 60));
      process.stdout.moveCursor(0, -3);
    } catch (e) {
      restoreTerminal();
      throw e;
    }
  }

  kill() {
    clearInterval(this.interval);
    TerminalClock.INSTANCE_COUNT--;

    process.stdout.clearScreenDown();

    restoreTerminal();

    process.stdin.off('data', this.interruptHandler);
    process.exit();
  }
}
