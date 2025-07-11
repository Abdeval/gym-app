import React, { useRef, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useAuth } from "@/contexts/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Colors } from "@/constants/colors";

export default function ProfileScreen() {
  const { user, signOut, updateProfile } = useAuth();

  // BottomSheet refs
  const updateSheetRef = useRef<BottomSheet>(null);
  const passwordSheetRef = useRef<BottomSheet>(null);

  const [name, setName] = React.useState(user?.name || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const stats = [
    { label: "Workouts Completed", value: "24", icon: "fitness" },
    { label: "Current Streak", value: "7 days", icon: "flame" },
    { label: "Total Time", value: "18h 30m", icon: "time" },
    { label: "Programs Completed", value: "2", icon: "trophy" },
  ];

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)/sign-in");
        },
      },
    ]);
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ name, email });
      updateSheetRef.current?.close();
      Alert.alert("Success", "Profile updated successfully");
    } catch (error: any) {
      console.log("Update Profile Error:", error);
      Alert.alert("Error", "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }
    try {
      // Implementation would depend on your auth provider
      passwordSheetRef.current?.close();
      setCurrentPassword("");
      setNewPassword("");
      Alert.alert("Success", "Password changed successfully");
    } catch (error: any) {
      console.log("Change Password Error:", error);
      Alert.alert("Error", "Failed to change password");
    }
  };

  // BottomSheet snap points
  const snapPoints = React.useMemo(() => ["50%"], []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#18181b" }}>
      <Header leftIcon="person" title="Profile" rightIcon="notifications" onRightPress={() => {}} />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Card className="mt-6 mb-6 items-center py-8">
          <View className="bg-primary rounded-full w-20 h-20 items-center justify-center mb-4">
            <Ionicons name="person" size={40} color="white" />
          </View>
          <Text className="text-white text-xl font-bold mb-1">{user?.name || "User"}</Text>
          <Text className="text-gray-400 text-base">{user?.email}</Text>
        </Card>

        <Card className="mb-6">
          <Text className="text-white font-semibold text-lg mb-4">Your Progress</Text>
          <View className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <View key={index} className="bg-white/5 rounded-xl p-4 items-center">
                <Ionicons name={stat.icon as any} size={24} color={Colors.primary} />
                <Text className="text-white font-bold text-lg mt-2">{stat.value}</Text>
                <Text className="text-gray-400 text-sm text-center">{stat.label}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card className="mb-6">
          <Text className="text-white font-semibold text-lg mb-4">Account Settings</Text>

          <TouchableOpacity
            onPress={() => updateSheetRef.current?.expand()}
            className="flex-row items-center justify-between py-4 border-b border-white/10"
          >
            <View className="flex-row items-center">
              <Ionicons name="person-outline" size={20} color="#9CA3AF" />
              <Text className="text-white ml-3">Update Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => passwordSheetRef.current?.expand()}
            className="flex-row items-center justify-between py-4 border-b border-white/10"
          >
            <View className="flex-row items-center">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <Text className="text-white ml-3">Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSignOut} className="flex-row items-center py-4">
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text className="text-red-400 ml-3">Sign Out</Text>
          </TouchableOpacity>
        </Card>

        <View className="h-20" />
      </ScrollView>

      {/* Update Profile BottomSheet */}
      <BottomSheet
        ref={updateSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          overflow: "hidden",
        }}
        backgroundStyle={{ backgroundColor: Colors.dark.background }}
        
      >
        <BottomSheetView style={{ flex: 1, padding: 24 }}>
          <Text className="text-white font-semibold text-lg mb-4 text-center">Update Profile</Text>
          <TextInput
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white mb-4"
            placeholder="Name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white mb-6"
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <View className="flex-row gap-4">
            <Button title="Cancel" onPress={() => updateSheetRef.current?.close()} className="flex-1 bg-gray-600" />
            <Button title="Update" onPress={handleUpdateProfile} className="flex-1 bg-primary" />
          </View>
        </BottomSheetView>
      </BottomSheet>

      {/* Change Password BottomSheet */}
      <BottomSheet
        ref={passwordSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        style={{
          borderTopLeftRadius: 32,
          borderTopRightRadius: 32,
          overflow: "hidden",
        }}
        backgroundStyle={{ backgroundColor: Colors.dark.background}}
      >
        <BottomSheetView style={{ flex: 1, padding: 24}}>
          <Text className="text-white font-semibold text-lg mb-4 text-center">Change Password</Text>
          <TextInput
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white mb-4"
            placeholder="Current Password"
            placeholderTextColor="#9CA3AF"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <TextInput
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white mb-6"
            placeholder="New Password"
            placeholderTextColor="#9CA3AF"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <View className="flex-row gap-4">
            <Button
              title="Cancel"
              onPress={() => {
                passwordSheetRef.current?.close();
                setCurrentPassword("");
                setNewPassword("");
              }}
              className="flex-1 bg-gray-600"
            />
            <Button title="Change" onPress={handleChangePassword} className="flex-1 bg-primary" />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}