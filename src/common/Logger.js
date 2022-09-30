// @flow

let a = [];
export function log(str: string) {
  console.log(str);
  a.push(str);
}

export function flush(): string {
  //const flushed = a.join("\n");
  const flushed = JSON.stringify(a, null, 2);
  a = [];
  return flushed;
}
