import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

export default function TimerScreen() {
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [workoutTime, setWorkoutTime] = useState(0);
  const [isRestActive, setIsRestActive] = useState(false);
  const [restTime, setRestTime] = useState(60);
  const [defaultRestTime, setDefaultRestTime] = useState(60);
  const [isRestPaused, setIsRestPaused] = useState(false);

  const workoutInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const restInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Workout timer
  useEffect(() => {
    if (isWorkoutActive) {
      workoutInterval.current = setInterval(() => {
        setWorkoutTime((prev) => prev + 1);
      }, 1000);
    } else if (workoutInterval.current) {
      clearInterval(workoutInterval.current);
    }
    return () => {
      if (workoutInterval.current) clearInterval(workoutInterval.current);
    };
  }, [isWorkoutActive]);

  // Rest timer (pause/reprise inclus)
  useEffect(() => {
    if (isRestActive && !isRestPaused && restTime > 0) {
      restInterval.current = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsRestActive(false);
            setIsRestPaused(false);
            return defaultRestTime;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (restInterval.current) {
      clearInterval(restInterval.current);
    }
    return () => {
      if (restInterval.current) clearInterval(restInterval.current);
    };
  }, [isRestActive, isRestPaused, restTime, defaultRestTime]);

  // Pulse animation for rest timer
  useEffect(() => {
    if (isRestActive && !isRestPaused) {
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (isRestActive && !isRestPaused) pulse();
        });
      };
      pulse();
    }
  }, [isRestActive, isRestPaused, pulseAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsWorkoutActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsWorkoutActive(false);
    setWorkoutTime(0);
    setIsRestActive(false);
    setIsRestPaused(false);
    setRestTime(defaultRestTime);
  };

  const handleStartRest = () => {
    setIsRestActive(true);
    setIsRestPaused(false);
    setRestTime(defaultRestTime);
  };

  const handlePauseRest = () => {
    setIsRestPaused(true);
  };

  const handleResumeRest = () => {
    setIsRestPaused(false);
  };

  const handleSkipRest = () => {
    setIsRestActive(false);
    setIsRestPaused(false);
    setRestTime(defaultRestTime);
  };

  const adjustRestTime = (adjustment: number) => {
    const newTime = Math.max(10, defaultRestTime + adjustment);
    setDefaultRestTime(newTime);
    if (!isRestActive) {
      setRestTime(newTime);
    }
  };

  return (
    <View className="flex-1 bg-background-dark">
      <Header
        leftIcon="timer"
        title="Timer"
        rightIcon="notifications"
        onRightPress={() => {}}
      />

      <View className="flex-1 px-4 pt-12 gap-4">
        {/* Workout Timer */}
        <Card className="items-center py-8">
          <Text className="text-gray-400 text-lg mb-2">Workout Duration</Text>
          <Text className="text-white text-6xl font-bold mb-4">
            {formatTime(workoutTime)}
          </Text>

          <View className="flex-row gap-4">
            <Button
              title={isWorkoutActive ? "Pause" : "Start"}
              onPress={handleStartPause}
              className={`px-8 ${
                isWorkoutActive ? "bg-yellow-500" : "bg-green-500"
              }`}
            />
            <Button
              title="Reset"
              onPress={handleReset}
              className="px-8 bg-red-500"
            />
          </View>
        </Card>

        {/* Rest Timer */}
        <Card className="items-center py-8">
          <Text className="text-gray-400 text-lg mb-2">Rest Timer</Text>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <Text
              className={`text-5xl font-bold mb-4 ${
                isRestActive ? "text-orange-400" : "text-white"
              }`}
            >
              {formatTime(restTime)}
            </Text>
          </Animated.View>

          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => adjustRestTime(-10)}
              className="bg-white/10 rounded-full p-2 mr-4"
            >
              <Ionicons name="remove" size={20} color="white" />
            </TouchableOpacity>

            <Text className="text-gray-400 mx-4">
              Default: {formatTime(defaultRestTime)}
            </Text>

            <TouchableOpacity
              onPress={() => adjustRestTime(10)}
              className="bg-white/10 rounded-full p-2 ml-4"
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-4">
            {!isRestActive ? (
              <Button
                title="Start Rest"
                onPress={handleStartRest}
                className="px-8 bg-orange-500"
              />
            ) : isRestPaused ? (
              <>
                <Button
                  title="Resume"
                  onPress={handleResumeRest}
                  className="px-8 bg-green-500"
                />
                <Button
                  title="Skip Rest"
                  onPress={handleSkipRest}
                  className="px-8 bg-blue-500"
                />
              </>
            ) : (
              <>
                <Button
                  title="Pause"
                  onPress={handlePauseRest}
                  className="px-8 bg-yellow-500"
                />
                <Button
                  title="Skip Rest"
                  onPress={handleSkipRest}
                  className="px-8 bg-blue-500"
                />
              </>
            )}
          </View>
        </Card>

        {/* Quick Rest Times */}
        <Card className="py-6">
          <Text className="text-white font-semibold text-lg mb-4 text-center">
            Quick Rest Times
          </Text>
          <View className="flex-row justify-around">
            {[30, 60, 90, 120].map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => {
                  setDefaultRestTime(time);
                  setRestTime(time);
                }}
                className={`px-4 py-2 rounded-xl ${
                  defaultRestTime === time ? "bg-blue-500" : "bg-white/10"
                }`}
              >
                <Text className="text-white font-medium">{time}s</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </View>
    </View>
  );
}