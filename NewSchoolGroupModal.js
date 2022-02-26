import React, { useState } from "react";
import { Modal, Text, View, TextInput } from "react-native";
import { ToggleButton } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import * as Paper from "react-native-paper";
import * as MyButtons from "./MyButtons";

export default function NewSchoolGroupModal({
  schoolId,
  visible,
  onCreateGroup,
  closeModal,
}) {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.main.userInfo);
  const { orgsList, orgsMap, groupList, groupMap, userGroupMemberships } =
    useSelector((state) => {
      return {
        orgsList: state.main.orgsList,
        orgsMap: state.main.orgsMap,
        groupList: state.main.groupList,
        groupMap: state.main.groupMap,
        userGroupMemberships: state.main.userGroupMemberships,
      };
    });
  const [gradeSelection, setGradeSelection] = useState(null);
  const [yearSelection, setYearSelection] = useState(null);
  const [groupName, setGroupName] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (userInfo == null) {
    return <Text>Loading Data...</Text>;
  }
  if (processing) {
    return (
      <Modal visible={true}>
        <Text>Creating group...</Text>
      </Modal>
    );
  }

  const grades = ["1", "2", "3", "4", "5", "6"];
  const years = ["2021/22", "2020/21", "Other"];
  return (
    <Modal visible={visible} animationType={"slide"}>
      <Text key="grade">Grade</Text>
      <View key="grades" style={{ flexDirection: "row" }}>
        {grades.map((grade) => {
          return (
            <Paper.Button
              key={"grade" + grade}
              mode={gradeSelection == grade ? "contained" : "outlined"}
              compact="true"
              onPress={() => {
                setGradeSelection(grade);
              }}
            >
              {grade}
            </Paper.Button>
          );
        })}
      </View>
      <Text key="group_name_label">Group Name</Text>
      <TextInput
        key="group_name_input"
        style={{ borderWidth: 1, width: "100%", fontSize: 16 }}
        onChangeText={(value) => {
          setGroupName(value);
        }}
        value={groupName ?? ""}
        selectTextOnFocus={true}
      />
      <Text key="year_label">Year</Text>
      <View key="year_selection" style={{ flexDirection: "row" }}>
        {years.map((year) => {
          return (
            <Paper.Button
              key={year}
              mode={yearSelection == year ? "contained" : "outlined"}
              compact="true"
              onPress={() => {
                setYearSelection(year);
              }}
            >
              {year}
            </Paper.Button>
          );
        })}
      </View>
      <MyButtons.FormButton
        key="create_button"
        text="Join"
        onPress={() => {
          setProcessing(true);
          onCreateGroup(
            groupName,
            //gradeSelection ?? null,
            "foo",
            //yearSelection ?? null
            "bar"
          ).then(() => {
            setProcessing(false);
            closeModal();
          });
        }}
      />
    </Modal>
  );
}
