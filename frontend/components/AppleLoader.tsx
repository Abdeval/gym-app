"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { View, Animated, Easing } from "react-native"

interface AppleLoaderProps {
  size?: number
  color?: string
  className?: string
}

export const AppleLoader: React.FC<AppleLoaderProps> = ({ size = 20, color = "#007AFF", className = "" }) => {
  const spinValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0)
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin())
    }
    spin()
  }, [spinValue])

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  const dotSize = size * 0.15
  const radius = size * 0.35

  const dots = Array.from({ length: 8 }, (_, index) => {
    const angle = index * 45 * (Math.PI / 180)
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius

    const opacity = spinValue.interpolate({
      inputRange: [0, 0.125 * index, 0.125 * (index + 1), 1],
      outputRange: [0.3, 0.3, 1, 0.3],
      extrapolate: "clamp",
    })

    return (
      <Animated.View
        key={index}
        style={{
          position: "absolute",
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: color,
          opacity,
          transform: [{ translateX: x }, { translateY: y }],
        }}
      />
    )
  })

  return (
    <View className={`items-center justify-center ${className}`}>
      <Animated.View
        style={{
          width: size,
          height: size,
          transform: [{ rotate: spin }],
        }}
      >
        <View
          style={{
            width: size,
            height: size,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {dots}
        </View>
      </Animated.View>
    </View>
  )
}
