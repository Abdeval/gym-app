import { TouchableOpacity, Text, ActivityIndicator } from "react-native"

interface ButtonProps {
  title: string
  onPress: () => void
  loading?: boolean
  className?: string
}

export function Button({ title, onPress, loading = false, className = "" }: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      className={`px-4 py-3 rounded-xl bg-black/90 items-center justify-center ${className}`}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-medium text-base">{title}</Text>
      )}
    </TouchableOpacity>
  )
}
