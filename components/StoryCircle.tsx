import React from "react";
import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";

interface StoryCircleProps {
  imageUrl: string;
  username: string;
  hasNewStory?: boolean;
  onPress: () => void;
  size?: "small" | "medium" | "large";
}

export default function StoryCircle({
  imageUrl,
  username,
  hasNewStory = false,
  onPress,
  size = "medium",
}: StoryCircleProps) {
  const sizeStyles = {
    small: {
      container: { width: 70, height: 90 },
      gradient: { width: 60, height: 60, borderRadius: 30 },
      image: { width: 56, height: 56, borderRadius: 28 },
      text: { fontSize: 11 },
    },
    medium: {
      container: { width: 80, height: 100 },
      gradient: { width: 70, height: 70, borderRadius: 35 },
      image: { width: 66, height: 66, borderRadius: 33 },
      text: { fontSize: 12 },
    },
    large: {
      container: { width: 90, height: 110 },
      gradient: { width: 80, height: 80, borderRadius: 40 },
      image: { width: 76, height: 76, borderRadius: 38 },
      text: { fontSize: 13 },
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <Pressable style={[styles.container, currentSize.container]} onPress={onPress}>
      <LinearGradient
        colors={hasNewStory ? [Colors.accent, Colors.primary] : [Colors.textSecondary, Colors.textSecondary]}
        style={[styles.gradient, currentSize.gradient]}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={[styles.image, currentSize.image]} />
        </View>
      </LinearGradient>
      <Text style={[styles.username, currentSize.text]} numberOfLines={1}>
        {username}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginHorizontal: 5,
  },
  gradient: {
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  imageContainer: {
    backgroundColor: Colors.backgroundDark,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    backgroundColor: Colors.backgroundLight,
  },
  username: {
    color: Colors.text,
    marginTop: 5,
    textAlign: "center",
    width: "100%",
  },
});