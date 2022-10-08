// @flow strict-local

export function uninitialized<T>(): RemoteData<T> {
  return new RemoteData(true, false, null);
}
export function loading<T>(): RemoteData<T> {
  return new RemoteData(false, true, null);
}
export function isLoading(...remoteDatas: Array<RemoteData<any>>): boolean {
  for (const d of remoteDatas) {
    if (d.loading || d.uninitialized) {
      return true;
    }
  }
  return false;
}

export function data<T>(data: T): RemoteData<T> {
  return new RemoteData(false, false, data);
}

export class RemoteData<T> {
  uninitialized: boolean;
  loading: boolean;
  data: T;

  constructor(uninitialized, loading, data) {
    this.uninitialized = uninitialized;
    this.loading = loading;
    this.data = data;
  }

  getData() {
    if (this.loading || this.uninitialized) {
      throw new Error("Attempting to get data that is loading or uninitialized");
    }
    return this.data;
  }

  getDataOrNull() {
    return this.data;
  }
}
