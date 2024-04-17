#! /usr/bin/env node

import { TerminalClock } from '../src/terminal-clock.js';

const duration = process.argv.slice(2)[0];

if (duration) {
  const durationNum = Number.parseInt(duration);
  if (Number.isFinite(durationNum)) {
    new TerminalClock(durationNum);
  } else {
    console.error("Duration must be a finite integer");
    process.exit(1);
  }
} else {
  console.error("Must specify duration");
  process.exit(1);
}
