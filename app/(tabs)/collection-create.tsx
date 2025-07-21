import React, { useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, StyleSheet, Alert } from 'react-native';
import { collectionsApi } from '@/lib/api';
import { useRouter } from 'expo-router';

export default function CollectionCreateScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // 仮のユーザーID（本来は認証ユーザーから取得）
  const userId = 'test-user-id';

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }
    setLoading(true);
    try {
      await collectionsApi.createCollection({
        title,
        description,
        owner_id: userId,
        is_public: isPublic,
      });
      Alert.alert('作成完了', 'コレクションを作成しました', [
        { text: 'OK', onPress: () => router.push('/collections') }
      ]);
    } catch (e: any) {
      Alert.alert('エラー', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>コレクション作成</Text>
      <TextInput
        style={styles.input}
        placeholder="タイトル"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="説明（任意）"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.row}>
        <Text style={styles.label}>公開</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>
      <Pressable style={styles.button} onPress={handleCreate} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? '作成中...' : '作成'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#18181b', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 16 },
  input: { backgroundColor: '#27272a', color: '#fff', borderRadius: 8, padding: 12, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  label: { color: '#fff', fontSize: 16, marginRight: 8 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 