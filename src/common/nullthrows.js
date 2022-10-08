// @flow strict-local

export default function nullthrows<T>(val: ?T, description: ?string = ""): T {
  if (val == null) {
    throw "Null throws: " + (description ?? "");
  }
  return val;
}
