
import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio"
import type { Episode, Podcast, PodcastContextType } from "@/lib/types"

const PodcastContext = createContext<PodcastContextType | undefined>(undefined)

export function PodcastProvider({ children }: { children: React.ReactNode }) {
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null)
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null)

  // Create audio player instance
  const player = useAudioPlayer()
  const status = useAudioPlayerStatus(player)

  // Use ref to track if component is mounted
  const isMountedRef = useRef(true)

  // Derived state from audio player status
  const isPlaying = status.playing || false
  const position = (status.currentTime || 0) * 1000 // Convert to milliseconds
  const duration = (status.duration || 0) * 1000 // Convert to milliseconds

  useEffect(() => {
    isMountedRef.current = true

    // Cleanup when component unmounts
    return () => {
      isMountedRef.current = false
      try {
        // Only remove if the player is still valid and component is unmounting
        if (player && typeof player.remove === "function") {
          player.remove()
        }
      } catch (error) {
        // Ignore cleanup errors as they're expected during unmount
        console.log("Player cleanup completed")
      }
    }
  }, []) // Remove player from dependency array

  const playPodcast = async (podcast: Podcast, episodeIndex = 0) => {
    try {
      // Check if component is still mounted
      if (!isMountedRef.current) return

      const episode = podcast.episodes[episodeIndex]
      if (!episode?.audioUrl) {
        console.error("No audio URL found for episode")
        return
      }

      const audioUrl = episode.audioUrl
      console.log("Attempting to play:", audioUrl)

      // Set current episode before playing
      setCurrentEpisode(episode)
      setCurrentPodcast(podcast)

      // Replace current source and play
      await player.replace(audioUrl as string)
      player.play()

      console.log("Podcast started successfully")
    } catch (error) {
      console.error("Error playing podcast:", error)
      // Reset state on error
      if (isMountedRef.current) {
        setCurrentPodcast(null)
        setCurrentEpisode(null)
      }
    }
  }

  const pausePodcast = () => {
    try {
      if (!isMountedRef.current) return
      player.pause()
    } catch (error) {
      console.error("Error pausing podcast:", error)
    }
  }

  const resumePodcast = () => {
    try {
      if (!isMountedRef.current) return
      player.play()
    } catch (error) {
      console.error("Error resuming podcast:", error)
    }
  }

  const stopPodcast = () => {
    try {
      if (!isMountedRef.current) return

      // Stop playback but don't remove the player
      player.pause()

      // Reset state
      setCurrentPodcast(null)
      setCurrentEpisode(null)

      console.log("Podcast stopped")
    } catch (error) {
      console.error("Error stopping podcast:", error)
    }
  }

  const seekTo = (newPosition: number) => {
    try {
      if (!isMountedRef.current) return

      // Convert milliseconds to seconds for expo-audio
      const positionInSeconds = newPosition / 1000
      player.seekTo(positionInSeconds)
    } catch (error) {
      console.error("Error seeking:", error)
    }
  }

  return (
    <PodcastContext.Provider
      value={{
        currentPodcast,
        currentEpisode,
        isPlaying,
        position,
        duration,
        playPodcast,
        pausePodcast,
        resumePodcast,
        stopPodcast,
        seekTo,
      }}
    >
      {children}
    </PodcastContext.Provider>
  )
}

export function usePodcast() {
  const context = useContext(PodcastContext)
  if (context === undefined) {
    throw new Error("usePodcast must be used within a PodcastProvider")
  }
  return context
}
