// @flow strict-local

import * as Logger from "./Logger";
import * as Dates from "./Date";
import type { ChatMessage, UserChatMessage } from "./Actions";

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
      return { status: userMessage.userStatus.status };
    } else {
      return { status: null };
    }
  }
}

export function calculateUnreadChatMessages(
  chatMessages: Array<ChatMessageInfo>
): Array<ChatMessageInfo> {
  const unreadMessages = chatMessages.filter((message) => message.userStatus?.status != "read");
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
