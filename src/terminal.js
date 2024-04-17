import { execSync } from 'child_process';

export function setupTerminal() {
  execSync('stty raw -echo', {
    stdio: 'inherit' // this is important!
  });
}

export function restoreTerminal() {
  execSync('stty -raw echo', {
    stdio: 'inherit' // this is important!
  });
}
