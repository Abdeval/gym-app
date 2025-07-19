import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ImageBackground,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/Button";
import { Colors } from "@/constants/colors";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.3;
const FORM_HEIGHT = height * 0.7;

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const { signUp } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signUp(email, password, name);
      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.log("SignUp error:", err);
      Alert.alert(err, "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require("@/assets/images/ui/home.png")}
      className="flex-1 relative"
    >
      {/* transparent background */}
      <View className="h-screen w-screen top-0 left-0 right-0 bottom-0 absolute bg-primary/20"/>
      {/* Header */}
      <View
        className="w-full justify-center items-center"
        style={{ height: HEADER_HEIGHT }}
      >
        <Text className="text-4xl font-bold text-white text-center mb-2">
          Create Account
        </Text>
        <Text className="text-gray-200 text-center">
          Start your fitness transformation today
        </Text>
      </View>

      {/* Animated Back Button */}
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          position: "absolute",
          top: 35,
          left: 0,
          zIndex: 10,
        }}
        className="px-4 py-4"
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Ionicons
            name="arrow-back"
            size={24}
            color={Colors.light.foreground}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Animated Form */}
      <KeyboardAvoidingView
        className="flex-1"
        style={{ height: FORM_HEIGHT, marginTop: -40 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
            flex: 1,
          }}
          className="bg-background-dark rounded-t-[40px] px-4 py-8 flex-1"
        >
          {/* Name */}
          <View className="flex-row items-center bg-foreground-dark border border-white/20 rounded-3xl px-4 py-4 mb-4">
            <Ionicons
              name="person-outline"
              size={20}
              color={Colors.primary || "#ef4444"}
              className="mr-3"
            />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="Name (Optional)"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email */}
          <View className="mt-2">
            <View
              className={`flex-row items-center bg-foreground-dark rounded-3xl px-4 py-4 border ${
                errors.email ? "border-red-500" : "border-white/20"
              }`}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.primary || "#ef4444"}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text className="text-red-400 text-sm mt-1 ml-2">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password */}
          <View className="mt-4">
            <View
              className={`flex-row items-center bg-foreground-dark rounded-3xl px-4 py-4 border ${
                errors.password ? "border-red-500" : "border-white/20"
              }`}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.primary || "#ef4444"}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            {errors.password && (
              <Text className="text-red-400 text-sm mt-1 ml-2">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="mt-4">
            <View
              className={`flex-row items-center bg-foreground-dark rounded-3xl px-4 py-4 border ${
                errors.confirmPassword ? "border-red-500" : "border-white/20"
              }`}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.primary || "#ef4444"}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            {errors.confirmPassword && (
              <Text className="text-red-400 text-sm mt-1 ml-2">
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          <ButtonWithLoading
            loading={loading}
            onPress={handleSignUp}
            title="Sign Up"
            className="mt-4 py-24"
          />

          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-white/20" />
            <Text className="text-gray-400 mx-4">or continue with</Text>
            <View className="flex-1 h-px bg-white/20" />
          </View>

          {/* Google & Apple Buttons */}
          <View className="flex-row w-full items-center justify-center gap-4">
            <TouchableOpacity className="bg-foreground-dark border border-white/20 flex-1 rounded-3xl py-4 flex-row items-center justify-center">
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text className="text-white font-medium ml-3">Google</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-foreground-dark border border-white/20 flex-1 rounded-3xl py-4 flex-row items-center justify-center">
              <Ionicons name="logo-apple" size={20} color="white" />
              <Text className="text-white font-medium ml-3">Apple</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 flex-row justify-center">
            <Text className="text-gray-400">Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-medium">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
