import { Program } from "@/lib/types"
import type React from "react"
import { createContext, useContext, useState } from "react"


interface WorkoutContextType {
  activeProgram: Program | null
  todaysWorkout: string | null
  setActiveProgram: (program: Program) => void
  setTodaysWorkout: (workout: string) => void
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [activeProgram, setActiveProgram] = useState<Program | null>(null)
  const [todaysWorkout, setTodaysWorkout] = useState<string | null>("Push Day 💪")

  return (
    <WorkoutContext.Provider
      value={{
        activeProgram,
        todaysWorkout,
        setActiveProgram,
        setTodaysWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkout() {
  const context = useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error("useWorkout must be used within a WorkoutProvider")
  }
  return context
}
