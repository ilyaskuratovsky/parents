import * as DatabaseRDB from "./DatabaseRDB";
import * as DatabaseFS from "./DatabaseFS";

export async function getAllOrgs() {
  return DatabaseRDB.getAllOrgs();
}

export function observeOrgChanges(callback) {
  return DatabaseRDB.observeOrgChanges(callback);
}

export function observeUserMessages(uid, callback) {
  return DatabaseRDB.observeUserMessages(uid, callback);
}

export async function updateOrCreateUser(uid, data) {
  return DatabaseRDB.updateOrCreateUser(uid, data);
}

export async function updateUserAddToArrayField(uid, fieldName, value) {
  return DatabaseRDB.updateUserAddToArrayField(uid, fieldName, value);
}

export function observeUserChanges(uid, callback) {
  return DatabaseRDB.observeUserChanges(uid, callback);
}

export async function getAllGroups() {
  return DatabaseRDB.getAllGroups();
}

export function observeAllGroupChanges(callback) {
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

export function observeGroupMessages(groupId, callback) {
  return DatabaseFS.observeGroupMessages(groupId, callback);
}

export async function joinGroup(userInfo, groupId) {
  return DatabaseRDB.joinGroup(userInfo, groupId);
}

export async function createGroup(data) {
  return DatabaseRDB.createGroup(data);
}

export async function updateGroup(groupId, data) {
  return DatabaseRDB.updateGroup(groupId, data);
}

export async function sendMessage(groupId, uid, title, text, data, papaId, notificationInfo) {
  return DatabaseFS.sendMessage(groupId, uid, title, text, data, papaId, notificationInfo);
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

export async function observeToUserInvites(toUid, toEmail, callback) {
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

export async function updateUser(userId, update) {
  DatabaseRDB.updateUser(userId, update);
}

export async function logError(error, info) {
  DatabaseRDB.logError(error, info);
}
