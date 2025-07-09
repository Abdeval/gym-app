
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, Animated } from "react-native"
import { Link, router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/Button"

export default function SignInScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  // const { signIn, signInWithGoogle, signInWithApple } = useAuth()
  const { signIn } = useAuth();

  const buttonScale = new Animated.Value(1)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignIn = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await signIn(email, password)
      router.replace("/(tabs)/home")
    } catch (error) {
      Alert.alert("Error", "Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start()
  }

  return (
    <View className="flex-1 bg-black px-6 justify-center">
      <View className="mb-12">
        <Text className="text-4xl font-bold text-white text-center mb-2">Welcome Back</Text>
        <Text className="text-gray-400 text-center">Sign in to continue your fitness journey</Text>
      </View>

      <View className="space-y-4">
        <View>
          <TextInput
            className={`bg-white/10 border ${errors.email ? "border-red-500" : "border-white/20"} rounded-xl px-4 py-4 text-white text-base`}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Animated.Text className="text-red-400 text-sm mt-1 ml-2">{errors.email}</Animated.Text>}
        </View>

        <View>
          <TextInput
            className={`bg-white/10 border ${errors.password ? "border-red-500" : "border-white/20"} rounded-xl px-4 py-4 text-white text-base`}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {errors.password && (
            <Animated.Text className="text-red-400 text-sm mt-1 ml-2">{errors.password}</Animated.Text>
          )}
        </View>

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <Button
            title="Sign In"
            onPress={() => {
              animateButton()
              handleSignIn()
            }}
            loading={loading}
            className="mt-6"
          />
        </Animated.View>

        <View className="flex-row items-center my-6">
          <View className="flex-1 h-px bg-white/20" />
          <Text className="text-gray-400 mx-4">or</Text>
          <View className="flex-1 h-px bg-white/20" />
        </View>

        <TouchableOpacity
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 flex-row items-center justify-center mb-3"
          // onPress={signInWithGoogle}
        >
          <Ionicons name="logo-google" size={20} color="white" />
          <Text className="text-white font-medium ml-3">Sign in with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 flex-row items-center justify-center"
          // onPress={signInWithApple}
        >
          <Ionicons name="logo-apple" size={20} color="white" />
          <Text className="text-white font-medium ml-3">Sign in with Apple</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8 flex-row justify-center">
        <Text className="text-gray-400">Don't have an account? </Text>
        <Link href="/(auth)/sign-up" asChild>
          <TouchableOpacity>
            <Text className="text-blue-400 font-medium">Sign Up</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
