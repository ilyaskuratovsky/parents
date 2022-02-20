import * as Actions from "./Actions";
import { firebaseConfig } from "./config/firebase";
import * as FirebaseAuth from "firebase/auth";
import * as FirebaseConfig from "./config/firebase";
import * as firebase from "firebase/app";

//import { FieldValue } from "firebase-admin/firestore";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import * as Loation from "./Location";
/*
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
*/

export async function initializeApp(dispatch) {
  const schoolsSnapshot = await getDocs(
    collection(FirebaseConfig.db, "schools")
  );
  const schools = [];
  schoolsSnapshot.forEach((doc) => {
    schools.push(doc.data());
  });

  const groupsSnapshot = await getDocs(collection(FirebaseConfig.db, "groups"));
  const groups = [];
  groupsSnapshot.forEach((doc) => {
    groups.push(doc.data());
  });
  dispatch(Actions.locationDataInit({ schools, groups }));

  console.log("here");

  const unsubscribeAuth = FirebaseAuth.onAuthStateChanged(
    FirebaseConfig.auth,
    async (authenticatedUser) => {
      if (authenticatedUser != null) {
        loggedIn(dispatch, authenticatedUser);
      } else {
        loggedOut(dispatch);
      }
    }
  );
  dispatch(Actions.goToScreen({ screen: "LOGIN" }));
}

export async function loggedIn(dispatch, authenticatedUser) {
  const uid = authenticatedUser.uid;
  const docRef = doc(FirebaseConfig.db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    //const user = docSnap;
  } else {
    await setDoc(doc(FirebaseConfig.db, "users", uid), {
      uid: uid,
      displayName: authenticatedUser.displayName,
      photoURL: authenticatedUser.photoURL,
      email: authenticatedUser.email,
    });
  }

  //observe user changes
  onSnapshot(
    doc(FirebaseConfig.db, "users", uid),
    (doc) => {
      const data = doc.data();
      dispatch(Actions.userInfo(data));
      if (data.profile == null) {
        dispatch(Actions.goToUserScreen({ screen: "PROFILE" }));
      } else {
        dispatch(Actions.goToUserScreen({ screen: "GROUPS" }));
      }
    },
    (err) => {
      console.log("encountered error");
    }
  );

  //observe schools changes
  var schoolQuery = onSnapshot(
    collection(FirebaseConfig.db, "schools"),
    (docsSnapshot) => {
      const schools = docsSnapshot.docs.map((doc) => doc.data());
      dispatch(Actions.schoolsUpdated(schools));
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );
  dispatch(Actions.goToScreen({ screen: "USER" }));
}

export async function loggedOut(dispatch) {
  dispatch(Actions.goToScreen({ screen: "LOGIN" }));
}

export async function saveUserProfileSchools(dispatch, userInfo, schools) {
  /*
  const res = await cityRef.set({
  capital: true
  }, { merge: true });
  */

  const newUserInfo = { ...userInfo, profile: { schools } };
  dispatch(Actions.userInfo(newUserInfo));

  await setDoc(doc(database, "users", userInfo.uid), newUserInfo, {
    merge: true,
  });
  dispatch(Actions.goToUserScreen({ screen: "GROUPS" }));
}

export async function joinGroup(dispatch, userInfo, groupId) {
  /*
  const res = await cityRef.set({
  capital: true
  }, { merge: true });
  */

  const userRef = doc(collection(FirebaseConfig.db, "users"), userInfo.uid);
  const newGroups = [...userInfo.groups];
  newGroups.push(groupId);
  const update = {
    groups: newGroups,
  };
  await setDoc(doc(FirebaseConfig.db, "users", userInfo.uid), update, {
    merge: true,
  });

  /*

// Atomically add a new region to the "regions" array field.
*/
  /*
  const newUserInfo = { ...userInfo, profile: { schools } };
  dispatch(Actions.userInfo(newUserInfo));

  await setDoc(doc(database, "users", userInfo.uid), newUserInfo, {
    merge: true,
  });
  dispatch(Actions.goToUserScreen({ screen: "GROUPS" }));
  */
}
