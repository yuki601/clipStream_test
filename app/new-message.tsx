import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Image } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft, Search, MessageCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { chatsApi } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

const mockFriends = [
  {
    id: "friend1",
    name: "Sniper King",
    username: "sniper_king",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
    isOnline: true
  },
  {
    id: "friend2",
    name: "Victory Royale",
    username: "victory_royale",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop",
    isOnline: false
  },
  {
    id: "friend3",
    name: "Speed Demon",
    username: "speed_demon",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop",
    isOnline: true
  },
  {
    id: "friend4",
    name: "Trick Master",
    username: "trick_master",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
    isOnline: false
  },
  {
    id: "friend5",
    name: "Comeback Kid",
    username: "comeback_kid",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2680&auto=format&fit=crop",
    isOnline: true
  }
];

export default function NewMessageScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setUsers([]);
      return;
    }
    setLoading(true);
    supabase.from('users')
      .select('*')
      .ilike('username', `%${searchQuery}%`)
      .then(({ data }) => setUsers(data || []))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  const handleStartChat = async (friendId: string) => {
    if (!user) return;
    // 既存チャットがあれば再利用（簡易実装）
    const chat = await chatsApi.createChat([user.id, friendId]);
    router.push(`/chat/${chat.id}`);
  };

  const FriendItem = ({ friend }: { friend: any }) => (
    <Pressable style={styles.friendItem} onPress={() => handleStartChat(friend.id)}>
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: friend.avatar }} style={styles.avatar} />
        </View>
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{friend.display_name || friend.username}</Text>
          <Text style={styles.friendUsername}>@{friend.username}</Text>
        </View>
      </View>
      <Pressable style={styles.messageButton} onPress={() => handleStartChat(friend.id)}>
        <MessageCircle color={Colors.primary} size={20} />
      </Pressable>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <Text style={styles.headerTitle}>New Message</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color={Colors.textSecondary} size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search friends..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Friends List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Users</Text>
        {loading ? (
          <Text style={{ color: Colors.textSecondary }}>Loading...</Text>
        ) : (
          users.map((friend) => (
            <FriendItem key={friend.id} friend={friend} />
          ))
        )}
        {users.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <MessageCircle color={Colors.textSecondary} size={50} />
            <Text style={styles.emptyStateText}>No users found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try searching for a different name
            </Text>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 15,
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
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  friendDetails: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  friendUsername: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  friendStatus: {
    fontSize: 12,
    color: Colors.success,
    marginTop: 2,
  },
  messageButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
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
});