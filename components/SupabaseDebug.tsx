import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { supabase } from '@/lib/supabase';
import { clipsApi } from '@/lib/api';
import Colors from '@/constants/colors';

export default function SupabaseDebug() {
  const [connectionStatus, setConnectionStatus] = useState<string>('Checking...');
  const [clipsCount, setClipsCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      // Supabase接続テスト
      const { data, error } = await supabase.from('clips').select('count', { count: 'exact', head: true });
      
      if (error) {
        setConnectionStatus('Error');
        setError(error.message);
        console.error('Supabase connection error:', error);
      } else {
        setConnectionStatus('Connected');
        setClipsCount(data?.length || 0);
        console.log('Supabase connected successfully');
      }
    } catch (err) {
      setConnectionStatus('Failed');
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Connection test failed:', err);
    }
  };

  const testClipsApi = async () => {
    try {
      const clips = await clipsApi.getAllClips();
      setClipsCount(clips.length);
      console.log('Clips API test successful:', clips.length, 'clips found');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API test failed');
      console.error('Clips API test failed:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Debug Info</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Connection Status:</Text>
        <Text style={[
          styles.value, 
          connectionStatus === 'Connected' ? styles.success : styles.error
        ]}>
          {connectionStatus}
        </Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Clips Count:</Text>
        <Text style={styles.value}>
          {clipsCount !== null ? clipsCount : 'Unknown'}
        </Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorLabel}>Error:</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Pressable style={styles.button} onPress={checkConnection}>
        <Text style={styles.buttonText}>Test Connection</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={testClipsApi}>
        <Text style={styles.buttonText}>Test Clips API</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: Colors.backgroundDark,
    borderRadius: 10,
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  value: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  success: {
    color: '#4CAF50',
  },
  error: {
    color: '#F44336',
  },
  errorContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderRadius: 5,
  },
  errorLabel: {
    color: '#F44336',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  errorText: {
    color: '#F44336',
    fontSize: 12,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 