#! /usr/bin/env node
import { TerminalTimer } from '../src/terminal-timer.js';
import { log, error } from '../src/utils.js';
import { parseDuration } from '../src/duration-parser.js';

const duration = process.argv.slice(2)[0];

const usage = `
Usage: 
  term-timer [hours]h [minutes]m [seconds]s?

  Must specify at least one of [hours], [minutes], [seconds]

  If only one duration specifier is provided with no suffix, defaults to interpreting as seconds
`;

if (duration) {
  let durationNum;
  try {
    durationNum = parseDuration(duration);
  } catch {
    error('Must correctly specify duration');
    log(usage);
    process.exit(1);
  }

  if (durationNum != null && Number.isFinite(durationNum)) {
    await new TerminalTimer(durationNum).run();
    process.exit(0);
  } else {
    error('Duration must be a finite integer');
    log(usage);
    process.exit(1);
  }
} else {
  error('Must specify duration');
  log(usage);
  process.exit(1);
}
