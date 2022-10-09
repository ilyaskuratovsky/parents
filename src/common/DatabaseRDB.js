// @flow strict-local

import * as RDB from "firebase/database";
import { rdb } from "../../config/firebase";
import * as Logger from "./Logger";
import type { Org } from "./Database";
import type {
  Chat,
  ChatMembership,
  ChatMessage,
  Group,
  GroupMembership,
  GroupMembershipRequest,
  GroupUpdate,
  Message,
  UserChatMessage,
  UserChatMessageUpdate,
  UserInfo,
  UserInfoUpdate,
  UserMessage,
} from "./Database";
import nullthrows from "nullthrows";

const observers = {};
export type ObjectMap<T> = {
  id: string,
  object: T,
};

export async function getAllOrgs(): Promise<Array<Org>> {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const orgsRDB = await RDB.get(RDB.child(dbRef, "orgs"));
  const val = orgsRDB.val();
  const ret = toOrgArray(val);
  return ret;
}

export function observeOrgChanges(callback: (orgs: Array<Org>) => void) {
  //rdb
  const schoolsRef = RDB.ref(rdb, "orgs");
  RDB.onValue(schoolsRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toOrgArray(data);
    callback(ret);
  });
}

export function observeUserMessages(uid: string, callback: (Array<UserMessage>) => void) {
  const userMessagesRef = RDB.ref(rdb, "user_messages/" + uid);
  RDB.onValue(userMessagesRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export function observeUserChatMessages(
  uid: string,
  callback: (Array<UserChatMessage>) => void
): () => void {
  const userMessagesRef = RDB.ref(rdb, "user_chat_messages/" + uid);
  const unsubscribe = RDB.onValue(userMessagesRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
  return unsubscribe;
}

export async function updateOrCreateUser(uid: string, data: UserInfoUpdate): Promise<?string> {
  const dbRef = RDB.ref(rdb);
  const userRef = RDB.child(dbRef, "users/" + uid);
  const userSnapshot = await RDB.get(userRef);
  if (userSnapshot.exists()) {
    await RDB.update(userRef, data);
    const current: UserInfo = { ...userSnapshot.val() };
    return current.uid;
  } else {
    await RDB.set(userRef, data);
    return userRef.key;
  }
}

export async function updateUserAddToArrayField(
  uid: string,
  fieldName: string,
  value: string
): Promise<void> {
  const dbRef = RDB.ref(rdb);
  const userRef = RDB.child(dbRef, "users/" + uid);
  const userSnapshot = await RDB.get(userRef);
  const currentArray = userSnapshot.val()[fieldName] ?? [];
  const newArray = currentArray.concat(value);
  const update = {};
  update[fieldName] = newArray;
  await RDB.update(userRef, update);
}

export function observeUserChanges(uid: string, callback: (UserInfo) => void): () => void {
  //realtime-database
  const userRef = RDB.ref(rdb, "users/" + uid);
  const unsubscribe = RDB.onValue(userRef, (snapshot) => {
    const userInfo = snapshot.val();
    callback(userInfo);
  });
  return unsubscribe;
}

export async function getAllGroups(): Promise<Array<Group>> {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const groups = await RDB.get(RDB.child(dbRef, "groups"));

  const ret = toArray(groups.val());
  return ret;
}

export function observeAllGroupChanges(callback: (Array<Group>) => void) {
  //rdb
  const groupsRef = RDB.ref(rdb, "groups");
  const unsubscribe = RDB.onValue(groupsRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export async function getAllUsers(): Promise<Array<UserInfo>> {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const users = await RDB.get(RDB.child(dbRef, "users"));

  const ret = toArray(users.val() ?? []);
  //const ret = toArray(null);
  return ret;
}

export function observeAllUserChanges(callback: (Array<UserInfo>) => void) {
  //rdb
  const usersRef = RDB.ref(rdb, "users");
  RDB.onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
}

export async function getAllGroupMemberships(): Promise<Array<GroupMembership>> {
  /*real-time database */
  const dbRef = RDB.ref(rdb);
  const snapshot = await RDB.get(RDB.child(dbRef, "group_memberships"));
  const ret = toArray(snapshot.val());
  return ret;
}

function observeAllGroupMembershipChangesHelper(
  uid: string,
  callback: (Array<GroupMembership>) => void,
  userCallback: (result: Array<GroupMembership>) => void
): () => void {
  const ref = RDB.ref(rdb, "group_memberships");
  const unsubscribe = RDB.onValue(ref, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray<GroupMembership>(data);
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

  return unsubscribe;
}

export function observeAllGroupMembershipChanges(callback: (Array<GroupMembership>) => void) {
  let uid: string;
  let userCallback = null;
  if (observers["observeAllGroupChanges"] != null) {
    uid = nullthrows(observers["observeAllGroupChanges"]?.["uid"]);
    userCallback = nullthrows(observers["observeAllGroupChanges"]?.["userCallback"]);
    observeAllGroupMembershipChangesHelper(uid, callback, userCallback);
  }
}

export function observeUserGroupMemberships(
  uid: string,
  userCallback: (Array<GroupMembership>) => void
): () => void {
  let callback = null;
  callback = nullthrows(
    observers["observeAllGroupChanges"]?.["callback"],
    'DatabaseRDB.js: observers["observeAllGroupChanges"] is null'
  );
  return observeAllGroupMembershipChangesHelper(uid, callback, userCallback);
}

export function observeUserChatMemberships(
  uid: string,
  callback: (Array<ChatMembership>) => void
): () => void {
  const ref = RDB.ref(rdb, "chat_memberships/" + uid);
  const unsubscribe = RDB.onValue(ref, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
  return unsubscribe;
}

export function observeGroupMembershipRequests(
  groupId: string,
  callback: (Array<GroupMembershipRequest>) => void
): () => void {
  const ref = RDB.ref(rdb, "group_membership_requests/" + groupId);
  const unsubscribe = RDB.onValue(ref, (snapshot) => {
    const data = snapshot.val();
    const ret = toArray(data);
    callback(ret);
  });
  return unsubscribe;
}

export function observeGroupMessages(groupId: string, callback: (Array<Message>) => void) {}

export function observeChatMessages(chatId: string, callback: (Array<ChatMessage>) => void) {}

export function observeChat(chatId: string, callback: (Chat) => void) {
  //realtime-database
  const chatRef = RDB.ref(rdb, "chats/" + chatId);
  RDB.onValue(chatRef, (snapshot) => {
    const chat = snapshot.val();
    callback({ id: snapshot.key, ...chat });
  });
}

export async function createGroup(
  groupName: string,
  groupDescription: string,
  type: string,
  orgId: ?string
): Promise<string> {
  const newReference = await RDB.push(RDB.ref(rdb, "/groups"));
  await RDB.set(newReference, { name: groupName, description: groupDescription, type, orgId });
  return newReference.key;
}

export async function joinGroup(uid: string, groupId: string): Promise<string> {
  const newReference = await RDB.push(RDB.ref(rdb, "/group_memberships"));
  await RDB.set(newReference, { uid: uid, groupId });
  return newReference.key;
}

export async function createGroupMembershipRequest(
  userInfo: UserInfo,
  groupId: string
): Promise<?string> {
  const newReference = await RDB.push(RDB.ref(rdb, "/group_membership_requests/" + groupId));
  await RDB.set(newReference, { uid: userInfo.uid, groupId });
  return newReference.key;
}

export async function deleteGroupMembershipRequest(
  userInfo: UserInfo,
  groupId: string,
  groupMembershipRequestId: string
): Promise<void> {
  const docRef = RDB.ref(
    rdb,
    "/group_membership_requests/" + groupId + "/" + groupMembershipRequestId
  );
  await RDB.remove(docRef);
}

export async function updateGroupMembershipRequest(
  groupId: string,
  groupMembershipRequestId: string,
  update: { ... }
): Promise<void> {
  const docRef = RDB.ref(
    rdb,
    "/group_membership_requests/" + groupId + "/" + groupMembershipRequestId
  );
  await RDB.update(docRef, update);
}
export async function joinOrg(userInfo: UserInfo, orgId: string): Promise<string> {
  const newReference = await RDB.push(RDB.ref(rdb, "/org_memberships"));
  await RDB.set(newReference, { uid: userInfo.uid, orgId });
  return newReference.key;
}

export async function createChat(data: {
  organizerUid: string,
  participantIds: Array<string>,
}): Promise<string> {
  const newReference = await RDB.push(RDB.ref(rdb, "/chats"));
  await RDB.set(newReference, data);
  return newReference.key;
}

export async function joinChat(uid: string, chatId: string): Promise<?string> {
  const newReference = await RDB.push(RDB.ref(rdb, "/chat_memberships/" + uid));
  await RDB.set(newReference, { uid: uid, chatId });
  return newReference.key;
}

export async function createOrg(name: string, type: string): Promise<string> {
  const newReference = await RDB.push(RDB.ref(rdb, "/orgs"));
  await RDB.set(newReference, { name, type });
  return newReference.key;
}

export async function updateUserGroupMembership(userGroupMembershipId: string, updateObj) {
  const docRef = RDB.ref(rdb, "/group_memberships/" + userGroupMembershipId);
  await RDB.update(docRef, updateObj);
}

export async function updateUserMessage(uid, messageId: string, update: { ... }): Promise<void> {
  const docRef = RDB.ref(rdb, "/user_messages/" + uid + "/" + messageId);
  await RDB.update(docRef, update);
}

export async function updateUserChatMessage(
  uid: string,
  chatMessageId: string,
  update: UserChatMessageUpdate
) {
  const docRef = RDB.ref(rdb, "/user_chat_messages/" + uid + "/" + chatMessageId);
  await RDB.update(docRef, update);
}

export async function updateGroup(groupId: string, update: GroupUpdate) {
  const docRef = RDB.ref(rdb, "/groups/" + groupId);
  await RDB.update(docRef, update);
}

export async function updateUser(uid: string, update: { ... }) {
  const docRef = RDB.ref(rdb, "/users/" + uid);
  await RDB.update(docRef, update);
}

export async function deleteGroupMembership(groupMembershipId: string): Promise<void> {
  Logger.log("deleting group membership: " + groupMembershipId);
  const docRef = RDB.ref(rdb, "/group_memberships/" + groupMembershipId);
  await RDB.remove(docRef);
}

export async function deleteGroup(groupId: string): Promise<void> {
  const docRef = RDB.ref(rdb, "/groups/" + groupId);
  await RDB.remove(docRef);
}

export async function deleteUser(uid: string): Promise<void> {
  const docRef = RDB.ref(rdb, "/users/" + uid);
  await RDB.remove(docRef);
}

export async function logError(error: { stack: string }, info: string): Promise<?string> {
  Logger.log("loggin error to rdb: " + JSON.stringify(error));
  const newReference = await RDB.push(RDB.ref(rdb, "/errors"));
  await RDB.set(newReference, { error: error.toString(), stack: error.stack });
  Logger.log("done logging error to rdb: " + JSON.stringify(error));
  return newReference.key;
}

function toArray<T>(idMap: { [key: string]: { ... } }): Array<T> {
  const array: Array<T> = [];
  if (idMap == null) {
    return array;
  }
  for (const [key, value] of Object.entries(idMap)) {
    const castValue = (value: T);
    array.push({ id: key, ...value });
  }
  return array;
}

function toOrgArray(idMap: { [key: string]: { ... } }): Array<Org> {
  const array: Array<Org> = [];
  if (idMap == null) {
    return array;
  }
  for (const [key, value] of Object.entries(idMap)) {
    array.push({ id: key, ...value });
  }
  return array;
}
