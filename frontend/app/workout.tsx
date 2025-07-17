import { useState } from "react";
import { View, Alert, SafeAreaView } from "react-native";
import { useWorkoutProgress } from "@/hooks/useWorkout";
import { WorkoutCompleteModal } from "@/components/WorkoutCompleteModal";
import { Button } from "@/components/Button";

// Add this to your existing WorkoutScreen component
export default function WorkoutScreen() {
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<any>(null);
  const { completeWorkout, loading } = useWorkoutProgress();

  const handleWorkoutFinish = (workout: any) => {
    setCurrentWorkout(workout);
    setShowCompleteModal(true);
  };

  const handleCompleteWorkout = async () => {
    if (!currentWorkout) return;

    try {
      await completeWorkout(currentWorkout.id);
      setShowCompleteModal(false);
      Alert.alert("Success", "Workout completed and progress saved!");
      // Optionally navigate back or refresh data
    } catch (error: any) {
      Alert.alert("Error", "Failed to save workout progress");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <View className="flex-1 bg-background-dark h-screen items-center justify-center">
        {/* Your existing workout UI */}

        {/* Add this button when workout is finished */}
        <Button
          title="Finish Workout"
          onPress={() => handleWorkoutFinish(currentWorkout)}
          className="bg-green-500 mx-4 mb-4"
        />

        <WorkoutCompleteModal
          visible={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          onComplete={handleCompleteWorkout}
          workoutTitle={currentWorkout?.title || ""}
        />
      </View>
    </SafeAreaView>
  );
}
