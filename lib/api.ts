import { supabase } from './supabase';
import { VideoClip, User } from '@/types';

// クリップ関連のAPI
export const clipsApi = {
  // すべてのクリップを取得
  async getAllClips(): Promise<VideoClip[]> {
    const { data, error } = await supabase
      .from('clips')
      .select('*')
      .eq('visibility', 'public')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map(clip => ({
      id: clip.id,
      title: clip.title,
      url: clip.url,
      thumbnailUrl: clip.thumbnail_url,
      duration: clip.duration,
      source: clip.source,
      gameTag: clip.game_tags,
      createdAt: clip.created_at,
      expiresAt: clip.expires_at,
      userId: clip.user_id,
      username: clip.username,
      userAvatar: clip.user_avatar,
      viewCount: clip.view_count,
      isArchived: clip.is_archived,
      isPinned: clip.is_pinned,
      visibility: clip.visibility,
    })) || [];
  },

  // クリップを作成
  async createClip(clip: Omit<VideoClip, 'id' | 'createdAt' | 'viewCount'>): Promise<VideoClip> {
    const { data, error } = await supabase
      .from('clips')
      .insert({
        title: clip.title,
        url: clip.url,
        thumbnail_url: clip.thumbnailUrl,
        duration: clip.duration,
        source: clip.source,
        game_tags: clip.gameTag,
        expires_at: clip.expiresAt,
        user_id: clip.userId,
        username: clip.username,
        user_avatar: clip.userAvatar,
        is_archived: clip.isArchived,
        is_pinned: clip.isPinned,
        visibility: clip.visibility,
      })
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      thumbnailUrl: data.thumbnail_url,
      duration: data.duration,
      source: data.source,
      gameTag: data.game_tags,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      userId: data.user_id,
      username: data.username,
      userAvatar: data.user_avatar,
      viewCount: data.view_count,
      isArchived: data.is_archived,
      isPinned: data.is_pinned,
      visibility: data.visibility,
    };
  },

  // クリップを更新
  async updateClip(id: string, updates: Partial<VideoClip>): Promise<VideoClip> {
    const updateData: any = {};
    if (updates.title) updateData.title = updates.title;
    if (updates.url) updateData.url = updates.url;
    if (updates.thumbnailUrl) updateData.thumbnail_url = updates.thumbnailUrl;
    if (updates.duration) updateData.duration = updates.duration;
    if (updates.source) updateData.source = updates.source;
    if (updates.gameTag) updateData.game_tags = updates.gameTag;
    if (updates.expiresAt) updateData.expires_at = updates.expiresAt;
    if (updates.visibility) updateData.visibility = updates.visibility;
    if (updates.isArchived !== undefined) updateData.is_archived = updates.isArchived;
    if (updates.isPinned !== undefined) updateData.is_pinned = updates.isPinned;

    const { data, error } = await supabase
      .from('clips')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      thumbnailUrl: data.thumbnail_url,
      duration: data.duration,
      source: data.source,
      gameTag: data.game_tags,
      createdAt: data.created_at,
      expiresAt: data.expires_at,
      userId: data.user_id,
      username: data.username,
      userAvatar: data.user_avatar,
      viewCount: data.view_count,
      isArchived: data.is_archived,
      isPinned: data.is_pinned,
      visibility: data.visibility,
    };
  },

  // クリップを削除
  async deleteClip(id: string): Promise<void> {
    const { error } = await supabase
      .from('clips')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // ビュー数を増やす
  async incrementViewCount(id: string): Promise<void> {
    const { error } = await supabase.rpc('increment_view_count', { clip_id: id });
    if (error) throw error;
  },
};

// ユーザー関連のAPI
export const usersApi = {
  // ユーザーを取得
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      avatar: data.avatar,
      bio: data.bio,
      followers: data.followers,
      following: data.following,
      clips: data.clips,
      highlights: [], // 別途取得が必要
    };
  },

  // ユーザーを更新
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const updateData: any = {};
    if (updates.username) updateData.username = updates.username;
    if (updates.displayName) updateData.display_name = updates.displayName;
    if (updates.avatar) updateData.avatar = updates.avatar;
    if (updates.bio) updateData.bio = updates.bio;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return {
      id: data.id,
      username: data.username,
      displayName: data.display_name,
      avatar: data.avatar,
      bio: data.bio,
      followers: data.followers,
      following: data.following,
      clips: data.clips,
      highlights: [],
    };
  },

  // フォローする
  async followUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabase
      .from('follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
      });

    if (error) throw error;
  },

  // フォローを解除
  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const { error } = await supabase
      .from('follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);

    if (error) throw error;
  },
};

// 認証関連のAPI
export const authApi = {
  // サインアップ
  async signUp(email: string, password: string, username: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          display_name: displayName,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  // サインイン
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // サインアウト
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 現在のユーザーを取得
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
};

// トレンド関連のAPI
export const trendingApi = {
  // トレンドクリップを取得
  async getTrendingClips(): Promise<VideoClip[]> {
    const { data, error } = await supabase
      .from('clips')
      .select('*')
      .eq('visibility', 'public')
      .order('view_count', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data?.map(clip => ({
      id: clip.id,
      title: clip.title,
      url: clip.url,
      thumbnailUrl: clip.thumbnail_url,
      duration: clip.duration,
      source: clip.source,
      gameTag: clip.game_tags,
      createdAt: clip.created_at,
      expiresAt: clip.expires_at,
      userId: clip.user_id,
      username: clip.username,
      userAvatar: clip.user_avatar,
      viewCount: clip.view_count,
      isArchived: clip.is_archived,
      isPinned: clip.is_pinned,
      visibility: clip.visibility,
    })) || [];
  },
}; 