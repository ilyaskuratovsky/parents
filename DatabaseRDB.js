import * as RDB from "firebase/database";
import { rdb } from "./config/firebase";

const observers = {};

export async function getAllSchools() {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const schoolsRDB = await RDB.get(RDB.child(dbRef, "schools"));

  const ret = toArray(schoolsRDB.val());
  return ret;
}

export function observeSchoolChanges(callback) {
  //rdb
  const schoolsRef = RDB.ref(rdb, "schools");
  RDB.onValue(schoolsRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export async function updateOrCreateUser(uid, data) {
  const dbRef = RDB.ref(rdb);
  const userRef = RDB.child(dbRef, "users/" + uid);
  const userSnapshot = await RDB.get(userRef);
  if (userSnapshot.exists()) {
    await RDB.update(userRef, data);
  } else {
    await RDB.set(userRef, data);
  }
  const userInfo = data;
  return userInfo;
}

export function observeUserChanges(uid, callback) {
  //realtime-database
  const userRef = RDB.ref(rdb, "users/" + uid);
  RDB.onValue(userRef, (snapshot) => {
    const userInfo = snapshot.val();
    callback(userInfo);
  });
}

export async function getAllGroups() {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const groups = await RDB.get(RDB.child(dbRef, "groups"));

  const ret = toArray(groups.val());
  return ret;
}

export function observeAllGroupChanges(callback) {
  //rdb
  const groupsRef = RDB.ref(rdb, "groups");
  const unsubscribe = RDB.onValue(groupsRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export async function getAllUsers() {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const users = await RDB.get(RDB.child(dbRef, "users"));

  const ret = toArray(users.val());
  return ret;
}

export function observeAllUserChanges(callback) {
  //rdb
  const usersRef = RDB.ref(rdb, "users");
  RDB.onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export async function getAllGroupMemberships() {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const snapshot = await RDB.get(RDB.child(dbRef, "group_memberships"));
  const ret = toArray(snapshot.val());
  return ret;
}

function observeAllGroupMembershipChangesHelper(callback, uid, userCallback) {
  const ref = RDB.ref(rdb, "group_memberships");
  const unsubscribe = RDB.onValue(ref, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
    if (uid != null) {
      const userGroupMemberships = ret.filter(
        (groupMembership) => groupMembership.uid == uid
      );
      userCallback(userGroupMemberships);
    }
  });
  observers["observeAllGroupChanges"] = {
    callback,
    uid,
    userCallback,
    unsubscribe,
  };
}

export function observeAllGroupMembershipChanges(callback) {
  let uid = null;
  let userCallback = null;
  if (observers["observeAllGroupChanges"] != null) {
    uid = observers["observeAllGroupChanges"]["uid"];
    userCallback = observers["observeAllGroupChanges"]["userCallback"];
  }
  observeAllGroupMembershipChangesHelper(callback, uid, userCallback);
}

export function observeUserGroupMemberships(uid, userCallback) {
  let callback = null;
  if (observers["observeAllGroupChanges"] != null) {
    callback = observers["observeAllGroupChanges"]["callback"];
  }
  observeAllGroupMembershipChangesHelper(callback, uid, userCallback);
}

export function observeGroupMessages(groupId, callback) {}

export async function createGroup(data) {
  const newReference = await RDB.push(RDB.ref(rdb, "/groups"));
  await RDB.set(newReference, data);
  return newReference.key;
}

export async function joinGroup(userInfo, groupId) {
  //realtime database
  const newReference = await RDB.push(RDB.ref(rdb, "/group_memberships"));
  await RDB.set(newReference, { uid: userInfo.uid, groupId });
  return newReference.key;
}

function toArray(obj) {
  const array = [];
  for (const [key, value] of Object.entries(obj)) {
    array.push({ id: key, ...value });
  }
  return array;
}
