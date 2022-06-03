import * as Logger from "./Logger";

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
  let rootMessage = { children: [] };
  const message = messages.filter((m) => m.id === messageId)[0];
  //message = undefined;
  Logger.log("found root message: " + JSON.stringify(message));
  let rootMessageId = message.id;
  if (message.papaId != null) {
    rootMessageId = message.papaId;
  }
  for (const m of messages) {
    if (m.papaId == rootMessageId) {
      rootMessage.children.push(m);
    } else if (m.id == rootMessageId) {
      rootMessage = { ...m, ...rootMessage };
    }
  }
  Logger.log("got root message: " + JSON.stringify(rootMessage));
  let rootMessageWithStatus = addMeta(rootMessage, userInfo, userMessagesMap, userMap);
  rootMessageWithStatus = addEventData(rootMessageWithStatus, userInfo, groupMembers);
  rootMessageWithStatus = addPollData(rootMessageWithStatus, userInfo, groupMembers);

  // const a = null;
  // const b = a.foo;

  Logger.log("done buildingRootMessageWithChildren, messageId: " + messageId);
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
    rootMessageWithStatus = addEventData(rootMessageWithStatus, userInfo, groupMembers);
    return { ...rootMessage, ...rootMessageWithStatus };
  });
  Logger.log(
    "done buildRootMessagesWithChildren, messagesWithStatus.length: " + messagesWithStatus?.length
  );
  return messagesWithStatus;
}

export function calculateUnreadMessages(groupMessagesMap, userMessagesMap) {
  let unreadMessages = 0;
  for (const groupId of Object.keys(groupMessagesMap)) {
    const groupMessages = groupMessagesMap[groupId];
    for (const message of groupMessages) {
      const userMessage = userMessagesMap[message.id];
      if (userMessage == null || userMessage.status != "read") {
        unreadMessages += 1;
      }
    }
  }
  return unreadMessages;
}

export function addMeta(rootMessage, userInfo, userMessagesMap, userMap, groupMap) {
  /* status */
  let status = null;
  let userMessageId = null;
  if (userInfo.uid !== rootMessage.uid) {
    const userMessage = userMessagesMap[rootMessage.id];
    status = userMessage?.status;
    userMessageId = userMessage?.id;
  } else {
    status = "read";
  }

  /* user */
  const user = userMap[rootMessage.uid];

  /* unread child count */
  const unreadChildCount = (rootMessage.children ?? []).filter((c) => {
    if (c.uid === userInfo.uid) {
      return false;
    }
    const status = userMessagesMap[c.id]?.status != "read";
    return status;
  }).length;

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
    status,
    userMessageId,
    unreadChildCount,
    lastUpdated,
    children,
    user,
    group,
  };
}

export function addEventData(rootMessage, userInfo, userMessagesMap, groupMembers) {
  let event = null;
  const eventMessages = [rootMessage, ...rootMessage.children].filter(
    (message) => message.event != null
  );
  if (eventMessages.length > 0) {
    event = { ...eventMessages[0].event, creator: eventMessages[0].uid };
  }
  if (event != null) {
    const eventWithUserStatus = { ...event };
    for (const childMessage of rootMessage.children ?? []) {
      const childEvent = childMessage.event;
      if (childEvent != null) {
        const childStatus = childEvent.status;
        const userStatus = { ...eventWithUserStatus.users };
        userStatus[childMessage.uid] = { status: childStatus };
        const summary = { ...eventWithUserStatus.summary };
        const statusCount = summary[childStatus] ?? 0;
        summary[childStatus] = statusCount + 1;
        eventWithUserStatus["users"] = userStatus;
        eventWithUserStatus["summary"] = summary;
      }
    }

    return { ...rootMessage, event: eventWithUserStatus };
  }
  return rootMessage;
}

export function addPollData(rootMessage, userInfo, userMessagesMap, groupMembers) {
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
      if (
        pollResponse != null &&
        pollResponse.find((option) => option.name === pollOption.name) != null
      ) {
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
