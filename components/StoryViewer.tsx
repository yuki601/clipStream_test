import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, FlatList, Dimensions, Animated, Pressable, Text, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { ArrowLeft, Home } from "lucide-react-native";
import { useRouter } from "expo-router";
import { VideoClip } from "@/types";
import VideoPlayer from "./VideoPlayer";
import Colors from "@/constants/colors";
import { commentsApi } from '@/lib/api';
import { Comment } from '@/types';

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (flatListRef.current && initialClipIndex > 0 && clips.length > 0) {
      flatListRef.current.scrollToIndex({
        index: initialClipIndex,
        animated: false,
      });
    }
  }, [initialClipIndex, clips.length]);

  // コメント取得
  useEffect(() => {
    if (!clips[activeIndex]) return;
    setCommentLoading(true);
    commentsApi.getComments('clip', clips[activeIndex].id)
      .then(setComments)
      .finally(() => setCommentLoading(false));
  }, [activeIndex, clips]);

  // コメント投稿
  const handleSendComment = async () => {
    if (!commentInput.trim() || !clips[activeIndex]) return;
    setCommentLoading(true);
    try {
      // TODO: 認証ユーザー情報取得
      const user = { id: 'test-user', username: 'test', userAvatar: '' };
      await commentsApi.createComment({
        parentId: undefined,
        targetType: 'clip',
        targetId: clips[activeIndex].id,
        userId: user.id,
        username: user.username,
        userAvatar: user.userAvatar,
        content: commentInput.trim(),
      });
      setCommentInput('');
      const newComments = await commentsApi.getComments('clip', clips[activeIndex].id);
      setComments(newComments);
    } finally {
      setCommentLoading(false);
    }
  };

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

  // データが空の場合は何も表示しない
  if (!clips || clips.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.navigationHeader}>
          <Pressable style={styles.navButton} onPress={handleBackPress}>
            <ArrowLeft color={Colors.text} size={24} />
          </Pressable>
          <Pressable style={styles.navButton} onPress={handleHomePress}>
            <Home color={Colors.text} size={24} />
          </Pressable>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No clips available</Text>
        </View>
      </View>
    );
  }

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
      {/* コメント一覧・投稿UI */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>コメント</Text>
          {commentLoading ? (
            <ActivityIndicator color={Colors.primary} />
          ) : (
            <FlatList
              data={comments}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Text style={styles.commentUser}>{item.username}</Text>
                  <Text style={styles.commentContent}>{item.content}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.commentEmpty}>コメントはまだありません</Text>}
              style={{ maxHeight: 180 }}
            />
          )}
          <View style={styles.commentInputRow}>
            <TextInput
              style={styles.commentInput}
              value={commentInput}
              onChangeText={setCommentInput}
              placeholder="コメントを入力..."
              placeholderTextColor={Colors.textSecondary}
              editable={!commentLoading}
            />
            <Pressable style={styles.commentSend} onPress={handleSendComment} disabled={commentLoading || !commentInput.trim()}>
              <Text style={{ color: Colors.primary, fontWeight: 'bold' }}>送信</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.backgroundDark,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 16,
  },
  commentsSection: { backgroundColor: '#232323', padding: 12, borderTopWidth: 1, borderTopColor: '#333' },
  commentsTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 8 },
  commentItem: { marginBottom: 8 },
  commentUser: { color: '#facc15', fontWeight: 'bold' },
  commentContent: { color: '#fff' },
  commentEmpty: { color: '#a1a1aa', fontStyle: 'italic', marginTop: 8 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  commentInput: { flex: 1, backgroundColor: '#18181b', color: '#fff', borderRadius: 8, padding: 8, marginRight: 8 },
  commentSend: { paddingHorizontal: 12, paddingVertical: 8 },
});