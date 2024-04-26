import { stdin, stdout } from 'node:process';
import { promisify } from 'node:util';
import { TerminalTimer } from './terminal-timer.js';

export const moveCursor = promisify(stdout.moveCursor);
export const clearScreenDown = stdout.clearScreenDown ? promisify(stdout.clearScreenDown) : null;

export function setupTerminal(timer: TerminalTimer): void {
  stdin.setRawMode(true);
  stdin.on('data', async d => {
    if (d[0] === 3 || d[0] === 4) {
      await moveCursor(0, -3);
      if (clearScreenDown) await clearScreenDown();
      timer.kill();
    }
  });
}

export async function restoreTerminal(): Promise<void> {
  stdin.setRawMode(false);
  stdin.removeAllListeners('data');
  if (clearScreenDown)
    await clearScreenDown();
}
