// @flow strict-local

import nullthrows from "nullthrows";

export default function filter_nulls<T>(arr: Array<?T>): Array<T> {
  const x = arr.filter((a) => a != null);
  return arr.map((a) => nullthrows(a));
}
