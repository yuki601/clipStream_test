export interface VideoClip {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  source: 'youtube' | 'twitch' | 'medal' | 'local' | 'other';
  gameTag: string[];
  createdAt: string;
  expiresAt: string;
  userId: string;
  username: string;
  userAvatar: string;
  viewCount: number;
  isArchived: boolean;
  isPinned: boolean;
  visibility: 'public' | 'followers' | 'private';
  userIsVerified?: boolean;
  userBadgeType?: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  clips: number;
  highlights: VideoClip[];
  is_verified?: boolean;
  badge_type?: string;
}

export interface Comment {
  id: string;
  parentId?: string; // スレッド/リプライ用
  targetType: 'clip' | 'collection';
  targetId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  deleted?: boolean;
}

export interface Chat {
  id: string;
  userIds: string[]; // 参加ユーザーID
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  type: 'text' | 'image' | 'voice';
  createdAt: string;
  updatedAt?: string;
  deleted?: boolean;
}