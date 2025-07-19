import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/contexts/AuthContext";
import { WorkoutProvider } from "@/contexts/WorkoutContext";
import { useFonts } from "expo-font";
import "../global.css";
import { PodcastProvider } from "@/contexts/PodcastsContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("@/assets/fonts/SpaceMono-Regular.ttf"),
    Regular: require("@/assets/fonts/Poppins-Regular.ttf"),
    Medium: require("@/assets/fonts/Poppins-Medium.ttf"),
    semibold: require("@/assets/fonts/Poppins-SemiBold.ttf"),
    Bold: require("@/assets/fonts/Poppins-Bold.ttf"),
    Italic: require("@/assets/fonts/Poppins-Italic.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <PodcastProvider>
          <StatusBar style="dark" />
          <WorkoutProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
            </Stack>
            <StatusBar style="light" />
          </WorkoutProvider>
        </PodcastProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
