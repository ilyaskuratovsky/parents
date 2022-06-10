import moment from "moment-timezone";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Globals from "./Globals";
import * as UIConstants from "./UIConstants";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import FacePile from "./FacePile";
import * as Date from "../common/Date";
import * as Debug from "../common/Debug";

export default function EventPollMessageCreatorView({ message, showGroup = false }) {
  const dispatch = useDispatch();

  //show the poll results + how many comments (as in a regular message)
  //have "create meeting button" - this will go to a new "create meeting out of poll screen"
  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity
        style={{ flex: 1, padding: 20, backgroundColor: "rgba(204, 255, 255, 0.5)" }}
        onPress={() => {
          //onPress();
        }}
      >
        {Globals.dev ? <Text style={{ fontSize: 10 }}>{message.id}</Text> : null}
        {Globals.dev ? (
          <Text style={{ fontSize: 10 }}>{JSON.stringify({ ...message, children: null })}</Text>
        ) : null}
        <View style={{ height: 22 }}>
          <Text style={{ fontWeight: "bold", fontSize: 12 }}>
            Creator Event Date &amp; Time Poll
          </Text>
        </View>
        <View style={{ height: 30 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20 }}>{message.title}</Text>
        </View>

        <View
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
              style={{
                paddingTop: 8,
                paddingBottom: 4,
                paddingLeft: 10,
                backgroundColor: "lightgrey",
                //marginTop: index == 0 ? 0 : 10,
                marginBottom: index == 0 ? 4 : 4,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>
                {moment(Date.toDate(option.startDate)).format("LLLL") +
                  " - " +
                  moment(Date.toDate(option.endTime)).format("LT")}
              </Text>
              {optionSummary.uid_list.length >= 0 && (
                <View style={{ marginLeft: 0 }}>
                  <FacePile userIds={optionSummary.uid_list} border />
                </View>
              )}
              {optionSummary.uid_list.length == 0 && (
                <View style={{ marginLeft: 0, height: 24 }}></View>
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
