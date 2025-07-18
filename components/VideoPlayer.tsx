import React, { useState } from "react";
import { StyleSheet, View, Text, Image, Pressable, Dimensions, Platform } from "react-native";
import { WebView } from "react-native-webview";
import { Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share2 } from "lucide-react-native";
import Colors from "@/constants/Colors";
import { VideoClip } from "@/types";
import { LinearGradient } from "expo-linear-gradient";

interface VideoPlayerProps {
  clip: VideoClip;
  isActive: boolean;
}

const { width, height } = Dimensions.get("window");

export default function VideoPlayer({ clip, isActive }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (showThumbnail) {
      setShowThumbnail(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  // Format time since post
  const formatTimeSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      {showThumbnail ? (
        <Pressable style={styles.thumbnailContainer} onPress={togglePlay}>
          <Image source={{ uri: clip.thumbnailUrl }} style={styles.thumbnail} />
          <View style={styles.playButtonOverlay}>
            <Play color={Colors.text} size={40} />
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{formatDuration(clip.duration)}</Text>
          </View>
        </Pressable>
      ) : (
        <View style={styles.videoContainer}>
          {Platform.OS === 'web' ? (
            <iframe
              src={`${clip.url}?autoplay=${isActive && isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
            />
          ) : (
            <WebView
              source={{ uri: `${clip.url}?autoplay=${isActive && isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}` }}
              style={styles.webview}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              mediaPlaybackRequiresUserAction={false}
            />
          )}
        </View>
      )}

      {/* Controls overlay */}
      <Pressable style={styles.controlsOverlay} onPress={togglePlay}>
        {/* Top gradient */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'transparent']}
          style={styles.topGradient}
        >
          <View style={styles.userInfo}>
            <Image source={{ uri: clip.userAvatar }} style={styles.userAvatar} />
            <View>
              <Text style={styles.username}>{clip.username}</Text>
              <Text style={styles.timeAgo}>{formatTimeSince(clip.createdAt)}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Bottom gradient */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.bottomGradient}
        >
          <View style={styles.clipInfo}>
            <Text style={styles.clipTitle}>{clip.title}</Text>
            <View style={styles.tagContainer}>
              {clip.gameTag.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        {/* Side controls */}
        <View style={styles.sideControls}>
          <Pressable style={styles.controlButton} onPress={toggleLike}>
            <Heart color={isLiked ? Colors.accent : Colors.text} fill={isLiked ? Colors.accent : 'none'} size={28} />
            <Text style={styles.controlText}>12.5K</Text>
          </Pressable>
          <Pressable style={styles.controlButton}>
            <MessageCircle color={Colors.text} size={28} />
            <Text style={styles.controlText}>423</Text>
          </Pressable>
          <Pressable style={styles.controlButton}>
            <Share2 color={Colors.text} size={28} />
            <Text style={styles.controlText}>Share</Text>
          </Pressable>
        </View>

        {/* Center play/pause button (only visible when tapped) */}
        {!isPlaying && !showThumbnail && (
          <View style={styles.centerPlayButton}>
            <Play color={Colors.text} size={50} />
          </View>
        )}

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <Pressable style={styles.muteButton} onPress={toggleMute}>
            {isMuted ? (
              <VolumeX color={Colors.text} size={22} />
            ) : (
              <Volume2 color={Colors.text} size={22} />
            )}
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width,
    height: height - 110, // Adjust for tab bar
    backgroundColor: Colors.backgroundDark,
  },
  thumbnailContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  durationBadge: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  durationText: {
    color: Colors.text,
    fontSize: 12,
  },
  videoContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  webview: {
    flex: 1,
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  topGradient: {
    height: 100,
    width: "100%",
    paddingTop: 40,
    paddingHorizontal: 15,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  username: {
    color: Colors.text,
    fontWeight: "700" as const,
    fontSize: 16,
  },
  timeAgo: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  bottomGradient: {
    height: 150,
    width: "100%",
    justifyContent: "flex-end",
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  clipInfo: {
    width: "75%",
  },
  clipTitle: {
    color: Colors.text,
    fontWeight: "700" as const,
    fontSize: 18,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: "rgba(108, 92, 231, 0.3)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 5,
  },
  tagText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600" as const,
  },
  sideControls: {
    position: "absolute",
    right: 10,
    bottom: 100,
    alignItems: "center",
  },
  controlButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  controlText: {
    color: Colors.text,
    fontSize: 12,
    marginTop: 5,
  },
  centerPlayButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  muteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});