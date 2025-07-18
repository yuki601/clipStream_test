import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, Image } from "react-native";
import { useRouter } from "expo-router";
import { Heart, MessageCircle, UserPlus, Play, Settings } from "lucide-react-native";
import Colors from "../constants/Colors";
import Header from "../components/Header";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "clip";
  user: {
    username: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  isRead: boolean;
  clipThumbnail?: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "like",
    user: {
      username: "sniper_king",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
    },
    message: "liked your clip 'Epic Clutch Win'",
    timestamp: "2m",
    isRead: false,
    clipThumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "2",
    type: "comment",
    user: {
      username: "victory_royale",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop",
    },
    message: "commented on your clip: 'That was insane! 🔥'",
    timestamp: "5m",
    isRead: false,
    clipThumbnail: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2670&auto=format&fit=crop",
  },
  {
    id: "3",
    type: "follow",
    user: {
      username: "speed_demon",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop",
    },
    message: "started following you",
    timestamp: "10m",
    isRead: false,
  },
  {
    id: "4",
    type: "clip",
    user: {
      username: "trick_master",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
    },
    message: "posted a new clip",
    timestamp: "15m",
    isRead: true,
    clipThumbnail: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2671&auto=format&fit=crop",
  },
  {
    id: "5",
    type: "like",
    user: {
      username: "comeback_kid",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2680&auto=format&fit=crop",
    },
    message: "and 12 others liked your clip 'Speedrun World Record'",
    timestamp: "1h",
    isRead: true,
    clipThumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop",
  },
  {
    id: "6",
    type: "comment",
    user: {
      username: "sniper_king",
      avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
    },
    message: "replied to your comment",
    timestamp: "2h",
    isRead: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "like":
        return <Heart color={Colors.accent} size={20} fill={Colors.accent} />;
      case "comment":
        return <MessageCircle color={Colors.secondary} size={20} />;
      case "follow":
        return <UserPlus color={Colors.primary} size={20} />;
      case "clip":
        return <Play color={Colors.success} size={20} />;
      default:
        return <Heart color={Colors.textSecondary} size={20} />;
    }
  };

  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        showSearch={true}
        showNotification={false}
        showBack={true}
        showHome={true}
      />

      {/* Filter and Actions */}
      <View style={styles.actionsContainer}>
        <View style={styles.filterContainer}>
          <Pressable
            style={[styles.filterButton, filter === "all" && styles.activeFilter]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterText, filter === "all" && styles.activeFilterText]}>
              All
            </Text>
          </Pressable>
          <Pressable
            style={[styles.filterButton, filter === "unread" && styles.activeFilter]}
            onPress={() => setFilter("unread")}
          >
            <Text style={[styles.filterText, filter === "unread" && styles.activeFilterText]}>
              Unread ({unreadCount})
            </Text>
          </Pressable>
        </View>
        {unreadCount > 0 && (
          <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
            <Text style={styles.markAllButtonText}>Mark all as read</Text>
          </Pressable>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Settings color={Colors.textSecondary} size={50} />
            <Text style={styles.emptyStateText}>
              {filter === "unread" ? "No unread notifications" : "No notifications yet"}
            </Text>
            <Text style={styles.emptyStateSubtext}>
              {filter === "unread" 
                ? "You're all caught up!"
                : "When people interact with your clips, you'll see it here"
              }
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notification) => (
            <Pressable
              key={notification.id}
              style={[
                styles.notificationItem,
                !notification.isRead && styles.unreadNotification,
              ]}
              onPress={() => markAsRead(notification.id)}
            >
              <View style={styles.notificationContent}>
                <View style={styles.userInfo}>
                  <Image
                    source={{ uri: notification.user.avatar }}
                    style={styles.userAvatar}
                  />
                  <View style={styles.notificationIcon}>
                    {getNotificationIcon(notification.type)}
                  </View>
                </View>
                <View style={styles.notificationText}>
                  <Text style={styles.notificationMessage}>
                    <Text style={styles.username}>{notification.user.username}</Text>
                    {" " + notification.message}
                  </Text>
                  <Text style={styles.timestamp}>{notification.timestamp}</Text>
                </View>
                {notification.clipThumbnail && (
                  <Image
                    source={{ uri: notification.clipThumbnail }}
                    style={styles.clipThumbnail}
                  />
                )}
              </View>
              {!notification.isRead && <View style={styles.unreadDot} />}
            </Pressable>
          ))
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
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterContainer: {
    flexDirection: "row",
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: Colors.backgroundLight,
  },
  activeFilter: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  activeFilterText: {
    color: Colors.text,
    fontWeight: "600" as const,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllButtonText: {
    color: Colors.primary,
    fontWeight: "600" as const,
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  unreadNotification: {
    backgroundColor: `${Colors.primary}05`,
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    position: "relative",
    marginRight: 12,
  },
  userAvatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  notificationIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.backgroundDark,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.backgroundDark,
  },
  notificationText: {
    flex: 1,
    marginRight: 10,
  },
  notificationMessage: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
  username: {
    fontWeight: "600" as const,
    color: Colors.text,
  },
  timestamp: {
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  clipThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 10,
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