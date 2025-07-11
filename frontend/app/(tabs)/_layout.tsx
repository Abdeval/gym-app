import { Redirect, Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/contexts/AuthContext"
import { Colors } from "@/constants/colors"

export default function TabLayout() {
  const { user } = useAuth()
  if(!user) return <Redirect href="/(auth)/sign-in" />

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.dark.foreground,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopWidth: 1,
          borderColor: "rgba(255,255,255,0.08)", // même couleur que Card border
          borderWidth: 0,
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          overflow: "hidden",
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={focused ? Colors.primary : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "Timer",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "timer" : "timer-outline"}
              size={24}
              color={focused ? Colors.primary : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="programs"
        options={{
          title: "Programs",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={24}
              color={focused ? Colors.primary : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={focused ? Colors.primary : color}
            />
          ),
        }}
      />
    </Tabs>
  )
}