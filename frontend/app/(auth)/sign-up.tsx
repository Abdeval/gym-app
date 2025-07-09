
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native"
import { Link, router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/Button"

export default function SignUpScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  // const { signUp, signInWithGoogle, signInWithApple } = useAuth()
  const { signUp } = useAuth()

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: {
      email?: string
      password?: string
      confirmPassword?: string
    } = {}

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

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await signUp(email, password, name)
      router.replace("/(tabs)/home")
    } catch (error) {
      Alert.alert("Error", "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1 bg-gradient-to-br from-gray-900 to-black px-6 justify-center">
      <View className="mb-12">
        <Text className="text-4xl font-bold text-white text-center mb-2">Create Account</Text>
        <Text className="text-gray-400 text-center">Start your fitness transformation today</Text>
      </View>

      <View className="space-y-4">
        <TextInput
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 text-white text-base"
          placeholder="Name (Optional)"
          placeholderTextColor="#9CA3AF"
          value={name}
          onChangeText={setName}
        />

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
          {errors.email && <Text className="text-red-400 text-sm mt-1 ml-2">{errors.email}</Text>}
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
          {errors.password && <Text className="text-red-400 text-sm mt-1 ml-2">{errors.password}</Text>}
        </View>

        <View>
          <TextInput
            className={`bg-white/10 border ${errors.confirmPassword ? "border-red-500" : "border-white/20"} rounded-xl px-4 py-4 text-white text-base`}
            placeholder="Confirm Password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {errors.confirmPassword && <Text className="text-red-400 text-sm mt-1 ml-2">{errors.confirmPassword}</Text>}
        </View>

        <Button title="Sign Up" onPress={handleSignUp} loading={loading} className="mt-6" />

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
          <Text className="text-white font-medium ml-3">Sign up with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white/10 border border-white/20 rounded-xl px-4 py-4 flex-row items-center justify-center"
          // onPress={signInWithApple}
        >
          <Ionicons name="logo-apple" size={20} color="white" />
          <Text className="text-white font-medium ml-3">Sign up with Apple</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-8 flex-row justify-center">
        <Text className="text-gray-400">Already have an account? </Text>
        <Link href="/(auth)/sign-in" asChild>
          <TouchableOpacity>
            <Text className="text-blue-400 font-medium">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  )
}
