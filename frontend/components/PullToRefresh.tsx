"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { View, Animated } from "react-native"
import { AppleActivityIndicator } from "./AppleActivityIndicator"
import { Colors } from "@/constants/colors"
import { AppleLoader } from "./AppleLoader"

interface PullToRefreshProps {
  refreshing: boolean
  onRefresh: () => void
  children: React.ReactNode
  className?: string
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ refreshing, onRefresh, children, className = "" }) => {
  const translateY = useRef(new Animated.Value(0)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (refreshing) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 60,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // onRefresh()
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [refreshing, translateY, opacity])

  return (
    <View className={`flex-1 ${className}`}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          alignItems: "center",
          justifyContent: "center",
          opacity,
          transform: [
            {
              translateY: translateY.interpolate({
                inputRange: [0, 60],
                outputRange: [-60, 0],
              }),
            },
          ],
          zIndex: 1,
        }}
      >
        <AppleLoader size={30} color={Colors.primary} />
      </Animated.View>

      <Animated.View
        style={{
          flex: 1,
          transform: [{ translateY }],
        }}
      >
        {children}
      </Animated.View>
    </View>
  )
}

