import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, ScrollView, Image, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Upload, Youtube, Link2, Clock, Tag, Globe, Lock, ChevronDown, Check, Plus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/constants/colors";
import Header from "@/components/Header";
import { PRESET_GAME_TAGS } from "@/constants/game-tags";
import { clipsApi } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

type UploadMethod = "local" | "youtube" | "url";
type Visibility = "public" | "followers" | "private";
type ExpiryTime = "24h" | "48h" | "week" | "never";

export default function UploadScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("youtube");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [gameTags, setGameTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [expiryTime, setExpiryTime] = useState<ExpiryTime>("24h");
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const [showExpiryOptions, setShowExpiryOptions] = useState(false);
  const [showPresetTags, setShowPresetTags] = useState(false);

  // クリップ作成のミューテーション
  const createClipMutation = useMutation({
    mutationFn: clipsApi.createClip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clips'] });
      queryClient.invalidateQueries({ queryKey: ['trending'] });
      Alert.alert("Success", "Your clip has been uploaded!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    },
    onError: (error) => {
      Alert.alert("Error", "Failed to upload clip. Please try again.");
    },
  });

  const handleUpload = () => {
    if (!user) {
      Alert.alert("Error", "Please sign in to upload clips");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your clip");
      return;
    }

    if (!url.trim()) {
      Alert.alert("Error", "Please provide a video URL or upload a file");
      return;
    }

    if (gameTags.length === 0) {
      Alert.alert("Error", "Please add at least one game tag");
      return;
    }

    // 有効期限の計算
    const now = new Date();
    let expiresAt = new Date();
    switch (expiryTime) {
      case "24h":
        expiresAt.setHours(now.getHours() + 24);
        break;
      case "48h":
        expiresAt.setHours(now.getHours() + 48);
        break;
      case "week":
        expiresAt.setDate(now.getDate() + 7);
        break;
      case "never":
        expiresAt = new Date(now.getTime() + 100 * 365 * 24 * 60 * 60 * 1000); // 100年後
        break;
    }

    const clipData = {
      title: title.trim(),
      url: url.trim(),
      thumbnailUrl: thumbnailUrl || "https://via.placeholder.com/300x200",
      duration: 0, // 実際の実装では動画の長さを取得する必要があります
      source: uploadMethod as 'youtube' | 'twitch' | 'medal' | 'local' | 'other',
      gameTag: gameTags,
      expiresAt: expiresAt.toISOString(),
      userId: user.id,
      username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
      userAvatar: user.user_metadata?.avatar || "https://via.placeholder.com/100x100",
      isArchived: false,
      isPinned: false,
      visibility: visibility,
    };

    createClipMutation.mutate(clipData);
  };

  const handleAddTag = () => {
    if (newTag.trim() && !gameTags.includes(newTag.trim())) {
      setGameTags([...gameTags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleAddPresetTag = (tag: string) => {
    if (!gameTags.includes(tag)) {
      setGameTags([...gameTags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setGameTags(gameTags.filter(t => t !== tag));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setThumbnailUrl(result.assets[0].uri);
    }
  };

  const renderVisibilityOption = (option: Visibility, label: string, icon: React.ReactNode) => (
    <Pressable
      style={[styles.optionItem, visibility === option && styles.selectedOption]}
      onPress={() => {
        setVisibility(option);
        setShowVisibilityOptions(false);
      }}
    >
      {icon}
      <Text style={styles.optionText}>{label}</Text>
      {visibility === option && <Check color={Colors.primary} size={18} />}
    </Pressable>
  );

  const renderExpiryOption = (option: ExpiryTime, label: string) => (
    <Pressable
      style={[styles.optionItem, expiryTime === option && styles.selectedOption]}
      onPress={() => {
        setExpiryTime(option);
        setShowExpiryOptions(false);
      }}
    >
      <Text style={styles.optionText}>{label}</Text>
      {expiryTime === option && <Check color={Colors.primary} size={18} />}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Header 
        title="New Clip"
        showSearch={false}
        showNotification={false}
        showBack={true}
        showHome={true}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.shareButtonContainer}>
          <Pressable style={styles.shareButton} onPress={handleUpload}>
            <Text style={styles.shareButtonText}>Share</Text>
          </Pressable>
        </View>

        <View style={styles.methodSelector}>
          <Pressable
            style={[styles.methodOption, uploadMethod === "youtube" && styles.activeMethod]}
            onPress={() => setUploadMethod("youtube")}
          >
            <Youtube
              color={uploadMethod === "youtube" ? Colors.primary : Colors.textSecondary}
              size={24}
            />
            <Text
              style={[
                styles.methodText,
                uploadMethod === "youtube" && styles.activeMethodText,
              ]}
            >
              YouTube
            </Text>
          </Pressable>
          <Pressable
            style={[styles.methodOption, uploadMethod === "url" && styles.activeMethod]}
            onPress={() => setUploadMethod("url")}
          >
            <Link2
              color={uploadMethod === "url" ? Colors.primary : Colors.textSecondary}
              size={24}
            />
            <Text
              style={[
                styles.methodText,
                uploadMethod === "url" && styles.activeMethodText,
              ]}
            >
              URL
            </Text>
          </Pressable>
          <Pressable
            style={[styles.methodOption, uploadMethod === "local" && styles.activeMethod]}
            onPress={() => setUploadMethod("local")}
          >
            <Upload
              color={uploadMethod === "local" ? Colors.primary : Colors.textSecondary}
              size={24}
            />
            <Text
              style={[
                styles.methodText,
                uploadMethod === "local" && styles.activeMethodText,
              ]}
            >
              Upload
            </Text>
          </Pressable>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Add a title to your clip"
            placeholderTextColor={Colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            {uploadMethod === "youtube"
              ? "YouTube URL"
              : uploadMethod === "url"
              ? "Video URL"
              : "Upload Video"}
          </Text>
          {uploadMethod === "local" ? (
            <Pressable style={styles.uploadFileButton} onPress={() => Alert.alert("Upload", "This would open the file picker")}>
              <Upload color={Colors.text} size={24} style={styles.uploadIcon} />
              <Text style={styles.uploadFileText}>Select video file</Text>
            </Pressable>
          ) : (
            <TextInput
              style={styles.input}
              placeholder={
                uploadMethod === "youtube"
                  ? "Paste YouTube video URL"
                  : "Paste video URL from any source"
              }
              placeholderTextColor={Colors.textSecondary}
              value={url}
              onChangeText={setUrl}
            />
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Thumbnail</Text>
          {thumbnailUrl ? (
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
              <Pressable style={styles.changeThumbnailButton} onPress={pickImage}>
                <Text style={styles.changeThumbnailText}>Change</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.uploadThumbnailButton} onPress={pickImage}>
              <Upload color={Colors.text} size={24} style={styles.uploadIcon} />
              <Text style={styles.uploadThumbnailText}>Select thumbnail image</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Game Tags</Text>
          
          {/* Preset Tags Button */}
          <Pressable 
            style={styles.presetTagsButton} 
            onPress={() => setShowPresetTags(!showPresetTags)}
          >
            <Tag color={Colors.primary} size={18} />
            <Text style={styles.presetTagsButtonText}>Choose from preset tags</Text>
            <ChevronDown color={Colors.primary} size={18} />
          </Pressable>

          {/* Preset Tags Grid */}
          {showPresetTags && (
            <View style={styles.presetTagsContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.presetTagsScroll}
              >
                <View style={styles.presetTagsContent}>
                  {PRESET_GAME_TAGS.map((tag) => (
                    <Pressable
                      key={tag}
                      style={[
                        styles.presetTag,
                        gameTags.includes(tag) && styles.selectedPresetTag
                      ]}
                      onPress={() => handleAddPresetTag(tag)}
                    >
                      <Text style={[
                        styles.presetTagText,
                        gameTags.includes(tag) && styles.selectedPresetTagText
                      ]}>
                        {tag}
                      </Text>
                      {gameTags.includes(tag) && (
                        <Check color={Colors.text} size={14} style={styles.checkIcon} />
                      )}
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Custom Tag Input */}
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add custom tag"
              placeholderTextColor={Colors.textSecondary}
              value={newTag}
              onChangeText={setNewTag}
              onSubmitEditing={handleAddTag}
            />
            <Pressable style={styles.addTagButton} onPress={handleAddTag}>
              <Plus color={Colors.text} size={18} />
            </Pressable>
          </View>

          {/* Selected Tags */}
          <View style={styles.tagsContainer}>
            {gameTags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
                <Pressable onPress={() => handleRemoveTag(tag)}>
                  <X color={Colors.text} size={14} />
                </Pressable>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Visibility</Text>
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setShowVisibilityOptions(!showVisibilityOptions)}
          >
            <View style={styles.dropdownButtonContent}>
              {visibility === "public" ? (
                <Globe color={Colors.text} size={18} />
              ) : visibility === "followers" ? (
                <Lock color={Colors.text} size={18} />
              ) : (
                <Lock color={Colors.text} size={18} />
              )}
              <Text style={styles.dropdownButtonText}>
                {visibility === "public"
                  ? "Public"
                  : visibility === "followers"
                  ? "Followers Only"
                  : "Private"}
              </Text>
            </View>
            <ChevronDown color={Colors.text} size={18} />
          </Pressable>
          {showVisibilityOptions && (
            <View style={styles.optionsContainer}>
              {renderVisibilityOption("public", "Public", <Globe color={Colors.text} size={18} />)}
              {renderVisibilityOption("followers", "Followers Only", <Lock color={Colors.text} size={18} />)}
              {renderVisibilityOption("private", "Private", <Lock color={Colors.text} size={18} />)}
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Story Duration</Text>
          <Pressable
            style={styles.dropdownButton}
            onPress={() => setShowExpiryOptions(!showExpiryOptions)}
          >
            <View style={styles.dropdownButtonContent}>
              <Clock color={Colors.text} size={18} />
              <Text style={styles.dropdownButtonText}>
                {expiryTime === "24h"
                  ? "24 hours"
                  : expiryTime === "48h"
                  ? "48 hours"
                  : expiryTime === "week"
                  ? "1 week"
                  : "Never expire"}
              </Text>
            </View>
            <ChevronDown color={Colors.text} size={18} />
          </Pressable>
          {showExpiryOptions && (
            <View style={styles.optionsContainer}>
              {renderExpiryOption("24h", "24 hours")}
              {renderExpiryOption("48h", "48 hours")}
              {renderExpiryOption("week", "1 week")}
              {renderExpiryOption("never", "Never expire")}
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
    paddingHorizontal: 15,
  },
  shareButtonContainer: {
    alignItems: "flex-end",
    marginTop: 10,
    marginBottom: 10,
  },
  shareButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: Colors.primary,
  },
  shareButtonText: {
    color: Colors.text,
    fontWeight: "600" as const,
  },
  methodSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 10,
  },
  methodOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: Colors.backgroundLight,
  },
  activeMethod: {
    backgroundColor: `${Colors.primary}20`,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  methodText: {
    color: Colors.textSecondary,
    marginLeft: 8,
    fontWeight: "500" as const,
  },
  activeMethodText: {
    color: Colors.text,
  },
  inputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 10,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 16,
  },
  uploadFileButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  uploadIcon: {
    marginRight: 10,
  },
  uploadFileText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "500" as const,
  },
  thumbnailContainer: {
    position: "relative",
    borderRadius: 8,
    overflow: "hidden",
    height: 180,
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  changeThumbnailButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  changeThumbnailText: {
    color: Colors.text,
    fontWeight: "600" as const,
  },
  uploadThumbnailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  uploadThumbnailText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "500" as const,
  },
  presetTagsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.primary}20`,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  presetTagsButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: "600" as const,
    marginLeft: 8,
    flex: 1,
  },
  presetTagsContainer: {
    marginBottom: 15,
    height: 60,
  },
  presetTagsScroll: {
    flex: 1,
  },
  presetTagsContent: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  presetTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedPresetTag: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetTagText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "500" as const,
  },
  selectedPresetTagText: {
    color: Colors.text,
    fontWeight: "600" as const,
  },
  checkIcon: {
    marginLeft: 5,
  },
  tagInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: Colors.text,
    fontSize: 16,
  },
  addTagButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.primary}30`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    color: Colors.primary,
    marginRight: 5,
    fontWeight: "600" as const,
  },
  dropdownButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  dropdownButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropdownButtonText: {
    color: Colors.text,
    fontSize: 16,
    marginLeft: 10,
  },
  optionsContainer: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 8,
    marginTop: 5,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: `${Colors.primary}20`,
  },
  optionText: {
    color: Colors.text,
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
});