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
}