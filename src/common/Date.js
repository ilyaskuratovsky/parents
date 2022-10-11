// @flow strict-local
import moment from "moment";

export type AnyDateType =
  | {
      toMillis: () => number,
    }
  | number;
//| Date;
export function toMillis(obj: AnyDateType): ?number {
  const dt = toDate(obj);
  if (dt == null) {
    return null;
  }
  return dt.getTime();
}

export function compare(obj1: AnyDateType, obj2: AnyDateType): number {
  if (obj1 == null && obj2 == null) {
    return 0;
  } else if (obj2 == null) {
    return 1;
  } else if (obj1 == null) {
    return -1;
  }

  const dt1 = toDate(obj1);
  const dt2 = toDate(obj2);

  if ((dt1?.getTime() ?? 0) > (dt2?.getTime() ?? 0)) {
    return 1;
  } else if ((dt2?.getTime() ?? 0) > (dt1?.getTime() ?? 0)) {
    return -1;
  } else {
    return 0;
  }
}
export function toDate(obj: ?AnyDateType): ?Date {
  if (obj == null) {
    return null;
  }
  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj.toMillis === "function") {
    /* $FlowExpectedError */
    const millis = obj.toMillis();
    return new Date(millis);
  }

  try {
    const m = moment(obj, "YYYYMMDD ");
    if (m != null) {
      return m.toDate();
    }
  } catch (e) {}
  throw "not able to parse date " + JSON.stringify(obj);
}

export function roundToNearest(date: Date, nearest: number = 15): Date {
  const ms = 1000 * 60 * nearest;

  return new Date(Math.ceil(date.getTime() / ms) * ms);
}
