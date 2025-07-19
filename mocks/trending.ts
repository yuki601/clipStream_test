import { VideoClip } from "@/types";

export interface TrendingCategory {
  id: string;
  name: string;
  icon: string;
  clips: VideoClip[];
}

export const mockTrendingCategories: TrendingCategory[] = [
  {
    id: "fps",
    name: "FPS",
    icon: "🎯",
    clips: [
      {
        id: "trending-fps-1",
        title: "Insane 1v5 Clutch",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2670&auto=format&fit=crop",
        duration: 42,
        source: "twitch",
        gameTag: ["APEX", "Clutch"],
        createdAt: new Date(Date.now() - 1800000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-1",
        username: "apex_legend",
        userAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
        viewCount: 15420,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      },
      {
        id: "trending-fps-2",
        title: "Perfect Headshot Montage",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
        duration: 38,
        source: "youtube",
        gameTag: ["Valorant", "Headshot"],
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-2",
        username: "headshot_king",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop",
        viewCount: 12350,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      },
      {
        id: "trending-fps-3",
        title: "200IQ Play",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop",
        duration: 35,
        source: "medal",
        gameTag: ["Call of Duty", "Strategy"],
        createdAt: new Date(Date.now() - 5400000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-3",
        username: "tactical_genius",
        userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop",
        viewCount: 9876,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      }
    ]
  },
  {
    id: "battle-royale",
    name: "Battle Royale",
    icon: "👑",
    clips: [
      {
        id: "trending-br-1",
        title: "Solo Squad Wipe",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2671&auto=format&fit=crop",
        duration: 55,
        source: "youtube",
        gameTag: ["Fortnite", "Solo"],
        createdAt: new Date(Date.now() - 2700000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-4",
        username: "battle_master",
        userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
        viewCount: 18750,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      },
      {
        id: "trending-br-2",
        title: "Last Circle Miracle",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop",
        duration: 48,
        source: "twitch",
        gameTag: ["PUBG", "Victory"],
        createdAt: new Date(Date.now() - 4500000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-5",
        username: "chicken_dinner",
        userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2680&auto=format&fit=crop",
        viewCount: 14230,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      }
    ]
  },
  {
    id: "moba",
    name: "MOBA",
    icon: "⚔️",
    clips: [
      {
        id: "trending-moba-1",
        title: "Pentakill Highlight",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2670&auto=format&fit=crop",
        duration: 41,
        source: "youtube",
        gameTag: ["League of Legends", "Pentakill"],
        createdAt: new Date(Date.now() - 6300000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-6",
        username: "penta_hunter",
        userAvatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
        viewCount: 11540,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      }
    ]
  },
  {
    id: "racing",
    name: "Racing",
    icon: "🏎️",
    clips: [
      {
        id: "trending-racing-1",
        title: "Perfect Drift Chain",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop",
        duration: 33,
        source: "medal",
        gameTag: ["Gran Turismo", "Drift"],
        createdAt: new Date(Date.now() - 7200000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-7",
        username: "drift_king",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop",
        viewCount: 8920,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      }
    ]
  },
  {
    id: "rpg",
    name: "RPG",
    icon: "🗡️",
    clips: [
      {
        id: "trending-rpg-1",
        title: "Boss Fight No Damage",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop",
        duration: 60,
        source: "youtube",
        gameTag: ["Elden Ring", "Boss"],
        createdAt: new Date(Date.now() - 9000000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-8",
        username: "souls_master",
        userAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop",
        viewCount: 13670,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      }
    ]
  },
  {
    id: "indie",
    name: "Indie",
    icon: "🎮",
    clips: [
      {
        id: "trending-indie-1",
        title: "Hidden Gem Discovery",
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        thumbnailUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2671&auto=format&fit=crop",
        duration: 45,
        source: "twitch",
        gameTag: ["Indie", "Discovery"],
        createdAt: new Date(Date.now() - 10800000).toISOString(),
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
        userId: "trending-user-9",
        username: "indie_explorer",
        userAvatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
        viewCount: 6540,
        isArchived: false,
        isPinned: false,
        visibility: "public"
      }
    ]
  }
];