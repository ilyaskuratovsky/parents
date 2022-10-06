export default function nullthrows<T>(val: ?T, description: ?string = "") {
  if (val == null) {
    throw "Null throws: " + description;
  }
  return val;
}
