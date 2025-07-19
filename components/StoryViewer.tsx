import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, FlatList, Dimensions, Animated, Pressable } from "react-native";
import { ArrowLeft, Home } from "lucide-react-native";
import { useRouter } from "expo-router";
import { VideoClip } from "@/types";
import VideoPlayer from "./VideoPlayer";
import Colors from "@/constants/colors";

interface StoryViewerProps {
  clips: VideoClip[];
  initialClipIndex?: number;
  onClose?: () => void;
}

const { width } = Dimensions.get("window");

export default function StoryViewer({ clips, initialClipIndex = 0, onClose }: StoryViewerProps) {
  const [activeIndex, setActiveIndex] = useState(initialClipIndex);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (flatListRef.current && initialClipIndex > 0) {
      flatListRef.current.scrollToIndex({
        index: initialClipIndex,
        animated: false,
      });
    }
  }, [initialClipIndex]);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleMomentumScrollEnd = (event: any) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(newIndex);
  };

  const handleBackPress = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleHomePress = () => {
    router.push("/(tabs)");
  };

  const renderItem = ({ item, index }: { item: VideoClip; index: number }) => {
    return <VideoPlayer clip={item} isActive={index === activeIndex} />;
  };

  return (
    <View style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.navigationHeader}>
        <Pressable style={styles.navButton} onPress={handleBackPress}>
          <ArrowLeft color={Colors.text} size={24} />
        </Pressable>
        <Pressable style={styles.navButton} onPress={handleHomePress}>
          <Home color={Colors.text} size={24} />
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={clips}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        initialScrollIndex={initialClipIndex}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navigationHeader: {
    position: "absolute",
    top: 50,
    left: 15,
    right: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 1000,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});