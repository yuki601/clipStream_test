import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { collectionsApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { earningsApi } from '@/lib/api';
import { commentsApi } from '@/lib/api';
import { Comment } from '@/types';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [collection, setCollection] = useState<any>(null);
  const [clips, setClips] = useState<any[]>([]);
  const [users, setUsers] = useState<{[id: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    collectionsApi.getCollection(id as string)
      .then(async (coll) => {
        setCollection(coll);
        // コレクション閲覧時の収益分配
        if (coll?.owner_id) {
          // 公式ユーザーかどうか取得
          const { data: owner } = await supabase.from('users').select('is_verified').eq('id', coll.owner_id).single();
          const point = owner?.is_verified ? 2 : 1;
          await earningsApi.addEarning(coll.owner_id, point, 'collection_view', coll.id);
        }
      })
      .catch(e => setError(e.message));
    collectionsApi.getClipsInCollection(id as string)
      .then(async data => {
        const clipsArr = data.map((c: any) => c.clips);
        setClips(clipsArr);
        // クリップのユーザー情報をまとめて取得
        const ids = Array.from(new Set(clipsArr.map((c: any) => c.userId)));
        const { data: userData } = await supabase.from('users').select('*').in('id', ids);
        const userMap: {[id: string]: any} = {};
        (userData || []).forEach((u: any) => { userMap[u.id] = u; });
        setUsers(userMap);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // コメント取得
  useEffect(() => {
    if (!id) return;
    setCommentLoading(true);
    commentsApi.getComments('collection', id as string)
      .then(setComments)
      .finally(() => setCommentLoading(false));
  }, [id]);

  // コメント投稿
  const handleSendComment = async () => {
    if (!commentInput.trim() || !id) return;
    setCommentLoading(true);
    try {
      // TODO: 認証ユーザー情報取得
      const user = { id: 'test-user', username: 'test', userAvatar: '' };
      await commentsApi.createComment({
        parentId: undefined,
        targetType: 'collection',
        targetId: id as string,
        userId: user.id,
        username: user.username,
        userAvatar: user.userAvatar,
        content: commentInput.trim(),
      });
      setCommentInput('');
      const newComments = await commentsApi.getComments('collection', id as string);
      setComments(newComments);
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }
  if (!collection) {
    return <View style={styles.center}><Text>コレクションが見つかりません</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{collection.title}</Text>
      <Text style={styles.desc}>{collection.description}</Text>
      <Text style={styles.section}>収録クリップ</Text>
      <FlatList
        data={clips}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const user = users[item.userId];
          return (
            <Pressable style={styles.item} onPress={() => router.push(`/clip/${item.id}`)}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.username}</Text>
              {user && user.is_verified && (
                <Text style={styles.badge}>{user.badge_type ? `✔️${user.badge_type}` : '✔️公式'}</Text>
              )}
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>クリップがありません</Text>}
      />
      {/* コメント一覧・投稿UI */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>コメント</Text>
          {commentLoading ? (
            <ActivityIndicator color={'#facc15'} />
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
              placeholderTextColor={'#a1a1aa'}
              editable={!commentLoading}
            />
            <Pressable style={styles.commentSend} onPress={handleSendComment} disabled={commentLoading || !commentInput.trim()}>
              <Text style={{ color: '#facc15', fontWeight: 'bold' }}>送信</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181b', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  desc: { color: '#a1a1aa', marginBottom: 16 },
  section: { color: '#fff', fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  item: { backgroundColor: '#27272a', padding: 16, borderRadius: 8, marginBottom: 12 },
  itemTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  itemDesc: { color: '#a1a1aa', marginTop: 4 },
  empty: { color: '#a1a1aa', textAlign: 'center', marginTop: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
  badge: { color: '#facc15', fontWeight: 'bold', marginTop: 4 },
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