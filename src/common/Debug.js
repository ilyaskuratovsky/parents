import { useDispatch, useSelector } from "react-redux";
import * as MessageUtils from "./MessageUtils";

export function isDebugMode() {
  const status = useSelector((state) => state.debug.debugMode.status);
  return status;
}

export function toggleDebugMode() {
  const dispatch = useDispatch();
  dispatch(Actions.toggleDebugMode());
}
