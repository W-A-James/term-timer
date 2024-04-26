#! /usr/bin/env node
import { TerminalTimer } from './terminal-timer.js';
import { log, error } from './utils.js';
import { parseDuration } from './duration-parser.js';

import { Command } from 'commander';


const usage = `
Usage: 
  term-timer [hours]h [minutes]m [seconds]s? [--no-7seg|n]

  Must specify at least one of [hours], [minutes], [seconds]

  If only one duration specifier is provided with no suffix, defaults to interpreting as seconds
`;

const program = new Command();
program
  .name('term-timer')
  .description('Simple terminal-based timer')
  .version('1.0.0');

program
  .argument('[HOURS]', 'Number of hours. Specified as <n>h.')
  .argument('[MINUTES]', 'Number of minutes. Specified as <n>m.')
  .argument('[SECONDS]', 'Number of seconds. Specified as <n>s or <n>')
  .option('-n, --no7seg', 'Don\'t use 7seg unicode characters to display remaining time');


async function main() {
  program.parse();
  let duration: number;

  switch (program.args.length) {
  case 1:
  case 2:
  case 3:
    break;

  default:
    program.help();
    break;
  }

  try {
    duration = parseDuration(program.args.join(' '));
  } catch {
    error('Must correctly specify duration');
    log(usage);
    process.exit(1);
  }

  if (duration != null && Number.isFinite(duration)) {
    await new TerminalTimer(duration, Boolean(program.opts().no7seg)).run();
    process.exit(0);
  } else {
    error('Duration must be a finite integer');
    log(usage);
    process.exit(1);
  }
}

main();
