import * as RDB from "firebase/database";
import { rdb } from "../../config/firebase";

const observers = {};

export async function getAllOrgs() {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const orgsRDB = await RDB.get(RDB.child(dbRef, "orgs"));

  const ret = toArray(orgsRDB.val());
  return ret;
}

export function observeOrgChanges(callback) {
  //rdb
  const schoolsRef = RDB.ref(rdb, "orgs");
  RDB.onValue(schoolsRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export function observeUserMessages(uid, callback) {
  const userMessagesRef = RDB.ref(rdb, "user_messages/" + uid);
  RDB.onValue(userMessagesRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export function observeUserChatMessages(uid, callback) {
  const userMessagesRef = RDB.ref(rdb, "user_chat_messages/" + uid);
  RDB.onValue(userMessagesRef, (snapshot) => {
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
    return { ...userSnapshot.val(), ...data };
  } else {
    await RDB.set(userRef, data);
    return data;
  }
  const userInfo = data;
  return userInfo;
}

export async function updateUserAddToArrayField(uid, fieldName, value) {
  const dbRef = RDB.ref(rdb);
  const userRef = RDB.child(dbRef, "users/" + uid);
  const userSnapshot = await RDB.get(userRef);
  const currentArray = userSnapshot.val()[fieldName] ?? [];
  const newArray = currentArray.concat(value);
  const update = {};
  update[fieldName] = newArray;
  await RDB.update(userRef, update);
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

  const ret = toArray(users.val() ?? []);
  //const ret = toArray(null);
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
      const userGroupMemberships = ret.filter((groupMembership) => groupMembership.uid == uid);
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

export function observeUserChatMemberships(uid, callback) {
  const ref = RDB.ref(rdb, "chat_memberships/" + uid);
  const unsubscribe = RDB.onValue(ref, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export function observeGroupMessages(groupId, callback) {}

export function observeChatMessages(chatId, callback) {}

export function observeChat(chatId, callback) {
  //realtime-database
  const chatRef = RDB.ref(rdb, "chats/" + chatId);
  RDB.onValue(chatRef, (snapshot) => {
    const chat = snapshot.val();
    callback({ id: snapshot.key, ...chat });
  });
}

export async function createGroup(data) {
  const newReference = await RDB.push(RDB.ref(rdb, "/groups"));
  await RDB.set(newReference, data);
  return newReference.key;
}

export async function joinGroup(userInfo, groupId) {
  const newReference = await RDB.push(RDB.ref(rdb, "/group_memberships"));
  await RDB.set(newReference, { uid: userInfo.uid, groupId });
  return newReference.key;
}

export async function joinOrg(userInfo, orgId) {
  const newReference = await RDB.push(RDB.ref(rdb, "/org_memberships"));
  await RDB.set(newReference, { uid: userInfo.uid, orgId });
  return newReference.key;
}

export async function createChat(data) {
  const newReference = await RDB.push(RDB.ref(rdb, "/chats"));
  await RDB.set(newReference, data);
  return newReference.key;
}

export async function joinChat(uid, chatId) {
  const newReference = await RDB.push(RDB.ref(rdb, "/chat_memberships/" + uid));
  await RDB.set(newReference, { uid: uid, chatId });
  return newReference.key;
}

export async function createOrg(name, type) {
  const newReference = await RDB.push(RDB.ref(rdb, "/orgs"));
  await RDB.set(newReference, { name, type });
  return newReference.key;
}

export async function updateUserGroupMembership(userGroupMembershipId, updateObj) {
  const docRef = RDB.ref(rdb, "/group_memberships/" + userGroupMembershipId);
  await RDB.update(docRef, updateObj);
}

export async function updateUserMessage(uid, messageId, update) {
  const docRef = RDB.ref(rdb, "/user_messages/" + uid + "/" + messageId);
  await RDB.update(docRef, update);
}

export async function updateUserChatMessage(uid, chatMessageId, update) {
  const docRef = RDB.ref(rdb, "/user_chat_messages/" + uid + "/" + chatMessageId);
  await RDB.update(docRef, update);
}

export async function updateGroup(groupId, update) {
  const docRef = RDB.ref(rdb, "/groups/" + groupId);
  await RDB.update(docRef, update);
}

export async function updateUser(uid, update) {
  const docRef = RDB.ref(rdb, "/users/" + uid);
  await RDB.update(docRef, update);
}

export async function deleteGroupMembership(groupMembershipId) {
  const docRef = RDB.ref(rdb, "/group_memberships/" + groupMembershipId);
  await RDB.remove(docRef);
}

export async function deleteGroup(groupId) {
  const docRef = RDB.ref(rdb, "/groups/" + groupId);
  await RDB.remove(docRef);
}

export async function logError(error, info) {
  console.log("loggin error to rdb: " + JSON.stringify(error));
  const newReference = await RDB.push(RDB.ref(rdb, "/errors"));
  await RDB.set(newReference, { error: error.toString(), stack: error.stack });
  console.log("done logging error to rdb: " + JSON.stringify(error));
  return newReference.key;
}

function toArray(obj) {
  if (obj == null) {
    return [];
  }
  const array = [];
  for (const [key, value] of Object.entries(obj)) {
    array.push({ id: key, ...value });
  }
  return array;
}
