// Firebase configuration and setup
// This file will be used when implementing Firebase backend

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase collections structure
export const COLLECTIONS = {
  USERS: 'users',
  CLIPS: 'clips',
  TRENDING: 'trending',
  NOTIFICATIONS: 'notifications',
  FOLLOWS: 'follows',
  LIKES: 'likes',
  COMMENTS: 'comments',
} as const;

// Firebase user document structure
export interface FirebaseUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  clips: number;
  createdAt: string;
  updatedAt: string;
  settings: {
    notifications: boolean;
    privacy: 'public' | 'followers' | 'private';
    darkMode: boolean;
  };
}

// Firebase clip document structure
export interface FirebaseClip {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  source: 'youtube' | 'twitch' | 'medal' | 'local' | 'other';
  gameTag: string[];
  createdAt: string;
  expiresAt: string;
  userId: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isArchived: boolean;
  isPinned: boolean;
  visibility: 'public' | 'followers' | 'private';
}

// Firebase trending document structure
export interface FirebaseTrending {
  id: string;
  category: string;
  clips: string[]; // Array of clip IDs
  updatedAt: string;
  rank: number;
}

// Firebase notification document structure
export interface FirebaseNotification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'clip';
  fromUserId: string;
  toUserId: string;
  clipId?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// Firebase service functions (to be implemented)
export class FirebaseService {
  // User operations
  static async createUser(user: Omit<FirebaseUser, 'id' | 'createdAt' | 'updatedAt'>) {
    // Implementation will be added when Firebase is integrated
    console.log('Creating user:', user);
  }

  static async getUser(userId: string) {
    // Implementation will be added when Firebase is integrated
    console.log('Getting user:', userId);
  }

  static async updateUser(userId: string, updates: Partial<FirebaseUser>) {
    // Implementation will be added when Firebase is integrated
    console.log('Updating user:', userId, updates);
  }

  // Clip operations
  static async createClip(clip: Omit<FirebaseClip, 'id' | 'createdAt' | 'viewCount' | 'likeCount' | 'commentCount'>) {
    // Implementation will be added when Firebase is integrated
    console.log('Creating clip:', clip);
  }

  static async getClips(userId?: string, limit?: number) {
    // Implementation will be added when Firebase is integrated
    console.log('Getting clips:', { userId, limit });
  }

  static async getTrendingClips(category?: string) {
    // Implementation will be added when Firebase is integrated
    console.log('Getting trending clips:', category);
  }

  static async likeClip(clipId: string, userId: string) {
    // Implementation will be added when Firebase is integrated
    console.log('Liking clip:', clipId, userId);
  }

  // Notification operations
  static async getNotifications(userId: string) {
    // Implementation will be added when Firebase is integrated
    console.log('Getting notifications:', userId);
  }

  static async markNotificationAsRead(notificationId: string) {
    // Implementation will be added when Firebase is integrated
    console.log('Marking notification as read:', notificationId);
  }

  // Follow operations
  static async followUser(followerId: string, followingId: string) {
    // Implementation will be added when Firebase is integrated
    console.log('Following user:', followerId, followingId);
  }

  static async unfollowUser(followerId: string, followingId: string) {
    // Implementation will be added when Firebase is integrated
    console.log('Unfollowing user:', followerId, followingId);
  }
}

// Migration helper functions
export class DataMigration {
  // Convert mock data to Firebase format
  static convertMockUserToFirebase(mockUser: any): FirebaseUser {
    return {
      id: mockUser.id,
      username: mockUser.username,
      displayName: mockUser.displayName,
      avatar: mockUser.avatar,
      bio: mockUser.bio,
      followers: mockUser.followers,
      following: mockUser.following,
      clips: mockUser.clips,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        notifications: true,
        privacy: 'public',
        darkMode: true,
      },
    };
  }

  static convertMockClipToFirebase(mockClip: any): FirebaseClip {
    return {
      id: mockClip.id,
      title: mockClip.title,
      url: mockClip.url,
      thumbnailUrl: mockClip.thumbnailUrl,
      duration: mockClip.duration,
      source: mockClip.source,
      gameTag: mockClip.gameTag,
      createdAt: mockClip.createdAt,
      expiresAt: mockClip.expiresAt,
      userId: mockClip.userId,
      viewCount: mockClip.viewCount,
      likeCount: 0,
      commentCount: 0,
      isArchived: mockClip.isArchived,
      isPinned: mockClip.isPinned,
      visibility: mockClip.visibility,
    };
  }
}