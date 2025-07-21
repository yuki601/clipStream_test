import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { collectionsApi } from '@/lib/api';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function CollectionsScreen() {
  const [collections, setCollections] = useState<any[]>([]);
  const [users, setUsers] = useState<{[id: string]: any}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    collectionsApi.getAllCollections()
      .then(async (colls) => {
        setCollections(colls);
        // コレクション作成者のユーザー情報をまとめて取得
        const ids = Array.from(new Set(colls.map((c: any) => c.owner_id)));
        const { data: userData } = await supabase.from('users').select('*').in('id', ids);
        const userMap: {[id: string]: any} = {};
        (userData || []).forEach((u: any) => { userMap[u.id] = u; });
        setUsers(userMap);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // 公式ユーザー優遇ソート
  const sortedCollections = React.useMemo(() => {
    if (!collections) return [];
    return [...collections].sort((a, b) => {
      const aVerified = users[a.owner_id]?.is_verified ? 1 : 0;
      const bVerified = users[b.owner_id]?.is_verified ? 1 : 0;
      if (aVerified !== bVerified) return bVerified - aVerified;
      // 公式同士/非公式同士は元の順（createdAt降順）
      return 0;
    });
  }, [collections, users]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>コレクション一覧</Text>
      <FlatList
        data={sortedCollections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const user = users[item.owner_id];
          return (
            <Pressable style={styles.item} onPress={() => router.push(`/collections/${item.id}`)}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDesc}>{item.description}</Text>
              {user && (
                <View style={styles.userRow}>
                  <Text style={styles.userName}>by {user.display_name}</Text>
                  {user.is_verified && (
                    <Text style={styles.badge}>{user.badge_type ? `✔️${user.badge_type}` : '✔️公式'}</Text>
                  )}
                </View>
              )}
            </Pressable>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>コレクションがありません</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181b', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  item: { backgroundColor: '#27272a', padding: 16, borderRadius: 8, marginBottom: 12 },
  itemTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  itemDesc: { color: '#a1a1aa', marginTop: 4 },
  userRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  userName: { color: '#a1a1aa', marginRight: 8 },
  badge: { color: '#facc15', fontWeight: 'bold' },
  empty: { color: '#a1a1aa', textAlign: 'center', marginTop: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
}); 