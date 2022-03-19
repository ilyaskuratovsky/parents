import { database } from "./firebase";
import { ref, set } from "firebase/database";

export function randomId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const length = 9;
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function randomColor() {
  const colors = ["cyan", "purple", "green", "aqua", "maroon"];
  return colors[Math.floor(Math.random() * colors.length)];
}
