import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Switch, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { collectionsApi } from '@/lib/api';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CollectionEditScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;
    collectionsApi.getCollection(id as string)
      .then(data => {
        setTitle(data.title);
        setDescription(data.description || '');
        setIsPublic(data.is_public);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }
    setSaving(true);
    try {
      await collectionsApi.updateCollection(id as string, {
        title,
        description,
        is_public: isPublic,
      });
      Alert.alert('更新完了', 'コレクションを更新しました', [
        { text: 'OK', onPress: () => router.push('/collections') }
      ]);
    } catch (e: any) {
      Alert.alert('エラー', e.message);
    } finally {
      setSaving(false);
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
      <Text style={styles.title}>コレクション編集</Text>
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
      <Pressable style={styles.button} onPress={handleUpdate} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? '更新中...' : '更新'}</Text>
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
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
}); 