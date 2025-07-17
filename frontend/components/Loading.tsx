import type React from "react"
import { View, Text, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "./Button"
import { Colors } from "@/constants/colors"

interface LoadingErrorProps {
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  loadingText?: string
  className?: string
}

export const LoadingError: React.FC<LoadingErrorProps> = ({
  loading = false,
  error = null,
  onRetry,
  loadingText = "Loading...",
  className = "",
}) => {
  if (loading) {
    return (
      <View className={`bg-background-dark rounded-xl p-6 items-center justify-center ${className}`}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="text-gray-400 text-base mt-4 text-center">{loadingText}</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View className={`bg-background-dark rounded-xl p-6 items-center justify-center ${className}`}>
        <View className="bg-red-500/20 rounded-full w-16 h-16 items-center justify-center mb-4">
          <Ionicons name="alert-circle" size={32} color="#EF4444" />
        </View>

        <Text className="text-red-400 text-lg font-semibold text-center mb-2">Error</Text>

        <Text className="text-gray-400 text-base text-center leading-6 mb-6">{error}</Text>

        {onRetry && <Button title="Try Again" onPress={onRetry} className="bg-primary px-6" />}
      </View>
    )
  }

  return null
}
