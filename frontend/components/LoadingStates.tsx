import type React from "react"
import { View, Text } from "react-native"
import { AppleActivityIndicator } from "./AppleActivityIndicator"
import { Colors } from "@/constants/colors"

interface LoadingOverlayProps {
  visible: boolean
  text?: string
  size?: "small" | "medium" | "large"
  className?: string
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  text = "Loading...",
  size = "medium",
  className = "",
}) => {
  if (!visible) return null

  return (
    <View className={`absolute inset-0 bg-black/50 items-center justify-center z-50 ${className}`}>
      <View className="bg-background-dark rounded-2xl p-8 items-center min-w-32">
        <AppleActivityIndicator size={size} color={Colors.primary} />
        {text && <Text className="text-white text-base mt-4 text-center">{text}</Text>}
      </View>
    </View>
  )
}

interface LoadingCardProps {
  loading: boolean
  text?: string
  children?: React.ReactNode
  className?: string
}

export const LoadingCard: React.FC<LoadingCardProps> = ({ loading, text = "Loading...", children, className = "" }) => {
  return (
    <View className={`bg-background-dark rounded-xl p-6 ${className}`}>
      {loading ? (
        <View className="items-center justify-center py-8">
          <AppleActivityIndicator color={Colors.primary} />
          <Text className="text-gray-400 text-base mt-4 text-center">{text}</Text>
        </View>
      ) : (
        children
      )}
    </View>
  )
}

interface InlineLoadingProps {
  loading: boolean
  text?: string
  size?: "small" | "medium" | "large"
  className?: string
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({ loading, text, size = "small", className = "" }) => {
  if (!loading) return null

  return (
    <View className={`flex-row items-center ${className}`}>
      <AppleActivityIndicator size={size} color={Colors.primary} />
      {text && <Text className="text-gray-400 text-sm ml-2">{text}</Text>}
    </View>
  )
}
