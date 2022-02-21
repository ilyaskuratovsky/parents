import * as Actions from "./Actions";
import { db, auth } from "./config/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  where,
  setDoc,
  onSnapshot,
  query,
  //} from "firebase/firestore/lite";
} from "firebase/firestore";

export async function initializeApp(dispatch) {
  const schoolsSnapshot = await getDocs(collection(db, "schools"));
  const schools = [];
  schoolsSnapshot.forEach((doc) => {
    schools.push(doc.data());
  });

  const groupsSnapshot = await getDocs(collection(db, "groups"));
  const groups = [];
  groupsSnapshot.forEach((doc) => {
    groups.push(doc.data());
  });
  dispatch(Actions.locationDataInit({ schools, groups }));

  console.log("here");

  const unsubscribeAuth = onAuthStateChanged(
    auth,
    async (authenticatedUser) => {
      console.log("auth state change: " + JSON.stringify(authenticatedUser));
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
  console.log("logged in");
  const uid = authenticatedUser.uid;
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    //const user = docSnap;
  } else {
    await setDoc(doc(db, "users", uid), {
      uid: uid,
      displayName: authenticatedUser.displayName,
      photoURL: authenticatedUser.photoURL,
      email: authenticatedUser.email,
    });
  }

  //observe user changes
  const userDocRef = doc(db, "users", uid);
  onSnapshot(
    userDocRef,
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

  //observe group membership changes
  const groupMembershipsQuery = query(
    collection(db, "group_memberships"),
    where("uid", "==", uid)
  );
  const groupMemberships = await getDocs(groupMembershipsQuery);
  const groupMembershipDocs = groupMemberships.docs.map((doc) => doc.data());
  dispatch(Actions.groupMemberships(groupMembershipDocs));

  /*
  onSnapshot(
    groupMemberships,
    (snapshot) => {
      const groupMemberships = snapshot.docs.map((doc) => doc.data());
      dispatch(Actions.groupMemberships(groupMemberships));
    },
    (err) => {
      console.log(`Encountered error: ${err}`);
    }
  );
  */

  //observe schools changes
  var schoolQuery = onSnapshot(
    collection(db, "schools"),
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
  const groupMembershipCollectionRef = collection(db, "group_membership");
  const existingGroupMembership = await groupMembershipCollectionRef
    .where("uid", "==", userInfo.uid)
    .where("groupId", "==", groupId)
    .get();
  if (!existingGroupMembership.exists()) {
    const membership = { uid: userInfo.uid, groupId: groupId };
    await addDoc(groupMembershipCollectionRef, membership);
  }
  /*
  const newGroups = [...userInfo.groups];
  newGroups.push(groupId);
  const update = {
    groups: newGroups,
  };
  await setDoc(doc(db, "users", userInfo.uid), update, {
    merge: true,
  });
  */
}
