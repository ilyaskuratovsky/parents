// @flow strict-local

import * as Logger from "./Logger";
import * as Dates from "./Date";
import type { ChatMessage } from "./Actions";
import type { Group, Message, UserInfo, UserMessage } from "./Database";

export default class RootMessage {
  rootMessage: Message;
  children: ?Array<Message>;
  userMessagesMap: { [key: string]: ?UserMessage };
  groupMap: { [key: string]: ?Group };
  userMap: { [key: string]: ?UserInfo };

  constructor(
    rootMessage: Message,
    children: Array<Message>,
    userMessagesMap: { [key: string]: ?UserMessage },
    groupMap: { [key: string]: ?Group },
    userMap: { [key: string]: ?UserInfo }
  ) {
    this.rootMessage = rootMessage;
    this.children = children;
    this.userMessagesMap = userMessagesMap;
    this.groupMap = groupMap;
    this.userMap = userMap;
  }

  getID(): string {
    return this.rootMessage.id;
  }

  getTitle(): ?string {
    return this.rootMessage.title;
  }

  getText(): ?string {
    return this.rootMessage.text;
  }

  getAttachments(): ?Array<{ uri: string }> {
    return this.rootMessage.attachments;
  }

  getGroupId(): string {
    return this.rootMessage.groupId;
  }

  getGroup(): ?Group {
    return this.groupMap[this.rootMessage.groupId];
  }

  getUserInfo(): ?UserInfo {
    return this.userMap[this.rootMessage.uid];
  }

  getTimestamp(): Date {
    return new Date(this.rootMessage.timestamp);
  }

  getChildren() {
    const sortedMessages = [...(this.children ?? [])]
      .sort((m1, m2) => {
        const millis1 = Dates.toMillis(m1.timestamp) ?? 0;
        const millis2 = Dates.toMillis(m2.timestamp) ?? 0;
        return millis1 - millis2;
      })
      .map(
        (message) => new RootMessage(message, [], this.userMessagesMap, this.groupMap, this.userMap)
      );
  }

  getUnreadChildCount(): number {
    const unreadChildCount = (this.children ?? []).filter((c) => {
      if (c.uid === this.rootMessage.uid) {
        return false;
      }
      const status = this.userMessagesMap[c.id]?.status != "read";
      return status;
    }).length;
    return unreadChildCount;
  }
  getUserStatus(): { status: ?string } {
    const userMessage = this.userMessagesMap?.[this.getID()];
    if (userMessage != null) {
      return { status: userMessage.status };
    } else {
      return { status: null };
    }
  }

  getUserPollResponses(uid: string): null {
    if (this.rootMessage.poll == null) {
      return null;
    }

    let poll_response = {};
    for (const child of this.children ?? []) {
      if (child.uid === uid) {
        if (child.poll_response != null) {
          poll_response = Array.isArray(child.poll_response)
            ? child.poll_response[0]
            : child.poll_response;
        }
      }
    }
    //return poll_response;
    return null;
  }

  getPollSummary(): { ... } {
    /*
    "Option 1": {count: 2, total: 8, users: []}
    "Option 2": {}
    */
    if (this.message.poll == null) {
      return null;
    }

    const summary = {};
    let total = 0;
    for (const pollOption of this.rootMessage.poll) {
      const optionSummary = this.getPollOptionSummary(pollOption.name);
      summary[pollOption.name] = optionSummary;
      total += optionSummary.count;
    }

    for (const pollOption in summary) {
      summary[pollOption]["total"] = total;
    }
    return summary;
  }

  getPollOptionSummary(optionName: string): { ... } {
    /*
    {count: 2, total: 8, users: []}
    */
    const result = { count: 0, users: [] };
    for (const child of this.children ?? []) {
      if (child.poll_response != null) {
        const poll_response = Array.isArray(child.poll_response)
          ? child.poll_response[0]
          : child.poll_response;

        for (const option in poll_response) {
          if (option === optionName) {
            if (poll_response[option] === true) {
              result.count++;
              if (!result.users.includes(child.uid)) {
                result.users.push(child.uid);
              }
            }
          }
        }
      }
    }
    return result;
  }

  getPoll(): { ... } {
    return this.message.poll;
  }
}

// /*
// /* given a single root message, built it with children */
// function buildRootMessageWithChildren(
//   messageId: string,
//   messages: Array<Message>,
//   userInfo: UserInfo,
//   userMessagesMap: { [key: string]: UserMessage },
//   groupMap: { [key: string]: Group },
//   userMap: { [key: string]: UserInfo }
// ): MessageInfo {
//   let rootMessageWithStatus = addMeta(
//     rootMessage,
//     userInfo,
//     userMessagesMap ?? {},
//     userMap ?? {},
//     groupMap ?? {}
//   );
//   rootMessageWithStatus = addEventData(rootMessageWithStatus);
//   rootMessageWithStatus = addEventPollData(rootMessageWithStatus);

//   // const a = null;
//   // const b = a.foo;

//   Logger.log("done buildingRootMessageWithChildren: " + messageId);
//   return rootMessageWithStatus;
// }

// /* builds the entire collection of root message for all the messages of a group*/
// export function buildRootMessagesWithChildren(
//   messages: Array<Message>,
//   userInfo: UserInfo,
//   userMessagesMap: { [key: string]: UserMessage },
//   groupMap: { [key: string]: Group },
//   userMap: { [key: string]: UserInfo }
// ): Array<MessageInfo> {
//   Logger.log("buildRootMessagesWithChildren, messages.length: " + messages?.length);
//   const messageMap = messages.reduce(function (acc, message) {
//     const messageId = message["id"];
//     acc[messageId] = { ...message };
//     return acc;
//   }, {});

//   const sortedMessages = [...Object.keys(messageMap).map((k) => messageMap[k])].sort((m1, m2) => {
//     const millis1 = Dates.toMillis(m1.timestamp);
//     const millis2 = Dates.toMillis(m2.timestamp);
//     return millis1 - millis2;
//   });

//   for (const m of sortedMessages) {
//     if (m["papaId"] != null) {
//       const papaId = m["papaId"];
//       const papaMessage = messageMap[papaId];
//       if (papaMessage != null) {
//         if (papaMessage["children"] == null) {
//           papaMessage["children"] = [];
//         }
//         papaMessage["children"].push(m);
//       }
//     }
//   }

//   const rootMessages = Object.values(messageMap).filter((m) => m["papaId"] == null);
//   const messagesWithStatus = rootMessages.map((rootMessage) => {
//     let rootMessageWithStatus = addMeta(rootMessage, userInfo, userMessagesMap, userMap, groupMap);
//     return rootMessageWithStatus;
//   });
//   return messagesWithStatus;
// }

// export function calculateAllUserGroupsUnreadMessages(groupMessagesMap, userMessagesMap) {
//   let unreadMessages = 0;
//   for (const groupId of Object.keys(groupMessagesMap)) {
//     const groupMessages = groupMessagesMap[groupId];
//     for (const message of groupMessages.filter((message) => message.papaId == null)) {
//       const userMessage = userMessagesMap[message.id];
//       if (userMessage == null || userMessage.status != "read") {
//         unreadMessages += 1;
//       }
//     }
//   }
//   return unreadMessages;
// }

// export function calculateUnreadChatMessages(
//   chatMessages: Array<ChatMessageInfo>
// ): Array<ChatMessageInfo> {
//   const unreadMessages = chatMessages.filter((message) => message.userStatus?.status != "read");
//   /*
//   let unreadMessages = 0;
//   for (const message of userRootMessages) {
//     if (message.userStatus?.status != "read") {
//       unreadMessages += 1;
//     }
//   }
//   */
//   return unreadMessages;
// }

// export function filterUnreadMessages(messages, userMessagesMap): Array<MessageInfo> {
//   let unreadMessages = [];
//   for (const message of messages.filter((message) => message.papaId == null)) {
//     const userMessage = userMessagesMap[message.id];
//     if (userMessage == null || userMessage.status != "read") {
//       unreadMessages.push(message);
//     }
//   }
//   return unreadMessages;
// }

// export function addMeta(
//   rootMessage: MessageInfo,
//   userInfo: UserInfo,
//   userMessagesMap: { [key: string]: UserMessage },
//   userMap: { [key: string]: UserInfo },
//   groupMap: { [key: string]: Group }
// ): MessageInfo {
//   const user = userMap[rootMessage.uid];

//   /* status */
//   let userStatus = {};
//   let userMessageId = null;
//   let rootMessageStatus = null;
//   if (userInfo.uid !== rootMessage.uid) {
//     const userMessage = userMessagesMap[rootMessage.id];
//     rootMessageStatus = userMessage?.status;
//     userStatus["userMessageId"] = userMessage?.id;
//   } else {
//     rootMessageStatus = "read";
//   }

//   /* unread child count */
//   const unreadChildCount = (rootMessage.children ?? []).filter((c) => {
//     if (c.uid === userInfo.uid) {
//       return false;
//     }
//     const status = userMessagesMap[c.id]?.status != "read";
//     return status;
//   }).length;

//   userStatus["unreadChildCount"] = unreadChildCount;
//   userStatus["rootMessageStatus"] = rootMessageStatus;
//   userStatus["status"] = rootMessageStatus === "read" && unreadChildCount == 0 ? "read" : "unread";

//   /* group */
//   let group = null;
//   if (groupMap != null) {
//     group = groupMap[rootMessage.groupId];
//   }

//   /* add meta to children */
//   const children = [];
//   for (const childMessage of rootMessage.children ?? []) {
//     let childStatus = null;
//     if (childMessage.uid !== userInfo.uid) {
//       childStatus = userMessagesMap[childMessage.id];
//     } else {
//       childStatus = "read";
//     }
//     const childMessageUser = userMap[childMessage.uid];
//     children.push({ ...childMessage, status: childStatus, user: childMessageUser });
//   }

//   /* timestamp */
//   const lastUpdated = Math.max(
//     rootMessage.timestamp,
//     Math.max.apply(
//       Math,
//       (rootMessage.children ?? []).map((m) => m.timestamp)
//     )
//   );

//   return {
//     ...rootMessage,
//     userStatus,
//     lastUpdated,
//     children,
//     user,
//     group,
//   };
// }

// export function addEventData(rootMessage: MessageInfo): MessageInfo {
//   let event = null;
//   const eventMessages = [rootMessage, ...rootMessage.children].filter(
//     (message) => message.event != null
//   );
//   if (eventMessages.length > 0) {
//     event = { ...eventMessages[0].event, creator: eventMessages[0].uid };
//   }
//   if (event != null) {
//     //accumulate the event respon
//     //event responses
//     const eventResponses = [];
//     const childResponseIndexes = {};

//     for (const childMessage of rootMessage.children ?? []) {
//       const eventResponse = childMessage.eventResponse;
//       if (eventResponse != null) {
//         const responseObj = {
//           status: eventResponse,
//           user: childMessage.user,
//           text: childMessage.text,
//           timestamp: childMessage.timestamp,
//         };

//         const currentUserResponseIndex = childResponseIndexes[childMessage.user.uid];
//         if (currentUserResponseIndex != null) {
//           eventResponses[currentUserResponseIndex] = responseObj;
//         } else {
//           eventResponses.push(responseObj);
//           childResponseIndexes[childMessage.user.uid] = eventResponses.length - 1;
//         }
//       }
//     }

//     const eventWithResponses = { ...event };
//     eventWithResponses["responses"] = eventResponses;
//     return { ...rootMessage, event: eventWithResponses };
//   }
//   //summary per status

//   return rootMessage;
// }

// export function addEventPollData(rootMessage) {
//   let poll = null;
//   const pollMessages = [rootMessage, ...rootMessage.children].filter(
//     (message) => message.event_poll != null
//   );
//   if (pollMessages.length > 0) {
//     poll = { options: [...pollMessages[0].event_poll], creator: pollMessages[0].uid };
//   }

//   if (poll != null) {
//     const pollResponseSummary = eventPollResponseSummary(rootMessage);
//     const userEventPollResponsesMap = userEventPollResponses(rootMessage);

//     return {
//       ...rootMessage,
//       event_poll: poll,
//       event_poll_response_summary: pollResponseSummary,
//       user_event_poll_responses: userEventPollResponsesMap,
//     };
//   }

//   return rootMessage;
// }

// export function addPollData(rootMessage) {
//   Logger.log("rootMessage: " + JSON.stringify(rootMessage));
//   if (rootMessage.poll == null) {
//     return rootMessage;
//   }

//   const poll = rootMessage.poll;
//   let poll_responses = {};
//   const pollResponseMessages = [...(rootMessage.children ?? [])].filter(
//     (message) => message.poll_response != null
//   );

//   for (const pollOption of poll) {
//     const uidResponses = {};
//     const optionResponseMessages = pollResponseMessages.filter((r) => {
//       return r.poll_response.option.name == pollOption.name;
//     });
//     for (const message of optionResponseMessages) {
//       if (message.poll_response.response == "true") {
//         uidResponses[message.uid] = true;
//       } else {
//         delete uidResponses[message.uid];
//       }
//     }

//     const count = Object.keys(uidResponses).length;
//     const uids = Object.keys(uidResponses);
//     poll_responses[pollOption.name] = {
//       uids,
//     };
//   }

//   return {
//     ...rootMessage,
//     poll_responses: poll_responses,
//   };
// }

// function eventPollResponseSummary(rootMessage: MessageInfo) {
//   // accumulate all the 'last' responses per user
//   const eventPollResponsesPerUser: { [key: string]: MessageInfo } = {};
//   const childMessages = rootMessage.children;
//   for (const childMessage of childMessages) {
//     if (childMessage.event_poll_response != null) {
//       eventPollResponsesPerUser[childMessage.user["uid"]] = childMessage;
//     }
//   }

//   // get the poll options
//   const eventPollOptions = rootMessage.event_poll;
//   const result = [];
//   for (const pollOption of Object.keys(eventPollOptions).map((k) => eventPollOptions[k])) {
//     const uid_list = [];
//     for (const userId of Object.keys(eventPollResponsesPerUser)) {
//       const userEventPollResponseMessage = eventPollResponsesPerUser?.[userId];
//       const pollResponse = userEventPollResponseMessage.event_poll_response;
//       if (pollResponse != null && pollResponse[pollOption["name"]]?.status) {
//         uid_list.push(userId);
//       }
//     }
//     result.push({ poll_option: pollOption, uid_list: uid_list });
//   }
//   return result;
// }

// export function userEventPollResponses(rootMessage: MessageInfo): {
//   [key: string]: { [key: string]: { status: boolean } },
// } {
//   // accumulate all the 'last' responses per user
//   let eventPollUserResponses = {};
//   const childMessages = rootMessage.children;
//   for (const childMessage of childMessages) {
//     if (childMessage.event_poll_response != null) {
//       eventPollUserResponses[childMessage.user.uid] = childMessage.event_poll_response;
//     }
//   }
//   return eventPollUserResponses;
