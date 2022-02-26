import React, { useState } from "react";
import { Button, ScrollView, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import * as Controller from "./Controller";
import * as Paper from "react-native-paper";
import Portal from "./Portal";
import * as UIConstants from "./UIConstants";
import { CheckBox, Icon } from "react-native-elements";

export default function InitialChooseSchoolsWizard({ navigation }) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { schoolList, schoolMap } = useSelector((state) => {
    return {
      schoolList: state.main.orgsList.filter((org) => org.type == "school"),
      schoolMap: state.main.orgsMap,
    };
  });

  const schoolListSorted = [...schoolList];
  schoolListSorted.sort((s1, s2) => {
    return s1.name.localeCompare(s2.name);
  });

  const [section, setSection] = useState("school");
  const [schoolSelection, setSchoolSelection] = useState({});

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }

  const schoolSection = (
    <View key="school_section" style={{ flex: 1 }}>
      <Text style={{ fontSize: 20 }}>Select Your School(s)</Text>
      <ScrollView>
        {schoolListSorted.map((school) => {
          return (
            <View
              key={school.id}
              style={{ alignItems: "center", flex: 1, flexDirection: "row" }}
            >
              {/*
              <CheckBox
                status={schoolSelection[school.id] ? "checked" : "unchecked"}
                uncheckedColor="red"
                onPress={() => {
                  const newSchoolSelection = { ...schoolSelection };
                  newSchoolSelection[school.id] =
                    newSchoolSelection[school.id] ?? false ? true : false;
                  setSchoolSelection(newSchoolSelection);
                }}
              />
              */}
              <CheckBox
                containerStyle={{
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                  padding: 0,
                }}
                title={<Text style={{ fontSize: 14 }}>{school.name}</Text>}
                checked={schoolSelection[school.id] ?? false}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                onPress={() => {
                  const newSchoolSelection = { ...schoolSelection };
                  const checked = !(newSchoolSelection[school.id] ?? false);

                  newSchoolSelection[school.id] = checked;
                  console.log(
                    "setting school selection: " +
                      school.id +
                      ": " +
                      checked +
                      "," +
                      JSON.stringify(newSchoolSelection)
                  );
                  setSchoolSelection(newSchoolSelection);
                }}
              />
            </View>
          );
        })}
      </ScrollView>
      <Button
        onPress={() => {
          Controller.initialUserProfileSchools(
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
    <Portal backgroundColor={UIConstants.DEFAULT_BACKGROUND}>
      <View style={{ flex: 1 }}>{section == "school" && schoolSection}</View>
    </Portal>
  );
}
