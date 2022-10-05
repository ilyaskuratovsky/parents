// @flow strict-local

import { useSelector } from "react-redux";
import * as MessageUtils from "./MessageUtils";
import { useEffect, useMemo } from "react";
import * as Controller from "./Controller";
import { ROOT_GROUP_ID } from "../../config/firebase";
import * as RD from "./RemoteData";
import { RemoteData, uninitialized, loading, data, isLoading } from "./RemoteData";
import type {
  MainState,
  RootState,
  GroupMembership,
  ChatMembership,
  UserChatMessage,
  Chat,
  ChatMessage,
} from "./Actions";

import { calculateUnreadChatMessages } from "./ChatMessage";

import type { UserInfo, Group, Org, UserMessage, Message } from "./Database";
import * as Dates from "../common/Date";
import type { JsTypeString } from "react-native/ReactCommon/hermes/inspector/tools/msggen/src/Converters";
import RootMessage from "./Message";
import ChatMessageInfo from "./ChatMessage";

/*
export type MessageInfo = {
  id: string,
  uid: string,
  timestamp: number,
  papaId: ?string,
  lastUpdated: number,
  children: Array<MessageInfo>,
  event_poll_response: { [key: string]: { status: boolean } },
  event_poll: { [key: string]: { name: string, message: string } },
  user: UserInfo,
  userStatus: {
    status: string,
    rootMessageStatus: string,
    status: string,
    unreadChildCount: number,
    userMessageId: string,
  },
  ...
};
*/

export function getCurrentUser(): UserInfo {
  const user: UserInfo = useSelector((state: RootState) => state.main.userInfo);
  if (user == null) {
    throw "getCurrentUser: user is null";
  }
  return user;
}
export function getUsers(uids: Array<string>): Array<UserInfo> {
  const userMap: ?{ [key: string]: UserInfo } = useSelector(
    (state: RootState) => state.main.userMap
  );
  const users = [];
  if (userMap == null) {
    return [];
  }
  uids.forEach((uid) => {
    const user = userMap[uid];
    users.push(user);
  });
  return users;
}

export function getUser(uid: string): ?UserInfo {
  const select = (state: RootState) => state.main.userMap;
  const userMap = useSelector(select);
  /*
  const userMap: { [key: string]: UserInfo } =
    useSelector((state: RootState) => state.main.userMap) ?? {};
  */
  return userMap[uid];
}

export function getMessage(messageId: string): ?Message {
  let messagesMap: ?{ [key: string]: Message } = useSelector((state: RootState) => {
    return {
      messagesMap: state.main.messagesMap,
    };
  });
  return messagesMap != null ? messagesMap[messageId] : null;
}
export function getAllUsers(): ?Array<UserInfo> {
  const { users } = useSelector((state: RootState) => {
    return {
      users: state.main.userList,
    };
  });
  return users;
}
export function getAllOrgs(): ?Array<Org> {
  const { orgsList } = useSelector((state: RootState) => {
    return {
      orgsList: state.main.orgsList,
    };
  });
  return orgsList;
}

export function getAllOrgsMap(): ?{ [key: string]: Org } {
  const { orgsMap } = useSelector((state: RootState) => {
    return {
      orgsMap: state.main.orgsMap,
    };
  });
  return orgsMap;
}

export function getAllGroupsMap(): ?{ [key: string]: Group } {
  const { groupMap } = useSelector((state: RootState) => {
    return {
      groupMap: state.main.groupMap,
    };
  });
  return groupMap;
}

export function getOrgGroups(orgId: string): ?Array<Group> {
  const { groupList } = useSelector((state: RootState) => {
    return {
      groupList: state.main.groupList,
    };
  });

  if (groupList == null) {
    return [];
  }

  return groupList.filter((group) => group["orgId"] === orgId);
}

export function getSubGroups(groupId: string): Array<Group> {
  const { groupList } = useSelector((state: RootState) => {
    return {
      groupList: state.main.groupList,
    };
  });

  if (groupList == null) {
    return [];
  }
  return groupList.filter((group) => group["parentGroupId"] === groupId);
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
    groupList.filter((group) => group["orgId"] === orgId && group["type"] === "default_org_group")
  );
}

export function getAllOrgGroups(): ?Array<Group> {
  const { groupList } = useSelector<RootState>((state: RootState) => {
    return {
      groupList: state.main.groupList,
    };
  });
  /*
  if (groupList == null) {
    return null;
  }
  */

  const orgGroupList = groupList.filter(
    (group) => group["orgId"] != null && group["type"] === "default_org_group"
  );
  return orgGroupList;
}

export function getAllGroups(): Array<Group> {
  const { groupList } = useSelector<RootState>((state: RootState) => {
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
      groupMemberships:
        state.main.groupMembershipMap != null ? state.main.groupMembershipMap[groupId] : [],
    };
  });

  return groupMemberships;
}

export function getAllGroupMemberships(): Array<GroupMembership> {
  const groupMembershipsMap: { [key: string]: GroupMembership } = useSelector(
    (state: RootState): { [key: string]: GroupMembership } => {
      return state.main.groupMembershipMap ?? {};
    }
  );

  if (groupMembershipsMap == null) {
    return [];
  }

  return Object.keys(groupMembershipsMap).map((k) => groupMembershipsMap[k]);
}

export function getUserChatMemberships(): Array<ChatMembership> {
  const userChatMembershipsList: Array<ChatMembership> = useSelector((state: RootState) => {
    return {
      userChatMembershipsList: state.main.userChatMembershipsList,
    };
  });

  return userChatMembershipsList;
}

export function getAllRootMessages(): Array<RootMessage> {
  const rootMessagesMap = getAllRootMessagesMap();
  return Object.keys(rootMessagesMap).map((k) => rootMessagesMap[k]);
}

export function getAllRootMessagesMap(): { [key: string]: RootMessage } {
  const {
    messagesMap,
    groupMap,
    userMessagesMap,
    userMap,
  }: {
    messagesMap: ?{ [key: string]: ?Message },
    userMessagesMap: ?{ [key: string]: ?UserMessage },
    userMap: ?{ [key: string]: ?UserInfo },
    groupMap: ?{ [key: string]: ?Group },
  } = useSelector((state: RootState) => {
    return {
      groupMap: state.main.groupMap,
      messagesMap: state.main.messagesMap != null ? state.main.messagesMap : {},
      userMessagesMap: state.main.userMessagesMap,
      userMap: state.main.userMap,
    };
  });

  let rootMessageMap: { [key: string]: {| root: Message, children: Array<Message> |} } = {};

  for (const messageId in messagesMap) {
    const message = messagesMap[messageId];
    if (message?.papaId === null) {
      rootMessageMap[message.id] = { root: message, children: [] };
    }
  }

  for (const messageId in messagesMap) {
    const message = messagesMap[messageId];
    const papaId = message?.papaId;
    if (papaId != null) {
      const papaMessage = rootMessageMap[papaId];
      papaMessage?.children.push(message);
    }
  }

  const rootMessages: { [key: string]: RootMessage } = {};
  for (const rootMessageId of Object.keys(rootMessageMap)) {
    rootMessages[rootMessageId] = new RootMessage(
      rootMessageMap[rootMessageId].root,
      rootMessageMap[rootMessageId].children,
      userMessagesMap ?? {},
      groupMap ?? {},
      userMap ?? {}
    );
  }

  return rootMessages;
}

export function getRootMessage(messageId: string): ?RootMessage {
  return getAllRootMessagesMap()[messageId];
}

export function getGroupUserRootMessages(groupId: string): Array<RootMessage> {
  const all = getAllRootMessagesMap();
  return Object.keys(all)
    .map((k) => all[k])
    .filter((rootMessage) => rootMessage.getGroupId() === groupId);
}

export function getChatMessages(chatId: string): Array<ChatMessageInfo> {
  const user = getCurrentUser();
  const { chatMessages, userChatMessagesMap, userMap } = useSelector((state: RootState) => {
    return {
      chatMessages: chatId != null ? state.main.chatMessagesMap?.[chatId] : [],
      userChatMessagesMap: state.main.userChatMessagesMap,
      userMap: state.main.userMap,
    };
  });

  const rootChatMessages = useMemo(() => {
    if (chatMessages != null) {
      const userChatMessages = [];
      chatMessages.forEach((message) => {
        const userChatMessage = userChatMessagesMap[message.id];
        userChatMessages.push(new ChatMessageInfo(message, userChatMessage));
      });
      return userChatMessages;
    } else {
      return [];
    }
  }, [chatMessages, userChatMessagesMap]);
  return rootChatMessages;
}

export function getGroupUserRootUnreadMessages(groupId: string): Array<RootMessage> {
  const userGroupRootMessages = getGroupUserRootMessages(groupId);
  const unread = useMemo(() => {
    const unreadMessages = userGroupRootMessages.filter(
      (rootMessage) => rootMessage.getUserStatus().status != "read"
    );
    return unreadMessages;
  }, [userGroupRootMessages]);
  return unread;
}

export function getChatUserUnreadMessages(chatId: string): Array<ChatMessageInfo> {
  const chatMessages = getChatMessages(chatId);
  const unreadMessages = chatMessages.filter((message) => message.userStatus?.status != "read");
  return unreadMessages;
}

export function getGroup(groupId: string): ?Group {
  const { group } = useSelector((state: RootState) => {
    return {
      group: state.main.groupMap?.[groupId],
    };
  });
  return group;
}

export function getSuperPublicGroups(): Array<Group> {
  const groups: ?Array<Group> = useSelector(
    (state: RootState): ?Array<Group> => state.main.groupList
  );
  if (groups == null) {
    return [];
  }
  return groups.filter((group) => group.type === "super_public");
}

export function getUserUnreadMessageCount(): number {
  const allUserRootMessagesMap = getAllRootMessagesMap();
  const allUserRootMessages = Object.keys(allUserRootMessagesMap).map(
    (k) => allUserRootMessagesMap[k]
  );
  const unreadMessages = getUserUnreadChatMessageCount();
  return unreadMessages;
}

export function getUserUnreadChatMessageCount(): number {
  const allChatMessages = getAllUserChatMessages();
  const unreadMessages = calculateUnreadChatMessages(allChatMessages);
  return unreadMessages.length;
}

export function getAllUserChatMessages(): Array<ChatMessageInfo> {
  const user = getCurrentUser();
  const { chatMessages, userChatMessagesMap, userMap } = useSelector((state: RootState) => {
    return {
      chatMessages: Object.keys(state.main.chatMessagesMap ?? {}).map(
        (k: string) => state.main.chatMessagesMap?.[k]
      ),
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
}

/*
  let unreadMessages = 0;
  for (const message of userRootMessages) {
    if (message.userStatus?.status != "read") {
      unreadMessages += 1;
    }
  }
}

export function getGroupUserRootMessageUnreadCount(groupId: string): number {
  const unread = getGroupUserRootUnreadMessages(groupId);
  return unread.length;
}

export function getRootGroup(): ?Group {
  const { group } = useSelector((state: RootState) => {
    return {
      group: state.main.groupMap?.[ROOT_GROUP_ID],
    };
  });
  return group;
}

export function getOrg(orgId: string): ?Org {
  const { orgsMap } = useSelector((state: RootState) => {
    return {
      orgsMap: state.main.orgsMap,
    };
  });

  const org = orgsMap[orgId];
  return org;
}

export function getChat(chatId: string): ?Chat {
  const { chat } = useSelector((state: RootState) => {
    return {
      chat: state.main.chatMap?.[chatId],
    };
  });
  return chat;
}

export function getSuperPublicGroups(groupId: string): Array<Group> {
  const groups = useSelector((state: RootState) => {
    const groups = state.main.groupList;
    return groups;
  });
  return groups.filter((group) => group["type"] === "super_public");
}

export function getUserGroupMemberships(): Array<GroupMembership> {
  const user = getCurrentUser();
  const { userGroupMemberships } = useSelector((state: RootState) => {
    return {
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  return userGroupMemberships;
}

export function getUserGroupMembership(groupId: string): ?GroupMembership {
  const user = getCurrentUser();
  const { userGroupMemberships } = useSelector((state: RootState) => {
    return {
      userGroupMemberships: state.main.userGroupMemberships,
    };
  });
  const arr = (userGroupMemberships ?? []).filter((m) => m["groupId"] === groupId);
  return arr.length == 1 ? arr[0] : null;
}


export function getAllUserChatMessages(): Array<ChatMessageInfo> {
  const user = getCurrentUser();
  const { chatMessages, userChatMessagesMap, userMap } = useSelector((state: RootState) => {
    return {
      chatMessages: Object.keys(state.main.chatMessagesMap ?? {}).map(
        (k: string) => state.main.chatMessagesMap?.[k]
      ),
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

export function getUserMessage(messageId: string): ?UserMessage {
  let userMessagesMap = useSelector((state: RootState) => state.main.userMessagesMap);
  return userMessagesMap?.[messageId];
}

export function useMarkRead(messageId: string) {
  const user = getCurrentUser();
  const message = getRootMessage(messageId);

  useEffect(() => {
    if (message != null) {
      let markRead = [];
      if (message?.getUserStatus()?.status != "read") {
        markRead.push(message.getID());
      }
      const unreadChildMessages = (message.getChildren() ?? []).filter(
        (m) => m.getUserStatus().status != "read"
      );
      markRead = markRead.concat(unreadChildMessages.map((m) => m.id));
      Controller.markMessagesRead(user, markRead);
    }
  }, [message]);
}

export function useMarkChatMessagesRead(chatMessages: Array<ChatMessage>): void {
  const user = getCurrentUser();
  return useEffect(() => {
    Controller.markChatMessagesRead(
      user,
      chatMessages.map((m) => m.id)
    );
  }, []);
}

export function getDefaultOrgGroup(orgId: string): ?Group {
  const { orgsList, orgsMap, groupList, groupMap, userGroupMemberships } = useSelector(
    (state: RootState) => {
      return {
        orgsList: state.main.orgsList,
        orgsMap: state.main.orgsMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        userGroupMemberships: state.main.userGroupMemberships,
      };
    }
  );
  const defaultOrgGroup = groupList.getData().filter((group) => {
    return group["orgId"] == orgId && group["type"] === "default_org_group";
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
