// @flow strict-local

import * as DatabaseRDB from "./DatabaseRDB";
import * as DatabaseFS from "./DatabaseFS";
import type { AnyDateType } from "./Date";

export type UserInfo = {
  uid: string,
  displayName: ?string,
  firstName: ?string,
  lastName: ?string,
  email: ?string,
  image: ?string,
  superUser: ?boolean,
  profileInitialized: ?boolean,
  ...
};

export type UserInfoUpdate = {
  uid?: string,
  displayName?: ?string,
  firstName?: ?string,
  lastName?: ?string,
  email?: ?string,
  image?: ?string,
  superUser?: ?boolean,
  profileInitialized?: ?boolean,
  ...
};

export type Group = {
  id: string,
  type: string,
  name: string,
  description: ?string,
  parentGroupId: ?string,
  orgId: ?string,
  ...
};

export type GroupUpdate = {
  type?: string,
  name?: string,
  description?: ?string,
  parentGroupId?: ?string,
  orgId?: ?string,
  ...
};

export type Org = {
  id: string,
  name: string,
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
  event: ?MessageEvent,
  eventResponse: ?string,
  event_poll: ?MessageEventPoll,
  poll: ?Array<{ name: string, message: string }>,
  poll_response: ?{ ... },
  ...
};

export type MessageEvent = {
  start: AnyDateType,
  end: AnyDateType,
};

export type MessageEventPoll = { ... };

export type MessageEventResponse = {
  status: ?string,
};

export type UserMessage = {
  id: string,
  status: string,
  ...
};

export type UserMessageUpdate = {
  status?: string,
  ...
};

export type GroupMembership = {
  id: string,
  uid: string,
  groupId: string,
  lastViewedMessageTimestamp: number,
  ...
};

export type GroupMembershipUpdate = {
  uid?: string,
  groupId?: string,
  lastViewedMessageTimestamp?: number,
  ...
};

export type Chat = {
  id: string,
  ...
};

export type ChatMessage = {
  id: string,
  participants: Array<string>,
  ...
};

export type UserChatMessage = {
  id: string,
  status: string,
  ...
};

export type UserChatMessageUpdate = {
  status?: string,
  ...
};

export type ChatMembership = {
  id: string,
  chatId: string,
  ...
};

export type UserInvite = {
  id: string,
  status: ?string,
  ...
};

export type UserInviteUpdate = {
  status?: ?string,
  ...
};

export type GroupMembershipRequest = {
  id: string,
  uid: string,
  groupId: string,
  ...
};

export type NotificationInfo = {
  groupName: ?string,
  fromName: ?string,
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

/*
export async function getGroupMessages(groupId: string): Promise<Array<Message>> {
  const groupMessages = await DatabaseFS.getGroupMessages(groupId);
  return groupMessages;
}
*/

export function observeOrgChanges(callback: (snapshot: Array<Org>) => void): void {
  return DatabaseRDB.observeOrgChanges(callback);
}

export function observeUserMessages(
  uid: string,
  callback: (snapshot: Array<UserMessage>) => void
): void {
  return DatabaseRDB.observeUserMessages(uid, callback);
}

export function observeUserChatMessages(
  uid: string,
  callback: (snapshot: Array<UserChatMessage>) => void
): () => void {
  return DatabaseRDB.observeUserChatMessages(uid, callback);
}

export async function updateOrCreateUser(uid: string, data: UserInfoUpdate): Promise<UserInfo> {
  return DatabaseRDB.updateOrCreateUser(uid, data);
}

export async function updateUserAddToArrayField(
  uid: string,
  fieldName: string,
  value: string
): Promise<void> {
  return DatabaseRDB.updateUserAddToArrayField(uid, fieldName, value);
}

export function observeUserChanges(uid: string, callback: (UserInfo) => void): () => void {
  return DatabaseRDB.observeUserChanges(uid, callback);
}

export async function getAllGroups(): Promise<Array<Group>> {
  return DatabaseRDB.getAllGroups();
}

export function observeAllGroupChanges(callback: (Array<Group>) => void): void {
  return DatabaseRDB.observeAllGroupChanges(callback);
}

export async function getAllUsers(): Promise<Array<UserInfo>> {
  return DatabaseRDB.getAllUsers();
}

export function observeAllUserChanges(callback: (Array<UserInfo>) => void): void {
  return DatabaseRDB.observeAllUserChanges(callback);
}

export async function getAllGroupMemberships(): Promise<Array<GroupMembership>> {
  return DatabaseRDB.getAllGroupMemberships();
}

export function observeAllGroupMembershipChanges(callback: (Array<GroupMembership>) => void): void {
  return DatabaseRDB.observeAllGroupMembershipChanges(callback);
}

export function observeUserGroupMemberships(
  uid: string,
  callback: (Array<GroupMembership>) => void
): () => void {
  return DatabaseRDB.observeUserGroupMemberships(uid, callback);
}

export function observeGroupMembershipRequests(
  groupId: string,
  callback: (Array<GroupMembershipRequest>) => void
): () => void {
  return DatabaseRDB.observeGroupMembershipRequests(groupId, callback);
}

export function observeUserChatMemberships(
  uid: string,
  callback: (Array<ChatMembership>) => void
): () => void {
  return DatabaseRDB.observeUserChatMemberships(uid, callback);
}

export function observeGroupMessages(
  groupId: string,
  callback: (Array<Message>) => void
): () => void {
  return DatabaseFS.observeGroupMessages(groupId, callback);
}

export function observeChatMessages(chatId: string, callback: (Array<ChatMessage>) => void) {
  DatabaseFS.observeChatMessages(chatId, callback);
}

export function observeChat(chatId: string, callback: (Chat) => void) {
  DatabaseRDB.observeChat(chatId, callback);
}

export async function joinGroup(uid: string, groupId: string): Promise<string> {
  return DatabaseRDB.joinGroup(uid, groupId);
}

export async function createGroupMembershipRequest(
  userInfo: UserInfo,
  groupId: string
): Promise<?string> {
  return DatabaseRDB.createGroupMembershipRequest(userInfo, groupId);
}

export async function deleteGroupMembershipRequest(
  userInfo: UserInfo,
  groupId: string,
  groupMembershipRequestId: string
): Promise<void> {
  return DatabaseRDB.deleteGroupMembershipRequest(userInfo, groupId, groupMembershipRequestId);
}

export async function updateGroupMembershipRequest(
  groupId: string,
  groupMembershipRequestId: string,
  update: { ... }
): Promise<void> {
  return DatabaseRDB.updateGroupMembershipRequest(groupId, groupMembershipRequestId, update);
}

export async function joinOrg(userInfo: UserInfo, orgId: string): Promise<string> {
  return DatabaseRDB.joinOrg(userInfo, orgId);
}

export async function joinChat(uid: string, chatId: string): Promise<?string> {
  return DatabaseRDB.joinChat(uid, chatId);
}

export async function createGroup(
  groupName: string,
  groupDescription: string,
  type: string,
  orgId: ?string
): Promise<string> {
  return DatabaseRDB.createGroup(groupName, groupDescription, type, orgId);
}

export async function createChat(data: {
  organizerUid: string,
  participantIds: Array<string>,
}): Promise<string> {
  return DatabaseRDB.createChat(data);
}

export async function updateGroup(groupId: string, data: GroupUpdate): Promise<void> {
  return DatabaseRDB.updateGroup(groupId, data);
}

export async function sendMessage(
  groupId: string,
  uid: string,
  title: ?string,
  text: ?string,
  data: ?{ ... },
  papaId: ?string,
  notificationInfo: ?NotificationInfo
): Promise<string> {
  return DatabaseFS.sendMessage(groupId, uid, title, text, data, papaId, notificationInfo);
}

export async function sendChatMessage(
  chatId: string,
  uid: string,
  text: string,
  data: ?{ ... },
  papaId: ?string,
  notificationInfo: ?NotificationInfo
): Promise<string> {
  return DatabaseFS.sendChatMessage(chatId, uid, text, data, papaId, notificationInfo);
}

export async function createOrg(name: string, type: string): Promise<string> {
  return DatabaseRDB.createOrg(name, type);
}

export async function createInvite(
  fromUid: string,
  groupId: string,
  uid: ?string,
  email: ?string
): Promise<void> {
  return DatabaseFS.createInvite(fromUid, groupId, uid, email);
}

export async function createEvent(
  uid: string,
  groupId: string,
  title: string,
  text: string,
  startDate: string,
  endDate: string
): Promise<string> {
  return DatabaseFS.createEvent(uid, groupId, title, text, startDate, endDate);
}

export function observeToUserInvites(
  toUid: string,
  toEmail: string,
  callback: (Array<UserInvite>) => void
): () => void {
  return DatabaseFS.observeToUserInvites(toUid, toEmail, callback);
}

export function observeFromUserInvites(
  toUid: string,
  callback: (Array<UserInvite>) => void
): () => void {
  return DatabaseFS.observeFromUserInvites(toUid, callback);
}

export async function updateInvite(inviteId: string, update: UserInviteUpdate): Promise<void> {
  DatabaseFS.updateInvite(inviteId, update);
}

export async function updateUserGroupMembership(
  userGroupMembershipId: string,
  update: GroupMembershipUpdate
): Promise<void> {
  DatabaseRDB.updateUserGroupMembership(userGroupMembershipId, update);
}

export async function updateUserMessage(uid: string, messageId: string, update: UserMessageUpdate) {
  DatabaseRDB.updateUserMessage(uid, messageId, update);
}

export async function updateUserChatMessage(
  uid: string,
  chatMessageId: string,
  update: UserChatMessageUpdate
) {
  DatabaseRDB.updateUserChatMessage(uid, chatMessageId, update);
}

export async function updateUser(userId: string, update: UserInfoUpdate): Promise<void> {
  DatabaseRDB.updateUser(userId, update);
}

export async function deleteGroupMembership(groupMembershipId: string): Promise<void> {
  DatabaseRDB.deleteGroupMembership(groupMembershipId);
}

export async function deleteUser(uid: string) {
  DatabaseRDB.deleteUser(uid);
}

export async function deleteGroup(groupId: string) {
  DatabaseRDB.deleteGroup(groupId);
}

export async function logError(error: { stack: string }, info: string): Promise<void> {
  DatabaseRDB.logError(error, info);
}

function single<T>(list: Array<T>): ?T {
  if (list != null && list.length === 1) {
    return list[0];
  } else {
    return null;
  }
}
