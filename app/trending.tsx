import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { TrendingUp, Filter, Grid3X3, List } from "lucide-react-native";
import Colors from "@/constants/colors";
import Header from "@/components/Header";
import ClipThumbnail from "@/components/ClipThumbnail";
import StoryViewer from "@/components/StoryViewer";
import { mockTrendingCategories } from "@/mocks/trending";
import { VideoClip } from "@/types";

type ViewMode = "grid" | "list";

export default function TrendingScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [viewingStories, setViewingStories] = useState(false);
  const [selectedClips, setSelectedClips] = useState<VideoClip[]>([]);
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);

  const allClips = mockTrendingCategories.flatMap(category => category.clips);
  const filteredClips = selectedCategory === "all" 
    ? allClips 
    : mockTrendingCategories.find(cat => cat.id === selectedCategory)?.clips || [];

  const handleClipPress = (clipIndex: number) => {
    setSelectedClipIndex(clipIndex);
    setSelectedClips(filteredClips);
    setViewingStories(true);
  };

  const handleCloseStoryViewer = () => {
    setViewingStories(false);
  };

  if (viewingStories) {
    return (
      <StoryViewer
        clips={selectedClips}
        initialClipIndex={selectedClipIndex}
        onClose={handleCloseStoryViewer}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Trending"
        showSearch={true}
        showNotification={true}
        showBack={true}
        showHome={true}
      />

      {/* Header Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <TrendingUp color={Colors.accent} size={20} />
          <Text style={styles.statText}>
            {filteredClips.length} trending clips
          </Text>
        </View>
        <View style={styles.viewModeContainer}>
          <Pressable
            style={[styles.viewModeButton, viewMode === "grid" && styles.activeViewMode]}
            onPress={() => setViewMode("grid")}
          >
            <Grid3X3 color={viewMode === "grid" ? Colors.primary : Colors.textSecondary} size={18} />
          </Pressable>
          <Pressable
            style={[styles.viewModeButton, viewMode === "list" && styles.activeViewMode]}
            onPress={() => setViewMode("list")}
          >
            <List color={viewMode === "list" ? Colors.primary : Colors.textSecondary} size={18} />
          </Pressable>
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          <View style={styles.categoriesContent}>
            <Pressable
              style={[
                styles.categoryTab,
                selectedCategory === "all" && styles.activeCategoryTab
              ]}
              onPress={() => setSelectedCategory("all")}
            >
              <Text style={[
                styles.categoryText,
                selectedCategory === "all" && styles.activeCategoryText
              ]}>
                All
              </Text>
            </Pressable>
            {mockTrendingCategories.map((category) => (
              <Pressable
                key={category.id}
                style={[
                  styles.categoryTab,
                  selectedCategory === category.id && styles.activeCategoryTab
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Clips Grid/List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {viewMode === "grid" ? (
          <View style={styles.clipsGrid}>
            {filteredClips.map((clip, index) => (
              <ClipThumbnail
                key={clip.id}
                clip={clip}
                size="small"
                onPress={() => handleClipPress(index)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.clipsList}>
            {filteredClips.map((clip, index) => (
              <View key={clip.id} style={styles.listItem}>
                <View style={styles.rankContainer}>
                  <Text style={styles.rankNumber}>#{index + 1}</Text>
                </View>
                <ClipThumbnail
                  clip={clip}
                  size="medium"
                  onPress={() => handleClipPress(index)}
                />
                <View style={styles.listItemInfo}>
                  <Text style={styles.listItemTitle}>{clip.title}</Text>
                  <Text style={styles.listItemUser}>@{clip.username}</Text>
                  <Text style={styles.listItemViews}>
                    {clip.viewCount.toLocaleString()} views
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {filteredClips.length === 0 && (
          <View style={styles.emptyState}>
            <TrendingUp color={Colors.textSecondary} size={50} />
            <Text style={styles.emptyStateText}>No trending clips</Text>
            <Text style={styles.emptyStateSubtext}>
              Check back later for trending content
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600" as const,
    marginLeft: 8,
  },
  viewModeContainer: {
    flexDirection: "row",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 6,
  },
  activeViewMode: {
    backgroundColor: Colors.backgroundDark,
  },
  categoriesContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 70,
  },
  categoriesScroll: {
    flex: 1,
  },
  categoriesContent: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    minHeight: 36,
  },
  activeCategoryTab: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: Colors.textSecondary,
    fontWeight: "500" as const,
    fontSize: 14,
  },
  activeCategoryText: {
    color: Colors.text,
    fontWeight: "600" as const,
  },
  scrollView: {
    flex: 1,
  },
  clipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    paddingTop: 10,
  },
  clipsList: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 10,
  },
  rankContainer: {
    width: 40,
    alignItems: "center",
    marginRight: 10,
  },
  rankNumber: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.accent,
  },
  listItemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  listItemTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  listItemUser: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  listItemViews: {
    fontSize: 12,
    color: Colors.textSecondary,
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