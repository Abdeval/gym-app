import { useState, useRef, useEffect, useCallback } from "react"
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  Dimensions,
  RefreshControl, // Import RefreshControl
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { NotificationBottomSheet } from "@/components/NotificationsBottomSheet"
import { Colors } from "@/constants/colors"
import type BottomSheet from "@gorhom/bottom-sheet"
import { PodcastPlayer } from "@/components/PodcastsPlayer"
import { usePodcast } from "@/contexts/PodcastsContext"
import { fetchPodcasts } from "@/lib/api/taddy.api"
import type { Podcast } from "@/lib/types"
import { router } from "expo-router"
import { AppleLoader } from "@/components/AppleLoader" // Keep this if you want to use it for initial loading

const { width } = Dimensions.get("window")

// Map categories to actual genre values that the API expects
const CATEGORY_GENRE_MAP: { [key: string]: string[] } = {
  All: [],
  Strength: ["SPORTS", "FITNESS"],
  Cardio: ["FITNESS", "HEALTH"],
  Nutrition: ["HEALTH", "FITNESS"],
  Mindset: ["SELF_HELP", "MENTAL_HEALTH"],
  Recovery: ["HEALTH", "FITNESS"],
}

const CATEGORIES = ["All", "Strength", "Cardio", "Nutrition", "Mindset", "Recovery"]

export default function PodcastsScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [loading, setLoading] = useState(false) // For initial load and search/filter
  const [isRefreshing, setIsRefreshing] = useState(false) // For pull-to-refresh
  const notificationRef = useRef<BottomSheet>(null)
  const { currentPodcast, playPodcast, isPlaying } = usePodcast()

  const showNotification = () => {
    notificationRef.current?.expand()
  }

  const loadPodcasts = useCallback(
    async (isPullToRefresh = false) => {
      if (!isPullToRefresh) {
        setLoading(true) // Show main loader for initial load, search, filter
      } else {
        setIsRefreshing(true) // Show refresh indicator for pull-to-refresh
      }

      try {
        const genres = selectedCategory !== "All" ? CATEGORY_GENRE_MAP[selectedCategory] : undefined
        const data: any = await fetchPodcasts({
          search: searchQuery || undefined,
          genres: genres,
        })
        setPodcasts(data || [])
      } catch (e) {
        console.error("Failed to load podcasts:", e)
        // You might want to show an error message here
      } finally {
        if (!isPullToRefresh) {
          setLoading(false)
        } else {
          setIsRefreshing(false)
        }
      }
    },
    [searchQuery, selectedCategory],
  )

  useEffect(() => {
    loadPodcasts()
  }, [loadPodcasts])

  const handlePlayPodcast = (podcast: any, episode?: any) => {
    if (episode) {
      console.log("debugging...start")
      playPodcast(podcast, podcast.episodes.indexOf(episode))
    } else if (podcast.episodes && podcast.episodes.length > 0) {
      console.log("debugging...start-1")
      console.log("Playing latest episode of podcast:", podcast.name)
      playPodcast(podcast, podcast.episodes.indexOf(podcast.episodes[0]))
    }
  }

  const handlePodcastPress = (podcast: Podcast) => {
    router.push({
      pathname: "/podcast/[id]",
      params: {
        id: podcast.uuid,
        podcastData: JSON.stringify(podcast),
      },
    })
  }

  const renderGenres = (genres: string[]) => {
    if (!genres || genres.length === 0) return null
    return (
      <View className="flex-row flex-wrap mt-2">
        {genres.slice(0, 3).map((genre, index) => (
          <View key={index} className="bg-primary/20 px-2 py-1 rounded-full mr-2 mb-1">
            <Text className="text-primary text-xs font-medium">{genre}</Text>
          </View>
        ))}
        {genres.length > 3 && (
          <View className="bg-gray-600/20 px-2 py-1 rounded-full">
            <Text className="text-gray-400 text-xs">+{genres.length - 3}</Text>
          </View>
        )}
      </View>
    )
  }

  const renderPodcastItem = ({ item }: { item: Podcast }) => (
    <Card className="mb-4 bg-foreground-dark">
      <TouchableOpacity onPress={() => handlePodcastPress(item)}>
        <View className="flex-row">
          <Image
            source={{ uri: item.imageUrl }}
            className="w-20 h-20 rounded-xl mr-4"
            style={{ backgroundColor: Colors.primary + "22" }}
          />
          <View className="flex-1">
            <Text className="text-white font-semibold text-base mb-1" numberOfLines={2}>
              {item.name}
            </Text>
            <Text className="text-gray-400 text-sm mb-2" numberOfLines={2}>
              {item.description}
            </Text>
            {/* Episode Count */}
            <View className="flex-row items-center mb-2">
              <Ionicons name="headset-outline" size={14} color={Colors.primary} />
              <Text className="text-gray-400 text-xs ml-1">{item.totalEpisodesCount} episodes</Text>
            </View>
            {/* Genres */}
            {renderGenres(item.genres)}
            <View className="flex-row items-center justify-between mt-3">
              <TouchableOpacity
                onPress={() => handlePlayPodcast(item)}
                className="bg-primary/20 px-3 py-1 rounded-full flex-row items-center"
              >
                <Ionicons name="play" size={12} color={Colors.primary} />
                <Text className="text-primary text-xs ml-1 font-medium">Play Latest</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePlayPodcast(item)}
                className="bg-primary rounded-full p-2"
                style={{
                  backgroundColor:
                    currentPodcast?.uuid === item.uuid && isPlaying ? Colors.primary : Colors.primary + "44",
                }}
              >
                <Ionicons
                  name={currentPodcast?.uuid === item.uuid && isPlaying ? "pause" : "play"}
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Card>
  )

  return (
    <View className="flex-1 bg-background-dark">
      <Header leftIcon="headset" title="Podcasts" showNotification={showNotification} />
      <ScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadPodcasts(true)} 
            progressBackgroundColor={Colors.dark.background}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Search Bar */}
        <View className="mt-4 mb-6">
          <View className="bg-foreground-dark border border-white/10 rounded-xl px-4 py-3 flex-row items-center">
            <Ionicons name="search" size={20} color={Colors.primary} />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="Search podcasts, hosts, topics..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Category Filter */}
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full mr-3 ${
                  selectedCategory === category ? "bg-primary" : "bg-foreground-dark border border-white/10"
                }`}
              >
                <Text className={`font-medium ${selectedCategory === category ? "text-white" : "text-gray-400"}`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        {/* Featured Section */}
        {searchQuery === "" && selectedCategory === "All" && podcasts.length > 0 && (
          <View className="mb-6">
            <Text className="text-white font-semibold text-xl mb-4">Featured This Week</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {podcasts.slice(0, 3).map((podcast) => (
                <TouchableOpacity
                  key={podcast.uuid}
                  onPress={() => handlePodcastPress(podcast)}
                  className="mr-4"
                  style={{ width: width * 0.7 }}
                >
                  <Card className="bg-gradient-to-br from-primary/20 to-purple-600/20 border-primary/30">
                    <View className="flex-row">
                      <Image
                        source={{ uri: podcast.imageUrl }}
                        className="w-20 h-20 rounded-xl mr-4"
                        style={{ backgroundColor: Colors.primary + "22" }}
                      />
                      <View className="flex-1">
                        <Text className="text-white font-semibold text-base mb-2" numberOfLines={2}>
                          {podcast.name}
                        </Text>
                        <Text className="text-gray-300 text-sm mb-2" numberOfLines={2}>
                          {podcast.description}
                        </Text>
                        <View className="flex-row items-center justify-between">
                          <Text className="text-primary text-sm font-medium">
                            {podcast.totalEpisodesCount} episodes
                          </Text>
                          <TouchableOpacity
                            onPress={() => handlePlayPodcast(podcast)}
                            className="bg-primary rounded-full p-2"
                          >
                            <Ionicons name="play" size={16} color="white" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </Card>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {/* Results Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-white font-semibold text-lg">
            {searchQuery || selectedCategory !== "All" ? `Results (${podcasts.length})` : "All Podcasts"}
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="filter" size={16} color={Colors.primary} />
            <Text className="text-primary text-sm ml-1">Filter</Text>
          </TouchableOpacity>
        </View>
        {/* Loading State */}
        {loading && <AppleLoader color={Colors.primary} size={30} />}
        {/* Podcast List */}
        {!loading && (
          <FlatList
            data={podcasts}
            renderItem={renderPodcastItem}
            keyExtractor={(item) => item.uuid}
            scrollEnabled={false} // Keep this if the outer ScrollView handles scrolling
            showsVerticalScrollIndicator={false}
          />
        )}
        <View className="h-20" />
      </ScrollView>
      {/* Floating Podcast Player */}
      {currentPodcast && <PodcastPlayer bottom={90} />}
      <NotificationBottomSheet ref={notificationRef} />
    </View>
  )
}
