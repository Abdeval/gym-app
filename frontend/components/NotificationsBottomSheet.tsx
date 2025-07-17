import { forwardRef } from "react"
import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet"
import { Colors } from "@/constants/colors"

type NotificationBottomSheetProps = {
  ref?: React.Ref<BottomSheet>, 
  showNotification?: () => void
}

export const NotificationBottomSheet = forwardRef<BottomSheet, NotificationBottomSheetProps>((props, ref) => {
  const snapPoints = ["50%", "80%"]

  return (
    <BottomSheet
      ref={ref}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: Colors.dark.foreground,
      }}
      handleIndicatorStyle={{
        backgroundColor: Colors.primary,
        width: 40,
        height: 4,
      }}
      style={{
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: "hidden",
        zIndex: 1000
      }}
    >
      <BottomSheetView style={{ flex: 1, padding: 24 }}>
        <Text className="text-white font-semibold text-xl mb-6 text-center">Notifications</Text>

        {/* Notification Items */}
        <View className="gap-4">
          <View className="flex-row items-center p-4 bg-white/5 rounded-xl">
            <View className="rounded-full p-2 mr-3" style={{ backgroundColor: Colors.primary + "22" }}>
              <Ionicons name="fitness" size={20} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium">Nouvelle séance ajoutée !</Text>
              <Text className="text-gray-400 text-sm mt-1">Votre routine Push Day est prête</Text>
            </View>
          </View>

          <View className="flex-row items-center p-4 bg-white/5 rounded-xl">
            <View className="rounded-full p-2 mr-3" style={{ backgroundColor: Colors.primary + "22" }}>
              <Ionicons name="trophy" size={20} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium">Objectif atteint !</Text>
              <Text className="text-gray-400 text-sm mt-1">7 jours d{"'"}entraînement consécutifs</Text>
            </View>
          </View>

          <View className="flex-row items-center p-4 bg-white/5 rounded-xl">
            <View className="rounded-full p-2 mr-3" style={{ backgroundColor: Colors.primary + "22" }}>
              <Ionicons name="mail" size={20} color={Colors.primary} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-medium">Message de l{"'"}entraîneur</Text>
              <Text className="text-gray-400 text-sm mt-1">Excellent progrès cette semaine !</Text>
            </View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  )
})

NotificationBottomSheet.displayName = "NotificationBottomSheet"
