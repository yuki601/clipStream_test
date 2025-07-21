import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Search, Edit3, Camera, Mic } from "lucide-react-native";
import Colors from "@/constants/colors";
import Header from "@/components/Header";
import { chatsApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface Message {
  id: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  lastMessage: string;
  timestamp: string;
  isRead: boolean;
  isOnline: boolean;
  messageType: 'text' | 'image' | 'video' | 'voice';
}

const mockMessages: Message[] = [
  {
    id: "msg1",
    friendId: "friend1",
    friendName: "Sniper King",
    friendAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
    lastMessage: "That clip was insane! 🔥",
    timestamp: "2m",
    isRead: false,
    isOnline: true,
    messageType: 'text'
  },
  {
    id: "msg2",
    friendId: "friend2",
    friendName: "Victory Royale",
    friendAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop",
    lastMessage: "Want to play some duos later?",
    timestamp: "15m",
    isRead: true,
    isOnline: false,
    messageType: 'text'
  },
  {
    id: "msg3",
    friendId: "friend3",
    friendName: "Speed Demon",
    friendAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop",
    lastMessage: "📷 Photo",
    timestamp: "1h",
    isRead: true,
    isOnline: true,
    messageType: 'image'
  },
  {
    id: "msg4",
    friendId: "friend4",
    friendName: "Trick Master",
    friendAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
    lastMessage: "🎵 Voice message",
    timestamp: "3h",
    isRead: false,
    isOnline: false,
    messageType: 'voice'
  },
  {
    id: "msg5",
    friendId: "friend5",
    friendName: "Comeback Kid",
    friendAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2680&auto=format&fit=crop",
    lastMessage: "Check out my new speedrun record!",
    timestamp: "1d",
    isRead: true,
    isOnline: false,
    messageType: 'text'
  }
];

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [latestMessages, setLatestMessages] = useState<{[chatId: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [userMap, setUserMap] = useState<{[id: string]: any}>({});
  const [unreadCounts, setUnreadCounts] = useState<{[chatId: string]: number}>({});

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    chatsApi.getUserChats(user.id)
      .then(async (chatList) => {
        setChats(chatList);
        // 各チャットの最新メッセージを取得
        const msgMap: {[chatId: string]: any} = {};
        const otherUserIds = new Set<string>();
        chatList.forEach((chat: any) => {
          (chat.user_ids as string[]).forEach((uid: string) => {
            if (uid !== user.id) otherUserIds.add(uid);
          });
        });
        // 相手ユーザー情報をまとめて取得
        if (otherUserIds.size > 0) {
          const { data: usersData } = await supabase.from('users').select('*').in('id', Array.from(otherUserIds));
          const map: {[id: string]: any} = {};
          (usersData || []).forEach((u: any) => { map[u.id] = u; });
          setUserMap(map);
        }
        await Promise.all(chatList.map(async (chat: any) => {
          const msgs = await chatsApi.getChatMessages(chat.id);
          if (msgs.length > 0) msgMap[chat.id] = msgs[msgs.length - 1];
        }));
        setLatestMessages(msgMap);
        // 各チャットの未読数を取得
        const unreadMap: {[chatId: string]: number} = {};
        await Promise.all(chatList.map(async (chat: any) => {
          const count = await chatsApi.getUnreadCount(chat.id, user.id);
          unreadMap[chat.id] = count;
        }));
        setUnreadCounts(unreadMap);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const filteredChats = chats.filter(chat => {
    // 検索は相手ユーザー名で（仮: user_ids以外の情報は要拡張）
    return chat.id.includes(searchQuery); // TODO: ユーザー名での検索に拡張
  });

  const unreadCount = 0; // TODO: 未読数取得ロジック

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const getMessageIcon = (type: Message["messageType"]) => {
    switch (type) {
      case 'image':
        return <Camera color={Colors.textSecondary} size={16} />;
      case 'voice':
        return <Mic color={Colors.textSecondary} size={16} />;
      default:
        return null;
    }
  };

  const MessageItem = ({ chat }: { chat: any }) => {
    const lastMsg = latestMessages[chat.id];
    const otherUserId = (chat.user_ids as string[]).find((uid: string) => uid !== user?.id);
    const otherUser = otherUserId ? userMap[otherUserId] : null;
    return (
      <Pressable 
        style={styles.messageItem} 
        onPress={() => handleChatPress(chat.id)}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: otherUser?.avatar || '' }} style={styles.avatar} />
          {unreadCounts[chat.id] > 0 && (
            <View style={styles.unreadDot} />
          )}
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.friendName}>{otherUser?.display_name || otherUser?.username || chat.id}</Text>
            <Text style={styles.timestamp}>{lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</Text>
          </View>
          <View style={styles.lastMessageContainer}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {lastMsg ? lastMsg.content : 'No messages yet'}
            </Text>
            {unreadCounts[chat.id] > 0 && (
              <Text style={styles.unreadCountBadge}>{unreadCounts[chat.id]}</Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Messages"
        showSearch={false}
        showNotification={true}
        showBack={false}
        showHome={true}
      />

      {/* Search and New Message */}
      <View style={styles.topSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search color={Colors.textSecondary} size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search messages..."
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        <Pressable style={styles.newMessageButton} onPress={() => router.push("/new-message")}>
          <Edit3 color={Colors.text} size={20} />
        </Pressable>
      </View>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <View style={styles.unreadCountContainer}>
          <Text style={styles.unreadCountText}>
            {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Messages List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <Text style={{ color: Colors.textSecondary }}>Loading...</Text>
        ) : (
          filteredChats.map((chat) => (
            <MessageItem key={chat.id} chat={chat} />
          ))
        )}

        {filteredChats.length === 0 && (
          <View style={styles.emptyState}>
            <Edit3 color={Colors.textSecondary} size={50} />
            <Text style={styles.emptyStateText}>
              {searchQuery ? "No messages found" : "No messages yet"}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery 
                ? "Try searching for a different name" 
                : "Start a conversation with your friends!"
              }
            </Text>
            {!searchQuery && (
              <Pressable 
                style={styles.startChatButton} 
                onPress={() => router.push("/new-message")}
              >
                <Text style={styles.startChatButtonText}>Start New Chat</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchContainer: {
    flex: 1,
    marginRight: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  newMessageButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadCountContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: `${Colors.primary}20`,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  unreadCountText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600" as const,
  },
  scrollView: {
    flex: 1,
  },
  messageItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  unreadMessage: {
    backgroundColor: `${Colors.primary}05`,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  lastMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginLeft: 5,
  },
  unreadText: {
    color: Colors.text,
    fontWeight: "500" as const,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 10,
  },
  unreadCountBadge: { backgroundColor: '#facc15', color: '#18181b', borderRadius: 10, paddingHorizontal: 6, marginLeft: 8, fontWeight: 'bold', fontSize: 12 },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginTop: 15,
    textAlign: "center",
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  startChatButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 20,
  },
  startChatButtonText: {
    color: Colors.text,
    fontWeight: "600" as const,
  },
});