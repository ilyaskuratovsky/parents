import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Avatar, Divider } from "react-native-elements";

export default function ThreadView({ messages }) {
  const DATA = [
    {
      id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
      title: "First Item",
      message:
        "Hi there!\n My name is [name] and I am very happy to welcome you on board with [Company]!\nYou joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n[Benefit 1] [Benefit 2] [Benefit 3]\nThere’s just one more tiny step you need to take to achieve all these amazing things:\n[CTA that activates the customer]",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      message: "Hi there!",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      message:
        "Hi there!\n My name is [name] and I am very happy to welcome you on board with [Company]!\nYou joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n[Benefit 1] [Benefit 2] [Benefit 3]\nThere’s just one more tiny step you need to take to achieve all these amazing things:\n[CTA that activates the customer]",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      message: "Hi there!",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      message:
        "Hi there!\n My name is [name] and I am very happy to welcome you on board with [Company]!\nYou joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n[Benefit 1] [Benefit 2] [Benefit 3]\nThere’s just one more tiny step you need to take to achieve all these amazing things:\n[CTA that activates the customer]",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      message: "Hi there!",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      message:
        "Hi there!\n My name is [name] and I am very happy to welcome you on board with [Company]!\nYou joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n[Benefit 1] [Benefit 2] [Benefit 3]\nThere’s just one more tiny step you need to take to achieve all these amazing things:\n[CTA that activates the customer]",
    },
    {
      id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
      title: "Second Item",
      message: "Hi there!",
    },
    {
      id: "58694a0f-3da1-471f-bd96-145571e29d72",
      title: "Third Item",
      message:
        "Hi there!\n My name is [name] and I am very happy to welcome you on board with [Company]!\nYou joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n[Benefit 1] [Benefit 2] [Benefit 3]\nThere’s just one more tiny step you need to take to achieve all these amazing things:\n[CTA that activates the customer]",
    },
  ];
  const renderItem = ({ item }) => {
    return (
      <View
        style={{ backgroundColor: "orange", flexDirection: "row", flex: 1 }}
      >
        <View style={{ width: 20 }}>
          <Text>Gutter</Text>
        </View>
        <View style={{ padding: 10, borderRadius: 5, backgroundColor: "cyan" }}>
          <Text style={{ fontSize: 18, width: 240 }}>{item.message}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ paddingRight: 10, paddingLeft: 10 }}>
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{ flexDirection: "column-reverse" }}
      />
    </View>
  );
}
