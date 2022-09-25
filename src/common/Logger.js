let a = [];
export function log(str) {
  console.log(str);
  a.push(str);
}

export function flush() {
  //const flushed = a.join("\n");
  const flushed = JSON.stringify(a, null, 2);
  a = [];
  return flushed;
}
