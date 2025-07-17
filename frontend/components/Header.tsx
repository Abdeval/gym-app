import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/colors";

interface HeaderProps {
  leftIcon: keyof typeof Ionicons.glyphMap;
  title: string;
  showNotification?: () => void; 
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onLeftPress?: () => void;
}

export function Header({ leftIcon, title, showNotification, rightIcon, onLeftPress }: HeaderProps) {

  return (
    <View>
      <BlurView
        intensity={80}
        tint="systemMaterialDark"
        style={{
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          overflow: "hidden",
        }}
      >
        <View className="flex-row items-center justify-between px-4 pt-12 pb-4 bg-background-dark rounded-b-3xl">
          <TouchableOpacity
            onPress={onLeftPress}
            className="rounded-full p-3"
            style={{
              backgroundColor: Colors.primary + "22",
              borderWidth: 1,
              borderColor: Colors.primary,
            }}
          >
            <Ionicons name={leftIcon} size={20} color={Colors.primary} />
          </TouchableOpacity>

          <Text className="text-white text-lg font-semibold">{title}</Text>

          <TouchableOpacity
            onPress={showNotification} // ✅ Call from context
            style={{
              backgroundColor: Colors.primary + "22",
              borderWidth: 1,
              borderColor: Colors.primary,
              borderRadius: 9999,
              padding: 12,
            }}
          >
            <Ionicons name={rightIcon || "notifications"} size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );
}

