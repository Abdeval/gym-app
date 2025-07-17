import type React from "react"
import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface ErrorProps {
  text: string
  icon?: keyof typeof Ionicons.glyphMap
  className?: string
}

export const Error: React.FC<ErrorProps> = ({ text, icon = "alert-circle", className = "" }) => {
  return (
    <View className={`bg-background-dark rounded-xl p-6 items-center justify-center ${className}`}>
      <View className="bg-red-500/20 rounded-full w-16 h-16 items-center justify-center mb-4">
        <Ionicons name={icon} size={32} color="#EF4444" />
      </View>

      <Text className="text-red-400 text-lg font-semibold text-center mb-2">Oops! Something went wrong</Text>

      <Text className="text-gray-400 text-base text-center leading-6">{text}</Text>
    </View>
  )
}
