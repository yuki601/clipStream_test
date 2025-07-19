import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable } from "react-native";
import { TrendingUp, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import ClipThumbnail from "./ClipThumbnail";
import { TrendingCategory } from "@/mocks/trending";

interface TrendingSectionProps {
  categories: TrendingCategory[];
  onClipPress: (categoryIndex: number, clipIndex: number) => void;
}

export default function TrendingSection({ categories, onClipPress }: TrendingSectionProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleSeeAll = () => {
    router.push("/trending");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <TrendingUp color={Colors.accent} size={20} />
          <Text style={styles.title}>Trending Now</Text>
        </View>
        <Pressable style={styles.seeAllButton} onPress={handleSeeAll}>
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight color={Colors.textSecondary} size={16} />
        </Pressable>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category, index) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === index && styles.activeCategoryTab
            ]}
            onPress={() => setSelectedCategory(index)}
          >
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <Text style={[
              styles.categoryText,
              selectedCategory === index && styles.activeCategoryText
            ]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Trending Clips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.clipsScroll}
        contentContainerStyle={styles.clipsContainer}
      >
        {categories[selectedCategory]?.clips.map((clip, clipIndex) => (
          <View key={clip.id} style={styles.clipContainer}>
            <ClipThumbnail
              clip={clip}
              size="medium"
              onPress={() => onClipPress(selectedCategory, clipIndex)}
            />
            <View style={styles.clipInfo}>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{clipIndex + 1}</Text>
              </View>
              <Text style={styles.clipTitle} numberOfLines={2}>
                {clip.title}
              </Text>
              <Text style={styles.viewCount}>
                {clip.viewCount.toLocaleString()} views
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginLeft: 8,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginRight: 4,
  },
  categoriesScroll: {
    marginBottom: 15,
  },
  categoriesContainer: {
    paddingHorizontal: 15,
  },
  categoryTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
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
  clipsScroll: {
    paddingBottom: 10,
  },
  clipsContainer: {
    paddingHorizontal: 15,
  },
  clipContainer: {
    marginRight: 15,
    width: 180,
  },
  clipInfo: {
    marginTop: 8,
  },
  rankBadge: {
    position: "absolute",
    top: -8,
    right: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    zIndex: 1,
  },
  rankText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "700" as const,
  },
  clipTitle: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 4,
    lineHeight: 18,
  },
  viewCount: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
});