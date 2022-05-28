import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  onSnapshot,
  setDoc,
  where,
  query,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
//import Firebase from "firebase";

export async function getAllSchools() {
  /* firestore */
  const schoolsSnapshot = await getDocs(collection(db, "schools"));
  const schools = [];
  schoolsSnapshot.forEach((doc) => {
    schools.push({ id: doc.id, ...doc.data() });
  });
  return schools;
}

export function observeSchoolChanges(callback) {
  //firestores
  var schoolQuery = onSnapshot(
    collection(db, "schools"),
    (docsSnapshot) => {
      const schools = docsSnapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      callback(schools);
    },
    (err) => {
      Logger.log(`Encountered error: ${err}`);
    }
  );
}

export async function updateOrCreateUser(uid, data) {
  //firebase
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  let userDoc = null;
  let userInfo = null;

  // get or create the user info objet
  if (docSnap.exists()) {
    //update with latest push token
    const userRef = doc(collection(db, "users"), uid);
    //userInfo = { id: docSnap.id, ...docSnap.data() };
    userDoc = await setDoc(
      userRef,
      //   {
      //     pushToken: pushToken == undefined ? null : pushToken,
      //   },
      data,
      { merge: true }
    );
    userInfo = data;
  } else {
    userDoc = await setDoc(doc(db, "users", uid), data);
    userInfo = data;
  }
  return userInfo;
}

export function observeUserChanges(uid, callback) {
  //firebase
  const userDocRef = doc(db, "users", uid);
  onSnapshot(
    userDocRef,
    (doc) => {
      const data = doc.data();
      userInfo = { id: doc.id, ...data };
      callback(userInfo);
    },
    (err) => {
      console.log("encountered error");
    }
  );
}

export async function getAllGroups() {
  const groupsSnapshot = await getDocs(collection(db, "groups"));
  const groups = [];
  groupsSnapshot.forEach((doc) => {
    groups.push(doc.data());
  });
  return groups;
}

export function observeAllGroupChanges(callback) {
  //rdb
  const groupsCollectionRef = collection(db, "groups");
  onSnapshot(groupsCollectionRef, (groupsSnapshot) => {
    const groupDocs = [];
    groupsSnapshot.forEach((group) => {
      const data = group.data();
      groupDocs.push({
        id: group.id,
        name: data.name,
        schoolId: data.schoolId,
      });
    });
    callback(groupDocs);
  });
}

export async function getAllUsers() {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = [];
  usersSnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return groups;
}

export function observeAllUserChanges(callback) {
  //rdb
  const usersRef = collection(db, "users");
  onSnapshot(usersRef, (usersSnapshot) => {
    const users = [];
    usersSnapshot.forEach((userSnapshot) => {
      const data = userSnapshot.data();
      users.push({
        id: userSnapshot.id,
        ...data,
      });
    });
    callback(users);
  });
}

export async function getAllGroupMemberships() {
  const groupMembershipsSnapshot = await getDocs(collection(db, "group_memberships"));
  const group_memberships = [];
  groupMembershipsSnapshot.forEach((doc) => {
    group_memberships.push({ id: doc.id, ...doc.data() });
  });
  return group_memberships;
}

export function observeAllGroupMembershipChanges(callback) {
  //rdb
  const ref = collection(db, "group_memberships");
  onSnapshot(usersRef, (snapshot) => {
    const arr = [];
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      arr.push({
        id: userSnapshot.id,
        ...data,
      });
    });
    callback(arr);
  });
}

export function observeUserGroupMemberships(uid, callback) {
  const snapshotQuery = query(collection(db, "group_memberships"), where("uid", "==", uid));

  onSnapshot(snapshotQuery, (snapshot) => {
    const list = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    callback(list);
  });
}

export function observeToUserInvites(toUid, toEmail, callback) {
  const snapshotQuery = query(
    collection(db, "invites"),
    where("toUid", "in", ["_uid_" + toUid, "_email_" + toEmail]),
    where("status", "==", "new")
  );

  onSnapshot(snapshotQuery, (snapshot) => {
    const list = snapshot.docs
      .filter((doc) => {
        const data = doc.data();
        const toUidStr = data.toUid;
        const filter = toUidStr == "_uid_" + toUid || toUidStr == "_email_" + toEmail;
        console.log(
          "userinvite snapshot: " + toUid + ", toUidStr: " + toUidStr + ", filter: " + filter
        );
        return filter;
      })
      .map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
    callback(list);
  });
}

export function observeFromUserInvites(fromUid, callback) {
  const snapshotQuery = query(
    collection(db, "invites"),
    where("fromUid", "==", fromUid),
    where("status", "==", "new")
  );

  onSnapshot(snapshotQuery, (snapshot) => {
    const list = snapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });
    callback(list);
  });
}

export function observeGroupMessages(groupId, callback) {
  const ref = collection(doc(collection(db, "groups"), groupId), "messages");
  return onSnapshot(ref, (snapshot) => {
    const list = snapshot.docs.map((doc) => {
      const data = doc.data();
      const message = {
        id: doc.id,
        title: data.title,
        text: data.text,
        uid: data.uid,
        timestamp: data.timestamp,
        papaId: data.papaId,
        ...data,
      };
      return message;
    });
    callback(list);
  });
}

export async function joinGroup(userInfo, groupId) {
  const groupMembershipCollectionRef = collection(db, "group_memberships");
  const existingGroupMembershipQuery = query(
    groupMembershipCollectionRef,
    where("uid", "==", userInfo.uid),
    where("groupId", "==", groupId)
  );

  const existingGroupMembershipSnapshot = await getDocs(existingGroupMembershipQuery);

  console.log("existing memberships: " + existingGroupMembershipSnapshot.docs.length);
  if (existingGroupMembershipSnapshot.docs.length == 0) {
    const membership = { uid: userInfo.uid, groupId: groupId };
    await addDoc(groupMembershipCollectionRef, membership);
  }
}

export async function createGroup(data) {
  const groupsRef = collection(db, "groups");
  const group = await addDoc(groupsRef, data);
}

export async function sendMessage(groupId, uid, title, text, data, papaId, notificationInfo) {
  // console.log(firebase.firestore);
  // console.log(Object.keys(firebase.firestore));
  const message = {
    uid: uid,
    groupId,
    title,
    text,
    ...data,
    papaId,
    //timestamp: Timestamp.now().toDate(),
    timestamp: serverTimestamp(),
    notificationInfo,
  };
  const messagesRef = collection(doc(collection(db, "groups"), groupId), "messages");
  return await addDoc(messagesRef, message);
}

export async function createInvite(fromUid, groupId, uid, email) {
  console.log("creating invite");
  const invitesRef = collection(db, "invites");
  const timestamp = serverTimestamp();
  const group = await addDoc(invitesRef, {
    fromUid,
    groupId,
    toUid: uid != null ? "_uid_" + uid : "_email_" + email,
    status: "new",
    created: timestamp,
  });
  console.log("invite created: " + JSON.stringify(group));
}

export async function createEvent(uid, groupId, title, text, startDate, endDate) {
  console.log(
    "create event: " +
      uid +
      ", " +
      groupId +
      ", " +
      title +
      ", " +
      text +
      startDate +
      ", " +
      endDate
  );
  const eventsRef = collection(db, "events");
  const event = await addDoc(eventsRef, {
    uid,
    groupId,
    title,
    text,
    startDate,
    endDate,
  });
  return event.id;
}

export async function updateInvite(inviteId, update) {
  const docRef = doc(collection(db, "invites"), inviteId);
  await setDoc(docRef, update, { merge: true });
}
