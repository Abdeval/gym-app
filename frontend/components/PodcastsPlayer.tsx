import { useState } from "react"
import { View, Text, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Slider from "@react-native-community/slider"
import { Colors } from "@/constants/colors"
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated"
import { usePodcast } from "@/contexts/PodcastsContext"

export function PodcastPlayer({ bottom = 90 }: { bottom?: number }) {
  const {
    currentPodcast,
    currentEpisode,
    isPlaying,
    position,
    duration,
    pausePodcast,
    resumePodcast,
    stopPodcast,
    seekTo,
  } = usePodcast()

  const [isExpanded, setIsExpanded] = useState(false)
  const height = useSharedValue(80)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(height.value),
    }
  })

  // Don't render if no current podcast or episode
  if (!currentPodcast || !currentEpisode) return null

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    height.value = isExpanded ? 80 : 200
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pausePodcast()
    } else {
      resumePodcast()
    }
  }

  const handleSeek = (value: number) => {
    seekTo(value)
  }

  const handleStop = () => {
    setIsExpanded(false)
    height.value = 80
    stopPodcast()
  }

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: "absolute",
          bottom,
          left: 16,
          right: 16,
          backgroundColor: Colors.dark.background,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
          overflow: "hidden",
        },
      ]}
    >
      {/* Mini Player */}
      <TouchableOpacity onPress={toggleExpanded} className="p-4">
        <View className="flex-row items-center">
          <Image
            source={{ uri: currentEpisode.imageUrl || currentPodcast.imageUrl }}
            className="w-12 h-12 rounded-lg mr-3"
            style={{ backgroundColor: Colors.primary + "22" }}
          />
          <View className="flex-1">
            <Text className="text-white font-medium text-sm" numberOfLines={1}>
              {currentEpisode.name}
            </Text>
            <Text className="text-gray-400 text-xs" numberOfLines={1}>
              {currentPodcast.name}
            </Text>
          </View>
          <TouchableOpacity onPress={handlePlayPause} className="bg-primary rounded-full p-2 mr-3">
            <Ionicons name={isPlaying ? "pause" : "play"} size={16} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleStop}>
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Expanded Player */}
      {isExpanded && (
        <View className="px-4 pb-4 ">
          {/* Episode Info */}
          <View className="mb-4">
            <Text className="text-white font-semibold text-base mb-1" numberOfLines={2}>
              {currentEpisode.name}
            </Text>
            <Text className="text-gray-400 text-sm" numberOfLines={1}>
              {currentPodcast.name}
            </Text>
          </View>

          {/* Progress Bar */}
          <View className="mb-4">
            <Slider
              style={{ width: "100%", height: 20 }}
              minimumValue={0}
              maximumValue={duration || 1}
              value={position}
              onValueChange={handleSeek}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor="#333"
              thumbTintColor={Colors.primary}
            />
            <View className="flex-row justify-between mt-1">
              <Text className="text-gray-400 text-xs">{formatTime(position)}</Text>
              <Text className="text-gray-400 text-xs">{formatTime(duration)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View className="flex-row items-center justify-center gap-6">
            <TouchableOpacity onPress={() => seekTo(Math.max(0, position - 15000))}>
              <Ionicons name="play-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause} className="bg-primary rounded-full p-4">
              <Ionicons name={isPlaying ? "pause" : "play"} size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => seekTo(Math.min(duration, position + 15000))}>
              <Ionicons name="play-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Animated.View>
  )
}
