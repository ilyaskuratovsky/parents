// @flow strict-local

import moment from "moment-timezone";
import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Globals from "./Globals";
import * as UIConstants from "./UIConstants";
import { useDispatch, useSelector } from "react-redux";
import * as Actions from "../common/Actions";
import * as Debug from "../common/Debug";
import { Badge } from "react-native-elements";
import RootMessage from "../common/MessageData";
import * as Dates from "../common/Date.js";
import nullthrows from "nullthrows";

type Props = {
  item: RootMessage,
  showGroup?: ?boolean,
};
export default function EventMessageView({ item, showGroup = false }: Props): React.Node {
  const dispatch = useDispatch();
  const debugMode = Debug.isDebugMode();
  const timestamp = item.getTimestamp();
  const event = nullthrows(
    item.getEvent(),
    `EventMessageView.js item event is null for message id $item.getID()`
  );
  const eventSummary = item.getEventSummary();
  const eventStart = Dates.toDate(event.start);
  const eventEnd = moment(item.getEvent()?.end).toDate();

  return (
    <View style={{ flex: 1 }}>
      {debugMode ? <Text style={{ fontSize: 10 }}>{item.getID()}</Text> : null}
      {debugMode ? (
        <Text style={{ fontSize: 10 }}>{JSON.stringify({ ...item, children: null }, null, 2)}</Text>
      ) : null}
      <TouchableOpacity
        style={{ flex: 1, padding: 20, backgroundColor: "rgba(204, 255, 255, 0.5)" }}
        onPress={() => {
          dispatch(
            Actions.openModal({
              modal: "EVENT",
              messageId: item.getID(),
            })
          );
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", paddingRight: 20 }}>
          <View
            style={{
              paddingLeft: 0,
              paddingTop: 15,
              alignItems: "center",
              justifyContent: "flex-start",
              width: 20,
              //backgroundColor: "cyan",
            }}
          >
            {item.getUserStatus()?.status != "read" && (
              <Badge status="primary" value={""} containerStyle={{ width: 12, height: 12 }} />
            )}
          </View>
          <View
            style={{
              flexGrow: 1,
              flexDirection: "column",
              paddingTop: 10,
            }}
          >
            <View style={{ height: 22 }}>
              <Text style={{ fontWeight: "bold", fontSize: 12 }}>Event</Text>
            </View>
            <View style={{ height: 30 }}>
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>{item.getTitle()}</Text>
            </View>
            <View style={{ height: 24 }}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>
                {moment(eventStart).format("LLLL")} - {moment(eventEnd).format("LT")}
              </Text>
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
                {(item.getText() ?? "").replace(/(\r\n|\n|\r)/gm, " ")}
              </Text>
            </View>

            {eventSummary != null && (
              <View style={{ flexDirection: "row" }}>
                <Text>{eventSummary.acceptedCount} Accepted</Text>
                <Text>{eventSummary.declinedCount} Declined</Text>
                <Text>{eventSummary.notRespondedCount} Not Responded</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
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
                modal: "EVENT",
                messageId: item.getID(),
              })
            );
          }}
        >
          <Text>Going</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            flex: 1, //backgroundColor: "cyan"
          }}
        >
          <Text>Not Going</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            flex: 1, //backgroundColor: "cyan"
          }}
        >
          <Text>Maybe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
