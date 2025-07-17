import type React from "react"
import { View, Text, Modal } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { Button } from "@/components/Button"

interface WorkoutCompleteModalProps {
  visible: boolean
  onClose: () => void
  onComplete: () => void
  workoutTitle: string
}

export const WorkoutCompleteModal: React.FC<WorkoutCompleteModalProps> = ({
  visible,
  onClose,
  onComplete,
  workoutTitle,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="bg-background-dark rounded-2xl p-6 w-full max-w-sm">
          <View className="items-center mb-6">
            <View className="bg-green-500 rounded-full w-16 h-16 items-center justify-center mb-4">
              <Ionicons name="checkmark" size={32} color="white" />
            </View>
            <Text className="text-white text-xl font-bold text-center mb-2">Workout Complete!</Text>
            <Text className="text-gray-400 text-center">Great job finishing {workoutTitle}</Text>
          </View>

          <View className="flex-row gap-3">
            <Button title="Close" onPress={onClose} className="flex-1 bg-gray-600" />
            <Button title="Mark Complete" onPress={onComplete} className="flex-1 bg-green-500" />
          </View>
        </View>
      </View>
    </Modal>
  )
}
