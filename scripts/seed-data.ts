import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// .envファイルを読み込み
dotenv.config();

// Supabase設定
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// サンプルユーザーデータ
const sampleUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    username: 'sniper_king',
    display_name: 'Sniper King',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop',
    bio: 'Professional sniper player. Love long-range shots!',
    followers: 1243,
    following: 89,
    clips: 15,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    username: 'victory_royale',
    display_name: 'Victory Royale',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop',
    bio: 'Fortnite champion. Building and editing master!',
    followers: 2567,
    following: 156,
    clips: 23,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    username: 'speed_demon',
    display_name: 'Speed Demon',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop',
    bio: 'Speedrunning enthusiast. World record holder!',
    followers: 8943,
    following: 234,
    clips: 45,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    username: 'trick_master',
    display_name: 'Trick Master',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop',
    bio: 'Trickshot specialist. Impossible shots are my specialty!',
    followers: 4321,
    following: 178,
    clips: 32,
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    username: 'comeback_kid',
    display_name: 'Comeback Kid',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2680&auto=format&fit=crop',
    bio: 'Never give up! Comeback specialist.',
    followers: 6789,
    following: 267,
    clips: 28,
  },
];

// サンプルクリップデータ
const sampleClips = [
  {
    id: 'clip-001',
    title: 'Insane Sniper Shot',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=2670&auto=format&fit=crop',
    duration: 45,
    source: 'youtube',
    game_tags: ['APEX', 'Sniper'],
    created_at: new Date(Date.now() - 3600000).toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    username: 'sniper_king',
    user_avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop',
    view_count: 1243,
    is_archived: false,
    is_pinned: false,
    visibility: 'public',
  },
  {
    id: 'clip-002',
    title: 'Epic Clutch Win',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop',
    duration: 58,
    source: 'youtube',
    game_tags: ['Fortnite', 'Victory'],
    created_at: new Date(Date.now() - 7200000).toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    username: 'victory_royale',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop',
    view_count: 2567,
    is_archived: false,
    is_pinned: true,
    visibility: 'public',
  },
  {
    id: 'clip-003',
    title: 'Speedrun World Record',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2671&auto=format&fit=crop',
    duration: 32,
    source: 'twitch',
    game_tags: ['Minecraft', 'Speedrun'],
    created_at: new Date(Date.now() - 10800000).toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    username: 'speed_demon',
    user_avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=2680&auto=format&fit=crop',
    view_count: 8943,
    is_archived: true,
    is_pinned: true,
    visibility: 'public',
  },
  {
    id: 'clip-004',
    title: 'Impossible Trick Shot',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?q=80&w=2671&auto=format&fit=crop',
    duration: 22,
    source: 'medal',
    game_tags: ['Call of Duty', 'Trickshot'],
    created_at: new Date(Date.now() - 14400000).toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440004',
    username: 'trick_master',
    user_avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop',
    view_count: 4321,
    is_archived: false,
    is_pinned: false,
    visibility: 'public',
  },
  {
    id: 'clip-005',
    title: 'Unbelievable Comeback',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop',
    duration: 55,
    source: 'youtube',
    game_tags: ['League of Legends', 'Comeback'],
    created_at: new Date(Date.now() - 18000000).toISOString(),
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    user_id: '550e8400-e29b-41d4-a716-446655440005',
    username: 'comeback_kid',
    user_avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=2680&auto=format&fit=crop',
    view_count: 6789,
    is_archived: false,
    is_pinned: true,
    visibility: 'public',
  },
];

// サンプルフォローデータ
const sampleFollows = [
  {
    follower_id: '550e8400-e29b-41d4-a716-446655440001',
    following_id: '550e8400-e29b-41d4-a716-446655440002',
  },
  {
    follower_id: '550e8400-e29b-41d4-a716-446655440001',
    following_id: '550e8400-e29b-41d4-a716-446655440003',
  },
  {
    follower_id: '550e8400-e29b-41d4-a716-446655440002',
    following_id: '550e8400-e29b-41d4-a716-446655440001',
  },
  {
    follower_id: '550e8400-e29b-41d4-a716-446655440003',
    following_id: '550e8400-e29b-41d4-a716-446655440004',
  },
  {
    follower_id: '550e8400-e29b-41d4-a716-446655440004',
    following_id: '550e8400-e29b-41d4-a716-446655440005',
  },
  {
    follower_id: '550e8400-e29b-41d4-a716-446655440005',
    following_id: '550e8400-e29b-41d4-a716-446655440001',
  },
];

async function seedData() {
  console.log('🌱 Starting data seeding...');

  try {
    // 1. ユーザーデータを挿入
    console.log('📝 Inserting users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .insert(sampleUsers)
      .select();

    if (usersError) {
      console.error('❌ Error inserting users:', usersError);
      return;
    }
    console.log(`✅ Inserted ${users?.length || 0} users`);

    // 2. クリップデータを挿入
    console.log('🎬 Inserting clips...');
    const { data: clips, error: clipsError } = await supabase
      .from('clips')
      .insert(sampleClips)
      .select();

    if (clipsError) {
      console.error('❌ Error inserting clips:', clipsError);
      return;
    }
    console.log(`✅ Inserted ${clips?.length || 0} clips`);

    // 3. フォローデータを挿入
    console.log('👥 Inserting follows...');
    const { data: follows, error: followsError } = await supabase
      .from('follows')
      .insert(sampleFollows)
      .select();

    if (followsError) {
      console.error('❌ Error inserting follows:', followsError);
      return;
    }
    console.log(`✅ Inserted ${follows?.length || 0} follows`);

    console.log('🎉 Data seeding completed successfully!');
    console.log(`📊 Summary:`);
    console.log(`   - Users: ${users?.length || 0}`);
    console.log(`   - Clips: ${clips?.length || 0}`);
    console.log(`   - Follows: ${follows?.length || 0}`);

  } catch (error) {
    console.error('❌ Unexpected error during seeding:', error);
  }
}

// スクリプトを実行
seedData(); 