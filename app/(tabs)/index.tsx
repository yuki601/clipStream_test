import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Colors from "@/constants/colors";
import Header from "@/components/Header";
import StoryCircle from "@/components/StoryCircle";
import StoryViewer from "@/components/StoryViewer";
import ClipThumbnail from "@/components/ClipThumbnail";
import TrendingSection from "@/components/TrendingSection";
import { clipsApi, trendingApi } from "@/lib/api";
import { mockUsers } from "@/mocks/users";
import { supabase } from '@/lib/supabase';

export default function HomeScreen() {
  const router = useRouter();
  const [viewingStories, setViewingStories] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [selectedClips, setSelectedClips] = useState<any[]>([]);
  const [users, setUsers] = useState<{[id: string]: any}>({});

  // APIからデータを取得
  const { data: clips, isLoading: clipsLoading, error: clipsError } = useQuery({
    queryKey: ['clips'],
    queryFn: clipsApi.getAllClips,
  });

  useEffect(() => {
    if (clips) {
      const ids = Array.from(new Set(clips.map((c: any) => c.userId)));
      supabase.from('users').select('*').in('id', ids).then(({ data }) => {
        const userMap: {[id: string]: any} = {};
        (data || []).forEach((u: any) => { userMap[u.id] = u; });
        setUsers(userMap);
      });
    }
  }, [clips]);

  // 公式ユーザー優遇ソート
  const sortedClips = React.useMemo(() => {
    if (!clips) return [];
    return [...clips].sort((a, b) => {
      const aVerified = users[a.userId]?.is_verified ? 1 : 0;
      const bVerified = users[b.userId]?.is_verified ? 1 : 0;
      if (aVerified !== bVerified) return bVerified - aVerified;
      // 公式同士/非公式同士は元の順（createdAt降順）
      return 0;
    });
  }, [clips, users]);

  const { data: trendingClips, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: trendingApi.getTrendingClips,
  });

  const handleStoryPress = (index: number) => {
    if (clips) {
      setSelectedStoryIndex(index);
      setSelectedClips(clips);
      setViewingStories(true);
    }
  };

  const handleClipPress = (index: number) => {
    if (clips) {
      setSelectedStoryIndex(index);
      setSelectedClips(clips);
      setViewingStories(true);
    }
  };

  const handleTrendingClipPress = (clipIndex: number) => {
    if (trendingClips) {
      setSelectedStoryIndex(clipIndex);
      setSelectedClips(trendingClips);
      setViewingStories(true);
    }
  };

  const handleCloseStoryViewer = () => {
    setViewingStories(false);
  };

  // ローディング状態
  if (clipsLoading || trendingLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // エラー状態
  if (clipsError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Failed to load clips</Text>
      </View>
    );
  }

  if (viewingStories) {
    return (
      <StoryViewer 
        clips={selectedClips} 
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
            {sortedClips?.slice(0, 3).map((clip, index) => (
              <ClipThumbnail
                key={clip.id}
                clip={{ ...clip, userIsVerified: users[clip.userId]?.is_verified, userBadgeType: users[clip.userId]?.badge_type }}
                size="medium"
                onPress={() => handleClipPress(index)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent clips */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Clips</Text>
          <View style={styles.recentGrid}>
            {sortedClips?.map((clip, index) => (
              <ClipThumbnail
                key={clip.id}
                clip={{ ...clip, userIsVerified: users[clip.userId]?.is_verified, userBadgeType: users[clip.userId]?.badge_type }}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
  recentGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -5,
  },
  errorText: {
    color: Colors.text,
    fontSize: 16,
  },
});