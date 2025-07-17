import { useState } from "react"
import { postApi, getApi } from "@/lib/api/axios.api"
import { useAuth } from "@/contexts/AuthContext"

export const useWorkoutProgress = () => {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const completeWorkout = async (workoutId: string) => {
    if (!user?.sub) throw new Error("User not authenticated")

    setLoading(true)
    try {
      const response = await postApi("programs/complete", {
        userId: user.sub,
        workoutId,
      })
      return response
    } catch (error) {
      console.error("Error completing workout:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getUserStatistics = async () => {
    if (!user?.sub) throw new Error("User not authenticated")

    setLoading(true)
    try {
      const response = await getApi(`programs/statistics/${user.sub}`)
      return response
    } catch (error) {
      console.error("Error fetching statistics:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getWorkoutHistory = async () => {
    if (!user?.sub) throw new Error("User not authenticated")

    setLoading(true)
    try {
      const response = await getApi(`programs/history/${user.sub}`)
      return response
    } catch (error) {
      console.error("Error fetching workout history:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return {
    completeWorkout,
    getUserStatistics,
    getWorkoutHistory,
    loading,
  }
}
