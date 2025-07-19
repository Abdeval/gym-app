"use client";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { useWorkout } from "@/contexts/WorkoutContext";
import { NotificationBottomSheet } from "@/components/NotificationsBottomSheet";
import type BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { Colors } from "@/constants/colors";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { activeProgram, todaysWorkout } = useWorkout();
  const handleStartTimer = () => {
    router.push("/(tabs)/timer");
  };

  const notificationRef = useRef<BottomSheet>(null);
  const showNotification = () => {
    notificationRef.current?.expand();
  };

  // console.log(todaysWorkout);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-background-dark">
        <Header
          leftIcon="barbell"
          title="Home"
          showNotification={showNotification}
        />

        {/* Main Content */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          <ImageBackground
            source={require("@/assets/images/ui/home.png")}
            resizeMode="cover"
            style={{
              height: 200,
              borderRadius: 20,
              overflow: "hidden",
            }}
            className="w-full mt-4 mb-6 p-2 relative"
          >
            {/* Overlay for better text readability */}
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                borderRadius: 20,
                zIndex: 0,
              }}
            />
            {/* Top section - Welcome text */}
            <View className="relative z-50 flex-1 justify-end pb-2 p-4">
              <Text className="text-2xl font-bold text-white mb-2">
                Welcome back! 👋
              </Text>
              <Text className="text-gray-200 text-base">
                Ready to crush today{"'"}s workout?
              </Text>
            </View>
            {/* Bottom section - Today's Focus Card */}
            <View className="relative z-50 bg-black/30 rounded-3xl p-4 border border-white/20">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white font-semibold text-lg mb-1">
                    Today{"'"}s Focus
                  </Text>
                  <Text className="text-blue-300 text-base">
                    {todaysWorkout || "Push Day 💪"}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleStartTimer}
                  className="bg-primary rounded-full p-3 ml-3"
                >
                  <Ionicons name="play" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>

          {activeProgram && (
            <Card className="mb-6">
              <Text className="text-white font-semibold text-lg mb-3">
                Active Program
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-white text-base mb-1">
                    {activeProgram.title}
                  </Text>
                  {/* <Text className="text-gray-400 text-sm">
                  Week {activeProgram.currentWeek} of {activeProgram.totalWeeks}
                </Text> */}
                </View>
                <View className="bg-green-500/20 px-3 py-1 rounded-full">
                  <Text className="text-green-400 text-sm font-medium">
                    {activeProgram.level}
                  </Text>
                </View>
              </View>
              <View className="mt-4 bg-white/10 rounded-full h-2">
                <View
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    // width: `${(activeProgram.currentWeek / activeProgram.totalWeeks) * 100}%`,
                    width: "100%",
                  }}
                />
              </View>
            </Card>
          )}

          <Card className="mb-6">
            <Text className="text-white font-semibold text-lg mb-4">
              Quick Actions
            </Text>
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={handleStartTimer}
                className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex-1 mr-2 items-center"
              >
                <Ionicons name="timer" size={24} color="#EF4444" />
                <Text className="text-red-400 font-medium mt-2">
                  Start Timer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/programs")}
                className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 flex-1 ml-2 items-center"
              >
                <Ionicons name="list" size={24} color="#A855F7" />
                <Text className="text-purple-400 font-medium mt-2">
                  Programs
                </Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Updated Music/Podcast Player Card */}
          <Card className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white font-semibold text-lg">
                Audio & Podcasts
              </Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/podcasts")}>
                <Ionicons name="headset" size={20} color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <View className="gap-3">
              {/* Music Player */}
              <View className="flex-row items-center">
                <View className="bg-white/10 rounded-lg w-12 h-12 items-center justify-center mr-3">
                  <Ionicons name="musical-note" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">Workout Mix</Text>
                  <Text className="text-gray-400 text-sm">
                    Energizing beats
                  </Text>
                </View>
                <TouchableOpacity className="bg-white/10 rounded-full p-2">
                  <Ionicons name="play" size={16} color="white" />
                </TouchableOpacity>
              </View>

              {/* Podcast Preview */}
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/podcasts")}
                className="flex-row items-center pt-3 border-t border-white/10"
              >
                <View className="bg-primary/20 rounded-lg w-12 h-12 items-center justify-center mr-3">
                  <Ionicons name="headset" size={20} color={Colors.primary} />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">
                    Featured Podcasts
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    Training tips & motivation
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          </Card>

          {/* 
        <TouchableOpacity onPress={() => router.push("/workout")} className="bg-primary rounded-xl py-3 mb-6">
          <Text>workout</Text>
        </TouchableOpacity> */}
          <View className="h-20" />
        </ScrollView>

        <NotificationBottomSheet ref={notificationRef} />
      </View>
    </SafeAreaView>
  );
}
