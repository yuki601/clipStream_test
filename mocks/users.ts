import { User } from "@/types";
import { mockClips } from "./clips";

export const mockUsers: User[] = [
  {
    id: "user1",
    username: "sniper_king",
    displayName: "Sniper King",
    avatar: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=2574&auto=format&fit=crop",
    bio: "Professional APEX player. Sniper specialist.",
    followers: 12500,
    following: 345,
    clips: 87,
    highlights: [mockClips[0]]
  },
  {
    id: "user2",
    username: "victory_royale",
    displayName: "Victory Royale",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2680&auto=format&fit=crop",
    bio: "Fortnite champion. 500+ wins and counting!",
    followers: 8700,
    following: 412,
    clips: 65,
    highlights: [mockClips[1]]
  },
  {
    id: "currentUser",
    username: "you",
    displayName: "Your Profile",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=2574&auto=format&fit=crop",
    bio: "Gaming enthusiast. Sharing my best moments!",
    followers: 1250,
    following: 534,
    clips: 42,
    highlights: [mockClips[2], mockClips[4]]
  }
];