import * as Logger from "./Logger";
import * as Dates from "../common/Date";

/* given a single root message, built it with children */
export function buildRootMessageWithChildren(
  messageId,
  messages,
  userInfo,
  userMessagesMap,
  groupMembers,
  groupMap,
  userMap
) {
  const sortedMessages = [...messages].sort((m1, m2) => {
    const millis1 = Dates.toMillis(m1.timestamp);
    const millis2 = Dates.toMillis(m2.timestamp);
    return millis1 - millis2;
  });

  /*
  Logger.log(
    "buildingRootMessageWithChildren, messageId: " +
      messageId +
      ", messages: " +
      JSON.stringify(
        messages.map((message) => {
          if (message != null) {
            return { id: message.id, papaId: message.papaId };
          } else {
            return { id: "undefined" };
          }
        }),
        null,
        2
      )
  );
  */

  let rootMessage = { children: [] };
  const message = sortedMessages.filter((m) => m.id === messageId)[0];
  //const message = messages.filter((m) => m.id === messageId)[0];
  //message = undefined;
  Logger.log("found root message: " + JSON.stringify(message));
  let rootMessageId = message.id;
  if (message.papaId != null) {
    rootMessageId = message.papaId;
  }
  for (const m of sortedMessages) {
    //for (const m of messages) {
    if (m.papaId == rootMessageId) {
      rootMessage.children.push(m);
    } else if (m.id == rootMessageId) {
      rootMessage = { ...m, ...rootMessage };
    }
  }
  let rootMessageWithStatus = addMeta(rootMessage, userInfo, userMessagesMap, userMap, groupMap);
  rootMessageWithStatus = addEventData(rootMessageWithStatus);
  rootMessageWithStatus = addEventPollData(rootMessageWithStatus);

  // const a = null;
  // const b = a.foo;

  Logger.log("done buildingRootMessageWithChildren: " + messageId);
  return rootMessageWithStatus;
}

/* builds the entire collection of root message for all the messages of a group*/
export function buildRootMessagesWithChildren(
  messages,
  userInfo,
  userMessagesMap,
  groupMembers,
  groupMap,
  userMap
) {
  Logger.log("buildRootMessagesWithChildren, messages.length: " + messages?.length);
  const messageMap = messages.reduce(function (acc, message) {
    acc[message.id] = { ...message };
    return acc;
  }, {});

  for (const m of Object.values(messageMap)) {
    if (m.papaId != null) {
      const papaMessage = messageMap[m.papaId];
      if (papaMessage != null) {
        if (papaMessage.children == null) {
          papaMessage["children"] = [];
        }
        papaMessage.children.push(m);
      }
    }
  }

  const rootMessages = Object.values(messageMap).filter((m) => m.papaId == null);
  const messagesWithStatus = rootMessages.map((rootMessage) => {
    let rootMessageWithStatus = addMeta(rootMessage, userInfo, userMessagesMap, userMap, groupMap);
    rootMessageWithStatus = addEventData(rootMessageWithStatus);
    rootMessageWithStatus = addEventPollData(rootMessageWithStatus);
    return { ...rootMessage, ...rootMessageWithStatus };
  });
  Logger.log(
    "done buildRootMessagesWithChildren, messagesWithStatus.length: " + messagesWithStatus?.length
  );
  return messagesWithStatus;
}

export function calculateAllUserGroupsUnreadMessages(groupMessagesMap, userMessagesMap) {
  let unreadMessages = 0;
  for (const groupId of Object.keys(groupMessagesMap)) {
    const groupMessages = groupMessagesMap[groupId];
    for (const message of groupMessages.filter((message) => message.papaId == null)) {
      const userMessage = userMessagesMap[message.id];
      if (userMessage == null || userMessage.status != "read") {
        unreadMessages += 1;
      }
    }
  }
  return unreadMessages;
}

export function calculateUnreadMessages(userRootMessages) {
  const unreadMessages = userRootMessages.filter(
    (rootMessage) => rootMessage.userStatus?.status != "read"
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

export function filterUnreadMessages(messages, userMessagesMap) {
  let unreadMessages = [];
  for (const message of messages.filter((message) => message.papaId == null)) {
    const userMessage = userMessagesMap[message.id];
    if (userMessage == null || userMessage.status != "read") {
      unreadMessages.push(message);
    }
  }
  return unreadMessages;
}

export function addMeta(rootMessage, userInfo, userMessagesMap, userMap, groupMap) {
  const user = userMap[rootMessage.uid];

  /* status */
  let userStatus = {};
  let userMessageId = null;
  let rootMessageStatus = null;
  if (userInfo.uid !== rootMessage.uid) {
    const userMessage = userMessagesMap[rootMessage.id];
    rootMessageStatus = userMessage?.status;
    userStatus["userMessageId"] = userMessage?.id;
  } else {
    rootMessageStatus = "read";
  }

  /* unread child count */
  const unreadChildCount = (rootMessage.children ?? []).filter((c) => {
    if (c.uid === userInfo.uid) {
      return false;
    }
    const status = userMessagesMap[c.id]?.status != "read";
    return status;
  }).length;

  userStatus["unreadChildCount"] = unreadChildCount;
  userStatus["rootMessageStatus"] = rootMessageStatus;
  userStatus["status"] = rootMessageStatus === "read" && unreadChildCount == 0 ? "read" : "unread";

  /* group */
  let group = null;
  if (groupMap != null) {
    group = groupMap[rootMessage.groupId];
  }

  /* add meta to children */
  const children = [];
  for (const childMessage of rootMessage.children ?? []) {
    let childStatus = null;
    if (childMessage.uid !== userInfo.uid) {
      childStatus = userMessagesMap[childMessage.id];
    } else {
      childStatus = "read";
    }
    const childMessageUser = userMap[childMessage.uid];
    children.push({ ...childMessage, status: childStatus, user: childMessageUser });
  }

  /* timestamp */
  const lastUpdated = Math.max(
    rootMessage.timestamp,
    Math.max.apply(
      Math,
      (rootMessage.children ?? []).map((m) => m.timestamp)
    )
  );

  return {
    ...rootMessage,
    userStatus,
    lastUpdated,
    children,
    user,
    group,
  };
}

export function addEventData(rootMessage) {
  let event = null;
  const eventMessages = [rootMessage, ...rootMessage.children].filter(
    (message) => message.event != null
  );
  if (eventMessages.length > 0) {
    event = { ...eventMessages[0].event, creator: eventMessages[0].uid };
  }
  if (event != null) {
    //accumulate the event respon
    //event responses
    const eventResponses = [];
    const childResponseIndexes = {};

    for (const childMessage of rootMessage.children ?? []) {
      const eventResponse = childMessage.eventResponse;
      if (eventResponse != null) {
        const responseObj = {
          status: eventResponse,
          user: childMessage.user,
          text: childMessage.text,
          timestamp: childMessage.timestamp,
        };

        const currentUserResponseIndex = childResponseIndexes[childMessage.user.uid];
        if (currentUserResponseIndex != null) {
          eventResponses[currentUserResponseIndex] = responseObj;
        } else {
          eventResponses.push(responseObj);
          childResponseIndexes[childMessage.user.uid] = eventResponses.length - 1;
        }
      }
    }

    const eventWithResponses = { ...event };
    eventWithResponses["responses"] = eventResponses;
    return { ...rootMessage, event: eventWithResponses };
  }
  //summary per status

  return rootMessage;
}

export function addEventPollData(rootMessage) {
  let poll = null;
  const pollMessages = [rootMessage, ...rootMessage.children].filter(
    (message) => message.event_poll != null
  );
  if (pollMessages.length > 0) {
    poll = { options: [...pollMessages[0].event_poll], creator: pollMessages[0].uid };
  }

  if (poll != null) {
    const pollResponseSummary = eventPollResponseSummary(rootMessage);
    const userEventPollResponsesMap = userEventPollResponses(rootMessage);

    return {
      ...rootMessage,
      event_poll: poll,
      event_poll_response_summary: pollResponseSummary,
      user_event_poll_responses: userEventPollResponsesMap,
    };
  }

  return rootMessage;
}

function eventPollResponseSummary(rootMessage) {
  // accumulate all the 'last' responses per user
  const eventPollResponsesPerUser = {};
  const childMessages = rootMessage.children;
  for (const childMessage of childMessages) {
    if (childMessage.event_poll_response != null) {
      eventPollResponsesPerUser[childMessage.user.uid] = childMessage;
    }
  }

  // get the poll options
  const eventPollOptions = rootMessage.event_poll;
  const result = [];
  for (const pollOption of eventPollOptions) {
    const uid_list = [];
    for (const [userId, userEventPollResponseMessage] of Object.entries(
      eventPollResponsesPerUser
    )) {
      const pollResponse = userEventPollResponseMessage.event_poll_response;
      if (pollResponse != null && pollResponse[pollOption.name]?.status) {
        uid_list.push(userId);
      }
    }
    result.push({ poll_option: pollOption, uid_list: uid_list });
  }
  return result;
}

export function userEventPollResponses(rootMessage) {
  // accumulate all the 'last' responses per user
  let eventPollUserResponses = {};
  const childMessages = rootMessage.children;
  for (const childMessage of childMessages) {
    if (childMessage.event_poll_response != null) {
      eventPollUserResponses[childMessage.user.uid] = childMessage.event_poll_response;
    }
  }
  return eventPollUserResponses;
}
