import { Tabs } from "expo-router";
import React from "react";
import { Home, PlusCircle, User, Users, MessageCircle } from "lucide-react-native";
import { StyleSheet } from "react-native";
import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: styles.tabBar,
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="upload"
        options={{
          title: "Upload",
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ color, size }) => <MessageCircle color={color} size={size} />,
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="collections"
        options={{
          title: "Collections",
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />, // 仮アイコン
        }}
      />
      <Tabs.Screen
        name="badges"
        options={{
          title: "Badges",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />, // 仮アイコン
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />, // 仮アイコン
        }}
      />
      <Tabs.Screen
        name="officials"
        options={{
          title: "Officials",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />, // 仮アイコン
        }}
      />
      <Tabs.Screen
        name="collection-detail"
        options={{
          href: null, // タブには表示しない
        }}
      />
      <Tabs.Screen
        name="collection-create"
        options={{
          href: null, // タブには表示しない
        }}
      />
      <Tabs.Screen
        name="collection-edit"
        options={{
          href: null, // タブには表示しない
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.backgroundDark,
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 10,
  },
});