// @flow strict-local

import * as Logger from "./Logger";
import * as Dates from "./Date";
import type { ChatMessage, UserChatMessage } from "./Database";
import { useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import type { RootState } from "./Actions";
import filter_nulls from "./filter_nulls";

export default class ChatMessageInfo {
  rootChatMessage: ChatMessage;
  userChatMessagesMap: ?{ [key: string]: UserChatMessage };

  constructor(
    rootChatMessage: ChatMessage,
    userChatMessagesMap: ?{ [key: string]: UserChatMessage }
  ) {
    this.rootChatMessage = rootChatMessage;
    this.userChatMessagesMap = userChatMessagesMap;
  }

  getID(): string {
    return this.rootChatMessage.id;
  }

  getUserStatus(): { status: ?string } {
    const userMessage = this.userChatMessagesMap?.[this.getID()];
    if (userMessage != null) {
      return { status: userMessage.status };
    } else {
      return { status: null };
    }
  }
}

export function getChat(chatId: string): Array<ChatMessage> {
  const user = useSelector((state: RootState) => state.main.userInfo);

  const { chatMessages } = useSelector((state: RootState) => {
    return {
      chatMessages: filter_nulls(
        Object.keys(state.main.chatMessagesMap ?? {}).map((k: string) => {
          const chat = state.main.chatMessagesMap?.[k];
          return chat;
        })
      ),
    };
  });

  const sortedChildMessages = chatMessages ?? [];
  sortedChildMessages.sort((m1, m2) => {
    return m1.timestamp - m2.timestamp;
    //return 0;
  });
  return sortedChildMessages;
}

export function getAllUserChatMessages(): Array<ChatMessageInfo> {
  const user = useSelector((state: RootState) => state.main.userInfo);

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
      const chatMessageInfos = [];
      chatMessages.forEach((message) => {
        const userChatMessage = userChatMessagesMap[message.id];
        chatMessageInfos.push(new ChatMessageInfo(message, userChatMessagesMap));
        /*
        userChatMessages.push({
          ...message,
          userStatus: {
            status: userChatMessage?.status,
          },
          user: {
            ...userMap[message.uid],
          },
        });
        */
      });
      return chatMessageInfos;
    } else {
      return [];
    }
  }, [chatMessages, userChatMessagesMap, userMap]);
}

export function getUserUnreadChatMessageCount(): number {
  const allChatMessages = getAllUserChatMessages();
  const unreadMessages = calculateUnreadChatMessages(allChatMessages);
  return unreadMessages.length;
}

export function calculateUnreadChatMessages(
  chatMessages: Array<ChatMessageInfo>
): Array<ChatMessageInfo> {
  const unreadMessages = chatMessages.filter(
    (message) => message.getUserStatus()?.status != "read"
  );
  /*
  let unreadMessages = 0;
  for (const message of userRootMessages) {
    if (message.userStatus?.status != "read") {
      unreadMessages += 1;
    }
  }
  */
  return unreadMessages;
}
