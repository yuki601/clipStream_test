import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function OfficialsScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from('users')
      .select('*')
      .eq('is_verified', true)
      .order('followers', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setUsers(data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>公式認証クリエイター特集</Text>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={styles.row}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.infoCol}>
                <Text style={styles.itemTitle}>{item.display_name}
                  {item.is_verified && (
                    <Text style={styles.badge}> {item.badge_type ? `✔️${item.badge_type}` : '✔️公式'}</Text>
                  )}
                </Text>
                <Text style={styles.itemDesc}>@{item.username}</Text>
                <Text style={styles.itemDesc}>フォロワー: {item.followers}</Text>
              </View>
            </View>
            <Text style={styles.itemDesc}>{item.bio}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>公式認証ユーザーがいません</Text>}
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
  empty: { color: '#a1a1aa', textAlign: 'center', marginTop: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12, borderWidth: 2, borderColor: '#facc15' },
  infoCol: { flex: 1 },
  badge: { color: '#facc15', fontWeight: 'bold', marginLeft: 4, fontSize: 16 },
}); 