// @flow strict-local

export function uniqueArray<T>(array: Array<T>, keyFunc: (T) => string): Array<T> {
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

export function isEmptyString(str: ?string): boolean {
  const notEmpty = str != null && str.trim().length > 0;
  return !notEmpty;
}

export function parseEmails(str: ?string): Array<string> {
  if (str != null) {
    const re = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const match = str.match(re);
    if (match != null) {
      return match;
    }
  }
  return [];
}
