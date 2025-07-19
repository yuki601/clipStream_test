import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Search, X, TrendingUp, Clock, Hash, User } from "lucide-react-native";
import Colors from "@/constants/colors";
import Header from "@/components/Header";
import ClipThumbnail from "@/components/ClipThumbnail";
import StoryCircle from "@/components/StoryCircle";
import StoryViewer from "@/components/StoryViewer";
import { mockClips } from "@/mocks/clips";
import { mockUsers } from "@/mocks/users";

type SearchTab = "all" | "clips" | "users" | "tags";

const trendingTags = ["APEX", "Fortnite", "Valorant", "Call of Duty", "Minecraft"];
const recentSearches = ["sniper shots", "epic wins", "speed_demon", "#APEX"];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SearchTab>("all");
  const [viewingStories, setViewingStories] = useState(false);
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);

  const handleClipPress = (index: number) => {
    setSelectedClipIndex(index);
    setViewingStories(true);
  };

  const handleCloseStoryViewer = () => {
    setViewingStories(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      // In a real app, we would perform the search here
      console.log("Searching for:", searchQuery);
    }
  };

  const filteredClips = mockClips.filter(clip =>
    clip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    clip.gameTag.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
    clip.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTags = trendingTags.filter(tag =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (viewingStories) {
    return (
      <StoryViewer
        clips={filteredClips}
        initialClipIndex={selectedClipIndex}
        onClose={handleCloseStoryViewer}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Search"
        showSearch={false}
        showNotification={true}
        showBack={true}
        showHome={true}
      />

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color={Colors.textSecondary} size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search clips, users, or tags..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={clearSearch} style={styles.clearButton}>
              <X color={Colors.textSecondary} size={20} />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {searchQuery.length === 0 ? (
          // Show trending and recent searches when no query
          <>
            {/* Trending Tags */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <TrendingUp color={Colors.primary} size={20} />
                <Text style={styles.sectionTitle}>Trending Tags</Text>
              </View>
              <View style={styles.tagsContainer}>
                {trendingTags.map((tag) => (
                  <Pressable
                    key={tag}
                    style={styles.trendingTag}
                    onPress={() => setSearchQuery(`#${tag}`)}
                  >
                    <Hash color={Colors.primary} size={16} />
                    <Text style={styles.trendingTagText}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Recent Searches */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Clock color={Colors.textSecondary} size={20} />
                <Text style={styles.sectionTitle}>Recent Searches</Text>
              </View>
              {recentSearches.map((search, index) => (
                <Pressable
                  key={index}
                  style={styles.recentSearchItem}
                  onPress={() => setSearchQuery(search)}
                >
                  <Text style={styles.recentSearchText}>{search}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : (
          // Show search results
          <>
            {/* Search Tabs */}
            <View style={styles.tabsContainer}>
              <Pressable
                style={[styles.tab, activeTab === "all" && styles.activeTab]}
                onPress={() => setActiveTab("all")}
              >
                <Text style={[styles.tabText, activeTab === "all" && styles.activeTabText]}>
                  All
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, activeTab === "clips" && styles.activeTab]}
                onPress={() => setActiveTab("clips")}
              >
                <Text style={[styles.tabText, activeTab === "clips" && styles.activeTabText]}>
                  Clips ({filteredClips.length})
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, activeTab === "users" && styles.activeTab]}
                onPress={() => setActiveTab("users")}
              >
                <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>
                  Users ({filteredUsers.length})
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, activeTab === "tags" && styles.activeTab]}
                onPress={() => setActiveTab("tags")}
              >
                <Text style={[styles.tabText, activeTab === "tags" && styles.activeTabText]}>
                  Tags ({filteredTags.length})
                </Text>
              </Pressable>
            </View>

            {/* Search Results */}
            {(activeTab === "all" || activeTab === "users") && filteredUsers.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Users</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.usersScroll}>
                  {filteredUsers.map((user, index) => (
                    <StoryCircle
                      key={user.id}
                      imageUrl={user.avatar}
                      username={user.username}
                      hasNewStory={index < 2}
                      onPress={() => {}}
                    />
                  ))}
                </ScrollView>
              </View>
            )}

            {(activeTab === "all" || activeTab === "clips") && filteredClips.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Clips</Text>
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
              </View>
            )}

            {(activeTab === "all" || activeTab === "tags") && filteredTags.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {filteredTags.map((tag) => (
                    <Pressable
                      key={tag}
                      style={styles.searchResultTag}
                      onPress={() => setSearchQuery(`#${tag}`)}
                    >
                      <Hash color={Colors.primary} size={16} />
                      <Text style={styles.searchResultTagText}>{tag}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* No Results */}
            {filteredClips.length === 0 && filteredUsers.length === 0 && filteredTags.length === 0 && (
              <View style={styles.noResults}>
                <Search color={Colors.textSecondary} size={50} />
                <Text style={styles.noResultsText}>No results found</Text>
                <Text style={styles.noResultsSubtext}>
                  Try searching for different keywords
                </Text>
              </View>
            )}
          </>
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
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: Colors.text,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginLeft: 8,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  trendingTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.primary}20`,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  trendingTagText: {
    color: Colors.primary,
    fontWeight: "600" as const,
    marginLeft: 5,
  },
  recentSearchItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  recentSearchText: {
    color: Colors.text,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 15,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  activeTabText: {
    color: Colors.text,
    fontWeight: "700" as const,
  },
  usersScroll: {
    paddingBottom: 15,
  },
  clipsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: -5,
  },
  searchResultTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  searchResultTagText: {
    color: Colors.text,
    fontWeight: "600" as const,
    marginLeft: 5,
  },
  noResults: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: Colors.text,
    marginTop: 15,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 5,
    textAlign: "center",
  },
});