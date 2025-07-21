import React, { useState } from "react";
import { StyleSheet, View, Text, Image, ScrollView, Pressable, Dimensions } from "react-native";
import { Settings, Grid3X3, Bookmark, Edit3 } from "lucide-react-native";
import { useRouter } from "expo-router";
import Colors from "@/constants/colors";
import Header from "@/components/Header";
import ClipThumbnail from "@/components/ClipThumbnail";
import StoryViewer from "@/components/StoryViewer";
import { mockUsers } from "@/mocks/users";
import { mockClips } from "@/mocks/clips";

const { width } = Dimensions.get("window");
const currentUser = mockUsers.find(user => user.id === "currentUser");

export default function ProfileScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"clips" | "highlights">("clips");
  const [viewingStories, setViewingStories] = useState(false);
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);

  const handleClipPress = (index: number) => {
    setSelectedClipIndex(index);
    setViewingStories(true);
  };

  const handleCloseStoryViewer = () => {
    setViewingStories(false);
  };

  const handleEditProfile = () => {
    router.push("/edit-profile");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  // 公式ユーザー優遇ソート（自分のクリップは全てcurrentUserだが、今後拡張性のため）
  const sortedClips = React.useMemo(() => {
    if (!mockClips) return [];
    return [...mockClips].sort((a, b) => {
      const aVerified = currentUser?.is_verified ? 1 : 0;
      const bVerified = currentUser?.is_verified ? 1 : 0;
      if (aVerified !== bVerified) return bVerified - aVerified;
      return 0;
    });
  }, [mockClips, currentUser]);

  const sortedHighlights = React.useMemo(() => {
    if (!currentUser?.highlights) return [];
    return [...currentUser.highlights].sort((a, b) => {
      const aVerified = currentUser?.is_verified ? 1 : 0;
      const bVerified = currentUser?.is_verified ? 1 : 0;
      if (aVerified !== bVerified) return bVerified - aVerified;
      return 0;
    });
  }, [currentUser]);

  if (viewingStories) {
    return (
      <StoryViewer
        clips={activeTab === "clips" ? mockClips : currentUser?.highlights || []}
        initialClipIndex={selectedClipIndex}
        onClose={handleCloseStoryViewer}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header 
        title={currentUser?.displayName || "Profile"}
        showSearch={false}
        showNotification={false}
        showHome={true}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Image source={{ uri: currentUser?.avatar }} style={styles.profileImage} />
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser?.clips}</Text>
              <Text style={styles.statLabel}>Clips</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser?.followers}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentUser?.following}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
          <Pressable style={styles.settingsButton} onPress={handleSettings}>
            <Settings color={Colors.text} size={24} />
          </Pressable>
        </View>
        {/* 公式バッジ表示 */}
        {currentUser?.is_verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>{currentUser.badge_type ? `✔️${currentUser.badge_type}` : '✔️公式'}</Text>
          </View>
        )}
        {/* Bio */}
        <View style={styles.bioContainer}>
          <Text style={styles.username}>@{currentUser?.username}</Text>
          <Text style={styles.bio}>{currentUser?.bio}</Text>
        </View>

        {/* Edit Profile Button */}
        <Pressable style={styles.editButton} onPress={handleEditProfile}>
          <Edit3 color={Colors.text} size={16} style={styles.editIcon} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <Pressable
            style={[styles.tab, activeTab === "clips" && styles.activeTab]}
            onPress={() => setActiveTab("clips")}
          >
            <Grid3X3
              color={activeTab === "clips" ? Colors.primary : Colors.textSecondary}
              size={24}
            />
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === "highlights" && styles.activeTab]}
            onPress={() => setActiveTab("highlights")}
          >
            <Bookmark
              color={activeTab === "highlights" ? Colors.primary : Colors.textSecondary}
              size={24}
            />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          {activeTab === "clips" ? (
            <View style={styles.clipsGrid}>
              {sortedClips.map((clip, index) => (
                <ClipThumbnail
                  key={clip.id}
                  clip={{ ...clip, userIsVerified: currentUser?.is_verified, userBadgeType: currentUser?.badge_type }}
                  size="small"
                  onPress={() => handleClipPress(index)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.highlightsGrid}>
              {sortedHighlights.length ? (
                sortedHighlights.map((clip, index) => (
                  <ClipThumbnail
                    key={clip.id}
                    clip={{ ...clip, userIsVerified: currentUser?.is_verified, userBadgeType: currentUser?.badge_type }}
                    size="medium"
                    onPress={() => handleClipPress(index)}
                  />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Bookmark color={Colors.textSecondary} size={50} />
                  <Text style={styles.emptyStateText}>No highlights yet</Text>
                  <Text style={styles.emptyStateSubtext}>
                    Pin your favorite clips to see them here
                  </Text>
                </View>
              )}
            </View>
          )}
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
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  statsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  bioContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  username: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 5,
  },
  bio: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
    marginBottom: 20,
  },
  editIcon: {
    marginRight: 8,
  },
  editButtonText: {
    color: Colors.text,
    fontWeight: "600" as const,
  },
  tabsContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  contentContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  clipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  highlightsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  emptyState: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginTop: 15,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  verifiedBadge: {
    alignSelf: 'center',
    backgroundColor: '#facc15',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  verifiedText: {
    color: '#18181b',
    fontWeight: 'bold',
    fontSize: 14,
  },
});