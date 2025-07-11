import { View, Text, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import { Colors } from "@/constants/colors"

interface HeaderProps {
  leftIcon: keyof typeof Ionicons.glyphMap
  title: string
  rightIcon: keyof typeof Ionicons.glyphMap
  onRightPress: () => void
}

export function Header({ leftIcon, title, rightIcon, onRightPress }: HeaderProps) {
  return (
    <BlurView
      intensity={80}
      tint="systemMaterialDark"
      style={{
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        overflow: "hidden",
      }}
    >
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-foreground-dark rounded-b-3xl">
        <View
          className="rounded-full p-3"
          style={{
            backgroundColor: Colors.primary + "22", // faible opacité (hex: 22 ≈ 13%)
            borderWidth: 1,
            borderColor: Colors.primary,
          }}
        >
          <Ionicons name={leftIcon} size={20} color={Colors.primary} />
        </View>

        <Text className="text-white text-lg font-semibold">{title}</Text>

        <TouchableOpacity
          onPress={onRightPress}
          style={{
            backgroundColor: Colors.primary + "22",
            borderWidth: 1,
            borderColor: Colors.primary,
            borderRadius: 9999,
            padding: 12,
          }}
        >
          <Ionicons name={rightIcon} size={20} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </BlurView>
  )
}