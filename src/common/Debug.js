// @flow strict-local
import * as Actions from "./Actions";

import { useDispatch, useSelector } from "react-redux";

export function isDebugMode(): boolean {
  const status = useSelector((state) => state.debug.debugMode.status);
  return status;
}

export function toggleDebugMode() {
  const dispatch = useDispatch();
  dispatch(Actions.toggleDebugMode());
}
