import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { useWorkout } from "@/contexts/WorkoutContext"

export default function HomeScreen() {
  const { activeProgram, todaysWorkout } = useWorkout()

  const handleStartTimer = () => {
    router.push("/(tabs)/timer")
  }

  return (
    <View className="flex-1 bg-background-dark">
      <Header leftIcon="barbell" title="Home" rightIcon="notifications" onRightPress={() => {}} />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mt-6">
          <Text className="text-2xl font-bold text-white mb-2">Welcome back! 👋</Text>
          <Text className="text-gray-400 text-base mb-6">Ready to crush today{"'"}s workout?</Text>
        </View>

        <Card className="mb-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-white font-semibold text-lg mb-1">Today{"'"}s Focus</Text>
              <Text className="text-blue-300 text-base">{todaysWorkout || "Push Day 💪"}</Text>
            </View>
            <TouchableOpacity onPress={handleStartTimer} className="bg-blue-500 rounded-full p-3">
              <Ionicons name="play" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </Card>

        {activeProgram && (
          <Card className="mb-6">
            <Text className="text-white font-semibold text-lg mb-3">Active Program</Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-base mb-1">{activeProgram.name}</Text>
                <Text className="text-gray-400 text-sm">
                  Week {activeProgram.currentWeek} of {activeProgram.totalWeeks}
                </Text>
              </View>
              <View className="bg-green-500/20 px-3 py-1 rounded-full">
                <Text className="text-green-400 text-sm font-medium">{activeProgram.level}</Text>
              </View>
            </View>
            <View className="mt-4 bg-white/10 rounded-full h-2">
              <View
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${(activeProgram.currentWeek / activeProgram.totalWeeks) * 100}%`,
                }}
              />
            </View>
          </Card>
        )}

        <Card className="mb-6">
          <Text className="text-white font-semibold text-lg mb-4">Quick Actions</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handleStartTimer}
              className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex-1 mr-2 items-center"
            >
              <Ionicons name="timer" size={24} color="#EF4444" />
              <Text className="text-red-400 font-medium mt-2">Start Timer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/programs")}
              className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 flex-1 ml-2 items-center"
            >
              <Ionicons name="list" size={24} color="#A855F7" />
              <Text className="text-purple-400 font-medium mt-2">Programs</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card className="mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white font-semibold text-lg">Music Player</Text>
            <TouchableOpacity>
              <Ionicons name="musical-notes" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          <View className="flex-row items-center">
            <View className="bg-white/10 rounded-lg w-12 h-12 items-center justify-center mr-3">
              <Ionicons name="musical-note" size={20} color="white" />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium">Workout Mix</Text>
              <Text className="text-gray-400 text-sm">Energizing beats</Text>
            </View>
            <TouchableOpacity className="bg-white/10 rounded-full p-2">
              <Ionicons name="play" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </Card>

        <View className="h-20" />
      </ScrollView>
    </View>
  )
}
