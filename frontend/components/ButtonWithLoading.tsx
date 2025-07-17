import type React from "react"
import { TouchableOpacity, Text, View } from "react-native"
import { AppleActivityIndicator } from "./AppleActivityIndicator"
import { AppleLoader } from "./AppleLoader"
import { Colors } from "@/constants/colors"

interface ButtonWithLoadingProps {
  title: string
  onPress: () => void
  loading?: boolean
  disabled?: boolean
  className?: string
  loadingText?: string
}

export const ButtonWithLoading: React.FC<ButtonWithLoadingProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  className = "",
  loadingText,
}) => {
  const isDisabled = loading || disabled

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`bg-primary rounded-xl py-3 px-6 flex-row items-center justify-center ${
        isDisabled ? "opacity-50" : ""
      } ${className}`}
    >
      {loading && (
        <View className="mr-2">
          <AppleLoader size={30} color={Colors.primary} />
        </View>
      )}
      <Text className="text-white font-medium text-center">{loading && loadingText ? loadingText : title}</Text>
    </TouchableOpacity>
  )
}
