import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { earningsApi } from '@/lib/api';

export default function EarningsScreen() {
  // 仮のユーザーID（本来は認証ユーザーから取得）
  const userId = 'test-user-id';
  const [earnings, setEarnings] = useState<any[]>([]);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      earningsApi.getUserEarnings(userId),
      earningsApi.getUserPoints(userId),
    ])
      .then(([earningsData, pointsData]) => {
        setEarnings(earningsData);
        setPoints(pointsData);
      })
      .catch(e => setError(e.message))
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
      <Text style={styles.title}>収益・ポイント管理</Text>
      <Text style={styles.points}>ポイント残高: {points} pt</Text>
      <Text style={styles.section}>収益履歴</Text>
      <FlatList
        data={earnings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.amount} pt
              {item.source_type === 'clip_view' && item.amount >= 2 && (
                <Text style={styles.officialBadge}> 公式特典</Text>
              )}
              {item.source_type === 'collection_view' && item.amount >= 2 && (
                <Text style={styles.officialBadge}> 公式コレクション</Text>
              )}
            </Text>
            <Text style={styles.itemDesc}>{item.source_type} / {item.source_id}</Text>
            <Text style={styles.itemDesc}>{item.created_at}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>収益履歴がありません</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181b', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  points: { color: '#fff', fontSize: 18, marginBottom: 16 },
  section: { color: '#fff', fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  item: { backgroundColor: '#27272a', padding: 16, borderRadius: 8, marginBottom: 12 },
  itemTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  itemDesc: { color: '#a1a1aa', marginTop: 4 },
  empty: { color: '#a1a1aa', textAlign: 'center', marginTop: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
  officialBadge: { color: '#facc15', fontWeight: 'bold', marginLeft: 8, fontSize: 14 },
}); 