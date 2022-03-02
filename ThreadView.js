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
import TimeAgo from "react-timeago";

export default function ThreadView({ messages, sendMessage }) {
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

  /*
      _id: message.id,
      text: message.text,
      createdAt: new Date(message.timestamp),
      user: {
        _id: message.uid,
        name: user.displayName ?? user.email,
        //avatar: "https://placeimg.com/140/140/any",
      },
*/

  const renderItem = ({ item }) => {
    const timeAgo = ({ children }) => {
      return (
        <Text
          style={{
            marginLeft: 5,
            fontWeight: "normal",
            fontSize: 14,
          }}
        >
          {children}
        </Text>
      );
    };
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
            title={item.user.name.charAt(0).toUpperCase()}
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
              {item.user.name}
            </Text>
            <View
              style={{
                marginLeft: 5,
                fontWeight: "normal",
                fontSize: 14,
              }}
            >
              <TimeAgo
                date={item.createdAt}
                style={{
                  marginLeft: 5,
                  fontWeight: "normal",
                  fontSize: 14,
                }}
                component={timeAgo}
              />
            </View>
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
            {item.text}
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
        sendMessage={sendMessage}
        closeModal={() => {
          setShowNewMessageModal(false);
        }}
      />
      <FlatList
        style={{ flex: 1 }}
        data={
          //DATA
          messages
        }
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
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
      </View>
    </View>
  );
}
