import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ActivityIndicator, Alert, TextInput } from 'react-native';
import { badgesApi } from '@/lib/api';

export default function BadgesScreen() {
  // 仮のユーザーID（本来は認証ユーザーから取得）
  const userId = 'test-user-id';
  const [badges, setBadges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [badgeType, setBadgeType] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    badgesApi.getUserBadges(userId)
      .then(setBadges)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = async () => {
    if (!badgeType.trim()) {
      Alert.alert('エラー', 'バッジ種別を入力してください');
      return;
    }
    setApplying(true);
    try {
      await badgesApi.applyBadge(userId, badgeType);
      Alert.alert('申請完了', 'バッジ申請を受け付けました');
      setBadgeType('');
      // 再取得
      const data = await badgesApi.getUserBadges(userId);
      setBadges(data);
    } catch (e: any) {
      Alert.alert('エラー', e.message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={styles.error}>{error}</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>バッジ一覧</Text>
      <FlatList
        data={badges}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemTitle}>{item.badge_type}</Text>
            <Text style={styles.itemDesc}>{item.issued_at}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>バッジがありません</Text>}
      />
      <Text style={styles.section}>バッジ申請</Text>
      <TextInput
        style={styles.input}
        placeholder="バッジ種別（例: pro, streamer, official）"
        value={badgeType}
        onChangeText={setBadgeType}
      />
      <Pressable style={styles.button} onPress={handleApply} disabled={applying}>
        <Text style={styles.buttonText}>{applying ? '申請中...' : '申請'}</Text>
      </Pressable>
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
  section: { color: '#fff', fontWeight: 'bold', marginBottom: 8, marginTop: 16 },
  input: { backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
}); 