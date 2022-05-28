export function uniqueArray(array, keyFunc) {
  const ret = [];
  const keys = new Set();
  for (const e of array) {
    const key = keyFunc(e);
    if (!keys.has(key)) {
      ret.push(e);
      keys.add(key);
    }
  }
  return ret;
}

export function isEmptyString(str) {
  const notEmpty = str != null && str.trim().length > 0;
  console.log("notEmpty (" + str + "): " + notEmpty);
  return !notEmpty;
}
