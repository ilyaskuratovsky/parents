import React, { useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ThreadMessageModal from "./ThreadMessageModal";
export default function ThreadView({ messages }) {
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
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
  const [showMore, setShowMore] = useState({});
  const DATA = [
    {
      id: "1",
      title: "First Item",
      sender: "Ilya Skuratovsky",
      ago: "8:58 pm",
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
      ago: "7:01 pm",
    },
    {
      id: "3",
      title: "Third Item",
      sender: "Sowmya",
      ago: "6 hours ago",
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
      ago: "8:58 pm",
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
            alignItems: "center",
            paddingBottom: 5,
            backgroundColor: "white",
          }}
        >
          <Avatar
            size={28}
            rounded
            title="I"
            containerStyle={{
              backgroundColor: "coral",
              marginRight: 1,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingRight: 20,
            }}
          >
            <Text
              style={{
                marginLeft: 5,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {item.sender}
            </Text>
            <Text
              style={{
                marginLeft: 5,
                fontWeight: "normal",
                fontSize: 14,
              }}
            >
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
            numberOfLines={showMore[item.id] ? null : 4}
            style={{
              paddingLeft: 8,
              fontSize: 16,
              width: windowWidth - 20,
            }}
          >
            {item.message}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              const newShowMore = { ...showMore };
              newShowMore[item.id] = true;
              setShowMore(newShowMore);
            }}
          >
            <Icon name="reply" style={{ color: "lightgrey", fontSize: 20 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flexDirection: "column", flex: 1 }}>
      <ThreadMessageModal
        visible={showNewMessageModal}
        closeModal={() => {
          setShowNewMessageModal(false);
        }}
      />
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
      <View
        style={{
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: 10,
          paddingRight: 10,
          paddingBottom: 10,
          width: windowWidth,
          //backgroundColor: "orange",
        }}
      >
        {/*
        <Button
          buttonStyle={{ width: 150 }}
          containerStyle={{ margin: 2 }}
          disabledStyle={{
            borderWidth: 2,
            borderColor: "#00F",
          }}
          disabledTitleStyle={{ color: "#00F" }}
          linearGradientProps={null}
          icon={<Icon name="react" size={15} color="#0FF" />}
          iconContainerStyle={{ background: "#000" }}
          loadingProps={{ animating: true }}
          loadingStyle={{}}
          onPress={() => alert("click")}
          title="Hello"
          titleProps={{}}
          titleStyle={{ marginHorizontal: 5 }}
        />
        */}
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "darkgrey",
            borderRadius: 14,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
          onPress={() => {
            setShowNewMessageModal(true);
          }}
        >
          <Text
            style={{
              paddingLeft: 10,
              //backgroundColor: "green",
              fontSize: 14,
              color: "lightgrey",
            }}
          >
            New Message...
          </Text>
        </TouchableOpacity>
        {/*
        <Input
          containerStyle={{}}
          disabledInputStyle={{ background: "#ddd" }}
          inputContainerStyle={{}}
          errorStyle={{}}
          errorProps={{}}
          inputStyle={{}}
          labelStyle={{}}
          labelProps={{}}
          leftIconContainerStyle={{}}
          rightIconContainerStyle={{}}
          placeholder="Type message"
        />
        */}
        {/*
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            fontSize: 16,
            padding: 10,
            height: 50,
            width: "100%",
            borderRadius: 12,
          }}
          value={""}
          onSubmitEditing={() => {}}
          placeholder="New Message..."
          returnKeyType="send"
          //ref="newMessage"
          onFocus={() => {}}
          onBlur={() => {
            //this.refs.scrollView.scrollTo(0, 0);
          }}
          onChangeText={() => {
            //this.updateMessageState
          }}
        />
        */}
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
