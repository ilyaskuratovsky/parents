import * as Actions from "./Actions";
import { auth, database } from "../../config/firebase";
import { collection, doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import * as FirebaseAuth from "firebase/auth";

export const LOCATION = "greenwich";
