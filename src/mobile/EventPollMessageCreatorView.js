// @flow strict-local

import moment from "moment-timezone";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Globals from "./Globals";
import * as UIConstants from "./UIConstants";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import FacePile from "./FacePile";
import * as Date from "../common/Date";
import * as Debug from "../common/Debug";
import DebugText from "./DebugText";
import RootMessage from "../common/MessageData";

type Props = {
  message: RootMessage,
  showGroup?: ?boolean,
};

export default function EventPollMessageCreatorView({
  message,
  showGroup = false,
}: Props): React.Node {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();

  //show the poll results + how many comments (as in a regular message)
  //have "create meeting button" - this will go to a new "create meeting out of poll screen"
  return (
    <View style={{ flex: 1 }}>
      <DebugText key="debug" text="EventPollMessageCreatorView.js" />
      <TouchableOpacity
        style={{ flex: 1, padding: 20, backgroundColor: "rgba(204, 255, 255, 0.5)" }}
        onPress={() => {
          //onPress();
        }}
      >
        <DebugText key="debug1" text={message.id} />
        <DebugText key="debug2" text={JSON.stringify({ ...message, children: null }, null, 2)} />
        <View key="container1" style={{ height: 22 }}>
          <Text style={{ fontWeight: "bold", fontSize: 12 }}>
            Creator Event Date &amp; Time Poll
          </Text>
        </View>
        <View key="container2" style={{ height: 30 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{message.title}</Text>
        </View>

        <View
          key="container3"
          style={{
            width: 200,
            //backgroundColor: "cyan"
          }}
        >
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: 16,
              color: UIConstants.BLACK_TEXT_COLOR,
              flexGrow: 1,
            }}
          >
            {(message.text ?? "").replace(/(\r\n|\n|\r)/gm, " ")}
          </Text>
        </View>
        {/* poll results */}
        {message.event_poll.options.map((option, index) => {
          const optionSummary = message.event_poll_response_summary.filter((summary) => {
            return summary.poll_option.name === option.name;
          })[0];

          return (
            <View
              key={"poll_result_" + index}
              style={{
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: 10,
                backgroundColor: "lightgrey",
                //marginTop: index == 0 ? 0 : 10,
                marginBottom: index == 0 ? 4 : 4,
              }}
            >
              <Text key="time" style={{ fontWeight: "bold" }}>
                {moment(Date.toDate(option.startDate)).format("LLLL") +
                  " - " +
                  moment(Date.toDate(option.endTime)).format("LT")}
              </Text>
              {optionSummary.uid_list.length >= 0 && (
                <View key="facepile" style={{ marginLeft: 0 }}>
                  <FacePile userIds={optionSummary.uid_list} border />
                </View>
              )}
              {optionSummary.uid_list.length == 0 && (
                <View key="blank" style={{ marginLeft: 0, height: 24 }}></View>
              )}
            </View>
          );
        })}
      </TouchableOpacity>
      {/* buttons */}
      <View
        style={{
          height: 60,
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            flex: 1, //backgroundColor: "cyan"
          }}
          onPress={() => {
            dispatch(
              Actions.openModal({
                modal: "NEW_EVENT_FROM_POLL",
                pollMessageId: message.id,
              })
            );
          }}
        >
          <Text>Create Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
