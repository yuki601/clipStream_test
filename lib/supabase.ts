import { createClient } from '@supabase/supabase-js';

// Supabaseの設定
// これらの値は実際のSupabaseプロジェクトから取得してください
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 型定義
export interface Database {
  public: {
    Tables: {
      clips: {
        Row: {
          id: string;
          title: string;
          url: string;
          thumbnail_url: string;
          duration: number;
          source: 'youtube' | 'twitch' | 'medal' | 'local' | 'other';
          game_tags: string[];
          created_at: string;
          expires_at: string;
          user_id: string;
          username: string;
          user_avatar: string;
          view_count: number;
          is_archived: boolean;
          is_pinned: boolean;
          visibility: 'public' | 'followers' | 'private';
        };
        Insert: {
          id?: string;
          title: string;
          url: string;
          thumbnail_url?: string;
          duration: number;
          source: 'youtube' | 'twitch' | 'medal' | 'local' | 'other';
          game_tags: string[];
          created_at?: string;
          expires_at: string;
          user_id: string;
          username: string;
          user_avatar: string;
          view_count?: number;
          is_archived?: boolean;
          is_pinned?: boolean;
          visibility: 'public' | 'followers' | 'private';
        };
        Update: {
          id?: string;
          title?: string;
          url?: string;
          thumbnail_url?: string;
          duration?: number;
          source?: 'youtube' | 'twitch' | 'medal' | 'local' | 'other';
          game_tags?: string[];
          created_at?: string;
          expires_at?: string;
          user_id?: string;
          username?: string;
          user_avatar?: string;
          view_count?: number;
          is_archived?: boolean;
          is_pinned?: boolean;
          visibility?: 'public' | 'followers' | 'private';
        };
      };
      users: {
        Row: {
          id: string;
          username: string;
          display_name: string;
          avatar: string;
          bio: string;
          followers: number;
          following: number;
          clips: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          display_name: string;
          avatar?: string;
          bio?: string;
          followers?: number;
          following?: number;
          clips?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          display_name?: string;
          avatar?: string;
          bio?: string;
          followers?: number;
          following?: number;
          clips?: number;
          created_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
    };
  };
} 