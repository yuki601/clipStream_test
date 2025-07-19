export const PRESET_GAME_TAGS = [
  // FPS Games
  "APEX",
  "Valorant", 
  "Call of Duty",
  "Counter-Strike",
  "Overwatch",
  "Rainbow Six",
  
  // Battle Royale
  "Fortnite",
  "PUBG",
  "Warzone",
  "Apex Legends",
  
  // MOBA
  "League of Legends",
  "Dota 2",
  "Heroes of the Storm",
  
  // MMO/RPG
  "World of Warcraft",
  "Final Fantasy XIV",
  "Elden Ring",
  "Dark Souls",
  "Cyberpunk 2077",
  
  // Racing
  "Gran Turismo",
  "Forza",
  "F1",
  "Need for Speed",
  
  // Sports
  "FIFA",
  "NBA 2K",
  "Rocket League",
  
  // Indie/Other
  "Minecraft",
  "Among Us",
  "Fall Guys",
  "Genshin Impact",
  "Hades",
  
  // Action Types
  "Clutch",
  "Ace",
  "Pentakill",
  "Headshot",
  "Sniper",
  "Trickshot",
  "Speedrun",
  "Boss Fight",
  "PvP",
  "Victory",
  "Comeback",
  "Fail",
  "Funny",
  "Epic",
  "Insane"
] as const;

export type PresetGameTag = typeof PRESET_GAME_TAGS[number];