"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Animated, Easing } from "react-native"

interface AppleActivityIndicatorProps {
  size?: "small" | "medium" | "large"
  color?: string
  className?: string
}

export const AppleActivityIndicator: React.FC<AppleActivityIndicatorProps> = ({
  size = "medium",
  color = "#007AFF",
  className = "",
}) => {
  const animatedValues = useRef(Array.from({ length: 12 }, () => new Animated.Value(0))).current

  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
  }

  const actualSize = sizeMap[size]
  const lineWidth = actualSize * 0.08
  const lineHeight = actualSize * 0.25
  const radius = actualSize * 0.35

  useEffect(() => {
    const animations = animatedValues.map((animatedValue, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(index * 83), // Stagger the animations
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 600,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
      )
    })

    Animated.stagger(0, animations).start()

    return () => {
      animatedValues.forEach((av) => av.stopAnimation())
    }
  }, [animatedValues])

  const lines = animatedValues.map((animatedValue, index) => {
    const angle = index * 30 * (Math.PI / 180)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 1],
    })

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    })

    return (
      <Animated.View
        key={index}
        style={{
          position: "absolute",
          width: lineWidth,
          height: lineHeight,
          backgroundColor: color,
          borderRadius: lineWidth / 2,
          opacity,
          transform: [{ translateX: x }, { translateY: y - lineHeight / 2 }, { rotate: `${index * 30}deg` }, { scale }],
        }}
      />
    )
  })

  return (
    <View className={`items-center justify-center ${className}`}>
      <View
        style={{
          width: actualSize,
          height: actualSize,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {lines}
      </View>
    </View>
  )
}
