import { useSelector } from "react-redux";
import * as MessageUtils from "./MessageUtils";
import { useEffect, useMemo } from "react";
import * as Controller from "./Controller";
import { ROOT_GROUP_ID } from "../../config/firebase";
import * as RD from "./RemoteData";
import { RemoteData, uninitialized, loading, data, isLoading} from "./RemoteData";
import {Group, GroupMembership, Org, RootState} from "./Actions";
import { Message } from "./MessageUtils";

export function getCurrentUser() {
  const user = useSelector((state: RootState) => state.main.userInfo);
  return user;
}
export function getUsers(uids: Array<string>): Array<Record<string, Object>> {
  const userMap = useSelector((state: RootState) => state.main.userMap);
  const users = [] as Array<Record<string, Object>>;
  if (userMap == null) {
    return [];
  }
  uids.forEach((uid) => {
    const user = userMap[uid];
    users.push(user);
  });
  return users;
}

export function getUser(uid: string) {
  const userMap = useSelector((state: RootState) => state.main.userMap) ?? {};
  return userMap[uid];
}

export function getMessage(messageId: string) {
  let { messagesMap } = useSelector((state: RootState) => {
    return {
      messagesMap: state.main.messagesMap,
    };
  });
  return messagesMap != null ? messagesMap[messageId] : null;
}
export function getAllUsers() {
  const { users } = useSelector((state: RootState) => {
    return {
      users: state.main.userList,
    };
  });
  return users;
}
export function getAllOrgs() {
  const { orgsList } = useSelector((state: RootState) => {
    return {
      orgsList: state.main.orgsList,
    };
  });
  return orgsList;
}

export function getAllOrgsMap(): Record<string, Org> | null {
  const { orgsMap } = useSelector((state: RootState) => {
    return {
      orgsMap: state.main.orgsMap,
    };
  });
  return orgsMap;
}

export function getAllGroupsMap() {
  const { groupMap } = useSelector((state: RootState) => {
    return {
      groupMap: state.main.groupMap,
    };
  });
  return groupMap;
}

export function getOrgGroups(orgId: string): Array<Group> {
  const { groupList } = useSelector((state: RootState) => {
    return {
      groupList: state.main.groupList,
    };
  });

  if (groupList == null) {
    return [];
  }

  return groupList.filter((group) => group['orgId'] === orgId);
}

export function getSubGroups(groupId: string): Array<Group> {
  const { groupList } = useSelector((state: RootState) => {
    return {
      groupList: state.main.groupList,
    };
  });

  if(groupList == null) {
    return [];
  }
  return groupList.filter((group) => group['parentGroupId'] === groupId);
}

export function getOrgGroup(orgId: string): Group | null {
  const { groupList } = useSelector((state: RootState) => {
    return {
      groupList: state.main.groupList,
    };
  });

  if (groupList == null) {
    return null;
  }
  return single(
    groupList.filter((group) => group['orgId'] === orgId && group['type'] === "default_org_group")
  );
}

export function getAllOrgGroups() {
  const { groupList } = useSelector((state: RootState) => {
    return {
      groupList: state.main.groupList,
    };
  });
  if (groupList == null) {
    return null;
  }

  const orgGroupList = groupList.filter(
    (group) => group['orgId'] != null && group['type'] === "default_org_group"
  );
  return orgGroupList;
}

export function getAllGroups() {
  const { groupList } = useSelector((state: RootState) => {
    return {
      groupList: state.main.groupList,
    };
  });
  return groupList;
}

export function getGroupMemberships(groupId: string): Array<GroupMembership> {
  const group = getGroup(groupId);
  const { groupMemberships } = useSelector((state: RootState) => {
    return {
      groupMemberships: state.main.groupMembershipMap != null ? state.main.groupMembershipMap[groupId] : [],
    };
  });

  return groupMemberships;
}

export function getAllGroupMemberships(): Array<GroupMembership> {
  const { groupMembershipsMap } = useSelector((state: RootState) => {
    return {
      groupMembershipsMap: state.main.groupMembershipMap,
    };
  });

  if (groupMembershipsMap == null) {
    return [];
  }

  return [
    ...Object.entries(groupMembershipsMap)
      .map((keyValue) => keyValue[1])
      .flat(),
  ];
}

export function getUserChatMemberships() {
  const { userChatMemberships } = useSelector((state: RootState) => {
    return {
      userChatMemberships: state.main.userChatMemberships,
    };
  });

  return userChatMemberships;
}

export function getRootMessageWithChildrenAndUserStatus(messageId: string): Message | null {
  const message = getMessage(messageId);
  if (message == null) {
    return null;
  }
  const groupId = message.groupId as string;
  const { messages, groupMap, userMessagesMap, userMap } = useSelector((state: RootState) => {
    return {
      groupMap: state.main.groupMap,
      messages: state.main.groupMessagesMap != null ? state.main.groupMessagesMap[groupId] : [],
      userMessagesMap: state.main.userMessagesMap,
      userMap: state.main.userMap,
    };
  });
  const user = useSelector((state: RootState) => state.main.userInfo);

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
    return [false, result];
  }, [messageId, messages, user, userMessagesMap, groupMap, userMap]);
}

export function getGroupUserRootMessages(groupId) {
  const user = getCurrentUser();
  const { groupMessages, userMessagesMap, groupMap, userMap } = useSelector((state: RootState) => {
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
        user.getData(),
        userMessagesMap.getData(),
        null,
        groupMap.getData(),
        userMap.getData()
      );
    } else {
      return [];
    }
  }, [groupMessages, user, userMessagesMap, groupMap, userMap]);
}

export function getChatUserMessages(chatId) {
  const user = getCurrentUser();
  const { chatMessages, userChatMessagesMap, userMap } = useSelector((state: RootState) => {
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
  const { group } = useSelector((state: RootState) => {
    return {
      group: state.main.groupMap[groupId],
    };
  });
  return group;
}

export function getRootGroup() {
  const { group } = useSelector((state: RootState) => {
    return {
      group: state.main.groupMap[ROOT_GROUP_ID],
    };
  });
  return group;
}

export function getOrg(orgId) {
  const { orgsMap } = useSelector((state: RootState) => {
    return {
      orgsMap: state.main.orgsMap,
    };
  });

  const org = orgsMap[orgId];
  return org;
}

export function getChat(chatId) {
  const { chat } = useSelector((state: RootState) => {
    return {
      chat: state.main.chatMap[chatId],
    };
  });
  return chat;
}

export function getSuperPublicGroups(groupId) {
  const { groups } = useSelector((state: RootState) => {
    return {
      groups: state.main.groupList,
    };
  });
  if (isLoading(groups)) {
    return loading();
  }
  return groups.getData().filter((group) => group['type'] === "super_public");
}

export function getGroupUnreadMessages(groupId) {
  const { groupMessages, userMessagesMap } = useSelector((state: RootState) => {
    return {
      groupMessages: state.main.groupMessages[groupId] ?? [],
      userMessagesMap: state.main.userMessagesMap,
    };
  });

  return MessageUtils.filterUnreadMessages(groupMessages, userMessagesMap);
}

export function getUserGroupMemberships() {
  const user = getCurrentUser();
  const { userGroupMemberships } = useSelector((state: RootState) => {
    return {
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  return userGroupMemberships;
}

export function getUserGroupMembership(groupId: string) {
  const user = getCurrentUser();
  const { userGroupMemberships } = useSelector((state: RootState) => {
    return {
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  const arr = (userGroupMemberships ?? []).filter((m) => m['groupId'] === groupId);
  return arr.length == 1 ? arr[0] : null;
}

export function getUserUnreadMessageCount() {
  const allUserRootMessages = getAllUserRootMessages();
  if (allUserRootMessages.loading) {
    return loading();
  }
  const unreadMessages = MessageUtils.calculateUnreadMessages(allUserRootMessages.data);
  return data(unreadMessages.length);
}

export function getUserUnreadChatMessageCount() {
  const allChatMessages = getAllUserChatMessages();
  const unreadMessages = MessageUtils.calculateUnreadChatMessages(allChatMessages);
  return unreadMessages.length;
}

export function getAllUserRootMessages() {
  const user = getCurrentUser();
  const { groupMessagesMap, userMessagesMap, groupMap, userMap } = useSelector((state: RootState) => {
    return {
      groupMessagesMap: state.main.groupMessages,
      userMessagesMap: state.main.userMessagesMap,
      groupMap: state.main.groupMap,
      userMap: state.main.userMap,
    };
  });
  if (userMessagesMap.loading) {
    return loading();
  }

  return useMemo(() => {
    let allMessages = [];
    for (let groupId in groupMessagesMap) {
      const groupMessages = groupMessagesMap[groupId];
      if (groupMessages != null && groupMessages.length > 0) {
        allMessages = allMessages.concat(groupMessages);
      }
    }
    if (allMessages.length > 0) {
      const messages = MessageUtils.buildRootMessagesWithChildren(
        allMessages,
        user.getData(),
        userMessagesMap.getData(),
        null,
        groupMap.getData(),
        userMap.getData()
      );
      return data(messages);
    }
    return data([]);
  }, [groupMessagesMap, user, userMessagesMap]);
}

export function getAllUserChatMessages() {
  const user = getCurrentUser();
  const { chatMessages, userChatMessagesMap, userMap } = useSelector((state: RootState) => {
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
        const userChatMessage = userChatMessagesMap.getData()[message.id];
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
  useEffect(() => {
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
  return useEffect(() => {
    Controller.markChatMessagesRead(
      user,
      chatMessages.map((m) => m.id)
    );
  }, []);
}

export function getDefaultOrgGroup(orgId) {
  const { orgsList, orgsMap, groupList, groupMap, userGroupMemberships } = useSelector((state: RootState) => {
    return {
      orgsList: state.main.orgsList,
      orgsMap: state.main.orgsMap,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  const defaultOrgGroup = groupList.getData().filter((group) => {
    return group['orgId'] == orgId && group['type'] === "default_org_group";
  });
  return single(defaultOrgGroup);
}

export function getAllGroupMessages(): Array<Message> {
  console.log("getAllGroupMessages1");
  let { groupMessages, userMap, userMessagesMap, groupMap, userInfo } = useSelector((state: RootState) => {
    return {
      userInfo: state.main.userInfo,
      groupList: state.main.groupList,
      groupMap: state.main.groupMap,
      orgsMap: state.main.orgsMap,
      userMap: state.main.userMap,
      groupMessages: state.main.groupMessages,
      userMessagesMap: state.main.userMessagesMap,
    };
  });

  const messages = Object.values(groupMessages).flat();

  const sortedMessages = useMemo(() => {
    const rootMessages = MessageUtils.buildRootMessagesWithChildren(
      messages,
      userInfo,
      userMessagesMap,
      null,
      groupMap,
      userMap,
    );
    const sortedMessages = [...rootMessages] ?? [];
    sortedMessages.sort((m1, m2) => {
      return m2.lastUpdated - m1.lastUpdated;
    });
    return sortedMessages;
  }, [messages, userInfo, userMessagesMap, null, userMap]);
  return sortedMessages;
}

function single(list) {
  if (list != null && list.length > 0) {
    return list[list.length - 1];
  } else {
    return null;
  }
}
