import * as DatabaseRDB from "./DatabaseRDB";
import * as DatabaseFS from "./DatabaseFS";

export async function getAllOrgs() {
  return DatabaseRDB.getAllOrgs();
}

export function observeOrgChanges(callback) {
  return DatabaseRDB.observeOrgChanges(callback);
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

export async function sendMessage(groupId, uid, text) {
  return DatabaseFS.sendMessage(groupId, uid, text);
}

export async function createOrg(name, type) {
  return DatabaseRDB.createOrg(name, type);
}

export async function createInvite(fromUid, groupId, uid, email) {
  return DatabaseFS.createInvite(fromUid, groupId, uid, email);
}

export async function observeToUserInvites(toUid, toEmail, callback) {
  return DatabaseFS.observeToUserInvites(toUid, toEmail, callback);
}

export async function updateInvite(inviteId, update) {
  DatabaseFS.updateInvite(inviteId, update);
}
