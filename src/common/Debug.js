// @flow strict-local
import { useDispatch, useSelector } from "react-redux";

export function isDebugMode() {
  const status = useSelector((state) => state.debug.debugMode.status);
  return status;
}

export function toggleDebugMode() {
  const dispatch = useDispatch();
  dispatch(Actions.toggleDebugMode());
}
