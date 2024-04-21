export const log = console.log;

export function error(...args: any) {
  console.log('ERR:', ...args);
}
