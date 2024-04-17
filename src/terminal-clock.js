import { execSync } from 'child_process';
import { setInterval, clearInterval } from 'timers';

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
    this.setupTerminal();

    this.interruptHandler = data => {
      if (data == '\x03') { // handle ctrl-c
        process.stdout.moveCursor(0, -3, () => {
          process.stdout.clearScreenDown(() => {
            this.restoreTerminal();
            console.log("Clock stopped");
            this.kill();
          });
        });

      }
    }
    // Set up interrupt handler
    process.stdin.on('data', this.interruptHandler);

    this.killed = false;
    this.seconds = durationS;
    this.interval = setInterval(() => this.tick(), 1000);
  }

  tick() {
    console.log(digitalClock + '\r', to2Dig(Math.trunc(this.seconds / 60)), to2Dig(this.seconds-- % 60));
    process.stdout.moveCursor(0, -3, () => {
      if (this.seconds === 0) {
        this.kill();
      }
    });
  }

  kill() {
    clearInterval(this.interval);
    TerminalClock.INSTANCE_COUNT--;

    process.stdin.off('data', this.interruptHandler);
    process.exit();
  }

  setupTerminal() {
    execSync('stty raw -echo', {
      stdio: 'inherit' // this is important!
    });
  }

  restoreTerminal() {
    execSync('stty -raw echo', {
      stdio: 'inherit' // this is important!
    });
  }
}
