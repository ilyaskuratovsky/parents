import { useSelector } from "react-redux";
import * as MessageUtils from "../common/MessageUtils";

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
}

export function getGroup(groupId) {
  const { group } = useSelector((state) => {
    return {
      group: state.main.groupMap[groupId],
    };
  });
  return group;
}

export function getGroupUnreadMessageCount(groupId) {
  const { groupMessages, userMessagesMap } = useSelector((state) => {
    return {
      groupMessages: state.main.groupMessages[groupId] ?? [],
      userMessagesMap: state.main.userMessagesMap,
    };
  });

  return MessageUtils.calculateUnreadMessages(groupMessages, userMessagesMap);
}
