export function toMillis(obj) {
  const dt = toDate(obj);
  if (dt == null) {
    return null;
  }
  return dt.getTime();
}

export function compare(obj1, obj2) {
  if (obj1 == null && obj2 == null) {
    return 0;
  } else if (obj2 == null) {
    return 1;
  } else if (obj1 == null) {
    return -1;
  }

  const dt1 = toDate(obj1);
  const dt2 = toDate(obj2);

  if (dt1.getTime() > dt2.getTime()) {
    return 1;
  } else if (dt2.getTime() > dt1.getTime()) {
    return -1;
  } else {
    return 0;
  }
}
export function toDate(obj) {
  if (obj == null) {
    return null;
  }
  if (obj instanceof Date) {
    return obj;
  }

  if (typeof obj.toMillis === "function") {
    const millis = obj.toMillis();
    return new Date(millis);
  }

  try {
    const m = moment(obj, "YYYYMMDD ");
    if (m != null) {
      return m.toDate();
    }
  } catch (e) {}
  throw "not able to parse date: " + JSON.stringify(obj);
}

export function roundToNearest(date, nearest = 15) {
  const ms = 1000 * 60 * nearest;

  return new Date(Math.ceil(date.getTime() / ms) * ms);
}
