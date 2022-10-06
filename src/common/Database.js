// @flow strict-local

import * as DatabaseRDB from "./DatabaseRDB";
import * as DatabaseFS from "./DatabaseFS";

export type UserInfo = {
  uid: string,
  displayName: ?string,
  firstName: ?string,
  lastName: ?string,
  email: ?string,
  image: ?string,
  superUser: ?boolean,
  ...
};

export type Group = {
  id: string,
  type: string,
  name: string,
  description: ?string,
  parentGroupId: ?string,
  ...
};

export type Org = {
  id: string,
  ...
};

export type Message = {
  id: string,
  title: ?string,
  text: ?string,
  attachments: ?Array<{ uri: string }>,
  groupId: string,
  timestamp: number,
  papaId: string,
  uid: string,
  //poll: { ... },
  ...
};

export type UserMessage = {
  id: string,
  status: string,
  ...
};

export type GroupMembership = {
  id: string,
  uid: string,
  groupId: string,
  ...
};

export type Chat = {
  id: string,
  ...
};

export type ChatMessage = {
  id: string,
  ...
};

export type UserChatMessage = {
  id: string,
  userStatus: {
    status: string,
  },
  ...
};

export type ChatMembership = {
  id: string,
  ...
};

export type UserInvite = {
  id: string,
  ...
};

export type GroupMembershipRequest = {
  id: string,
  ...
};

export async function getAllOrgs(): Promise<Array<Org>> {
  return DatabaseRDB.getAllOrgs();
}

export async function getOrg(orgId: string): Promise<?Org> {
  const allOrgs = await DatabaseRDB.getAllOrgs();
  return single(allOrgs.filter((org) => org.id == orgId));
}

export async function getGroup(groupId: string): Promise<?Group> {
  const allGroups = await DatabaseRDB.getAllGroups();
  return single(allGroups.filter((group) => group.id == groupId));
}

export async function getGroupMessages(groupId: string): Promise<Array<Message>> {
  const groupMessages = await DatabaseFS.getGroupMessages(groupId);
  return groupMessages;
}

export function observeOrgChanges(callback: (snapshot) => void) {
  return DatabaseRDB.observeOrgChanges(callback);
}

export function observeUserMessages(uid, callback) {
  return DatabaseRDB.observeUserMessages(uid, callback);
}

export function observeUserChatMessages(uid, callback) {
  return DatabaseRDB.observeUserChatMessages(uid, callback);
}

export async function updateOrCreateUser(uid: string, data: UserInfo): Promise<UserInfo> {
  return DatabaseRDB.updateOrCreateUser(uid, data);
}

export async function updateUserAddToArrayField(uid, fieldName, value) {
  return DatabaseRDB.updateUserAddToArrayField(uid, fieldName, value);
}

export function observeUserChanges(uid, callback: (UserInfo) => void) {
  return DatabaseRDB.observeUserChanges(uid, callback);
}

export async function getAllGroups() {
  return DatabaseRDB.getAllGroups();
}

export function observeAllGroupChanges(callback: (Array<Group>) => void) {
  return DatabaseRDB.observeAllGroupChanges(callback);
}

export async function getAllUsers() {
  return DatabaseRDB.getAllUsers();
}

export function observeAllUserChanges(callback) {
  return DatabaseRDB.observeAllUserChanges(callback);
}

export async function getAllGroupMemberships() {
  return DatabaseRDB.getAllGroupMemberships();
}

export function observeAllGroupMembershipChanges(callback) {
  return DatabaseRDB.observeAllGroupMembershipChanges(callback);
}

export function observeUserGroupMemberships(uid, callback) {
  return DatabaseRDB.observeUserGroupMemberships(uid, callback);
}

export function observeGroupMembershipRequests(groupId, callback) {
  return DatabaseRDB.observeGroupMembershipRequests(groupId, callback);
}

export function observeUserChatMemberships(uid, callback) {
  return DatabaseRDB.observeUserChatMemberships(uid, callback);
}

export function observeGroupMessages(groupId, callback) {
  return DatabaseFS.observeGroupMessages(groupId, callback);
}

export function observeChatMessages(chatId, callback) {
  DatabaseFS.observeChatMessages(chatId, callback);
}

export function observeChat(chatId, callback) {
  DatabaseRDB.observeChat(chatId, callback);
}

export async function joinGroup(uid: string, groupId: string): Promise<string> {
  return DatabaseRDB.joinGroup(uid, groupId);
}

export async function createGroupMembershipRequest(userInfo, groupId) {
  return DatabaseRDB.createGroupMembershipRequest(userInfo, groupId);
}

export async function deleteGroupMembershipRequest(userInfo, groupId, groupMembershipRequestId) {
  return DatabaseRDB.deleteGroupMembershipRequest(userInfo, groupId, groupMembershipRequestId);
}

export async function updateGroupMembershipRequest(groupId, groupMembershipRequestId, update) {
  return DatabaseRDB.updateGroupMembershipRequest(groupId, groupMembershipRequestId, update);
}

export async function joinOrg(userInfo, orgId) {
  return DatabaseRDB.joinOrg(userInfo, orgId);
}

export async function joinChat(uid, chatId) {
  return DatabaseRDB.joinChat(uid, chatId);
}

export async function createGroup(data) {
  return DatabaseRDB.createGroup(data);
}

export async function createChat(data) {
  return DatabaseRDB.createChat(data);
}

export async function updateGroup(groupId, data) {
  return DatabaseRDB.updateGroup(groupId, data);
}

export async function sendMessage(groupId, uid, title, text, data, papaId, notificationInfo) {
  return DatabaseFS.sendMessage(groupId, uid, title, text, data, papaId, notificationInfo);
}

export async function sendChatMessage(chatId, uid, text, data, papaId, notificationInfo) {
  return DatabaseFS.sendChatMessage(chatId, uid, text, data, papaId, notificationInfo);
}

export async function createOrg(name, type) {
  return DatabaseRDB.createOrg(name, type);
}

export async function createInvite(fromUid, groupId, uid, email) {
  return DatabaseFS.createInvite(fromUid, groupId, uid, email);
}

export async function createEvent(uid, groupId, title, text, startDate, endDate) {
  return DatabaseFS.createEvent(uid, groupId, title, text, startDate, endDate);
}

export function observeToUserInvites(toUid, toEmail, callback) {
  return DatabaseFS.observeToUserInvites(toUid, toEmail, callback);
}

export async function observeFromUserInvites(toUid, callback) {
  return DatabaseFS.observeFromUserInvites(toUid, callback);
}

export async function updateInvite(inviteId, update) {
  DatabaseFS.updateInvite(inviteId, update);
}

export async function updateUserGroupMembership(userGroupMembershipId, update) {
  DatabaseRDB.updateUserGroupMembership(userGroupMembershipId, update);
}

export async function updateUserMessage(uid, messageId, update) {
  DatabaseRDB.updateUserMessage(uid, messageId, update);
}

export async function updateUserChatMessage(uid, chatMessageId, update) {
  DatabaseRDB.updateUserChatMessage(uid, chatMessageId, update);
}

export async function updateUser(userId, update) {
  DatabaseRDB.updateUser(userId, update);
}

export async function deleteGroupMembership(groupMembershipId) {
  DatabaseRDB.deleteGroupMembership(groupMembershipId);
}

export async function deleteUser(uid) {
  DatabaseRDB.deleteUser(uid);
}

export async function deleteGroup(groupId) {
  DatabaseRDB.deleteGroup(groupId);
}

export async function logError(error, info) {
  DatabaseRDB.logError(error, info);
}

function single<T>(list: Array<T>): ?T {
  if (list != null && list.length === 1) {
    return list[0];
  } else {
    return null;
  }
}
