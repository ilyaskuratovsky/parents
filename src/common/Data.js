import { useSelector } from "react-redux";
import * as MessageUtils from "../common/MessageUtils";
import { useEffect, useMemo } from "react";
import * as Controller from "../common/Controller";

export function getCurrentUser() {
  const user = useSelector((state) => state.main.userInfo);
  return user;
}
export function getMessage(messageId) {
  let { message } = useSelector((state) => {
    return {
      message: state.main.messages[messageId],
    };
  });
  return message;
}
``;

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
  /*
  export function buildRootMessagesWithChildren(
    messages,
    userInfo,
    userMessagesMap,
    groupMembers,
    groupMap,
    userMap
  */

  return useMemo(() => {
    return MessageUtils.buildRootMessagesWithChildren(
      groupMessages,
      user,
      userMessagesMap,
      null,
      groupMap,
      userMap
    );
  }, [groupMessages, user, userMessagesMap, groupMap, userMap]);
}

export function getGroupUserRootUnreadMessages(groupId) {
  const userGroupRootMessages = getGroupUserRootMessages(groupId);
  const unread = useMemo(
    () => MessageUtils.calculateUnreadMessages(userGroupRootMessages),
    [userGroupRootMessages]
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

export function getUserUnreadMessageCount() {
  const allUserRootMessages = getAllUserRootMessages();
  const unreadMessages = MessageUtils.calculateUnreadMessages(allUserRootMessages);
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
    for (groupId in groupMessagesMap) {
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
