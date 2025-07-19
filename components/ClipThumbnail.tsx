import React from "react";
import { StyleSheet, View, Text, Image, Pressable, Dimensions } from "react-native";
import { Play } from "lucide-react-native";
import Colors from "@/constants/colors";
import { VideoClip } from "@/types";

interface ClipThumbnailProps {
  clip: VideoClip;
  onPress: () => void;
  size?: "small" | "medium" | "large";
}

const { width } = Dimensions.get("window");

export default function ClipThumbnail({
  clip,
  onPress,
  size = "medium",
}: ClipThumbnailProps) {
  const sizeStyles = {
    small: {
      container: { width: width / 3 - 10, height: (width / 3 - 10) * 1.5 },
      playIcon: 20,
    },
    medium: {
      container: { width: width / 2 - 15, height: (width / 2 - 15) * 1.5 },
      playIcon: 30,
    },
    large: {
      container: { width: width - 30, height: (width - 30) * 0.6 },
      playIcon: 40,
    },
  };

  const currentSize = sizeStyles[size];

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Pressable style={[styles.container, currentSize.container]} onPress={onPress}>
      <Image source={{ uri: clip.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.overlay}>
        <View style={styles.playButton}>
          <Play color={Colors.text} size={currentSize.playIcon} />
        </View>
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>{formatDuration(clip.duration)}</Text>
        </View>
        {clip.isPinned && (
          <View style={styles.pinnedBadge}>
            <Text style={styles.pinnedText}>Pinned</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 5,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: Colors.backgroundLight,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  playButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: Colors.text,
    fontSize: 10,
  },
  pinnedBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  pinnedText: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: "600" as const,
  },
});