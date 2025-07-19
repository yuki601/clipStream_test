import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Image, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Send, Camera, Mic, Smile, MoreVertical } from "lucide-react-native";
import Colors from "@/constants/colors";

interface ChatMessage {
  id: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  type: 'text' | 'image' | 'voice';
}

const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    text: "Hey! Did you see my latest clip?",
    timestamp: "10:30 AM",
    isMe: false,
    type: 'text'
  },
  {
    id: "2",
    text: "Yeah! That sniper shot was incredible 🎯",
    timestamp: "10:32 AM",
    isMe: true,
    type: 'text'
  },
  {
    id: "3",
    text: "Thanks! I've been practicing that angle for weeks",
    timestamp: "10:33 AM",
    isMe: false,
    type: 'text'
  },
  {
    id: "4",
    text: "Want to play some duos later? I'm trying to hit Diamond rank",
    timestamp: "10:35 AM",
    isMe: true,
    type: 'text'
  },
  {
    id: "5",
    text: "Absolutely! I'll be online around 8 PM",
    timestamp: "10:36 AM",
    isMe: false,
    type: 'text'
  }
];

const friendData = {
  friend1: { name: "Sniper King", avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop", isOnline: true },
  friend2: { name: "Victory Royale", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop", isOnline: false },
  friend3: { name: "Speed Demon", avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop", isOnline: true },
};

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockChatMessages);
  const scrollViewRef = useRef<ScrollView>(null);

  const friend = friendData[id as keyof typeof friendData] || friendData.friend1;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        type: 'text'
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const MessageBubble = ({ msg }: { msg: ChatMessage }) => (
    <View style={[styles.messageContainer, msg.isMe ? styles.myMessage : styles.theirMessage]}>
      <View style={[styles.messageBubble, msg.isMe ? styles.myBubble : styles.theirBubble]}>
        <Text style={[styles.messageText, msg.isMe ? styles.myMessageText : styles.theirMessageText]}>
          {msg.text}
        </Text>
      </View>
      <Text style={styles.messageTime}>{msg.timestamp}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <View style={styles.friendInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: friend.avatar }} style={styles.avatar} />
            {friend.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <View>
            <Text style={styles.friendName}>{friend.name}</Text>
            <Text style={styles.friendStatus}>
              {friend.isOnline ? "Online" : "Last seen 2h ago"}
            </Text>
          </View>
        </View>
        <Pressable style={styles.moreButton}>
          <MoreVertical color={Colors.text} size={24} />
        </Pressable>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <Pressable style={styles.attachButton}>
            <Camera color={Colors.textSecondary} size={24} />
          </Pressable>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            placeholderTextColor={Colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <Pressable style={styles.emojiButton}>
            <Smile color={Colors.textSecondary} size={24} />
          </Pressable>
          {message.trim() ? (
            <Pressable style={styles.sendButton} onPress={sendMessage}>
              <Send color={Colors.text} size={20} />
            </Pressable>
          ) : (
            <Pressable style={styles.voiceButton}>
              <Mic color={Colors.textSecondary} size={24} />
            </Pressable>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  friendInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  friendStatus: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 15,
  },
  messageContainer: {
    marginBottom: 15,
  },
  myMessage: {
    alignItems: "flex-end",
  },
  theirMessage: {
    alignItems: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 5,
  },
  theirBubble: {
    backgroundColor: Colors.backgroundLight,
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: Colors.text,
  },
  theirMessageText: {
    color: Colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 5,
    marginHorizontal: 15,
  },
  inputContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: Colors.text,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
  },
  emojiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
});