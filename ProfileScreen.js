import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import {
  TouchableOpacity,
  Text,
  View,
  ScrollView,
  CheckBox,
  Button,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "./Controller";
/*
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
*/
import * as Firestore from "firebase/firestore";
import { signOut } from "firebase/auth";

import { auth, database } from "./config/firebase";

export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap } = useSelector((state) => {
    return {
      schoolList: state.main.schoolList,
      schoolMap: state.main.schoolMap,
    };
  });

  const [section, setSection] = useState("school");
  const [schoolSelection, setSchoolSelection] = useState({});

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  const schoolSection = (
    <View key="school_section" style={{ flex: 1 }}>
      <ScrollView>
        {schoolList.map((school) => {
          return (
            <View key={school.id} style={{ flex: 1, flexDirection: "row" }}>
              <CheckBox
                value={schoolSelection[school.id]}
                onValueChange={(val) => {
                  const newSchoolSelection = { ...schoolSelection };
                  newSchoolSelection[school.id] = val;
                  setSchoolSelection(newSchoolSelection);
                }}
              />
              <Text>{school.name}</Text>
            </View>
          );
        })}
      </ScrollView>
      <Button
        onPress={() => {
          Controller.saveUserProfileSchools(
            dispatch,
            userInfo,
            Object.keys(schoolSelection).filter((id) => schoolSelection[id])
          );
        }}
        title="Done"
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Text key="profile">Profile Screenx {JSON.stringify(userInfo)}</Text>
      {section == "school" && schoolSection}
    </View>
  );
}
