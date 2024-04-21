import { execSync } from 'node:child_process';

export function setupTerminal(): void {
  execSync('stty raw -echo', {
    stdio: 'inherit' // this is important!
  });
}

export function restoreTerminal(): void {
  execSync('stty -raw echo', {
    stdio: 'inherit' // this is important!
  });
}
