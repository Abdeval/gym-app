"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Header } from "@/components/Header"
import { Card } from "@/components/Card"
import { useWorkout } from "@/contexts/WorkoutContext"

const PROGRAMS = {
  beginner: [
    {
      id: "1",
      name: "Full Body Starter",
      duration: "4 weeks",
      level: "Beginner",
      description: "Perfect introduction to weight training",
      workouts: ["Upper Body", "Lower Body", "Full Body"],
    },
    {
      id: "2",
      name: "Bodyweight Basics",
      duration: "6 weeks",
      level: "Beginner",
      description: "Build strength using your own body weight",
      workouts: ["Push Movements", "Pull Movements", "Legs & Core"],
    },
  ],
  intermediate: [
    {
      id: "3",
      name: "Push Pull Legs",
      duration: "8 weeks",
      level: "Intermediate",
      description: "Classic muscle building split",
      workouts: ["Push Day", "Pull Day", "Leg Day"],
    },
    {
      id: "4",
      name: "Upper Lower Split",
      duration: "6 weeks",
      level: "Intermediate",
      description: "Balanced approach to muscle development",
      workouts: ["Upper Body", "Lower Body"],
    },
  ],
  advanced: [
    {
      id: "5",
      name: "Powerlifting Focus",
      duration: "12 weeks",
      level: "Advanced",
      description: "Build maximum strength in the big 3",
      workouts: ["Squat Focus", "Bench Focus", "Deadlift Focus"],
    },
    {
      id: "6",
      name: "Hypertrophy Specialization",
      duration: "10 weeks",
      level: "Advanced",
      description: "Maximum muscle growth protocol",
      workouts: ["Chest & Triceps", "Back & Biceps", "Shoulders", "Legs"],
    },
  ],
}

export default function ProgramsScreen() {
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null)
  const { setActiveProgram } = useWorkout()

  const levels = [
    { key: "beginner", label: "Beginner", color: "bg-green-500" },
    { key: "intermediate", label: "Intermediate", color: "bg-yellow-500" },
    { key: "advanced", label: "Advanced", color: "bg-red-500" },
  ] as const

  const handleSelectProgram = (program: any) => {
    setActiveProgram({
      ...program,
      currentWeek: 1,
      totalWeeks: Number.parseInt(program.duration.split(" ")[0]),
    })
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-gray-900 to-black">
      <Header leftIcon="list" title="Programs" rightIcon="notifications" onRightPress={() => {}} />

      <View className="px-4 mt-6">
        <Text className="text-2xl font-bold text-white mb-6">Choose Your Program</Text>

        <View className="flex-row mb-6">
          {levels.map((level) => (
            <TouchableOpacity
              key={level.key}
              onPress={() => setSelectedLevel(level.key)}
              className={`flex-1 py-3 mx-1 rounded-xl ${selectedLevel === level.key ? level.color : "bg-white/10"}`}
            >
              <Text className="text-white font-medium text-center">{level.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {PROGRAMS[selectedLevel].map((program) => (
          <Card key={program.id} className="mb-4">
            <TouchableOpacity onPress={() => setExpandedProgram(expandedProgram === program.id ? null : program.id)}>
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-white font-semibold text-lg mb-1">{program.name}</Text>
                  <Text className="text-gray-400 text-sm mb-2">{program.description}</Text>
                  <View className="flex-row items-center">
                    <View
                      className={`px-2 py-1 rounded-full mr-3 ${
                        program.level === "Beginner"
                          ? "bg-green-500/20"
                          : program.level === "Intermediate"
                            ? "bg-yellow-500/20"
                            : "bg-red-500/20"
                      }`}
                    >
                      <Text
                        className={`text-xs font-medium ${
                          program.level === "Beginner"
                            ? "text-green-400"
                            : program.level === "Intermediate"
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {program.level}
                      </Text>
                    </View>
                    <Text className="text-gray-400 text-sm">{program.duration}</Text>
                  </View>
                </View>
                <Ionicons
                  name={expandedProgram === program.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#9CA3AF"
                />
              </View>
            </TouchableOpacity>

            {expandedProgram === program.id && (
              <View className="mt-4 pt-4 border-t border-white/10">
                <Text className="text-white font-medium mb-3">Workouts:</Text>
                {program.workouts.map((workout, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <View className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                    <Text className="text-gray-300">{workout}</Text>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={() => handleSelectProgram(program)}
                  className="bg-blue-500 rounded-xl py-3 mt-4"
                >
                  <Text className="text-white font-medium text-center">Start Program</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        ))}

        <View className="h-20" />
      </ScrollView>
    </View>
  )
}
