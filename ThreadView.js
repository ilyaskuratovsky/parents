import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Avatar, Divider } from "react-native-elements";

export default function ThreadView({ messages }) {
  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 6,
          width: "100%",
          backgroundColor: "lightgrey",
        }}
      />
    );
  };

  const { height, width } = useWindowDimensions();
  const windowWidth = width ?? 0;
  const DATA = [
    {
      id: "1",
      title: "First Item",
      sender: "Ilya Skuratovsky",
      ago: "1 day ago",
      message:
        "Hi there!\n" +
        "My name is [name] and I am very happy to welcome you on board with [Company]!\n" +
        "You joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n" +
        "[Benefit 1] [Benefit 2] [Benefit 3]\n" +
        "There’s just one more tiny step you need to take to achieve all these amazing things:\n" +
        "[CTA that activates the customer]",
    },
    {
      id: "2",
      title: "Second Item",
      message: "Hi there!",
      sender: "Inga Skuratovsky",
      ago: "1 day ago",
    },
    {
      id: "3",
      title: "Third Item",
      sender: "Sowmya",
      ago: "1 day ago",
      replyingTo: "Inga Skuratovsky",
      replyingToMessage:
        "Hi there!\nMy name is [name] and I am very happy to welcome you on board with [Company]!\nYou joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n[Benefit 1] [Benefit 2] [Benefit 3]\nThere’s just one more tiny step you need to take to achieve all these amazing things:\n[CTA that activates the customer]",
      message:
        "Hi there!\nMy name is [name] and I am very happy to welcome you on board with [Company]!\nYou joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n[Benefit 1] [Benefit 2] [Benefit 3]\nThere’s just one more tiny step you need to take to achieve all these amazing things:\n[CTA that activates the customer]",
    },
    {
      id: "4",
      title: "Second Item",
      message: "Hi there!",
      ago: "1 day ago",
      sender: "Inga Skuratovsky",
    },
    {
      id: "5",
      title: "Third Item",
      ago: "1 day ago",
      sender: "Melissa DeVita",
      message:
        "Hi there!\nMy name is [name] and I am very happy to welcome you on board with [Company]!\nYou joined thousands of [user’s persona profession] who are already skyrocketing their sales with [Company] by:\n[Benefit 1] [Benefit 2] [Benefit 3]\nThere’s just one more tiny step you need to take to achieve all these amazing things:\n[CTA that activates the customer]",
    },
    {
      id: "6",
      title: "Second Item",
      ago: "1 day ago",
      message: "Hi there!",
      sender: "Inga Skuratovsky",
    },
  ];
  const renderItem = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "column",
          width: windowWidth,
          paddingTop: 14,
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 14,
        }}
      >
        {item.replyingTo && (
          <View
            style={{
              paddingLeft: 10,
              paddingTop: 5,
              borderRadius: 10,
              backgroundColor: "gainsboro",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                paddingBottom: 10,
                fontSize: 14,
                width: windowWidth - 20,
              }}
            >
              Replying to {item.replyingTo}
            </Text>
            <Text
              style={{
                paddingBottom: 10,
                fontSize: 14,
                width: windowWidth - 20,
              }}
              numberOfLines={2}
            >
              {item.replyingToMessage}
            </Text>
          </View>
        )}
        <View
          style={{
            width: windowWidth,
            justifyContent: "flex-start",
            flexDirection: "row",
            alignItems: "flex-start",
            paddingBottom: 5,
            backgroundColor: "white",
          }}
        >
          <Avatar
            size={36}
            rounded
            title="I"
            containerStyle={{
              backgroundColor: "coral",
              marginRight: 1,
            }}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={{ marginLeft: 5, fontWeight: "bold", fontSize: 16 }}>
              {item.sender}
            </Text>
            <Text style={{ marginLeft: 5, fontWeight: "normal", fontSize: 12 }}>
              {item.ago}
            </Text>
          </View>
        </View>
        <View
          style={{
            width: windowWidth - 20,
            paddingLeft: 0,
            paddingTop: 10,
            borderRadius: 0,
            backgroundColor: "white",
          }}
        >
          <Text
            style={{ paddingLeft: 8, fontSize: 16, width: windowWidth - 20 }}
          >
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <FlatList
        style={{ flex: 1 }}
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted
        contentContainerStyle={{
          width: windowWidth,
        }}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
      <View style={{ height: 50 }}>
        <Text>Bottom Bar</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});
