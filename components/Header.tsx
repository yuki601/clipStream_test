import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Search, Bell, ArrowLeft, Home } from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";

interface HeaderProps {
  title?: string;
  showSearch?: boolean;
  showNotification?: boolean;
  showBack?: boolean;
  showHome?: boolean;
  onBackPress?: () => void;
}

export default function Header({
  title = "ClipStream",
  showSearch = true,
  showNotification = true,
  showBack = false,
  showHome = false,
  onBackPress,
}: HeaderProps) {
  const router = useRouter();

  const handleSearchPress = () => {
    router.push({ pathname: '/search' }); // 修正
  };

  const handleNotificationPress = () => {
    router.push({ pathname: "/notifications" }); // 修正
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleHomePress = () => {
    router.push({ pathname: "/(tabs)" }); // 修正
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        {showBack && (
          <Pressable style={styles.iconButton} onPress={handleBackPress}>
            <ArrowLeft color={Colors.text} size={24} />
          </Pressable>
        )}
        {showHome && (
          <Pressable style={[styles.iconButton, showBack && styles.marginLeft]} onPress={handleHomePress}>
            <Home color={Colors.text} size={24} />
          </Pressable>
        )}
        <Text style={[styles.title, (showBack || showHome) && styles.titleWithButtons]}>{title}</Text>
      </View>
      <View style={styles.actions}>
        {showSearch && (
          <Pressable style={styles.iconButton} onPress={handleSearchPress}>
            <Search color={Colors.text} size={24} />
          </Pressable>
        )}
        {showNotification && (
          <Pressable style={styles.iconButton} onPress={handleNotificationPress}>
            <Bell color={Colors.text} size={24} />
            <View style={styles.notificationBadge} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: Colors.backgroundDark,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  titleWithButtons: {
    marginLeft: 15,
  },
  actions: {
    flexDirection: "row",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  marginLeft: {
    marginLeft: 10,
  },
  notificationBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accent,
  },
});