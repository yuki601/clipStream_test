import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import Header from "@/components/Header";
import StoryCircle from "@/components/StoryCircle";
import StoryViewer from "@/components/StoryViewer";
import ClipThumbnail from "@/components/ClipThumbnail";
import { mockClips } from "@/mocks/clips";
import { mockUsers } from "@/mocks/users";

export default function HomeScreen() {
  const router = useRouter();
  const [viewingStories, setViewingStories] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const handleStoryPress = (index: number) => {
    setSelectedStoryIndex(index);
    setViewingStories(true);
  };

  const handleClipPress = (index: number) => {
    setSelectedStoryIndex(index);
    setViewingStories(true);
  };

  const handleCloseStoryViewer = () => {
    setViewingStories(false);
  };

  if (viewingStories) {
    return (
      <StoryViewer 
        clips={mockClips} 
        initialClipIndex={selectedStoryIndex} 
        onClose={handleCloseStoryViewer}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Stories row */}
        <View style={styles.storiesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScroll}>
            {mockUsers.map((user, index) => (
              <StoryCircle
                key={user.id}
                imageUrl={user.avatar}
                username={user.username}
                hasNewStory={index < 3} // First 3 users have new stories
                onPress={() => handleStoryPress(index)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured clips */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Featured Clips</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
            {mockClips.slice(0, 3).map((clip, index) => (
              <ClipThumbnail
                key={clip.id}
                clip={clip}
                size="medium"
                onPress={() => handleClipPress(index)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Trending now */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <View style={styles.trendingGrid}>
            {mockClips.map((clip, index) => (
              <ClipThumbnail
                key={clip.id}
                clip={clip}
                size="small"
                onPress={() => handleClipPress(index)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  scrollView: {
    flex: 1,
  },
  storiesContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  storiesScroll: {
    paddingHorizontal: 10,
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 15,
  },
  featuredScroll: {
    paddingBottom: 15,
  },
  trendingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -5,
  },
});