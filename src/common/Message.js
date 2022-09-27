import * as Logger from "./Logger";
import * as Dates from "./Date";

export function getEventUserResponsesByStatus(rootMessage, status) {}

export class RootMessage {
  constructor(message) {
    this.message = message;
    this.id = message.id;
    this.groupId = message.groupId;
  }

  getUserPollResponses(uid) {
    if (this.message.poll == null) {
      return null;
    }

    let poll_response = {};
    for (const child of this.message.children) {
      if (child.user.uid === uid) {
        if (child.poll_response != null) {
          poll_response = Array.isArray(child.poll_response)
            ? child.poll_response[0]
            : child.poll_response;
        }
      }
    }
    return poll_response;
  }

  getPollSummary() {
    /*
    "Option 1": {count: 2, total: 8, users: []}
    "Option 2": {}
    */
    if (this.message.poll == null) {
      return null;
    }

    const summary = {};
    let total = 0;
    for (const pollOption of this.message.poll) {
      const optionSummary = this.getPollOptionSummary(pollOption.name);
      summary[pollOption.name] = optionSummary;
      total += optionSummary.count;
    }

    for (const pollOption in summary) {
      summary[pollOption]["total"] = total;
    }
    return summary;
  }

  getPollOptionSummary(optionName) {
    /*
    {count: 2, total: 8, users: []}
    */
    const result = { count: 0, users: [] };
    for (const child of this.message.children) {
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

  getPoll() {
    return this.message.poll;
  }
}
