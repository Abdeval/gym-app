import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";
import { usePodcast } from "@/contexts/PodcastsContext";
import type { Podcast, Episode } from "@/lib/types";
import { useLocalSearchParams, router } from "expo-router";
import { Header } from "@/components/Header";
import { PodcastPlayer } from "@/components/PodcastsPlayer";

export default function PodcastDetailScreen() {
  const { podcastData } = useLocalSearchParams<{
    id: string;
    podcastData: string;
  }>();
  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const {
    playPodcast,
    isPlaying,
    currentEpisode,
    pausePodcast,
    resumePodcast,
  } = usePodcast();
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  // todo: handle the play/pause
  const handlePlayPause = () => {
    if (isPlaying) {
      pausePodcast();
    } else {
      resumePodcast();
    }
  };

  console.log("currentEpisode:", currentEpisode);

  useEffect(() => {
    if (podcastData) {
      try {
        const parsedPodcast = JSON.parse(podcastData as string) as Podcast;
        setPodcast(parsedPodcast);
        setEpisodes(parsedPodcast.episodes || []);
      } catch (error) {
        console.error("Error parsing podcast data:", error);
        router.back();
      }
    }
  }, [podcastData]);

  const handlePlayEpisode = (episode: Episode) => {
    if (podcast) {
      playPodcast(podcast, podcast.episodes.indexOf(episode));
    }
  };

  const formatDuration = (duration: number) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const renderGenres = (genres: string[]) => {
    if (!genres || genres.length === 0) return null;

    return (
      <View className="flex-row flex-wrap mt-3">
        {genres.map((genre, index) => (
          <View
            key={index}
            className="bg-primary/20 px-3 py-1 rounded-full mr-2 mb-2"
          >
            <Text className="text-primary text-sm font-medium">{genre}</Text>
          </View>
        ))}
      </View>
    );
  };

  // ! render item for FlatList
  const renderEpisodeItem = ({
    item,
    index,
  }: {
    item: Episode;
    index: number;
  }) => {
    const isCurrentEpisode = currentEpisode?.uuid === item.uuid;
    const isCurrentPlaying = isCurrentEpisode && isPlaying;

    return (
      <TouchableOpacity
        onPress={() => handlePlayEpisode(item)}
        className={`p-4 mb-3 rounded-xl border ${
          isCurrentEpisode
            ? "bg-primary/10 border-primary/30"
            : "bg-foreground-dark border-white/10"
        }`}
      >
        <View className="flex-row">
          <Image
            source={{ uri: item.imageUrl || podcast?.imageUrl }}
            className="w-16 h-16 rounded-lg mr-4"
            style={{ backgroundColor: Colors.primary + "22" }}
          />
          <View className="flex-1">
            <View className="flex-row items-start justify-between mb-2">
              <Text
                className={`font-semibold text-base flex-1 mr-2 ${
                  isCurrentEpisode ? "text-primary" : "text-white"
                }`}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() => handlePlayEpisode(item)}
                className={`rounded-full p-2 ${
                  isCurrentPlaying ? "bg-primary" : "bg-primary/20"
                }`}
              >
                <Ionicons
                  name={isCurrentPlaying ? "pause" : "play"}
                  size={16}
                  color={isCurrentPlaying ? "white" : Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="bg-gray-600/20 px-2 py-1 rounded-full mr-2">
                  <Text className="text-gray-400 text-xs">
                    Episode {episodes.length - index}
                  </Text>
                </View>
                <Text className="text-gray-400 text-xs">
                  {formatDuration(item.duration)}
                </Text>
              </View>

              {isCurrentEpisode && (
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-primary rounded-full mr-2" />
                  <Text className="text-primary text-xs font-medium">
                    {isPlaying ? "Playing" : "Paused"}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!podcast) {
    return (
      <SafeAreaView className="flex-1 bg-background-dark">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-400">Loading podcast...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      {/* Header */}
      <Header
        leftIcon="arrow-back-outline"
        title="Podcast details"
        rightIcon="headset-outline"
        onLeftPress={() => router.back()}
      />

      <ScrollView
        className="flex-1 relative"
        showsVerticalScrollIndicator={false}
      >
        {/* Podcast Header */}
        <View className="px-4 py-6">
          <View className="items-center mb-6">
            <Image
              source={{ uri: podcast.imageUrl }}
              className="w-48 h-48 rounded-2xl mb-4"
              style={{ backgroundColor: Colors.primary + "22" }}
            />
            <Text className="text-white font-bold text-2xl text-center mb-2">
              {podcast.name}
            </Text>
            <Text className="text-gray-400 text-center text-base leading-6 mb-4">
              {podcast.description}
            </Text>

            {/* Stats */}
            <View className="flex-row items-center justify-center gap-6 mb-4">
              <View className="items-center">
                <Text className="text-white font-semibold text-lg">
                  {podcast.totalEpisodesCount}
                </Text>
                <Text className="text-gray-400 text-sm">Episodes</Text>
              </View>
              <View className="w-px h-8 bg-white/20" />
              <View className="items-center">
                <Text className="text-white font-semibold text-lg">
                  {podcast.genres?.length || 0}
                </Text>
                <Text className="text-gray-400 text-sm">Genres</Text>
              </View>
            </View>

            {/* Genres */}
            {renderGenres(podcast.genres)}

            {/* Play All Button */}
            <TouchableOpacity
              onPress={() =>
                episodes.length > 0 && handlePlayEpisode(episodes[0])
              }
              className="bg-primary rounded-full px-8 py-3 flex-row items-center mt-6"
            >
              <Ionicons name="play" size={20} color="white" />
              <Text className="text-white font-semibold text-base ml-2">
                Play Latest Episode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Episodes Section */}
        <View className="px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-semibold text-xl">
              Episodes ({episodes.length})
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Ionicons name="filter" size={16} color={Colors.primary} />
              <Text className="text-primary text-sm ml-1">Sort</Text>
            </TouchableOpacity>
          </View>

          {episodes.length > 0 ? (
            <FlatList
              data={episodes}
              renderItem={renderEpisodeItem}
              keyExtractor={(item) => item.uuid}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View className="items-center py-8">
              <Ionicons name="headset-outline" size={48} color="#666" />
              <Text className="text-gray-400 text-center mt-4">
                No episodes available
              </Text>
            </View>
          )}
        </View>

        <View className="h-32" />
      </ScrollView>
      
      { currentEpisode && <PodcastPlayer bottom={10}/>}
    </SafeAreaView>
  );
}
