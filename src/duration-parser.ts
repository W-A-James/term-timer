const HR = /^([1-9]+\d*)h$/i;
const MIN = /^([1-9]+\d*)m$/i;
const SEC = /^([1-9]+\d*)s$/i;

/**
  * Defaults to parsing as seconds
  * 
  * valid inputs
  * 1h 10m 1s
  * 1h 1s
  * 1m 1s
  * 1h
  * 1m
  * 1s
  * 10
  * @param durationString: string
  * */
export function parseDuration(durationString: string): number {
  const parts = durationString.split(' ');
  if (parts.length === 0 || parts.length > 3) throw new Error('Invalid duration specifier');


  let foundH = false;
  let foundM = false;
  let foundS = false;

  if (parts.length === 1 && /^\d+$/.test(parts[0])) {
    return Number.parseInt(parts[0]);
  }

  let seconds = 0;
  for (const durationSpec of parts) {
    let match = HR.exec(durationSpec);
    if (match) {
      if (foundH) throw new Error('Found duplicate hours specifier');
      foundH = true;
      seconds += Number.parseInt(match[1]) * 3600;
      continue;
    }

    match = MIN.exec(durationSpec);
    if (match) {
      if (foundM) throw new Error('Found duplicate minutes specifier');
      foundM = true;
      seconds += Number.parseInt(match[1]) * 60;
      continue;
    }

    match = SEC.exec(durationSpec);
    if (match) {
      if (foundS) throw new Error('Found duplicate seconds specifier');
      foundS = true;
      seconds += Number.parseInt(match[1]);
      continue;
    }

    throw new Error('Unrecognized time specifier');
  }

  return seconds;
}


