#! /usr/bin/env node

import { TerminalClock } from '../src/terminal-clock.js';
import { log, error } from '../src/utils.js';

const duration = process.argv.slice(2)[0];

const usage = `
Usage: 
  term-clock <DURATION>
`

if (duration) {
  const durationNum = Number.parseInt(duration);
  if (Number.isFinite(durationNum)) {
    new TerminalClock(durationNum);
  } else {
    error("Duration must be a finite integer");
    log(usage);
    process.exit(1);
  }
} else {
  error("Must specify duration");
  log(usage);
  process.exit(1);
}
