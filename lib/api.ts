import { supabase } from './supabase';
import { VideoClip, User, Comment, Chat, ChatMessage } from '@/types';

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

// コレクション関連のAPI
export const collectionsApi = {
  // コレクション一覧取得
  async getAllCollections() {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  // コレクション詳細取得
  async getCollection(id: string) {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
  // コレクション作成
  async createCollection(collection: {
    title: string;
    description?: string;
    owner_id: string;
    is_public?: boolean;
    cover_image?: string;
  }) {
    const { data, error } = await supabase
      .from('collections')
      .insert(collection)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // コレクション編集
  async updateCollection(id: string, updates: any) {
    const { data, error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // コレクション削除
  async deleteCollection(id: string) {
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
  // コレクションへのクリップ追加
  async addClipToCollection(collection_id: string, clip_id: string, order_index = 0) {
    const { data, error } = await supabase
      .from('collection_clips')
      .insert({ collection_id, clip_id, order_index })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // コレクションからクリップ削除
  async removeClipFromCollection(collection_id: string, clip_id: string) {
    const { error } = await supabase
      .from('collection_clips')
      .delete()
      .eq('collection_id', collection_id)
      .eq('clip_id', clip_id);
    if (error) throw error;
  },
  // コレクション内のクリップ一覧取得
  async getClipsInCollection(collection_id: string) {
    const { data, error } = await supabase
      .from('collection_clips')
      .select('clip_id, order_index, clips(*)')
      .eq('collection_id', collection_id)
      .order('order_index', { ascending: true });
    if (error) throw error;
    return data;
  },
};

// バッジ関連のAPI
export const badgesApi = {
  // ユーザーのバッジ一覧取得
  async getUserBadges(user_id: string) {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', user_id);
    if (error) throw error;
    return data;
  },
  // バッジ申請（運営審査用）
  async applyBadge(user_id: string, badge_type: string) {
    const { data, error } = await supabase
      .from('badges')
      .insert({ user_id, badge_type })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // バッジ削除
  async deleteBadge(id: string) {
    const { error } = await supabase
      .from('badges')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// 収益分配・ポイント関連のAPI
export const earningsApi = {
  // 収益履歴取得
  async getUserEarnings(user_id: string) {
    const { data, error } = await supabase
      .from('earnings')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },
  // 収益付与
  async addEarning(user_id: string, amount: number, source_type: string, source_id: string) {
    const { data, error } = await supabase
      .from('earnings')
      .insert({ user_id, amount, source_type, source_id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // ユーザーポイント取得
  async getUserPoints(user_id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('points')
      .eq('id', user_id)
      .single();
    if (error) throw error;
    return data?.points || 0;
  },
  // ユーザーポイント加算
  async addUserPoints(user_id: string, amount: number) {
    const { data, error } = await supabase
      .from('users')
      .update({ points: supabase.rpc('add_points', { user_id, amount }) })
      .eq('id', user_id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// コメント関連のAPI
export const commentsApi = {
  // 対象（clip/collection）ごとのコメント一覧取得
  async getComments(targetType: 'clip' | 'collection', targetId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('target_type', targetType)
      .eq('target_id', targetId)
      .eq('deleted', false)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  // コメント作成
  async createComment(comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        parent_id: comment.parentId,
        target_type: comment.targetType,
        target_id: comment.targetId,
        user_id: comment.userId,
        username: comment.username,
        user_avatar: comment.userAvatar,
        content: comment.content,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // コメント更新
  async updateComment(id: string, content: string): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // コメント削除（論理削除）
  async deleteComment(id: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .update({ deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
};

// チャット（DM）関連のAPI
export const chatsApi = {
  // ユーザーが参加しているチャット一覧取得
  async getUserChats(userId: string): Promise<Chat[]> {
    const { data, error } = await supabase
      .from('chats')
      .select('*')
      .contains('user_ids', [userId]);
    if (error) throw error;
    return data || [];
  },
  // チャット作成（1対1/グループ）
  async createChat(userIds: string[]): Promise<Chat> {
    const { data, error } = await supabase
      .from('chats')
      .insert({ user_ids: userIds })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // チャット内メッセージ一覧取得
  async getChatMessages(chatId: string): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId)
      .eq('deleted', false)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  },
  // メッセージ送信
  async sendMessage(msg: Omit<ChatMessage, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        chat_id: msg.chatId,
        user_id: msg.userId,
        username: msg.username,
        user_avatar: msg.userAvatar,
        content: msg.content,
        type: msg.type,
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // メッセージ編集
  async updateMessage(id: string, content: string): Promise<ChatMessage> {
    const { data, error } = await supabase
      .from('chat_messages')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  // メッセージ削除（論理削除）
  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase
      .from('chat_messages')
      .update({ deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  },
  // チャットごとの未読数取得
  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('chat_id', chatId)
      .not('read_by_user_ids', 'cs', `{${userId}}`)
      .eq('deleted', false);
    if (error) throw error;
    return data ? data.length : 0;
  },
  // チャット内メッセージを既読にする
  async markAsRead(chatId: string, userId: string): Promise<void> {
    const { data, error } = await supabase
      .from('chat_messages')
      .update({ read_by_user_ids: supabase.raw('array_append(read_by_user_ids, ?)', [userId]) })
      .eq('chat_id', chatId)
      .not('read_by_user_ids', 'cs', `{${userId}}`)
      .eq('deleted', false);
    if (error) throw error;
  },
}; 