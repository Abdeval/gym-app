import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Animated,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from "react-native";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";
import { Colors } from "@/constants/colors";
import { ButtonWithLoading } from "@/components/ButtonWithLoading";

const { height } = Dimensions.get("window");
const HEADER_HEIGHT = height * 0.3;

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  // const { signIn, signInWithGoogle, signInWithApple } = useAuth()
  const { signIn } = useAuth();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Entrance animation
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
    const newErrors: { email?: string; password?: string } = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await signIn(email, password);
      console.log(res);
      router.replace("/(tabs)/home");
    } catch(err: any) {
      console.log(err.status);
      Alert.alert("Error", err.message);
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
      <View className="h-screen w-screen top-0 left-0 right-0 bottom-0 absolute bg-primary/20" />
      {/* Header */}
      <View
        className="w-full justify-center items-center"
        style={{ height: HEADER_HEIGHT }}
      >
        <Text className="text-4xl font-bold text-white text-center mb-2">
          Welcome Back
        </Text>
        <Text className="text-gray-200 text-center">
          Sign in to continue your fitness journey
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

      <Animated.ScrollView
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { translateY: slideAnim }],
        }}
        className="px-6 py-6 rounded-t-[40px] bg-background-dark -mt-10"
        showsVerticalScrollIndicator={false}
      >
        {/* Form */}
        <View className="space-y-6">
          {/* Email Field */}
          <View>
            <Text className="text-foreground-light font-medium mb-3">
              Email
            </Text>
            <View
              className={`flex-row items-center bg-foreground-dark rounded-3xl px-4 py-4 border ${
                errors.email ? "border-primary" : "border-white/20 "
              }`}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={Colors.primary}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-sm mt-2 ml-2">
                {errors.email}
              </Text>
            )}
          </View>

          {/* Password Field */}
          <View>
            <Text className="text-foreground-light font-medium mb-3">
              Password
            </Text>
            <View
              className={`flex-row bg-foreground-dark items-center rounded-3xl px-4 py-4 border ${
                errors.password ? "border-primary" : "border-white/20"
              }`}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={Colors.primary}
                className="mr-3"
              />
              <TextInput
                className="flex-1 text-white text-base ml-3"
                placeholder="Create a password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            {errors.password && (
              <Text className="text-red-500 text-sm mt-2 ml-2">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Forgot Password */}
          <TouchableOpacity className="self-end">
            <Text className="text-primary font-medium">Forgot Password?</Text>
          </TouchableOpacity>

          {/* Sign In Button */}
          <ButtonWithLoading
            loading={loading}
            onPress={handleSignIn}
            title="Sign In"
          />

          {/* Divider */}
          <View className="flex-row items-center my-6">
            <View className="flex-1 h-px bg-white/20" />
            <Text className="text-gray-400 mx-4">or continue with</Text>
            <View className="flex-1 h-px bg-white/20" />
          </View>

          {/* Google Sign In */}
          <View className="flex-row w-full items-center justify-center gap-4">
            <TouchableOpacity
              // onPress={signInWithGoogle}
              className="bg-foreground-dark flex-1 rounded-3xl py-4 flex-row items-center justify-center border border-white/20"
            >
              <Ionicons name="logo-google" size={20} color="#DB4437" />
              <Text className="text-foreground-light font-medium ml-3">
                Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              // onPress={signInWithGoogle}
              className="bg-foreground-dark flex-1 rounded-3xl py-4 flex-row items-center justify-center border border-white/20"
            >
              <Ionicons
                name="logo-apple"
                size={20}
                color={Colors.light.foreground}
              />
              <Text className="text-foreground-light font-medium ml-3">
                Google
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center mt-8 mb-8">
          <Text className="text-gray-600">Don{"'"}t have an account? </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text className="text-primary font-medium">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </Animated.ScrollView>
    </ImageBackground>
  );
}
