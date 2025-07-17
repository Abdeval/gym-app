export interface Podcast {
  uuid: string
  name: string
  description: string
  imageUrl: string
  totalEpisodesCount: number
  episodes: Episode[]
  genres: string[]
  hash?: string
}

export interface Episode {
  uuid: string
  audioUrl: string
  imageUrl: string
  name: string
  duration: number
}

export interface PodcastContextType {
  currentPodcast: Podcast | null
  currentEpisode: Episode | null
  isPlaying: boolean
  position: number
  duration: number
  playPodcast: (podcast: Podcast, episodeIndex?: number) => void
  pausePodcast: () => void
  resumePodcast: () => void
  stopPodcast: () => void
  seekTo: (position: number) => void
}

export type Workout = {
  title: string;
};

export type Program = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  // duration: string;
  workouts: Workout[];
};

