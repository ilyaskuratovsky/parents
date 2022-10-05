// @flow strict-local

let a = [];
let filter = (str): boolean => true;
//filter = (str): boolean => str.startsWith("logged");

export const INFO = 1;

const LOG_LEVEL = INFO;

export function log(str: string, level?: number = 0) {
  if (filter != null) {
    if (!filter(str)) {
      return;
    }
  }
  if (level >= LOG_LEVEL) {
    console.log(str);
  }
  a.push(str);
}

export function flush(): string {
  //const flushed = a.join("\n");
  const flushed = JSON.stringify(a, null, 2);
  a = [];
  return flushed;
}
