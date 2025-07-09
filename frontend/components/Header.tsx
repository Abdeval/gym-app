import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"

interface HeaderProps {
  leftIcon: keyof typeof Ionicons.glyphMap
  title: string
  rightIcon: keyof typeof Ionicons.glyphMap
  onRightPress: () => void
}

export function Header({ leftIcon, title, rightIcon, onRightPress }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-black/20">
      <View className="bg-white/10 border border-white/20 rounded-full p-3">
        <Ionicons name={leftIcon} size={20} color="white" />
      </View>

      <Text className="text-white text-lg font-semibold">{title}</Text>

      <TouchableOpacity onPress={onRightPress} className="bg-white/10 border border-white/20 rounded-full p-3">
        <Ionicons name={rightIcon} size={20} color="white" />
      </TouchableOpacity>
    </View>
  )
}
