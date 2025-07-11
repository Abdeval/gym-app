import type React from "react"
import { View, type ViewProps } from "react-native"

interface CardProps extends ViewProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <View className={`bg-foreground-dark border border-white/20 rounded-3xl p-4 ${className}`} {...props}>
      {children}
    </View>
  )
}
