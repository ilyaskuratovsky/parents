import { useSelector } from "react-redux";
import * as MessageUtils from "../common/MessageUtils";
import { useEffect, useMemo } from "react";
import * as Controller from "../common/Controller";

export function getCurrentUser() {
  const user = useSelector((state) => state.main.userInfo);
  return user;
}
export function getUsers(uids) {
  const userMap = useSelector((state) => state.main.userMap);
  const users = [];
  uids.forEach((uid) => {
    users.push(userMap[uid]);
  });
  return users;
}

export function getMessage(messageId) {
  let { message } = useSelector((state) => {
    return {
      message: state.main.messages[messageId],
    };
  });
  return message;
}
export function getAllUsers() {
  const { users } = useSelector((state) => {
    return {
      users: state.main.userList,
    };
  });
  return users;
}
export function getAllOrgs() {
  const { orgsList } = useSelector((state) => {
    return {
      orgsList: state.main.orgsList,
    };
  });
  return orgsList;
}

export function getAllOrgsMap() {
  const { orgsMap } = useSelector((state) => {
    return {
      orgsMap: state.main.orgsMap,
    };
  });
  return orgsMap;
}

export function getOrgGroups(orgId) {
  const { groupList } = useSelector((state) => {
    return {
      groupList: state.main.groupList,
    };
  });
  return groupList.filter((group) => group.orgId === orgId);
}

export function getSubGroups(groupId) {
  const { groupList } = useSelector((state) => {
    return {
      groupList: state.main.groupList,
    };
  });
  return groupList.filter((group) => group.parentGroupId === groupId);
}

export function getOrgGroup(orgId) {
  const { groupList } = useSelector((state) => {
    return {
      groupList: state.main.groupList,
    };
  });
  return single(
    groupList.filter((group) => group.orgId === orgId && group.type === "default_org_group")
  );
}

export function getAllOrgGroups() {
  const { groupList } = useSelector((state) => {
    return {
      groupList: state.main.groupList,
    };
  });
  const orgGroupList = groupList.filter(
    (group) => group.orgId != null && group.type === "default_org_group"
  );
  return orgGroupList;
}

export function getAllGroups() {
  const { groupList } = useSelector((state) => {
    return {
      groupList: state.main.groupList,
    };
  });
  return groupList;
}

export function getAllOrgGroupMap() {
  const { groupList } = useSelector((state) => {
    return {
      groupList: state.main.groupList,
    };
  });
  const orgGroupList = groupList.filter((group) => group.orgId != null);
  const orgMap = orgGroupList.reduce((map, group) => {
    const orgId = group.orgId;
    const val = map[orgId];
    if (val != null) {
      map[orgId] = [...val, group];
    } else {
      map[orgId] = [group];
    }
  }, {});
  return orgMap;
}

export function getGroupMemberships(groupId) {
  const group = getGroup(groupId);
  const { groupMemberships } = useSelector((state) => {
    return {
      groupMemberships: state.main.groupMembershipMap[groupId],
    };
  });

  return groupMemberships;
}

export function getUserChatMemberships() {
  const { userChatMemberships } = useSelector((state) => {
    return {
      userChatMemberships: state.main.userChatMemberships,
    };
  });

  return userChatMemberships;
}

export function getRootMessageWithChildrenAndUserStatus(messageId) {
  const message = getMessage(messageId);
  const groupId = message.groupId;
  const { messages, groupMap, userMessagesMap, userMap } = useSelector((state) => {
    return {
      groupMap: state.main.groupMap,
      messages: state.main.groupMessages[groupId] ?? [],
      userMessagesMap: state.main.userMessagesMap,
      userMap: state.main.userMap,
    };
  });
  const user = useSelector((state) => state.main.userInfo);
  return useMemo(() => {
    const result = MessageUtils.buildRootMessageWithChildren(
      messageId,
      messages,
      user,
      userMessagesMap,
      null,
      groupMap,
      userMap
    );
    return result;
  }, [messageId, messages, user, userMessagesMap, groupMap, userMap]);
}

export function getGroupUserRootMessages(groupId) {
  const user = getCurrentUser();
  const { groupMessages, userMessagesMap, groupMap, userMap } = useSelector((state) => {
    return {
      groupMessages: state.main.groupMessages[groupId],
      userMessagesMap: state.main.userMessagesMap,
      groupMap: state.main.groupMap,
      userMap: state.main.userMap,
    };
  });

  return useMemo(() => {
    if (groupMessages != null) {
      return MessageUtils.buildRootMessagesWithChildren(
        groupMessages,
        user,
        userMessagesMap,
        null,
        groupMap,
        userMap
      );
    } else {
      return [];
    }
  }, [groupMessages, user, userMessagesMap, groupMap, userMap]);
}

export function getChatUserMessages(chatId) {
  const user = getCurrentUser();
  const { chatMessages, userChatMessagesMap, userMap } = useSelector((state) => {
    return {
      chatMessages: chatId != null ? state.main.chatMessages[chatId] : [],
      userChatMessagesMap: state.main.userChatMessagesMap,
      userMap: state.main.userMap,
    };
  });

  return useMemo(() => {
    if (chatMessages != null) {
      const userChatMessages = [];
      chatMessages.forEach((message) => {
        const userChatMessage = userChatMessagesMap[message.id];
        userChatMessages.push({
          ...message,
          userStatus: {
            status: userChatMessage?.status,
          },
          user: {
            ...userMap[message.uid],
          },
        });
      });
      return userChatMessages;
    } else {
      return [];
    }
  }, [chatMessages, userChatMessagesMap]);
}

export function getGroupUserRootUnreadMessages(groupId) {
  const userGroupRootMessages = getGroupUserRootMessages(groupId);
  const unread = useMemo(
    () => MessageUtils.calculateUnreadMessages(userGroupRootMessages),
    [userGroupRootMessages]
  );
  return unread;
}

export function getChatUserUnreadMessages(chatId) {
  const userChatMessages = getChatUserMessages(chatId);
  const unread = useMemo(
    () => MessageUtils.calculateUnreadChatMessages(userChatMessages),
    [userChatMessages]
  );
  return unread;
}

export function getGroupUserRootMessageUnreadCount(groupId) {
  const userGroupRootMessages = getGroupUserRootMessages(groupId);
  const unread = useMemo(
    () => MessageUtils.calculateUnreadMessages(userGroupRootMessages),
    [userGroupRootMessages]
  );
  return unread.length;
}

export function getGroup(groupId) {
  const { group } = useSelector((state) => {
    return {
      group: state.main.groupMap[groupId],
    };
  });
  return group;
}

export function getOrg(orgId) {
  const { orgsMap } = useSelector((state) => {
    return {
      orgsMap: state.main.orgsMap,
    };
  });

  const org = orgsMap[orgId];
  return org;
}

export function getChat(chatId) {
  const { chat } = useSelector((state) => {
    return {
      chat: state.main.chatMap[chatId],
    };
  });
  return chat;
}

export function getSuperPublicGroups(groupId) {
  const { groups } = useSelector((state) => {
    return {
      groups: state.main.groupList,
    };
  });
  return groups.filter((group) => group.type === "super_public");
}

export function getGroupUnreadMessages(groupId) {
  const { groupMessages, userMessagesMap } = useSelector((state) => {
    return {
      groupMessages: state.main.groupMessages[groupId] ?? [],
      userMessagesMap: state.main.userMessagesMap,
    };
  });

  return MessageUtils.filterUnreadMessages(groupMessages, userMessagesMap);
}

export function getUserGroupMemberships() {
  const user = getCurrentUser();
  const { userGroupMemberships } = useSelector((state) => {
    return {
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  return userGroupMemberships;
}

export function getUserGroupMembership(groupId) {
  const user = getCurrentUser();
  const { userGroupMemberships } = useSelector((state) => {
    return {
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  const arr = userGroupMemberships.filter((m) => m.groupId === groupId);
  return arr.length == 1 ? arr[0] : null;
}

export function getUserUnreadMessageCount() {
  const allUserRootMessages = getAllUserRootMessages();
  const unreadMessages = MessageUtils.calculateUnreadMessages(allUserRootMessages);
  return unreadMessages.length;
}

export function getUserUnreadChatMessageCount() {
  const allChatMessages = getAllUserChatMessages();
  const unreadMessages = MessageUtils.calculateUnreadChatMessages(allChatMessages);
  return unreadMessages.length;
}

export function getAllUserRootMessages() {
  const user = getCurrentUser();
  const { groupMessagesMap, userMessagesMap, groupMap, userMap } = useSelector((state) => {
    return {
      groupMessagesMap: state.main.groupMessages,
      userMessagesMap: state.main.userMessagesMap,
      groupMap: state.main.groupMap,
      userMap: state.main.userMap,
    };
  });
  return useMemo(() => {
    let allMessages = [];
    for (let groupId in groupMessagesMap) {
      const groupMessages = groupMessagesMap[groupId];
      if (groupMessages != null && groupMessages.length > 0) {
        allMessages = allMessages.concat(groupMessages);
      }
    }
    if (allMessages.length > 0) {
      /*
      export function buildRootMessagesWithChildren(
        messages,
        userInfo,
        userMessagesMap,
        groupMembers,
        groupMap,
        userMap
      */
      return MessageUtils.buildRootMessagesWithChildren(
        allMessages,
        user,
        userMessagesMap,
        null,
        groupMap,
        userMap
      );
    }
    return [];
  }, [groupMessagesMap, user, userMessagesMap]);
}

export function getAllUserChatMessages() {
  const user = getCurrentUser();
  const { chatMessages, userChatMessagesMap, userMap } = useSelector((state) => {
    return {
      chatMessages: Object.values(state.main.chatMessages).flat(),
      userChatMessagesMap: state.main.userChatMessagesMap,
      userMap: state.main.userMap,
    };
  });

  return useMemo(() => {
    if (chatMessages != null) {
      const userChatMessages = [];
      chatMessages.forEach((message) => {
        const userChatMessage = userChatMessagesMap[message.id];
        userChatMessages.push({
          ...message,
          userStatus: {
            status: userChatMessage?.status,
          },
          user: {
            ...userMap[message.uid],
          },
        });
      });
      return userChatMessages;
    } else {
      return [];
    }
  }, [chatMessages, userChatMessagesMap, userMap]);
  /*
  const { groupMessagesMap, userMessagesMap, groupMap, userMap } = useSelector((state) => {
    return {
      groupMessagesMap: state.main.groupMessages,
      userMessagesMap: state.main.userMessagesMap,
      groupMap: state.main.groupMap,
      userMap: state.main.userMap,
    };
  });
  return useMemo(() => {
    let allMessages = [];
    for (groupId in groupMessagesMap) {
      const groupMessages = groupMessagesMap[groupId];
      if (groupMessages != null && groupMessages.length > 0) {
        allMessages = allMessages.concat(groupMessages);
      }
    }
    if (allMessages.length > 0) {
      return MessageUtils.buildRootMessagesWithChildren(
        allMessages,
        user,
        userMessagesMap,
        null,
        groupMap,
        userMap
      );
    }
    return [];
  }, [groupMessagesMap, user, userMessagesMap]);
  */
}

export function useMarkRead(message) {
  const user = getCurrentUser();
  return useEffect(async () => {
    let markRead = [];
    if (message.userStatus?.status != "read") {
      markRead.push(message.id);
    }
    const unreadChildMessages = (message.children ?? []).filter((m) => m.status != "read");
    markRead = markRead.concat(unreadChildMessages.map((m) => m.id));
    Controller.markMessagesRead(user, markRead);
  }, [message]);
}

export function useMarkChatMessagesRead(chatMessages) {
  const user = getCurrentUser();
  return useEffect(async () => {
    Controller.markChatMessagesRead(
      user,
      chatMessages.map((m) => m.id)
    );
  }, []);
}

export function getDefaultOrgGroup(orgId) {
  const { orgsList, orgsMap, groupList, groupMap, userGroupMemberships } = useSelector((state) => {
    return {
      orgsList: state.main.orgsList,
      orgsMap: state.main.orgsMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  const defaultOrgGroup = groupList.filter((group) => {
    return group.orgId == orgId && group.type === "default_org_group";
  });
  return single(defaultOrgGroup);
}

function single(list) {
  if (list != null && list.length > 0) {
    return list[list.length - 1];
  } else {
    return null;
  }
}
