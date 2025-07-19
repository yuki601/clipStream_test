import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Search, UserPlus, UserCheck, MessageCircle, MoreVertical, Users } from "lucide-react-native";
import Colors from "@/constants/colors";
import Header from "@/components/Header";
import { mockUsers } from "@/mocks/users";

interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  mutualFriends: number;
  status: 'friends' | 'pending' | 'not_friends';
}

const mockFriends: Friend[] = [
  {
    id: "friend1",
    username: "sniper_king",
    displayName: "Sniper King",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
    isOnline: true,
    mutualFriends: 5,
    status: 'friends'
  },
  {
    id: "friend2",
    username: "victory_royale",
    displayName: "Victory Royale",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop",
    isOnline: false,
    lastSeen: "2h ago",
    mutualFriends: 3,
    status: 'friends'
  },
  {
    id: "friend3",
    username: "speed_demon",
    displayName: "Speed Demon",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop",
    isOnline: true,
    mutualFriends: 8,
    status: 'friends'
  },
  {
    id: "pending1",
    username: "trick_master",
    displayName: "Trick Master",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
    isOnline: false,
    lastSeen: "1d ago",
    mutualFriends: 2,
    status: 'pending'
  },
  {
    id: "suggested1",
    username: "comeback_kid",
    displayName: "Comeback Kid",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2680&auto=format&fit=crop",
    isOnline: true,
    mutualFriends: 4,
    status: 'not_friends'
  }
];

export default function FriendsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "pending" | "suggestions">("friends");

  const friends = mockFriends.filter(f => f.status === 'friends');
  const pendingRequests = mockFriends.filter(f => f.status === 'pending');
  const suggestions = mockFriends.filter(f => f.status === 'not_friends');

  const filteredData = () => {
    let data = [];
    switch (activeTab) {
      case "friends":
        data = friends;
        break;
      case "pending":
        data = pendingRequests;
        break;
      case "suggestions":
        data = suggestions;
        break;
    }
    
    if (searchQuery) {
      return data.filter(friend => 
        friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        friend.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data;
  };

  const handleMessage = (friendId: string) => {
    router.push(`/chat/${friendId}`);
  };

  const handleAddFriend = (friendId: string) => {
    console.log("Adding friend:", friendId);
  };

  const handleAcceptRequest = (friendId: string) => {
    console.log("Accepting friend request:", friendId);
  };

  const FriendItem = ({ friend }: { friend: Friend }) => (
    <View style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: friend.avatar }} style={styles.avatar} />
          {friend.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.friendDetails}>
          <Text style={styles.friendName}>{friend.displayName}</Text>
          <Text style={styles.friendUsername}>@{friend.username}</Text>
          <Text style={styles.friendStatus}>
            {friend.isOnline ? "Online" : friend.lastSeen}
          </Text>
          <Text style={styles.mutualFriends}>
            {friend.mutualFriends} mutual friends
          </Text>
        </View>
      </View>
      <View style={styles.friendActions}>
        {friend.status === 'friends' && (
          <>
            <Pressable 
              style={styles.actionButton} 
              onPress={() => handleMessage(friend.id)}
            >
              <MessageCircle color={Colors.primary} size={20} />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <MoreVertical color={Colors.textSecondary} size={20} />
            </Pressable>
          </>
        )}
        {friend.status === 'pending' && (
          <Pressable 
            style={styles.acceptButton} 
            onPress={() => handleAcceptRequest(friend.id)}
          >
            <UserCheck color={Colors.text} size={16} />
            <Text style={styles.acceptButtonText}>Accept</Text>
          </Pressable>
        )}
        {friend.status === 'not_friends' && (
          <Pressable 
            style={styles.addButton} 
            onPress={() => handleAddFriend(friend.id)}
          >
            <UserPlus color={Colors.text} size={16} />
            <Text style={styles.addButtonText}>Add</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Friends"
        showSearch={false}
        showNotification={true}
        showBack={false}
        showHome={true}
      />

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

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === "friends" && styles.activeTab]}
          onPress={() => setActiveTab("friends")}
        >
          <Text style={[styles.tabText, activeTab === "friends" && styles.activeTabText]}>
            Friends ({friends.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "pending" && styles.activeTab]}
          onPress={() => setActiveTab("pending")}
        >
          <Text style={[styles.tabText, activeTab === "pending" && styles.activeTabText]}>
            Requests ({pendingRequests.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "suggestions" && styles.activeTab]}
          onPress={() => setActiveTab("suggestions")}
        >
          <Text style={[styles.tabText, activeTab === "suggestions" && styles.activeTabText]}>
            Suggestions
          </Text>
        </Pressable>
      </View>

      {/* Friends List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredData().map((friend) => (
          <FriendItem key={friend.id} friend={friend} />
        ))}

        {filteredData().length === 0 && (
          <View style={styles.emptyState}>
            <Users color={Colors.textSecondary} size={50} />
            <Text style={styles.emptyStateText}>
              {activeTab === "friends" ? "No friends yet" : 
               activeTab === "pending" ? "No pending requests" : "No suggestions"}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {activeTab === "friends" ? "Start connecting with other gamers!" :
               activeTab === "pending" ? "Friend requests will appear here" : "Check back later for friend suggestions"}
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
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontWeight: "500" as const,
    fontSize: 14,
  },
  activeTabText: {
    color: Colors.text,
    fontWeight: "700" as const,
  },
  scrollView: {
    flex: 1,
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
  mutualFriends: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  friendActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  acceptButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.success,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  acceptButtonText: {
    color: Colors.text,
    fontWeight: "600" as const,
    marginLeft: 5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: Colors.text,
    fontWeight: "600" as const,
    marginLeft: 5,
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