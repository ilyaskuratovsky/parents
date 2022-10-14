// @flow strict-local

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
import * as Logger from "./Logger";
import type {
  ChatMessage,
  Group,
  GroupMembership,
  Message,
  NotificationInfo,
  UserInfo,
  UserInvite,
  UserInviteUpdate,
} from "./Database";
import nullthrows from "nullthrows";

//import Firebase from "firebase";
/*
export async function getAllSchools() {
  const schoolsSnapshot = await getDocs(collection(db, "schools"));
  const schools = [];
  schoolsSnapshot.forEach((doc) => {
    schools.push({ id: doc.id, ...doc.data() });
  });
  return schools;
}
*/
/*
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
*/

export async function updateOrCreateUser(uid: string, data: UserInfo): Promise<UserInfo> {
  //firebase
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  let userDoc = null;
  let userInfo: ?UserInfo = null;

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

export function observeUserChanges(uid: string, callback: (UserInfo) => void) {
  //firebase
  const userDocRef = doc(db, "users", uid);
  onSnapshot(
    userDocRef,
    (doc) => {
      const data = doc.data();
      const user = {
        id: doc.id,
        uid: doc.uid,
        displayName: doc.displayName,
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        image: doc.image,
        superUser: doc.superUser,
        profileInitialized: doc.profileInitialized,

        ...data,
      };
      callback(user);
    },
    (err) => {
      Logger.log("encountered error");
    }
  );
}

export async function getAllGroups(): Promise<Array<Group>> {
  const groupsSnapshot = await getDocs(collection(db, "groups"));
  const groups = [];
  groupsSnapshot.forEach((doc) => {
    groups.push(doc.data());
  });
  return groups;
}

export function observeAllGroupChanges(callback: (Array<Group>) => void) {
  //rdb
  const groupsCollectionRef = collection(db, "groups");
  onSnapshot(groupsCollectionRef, (groupsSnapshot) => {
    const groupDocs = [];
    groupsSnapshot.forEach((group) => {
      const data = group.data();
      groupDocs.push({
        id: group.id,
        type: data.type,
        name: data.name,
        description: data.description,
        schoolId: data.schoolId,
        orgId: data.orgId,
        parentGroupId: data.parentGroupId,
      });
    });
    callback(groupDocs);
  });
}

export async function getAllUsers(): Promise<Array<UserInfo>> {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const users = [];
  usersSnapshot.forEach((data) => {
    const user = {
      id: doc.id,
      uid: doc.uid,
      displayName: doc.displayName,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      image: doc.image,
      superUser: doc.superUser,
      profileInitialized: doc.profileInitialized,

      ...data,
    };
    users.push(user);
  });
  return users;
}

export function observeAllUserChanges(callback: (Array<UserInfo>) => void) {
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
/*
export async function getAllGroupMemberships(): Array<GroupMembership> {
  const groupMembershipsSnapshot = await getDocs(collection(db, "group_memberships"));
  const group_memberships = [];
  groupMembershipsSnapshot.forEach((doc) => {
    group_memberships.push({ id: doc.id, ...doc.data() });
  });
  return group_memberships;
}
*/

/*
export function observeAllGroupMembershipChanges(callback: (Array<GroupMembership>) => void) {
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
*/

/*
export function observeUserGroupMemberships(uid, callback) {
  const snapshotQuery = query(collection(db, "group_memberships"), where("uid", "==", uid));

  onSnapshot(snapshotQuery, (snapshot) => {
    const list = snapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    callback(list);
  });
}
*/

export function observeToUserInvites(
  toUid: string,
  toEmail: string,
  callback: (Array<UserInvite>) => void
): () => void {
  const snapshotQuery = query(
    collection(db, "invites"),
    where("toUid", "in", ["_uid_" + toUid, "_email_" + toEmail]),
    where("status", "==", "new")
  );

  const unsubscribe = onSnapshot(snapshotQuery, (snapshot) => {
    const list = snapshot.docs
      .filter((doc) => {
        const data = doc.data();
        const toUidStr = data.toUid;
        const filter = toUidStr == "_uid_" + toUid || toUidStr == "_email_" + toEmail;
        Logger.log(
          "userinvite snapshot: " +
            toUid +
            ", toUidStr: " +
            toUidStr +
            ", filter: " +
            (filter ? "true" : "false")
        );
        return filter;
      })
      .map((doc) => {
        const data = doc.data();
        return { id: doc.id, ...data };
      });
    callback(list);
  });
  return unsubscribe;
}

export function observeFromUserInvites(
  fromUid: string,
  callback: (Array<UserInvite>) => void
): () => void {
  const snapshotQuery = query(
    collection(db, "invites"),
    where("fromUid", "==", fromUid),
    where("status", "==", "new")
  );

  const unsubscribe = onSnapshot(snapshotQuery, (snapshot) => {
    const list = snapshot.docs.map((doc) => {
      const data = doc.data();
      return { id: doc.id, ...data };
    });
    callback(list);
  });

  return unsubscribe;
}

export function observeGroupMessages(
  groupId: string,
  callback: (Array<Message>) => void
): () => void {
  const ref = collection(doc(collection(db, "groups"), groupId), "messages");
  return onSnapshot(ref, (snapshot) => {
    const list = snapshot.docs.map((doc) => {
      const data = doc.data();
      Logger.log("Group messages snapshot: " + JSON.stringify(data, null, 2), Logger.DEBUG);
      const timestamp = data.timestamp;
      const message: Message = {
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

export function observeChatMessages(
  chatId: string,
  callback: (Array<ChatMessage>) => void
): () => void {
  const ref = collection(doc(collection(db, "chats"), chatId), "messages");
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

export async function joinGroup(userInfo: UserInfo, groupId: string) {
  const groupMembershipCollectionRef = collection(db, "group_memberships");
  const existingGroupMembershipQuery = query(
    groupMembershipCollectionRef,
    where("uid", "==", userInfo.uid),
    where("groupId", "==", groupId)
  );

  const existingGroupMembershipSnapshot = await getDocs(existingGroupMembershipQuery);

  Logger.log("existing memberships: " + existingGroupMembershipSnapshot.docs.length);
  if (existingGroupMembershipSnapshot.docs.length == 0) {
    const membership = { uid: userInfo.uid, groupId: groupId };
    await addDoc(groupMembershipCollectionRef, membership);
  }
}

export async function createGroup(data: mixed) {
  const groupsRef = collection(db, "groups");
  const group = await addDoc(groupsRef, data);
}

export async function sendMessage(
  groupId: string,
  uid: string,
  title: ?string,
  text: ?string,
  data: mixed,
  papaId: ?string,
  notificationInfo: ?NotificationInfo
): Promise<string> {
  const message = {
    uid: uid,
    groupId,
    title,
    text,
    ...data,
    papaId,
    timestamp: serverTimestamp(),
    notificationInfo,
  };
  const messagesRef = collection(doc(collection(db, "groups"), groupId), "messages");
  return await addDoc(messagesRef, message);
}

//return DatabaseFS.sendChatMessage(chatId, uid, text, data, papaId, notificationInfo);
export async function sendChatMessage(
  chatId: string,
  uid: string,
  text: string,
  data: mixed,
  papaId: ?string,
  notificationInfo: mixed
): Promise<string> {
  const message = {
    uid: uid,
    chatId,
    text,
    ...data,
    papaId,
    timestamp: serverTimestamp(),
    notificationInfo,
  };
  const messagesRef = collection(doc(collection(db, "chats"), chatId), "messages");
  return await addDoc(messagesRef, message);
}

export async function createInvite(
  fromUid: string,
  groupId: string,
  uid: ?string,
  email: ?string
): Promise<void> {
  Logger.log("creating invite");
  const invitesRef = collection(db, "invites");
  const timestamp = serverTimestamp();
  const group = await addDoc(invitesRef, {
    fromUid,
    groupId,
    toUid: uid != null ? "_uid_" + uid : "_email_" + (email ?? "null"),
    status: "new",
    created: timestamp,
  });
  Logger.log("invite created: " + JSON.stringify(group));
}

export async function createEvent(
  uid: string,
  groupId: string,
  title: string,
  text: string,
  startDate: string,
  endDate: string
): Promise<string> {
  Logger.log(
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

export async function updateInvite(inviteId: string, update: UserInviteUpdate) {
  const docRef = doc(collection(db, "invites"), inviteId);
  await setDoc(docRef, update, { merge: true });
}
