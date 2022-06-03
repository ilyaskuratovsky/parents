import * as Calendar from "expo-calendar";
import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment-timezone";

import {
  Alert,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-elements";
import { IconButton } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import CommentView from "./CommentView";
import * as Controller from "../common/Controller";
import * as MessageUtils from "../common/MessageUtils";
import * as MyButtons from "./MyButtons";
import Portal from "./Portal";
import * as Globals from "./Globals";
import TopBarMiddleContentSideButtons from "./TopBarMiddleContentSideButtons";
import * as UIConstants from "./UIConstants";
import * as UserInfo from "../common/UserInfo";
import * as Logger from "../common/Logger";

export default function BookCalendarEventModal({
  title,
  notes,
  startDate,
  endDate,
  timezone,
  onComplete,
  visible,
  onDismiss,
}) {
  const [calendars, setCalendars] = useState(null);
  const [calendarMap, setCalendarMap] = useState(null);

  useEffect(async () => {
    if (visible) {
      Logger.log("requesting calendar permission");
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        Logger.log("requesting calendar permission: granted");
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const calendarMap = calendars
          .filter((cal) => {
            return cal.allowsModifications === true;
          })
          .reduce((map, cal) => {
            const source = cal.source.name;
            if (map[source] == null) {
              map[source] = [];
            }
            map[source].push(cal);
            return map;
          }, {});
        setCalendars(calendars);
        setCalendarMap(calendarMap);
      }
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType={"slide"}>
      <Portal
        backgroundColor={UIConstants.DEFAULT_BACKGROUND}
        //backgroundColor="green"
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <SafeAreaView style={{ flex: 1, flexDirection: "column" }}>
            {Globals.dev && (
              <>
                <Text>BookCalendarEventModal.js</Text>
                <Text>
                  title: {title}, notes: {notes}, startDate: {moment(startDate).format("LLLL")},
                  endDate:
                  {moment(endDate).format("LLLL")}
                  onDismiss: {onDismiss == null ? "null" : "not null"}
                </Text>
              </>
            )}
            {calendarMap == null && <Text>Loading...</Text>}
            <ScrollView style={{ height: 200, backgroundColor: "gray" }}>
              {(calendarMap != null ? Object.keys(calendarMap) : [])
                .sort((source1, source2) => source1.localeCompare(source2))
                .map((source, i) => {
                  const calendars = calendarMap[source];
                  return (
                    <View key={source}>
                      <Text>{source}</Text>
                      <View
                        style={{
                          backgroundColor: "white",
                          borderRadius: 10,
                          padding: 10,
                          flexDirection: "column",
                        }}
                      >
                        {calendars.map((calendar, i) => {
                          console.log("color: " + JSON.stringify(calendar.color));
                          return (
                            <TouchableOpacity
                              key={i}
                              style={{ flexDirection: "column" }}
                              onPress={() => {
                                createEvent(calendar, title, notes, startDate, endDate)
                                  .then((eventId) => {
                                    Alert.alert("Done", null, [
                                      {
                                        text: "OK",
                                        onPress: async () => {
                                          onComplete();
                                        },
                                      },
                                    ]);
                                  })
                                  .catch((error) => {
                                    Alert.alert("caught error: " + JSON.stringify(error));
                                  });
                              }}
                            >
                              <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View
                                  style={{
                                    height: 20,
                                    width: 20,
                                    backgroundColor: calendar.color ?? "gray",
                                  }}
                                ></View>
                                <Text style={{ fontSize: 8, fontWeight: "bold" }}>
                                  {calendar?.title ?? "null"}
                                </Text>
                              </View>
                              {Globals.dev && (
                                <Text style={{ fontSize: 8 }}>
                                  {JSON.stringify(calendar, 2, null)}
                                </Text>
                              )}
                              {i < calendars.length - 1 && (
                                <Divider
                                  style={{ marginTop: 20, marginBottom: 10 }}
                                  width={3}
                                  color="lightgrey"
                                />
                              )}
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
            </ScrollView>
            <Button title="Cancel" onPress={() => onDismiss()} />
          </SafeAreaView>
        </View>
      </Portal>
    </Modal>
  );
}

async function createEvent(calendar, title, notes, startDate, endDate) {
  let dateMs = Date.parse("2022-04-11");

  Calendar.createEventAsync(calendar?.id, {
    //title: "ilya test 3",
    title: title,
    startDate: startDate,
    endDate: endDate,
    notes: notes,
    //timeZone: "America/New_York",
    //timeZone: timeZone,
    location: "",
  })
    .then((eventId) => {
      return eventId;
    })
    .catch((error) => {
      Alert.alert("got error booking in calnar: " + JSON.stringify(error));
    });
  // console.log(`calendar ID is: ${id}`)
}
