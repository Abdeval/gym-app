import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";

export default function Index() {
  return (
    <ImageBackground
      source={require("@/assets/images/ui/background.jpg")}
      resizeMode="cover"
      className="flex-1 items-center justify-center"
    >
      <View className="bg-black/50 w-full h-full items-center justify-center px-4">
        <Animated.View entering={FadeInDown.duration(800)}>
          <View className="w-screen py-8 items-center justify-center">
            <View
              className="p-2 items-center justify-center w-20 h-20 
            rounded-full bg-foreground-dark border border-primary
          "
            >
              <Image
                source={require("@/assets/images/ui/logo.png")}
                className="w-full h-full"
              />
            </View>
          </View>
          <View className="items-center px-4 gap-2">
            <Text className="text-white text-3xl font-bold text-center w-80">
              Welcome to the Gym Workout App!
            </Text>
            <Text className="text-gray-300 text-center mt-4">
              Track your workouts, follow programs, and stay motivated.
            </Text>
          </View>
          <View className="w-screen px-4 items-center">
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home")}
              className="mt-8 h-[60px] w-[60%] flex-row bg-primary
            rounded-3xl items-center justify-between px-1.5 py-1"
            >
              <Text className="text-white text-xl font-semibold text-center">
                Get Started
              </Text>
              <Ionicons
                name="arrow-forward-outline"
                size={50}
                color={"white"}
                className="bg-background-dark rounded-3xl"
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}
