export function buildMessageWithChildren(messageId, messages) {
  let rootMessage = { children: [] };
  for (const m of messages) {
    if (m.papaId == messageId) {
      rootMessage.children.push(m);
    } else if (m.id == messageId) {
      rootMessage = { ...m, ...rootMessage };
    }
  }
  return rootMessage;
}

export function buildRootMessagesWithChildren(messages) {
  const messageMap = messages.reduce(function (acc, message) {
    acc[message.id] = { ...message };
    return acc;
  }, {});

  for (const m of Object.values(messageMap)) {
    if (m.papaId != null) {
      const papaMessage = messageMap[m.papaId];
      if (papaMessage.children == null) {
        papaMessage["children"] = [];
      }
      papaMessage.children.push(m);
    }
  }

  const rootMessages = Object.values(messageMap).filter((m) => m.papaId == null);
  return rootMessages;
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
