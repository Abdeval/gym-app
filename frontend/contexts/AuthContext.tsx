
// import type React from "react"
// import { createContext, useContext, useState, useEffect } from "react"
// // import { createClient } from "@supabase/supabase-js"

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
// const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ""
// const supabase = createClient(supabaseUrl, supabaseKey)

// interface User {
//   id: string
//   email: string
//   name?: string
// }

// interface AuthContextType {
//   user: User | null
//   loading: boolean
//   signIn: (email: string, password: string) => Promise<void>
//   signUp: (email: string, password: string, name?: string) => Promise<void>
//   signOut: () => Promise<void>
//   signInWithGoogle: () => Promise<void>
//   signInWithApple: () => Promise<void>
//   updateProfile: (data: { name?: string; email?: string }) => Promise<void>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     // Check for existing session
//     const checkSession = async () => {
//       try {
//         const {
//           data: { session },
//         } = await supabase.auth.getSession()
//         if (session?.user) {
//           setUser({
//             id: session.user.id,
//             email: session.user.email || "",
//             name: session.user.user_metadata?.name,
//           })
//         }
//       } catch (error) {
//         console.error("Session check error:", error)
//       } finally {
//         setLoading(false)
//       }
//     }

//     checkSession()

//     // Listen for auth changes
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange(async (event, session) => {
//       if (session?.user) {
//         setUser({
//           id: session.user.id,
//           email: session.user.email || "",
//           name: session.user.user_metadata?.name,
//         })
//       } else {
//         setUser(null)
//       }
//       setLoading(false)
//     })

//     return () => subscription.unsubscribe()
//   }, [])

//   const signIn = async (email: string, password: string) => {
//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     })
//     if (error) throw error
//   }

//   const signUp = async (email: string, password: string, name?: string) => {
//     const { error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         data: {
//           name,
//         },
//       },
//     })
//     if (error) throw error
//   }

//   const signOut = async () => {
//     const { error } = await supabase.auth.signOut()
//     if (error) throw error
//   }

//   const signInWithGoogle = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "google",
//     })
//     if (error) throw error
//   }

//   const signInWithApple = async () => {
//     const { error } = await supabase.auth.signInWithOAuth({
//       provider: "apple",
//     })
//     if (error) throw error
//   }

//   const updateProfile = async (data: { name?: string; email?: string }) => {
//     const { error } = await supabase.auth.updateUser({
//       email: data.email,
//       data: { name: data.name },
//     })
//     if (error) throw error

//     if (user) {
//       setUser({ ...user, ...data })
//     }
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         signIn,
//         signUp,
//         signOut,
//         signInWithGoogle,
//         signInWithApple,
//         updateProfile,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }
import React, { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Vérifie si un token existe et récupère l'utilisateur
    const checkToken = async () => {
      const token = await AsyncStorage.getItem("token")
      if (token) {
        fetch("https://ton-api.com/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then(res => res.json())
          .then(data => setUser(data))
          .catch(() => setUser(null))
          .finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    }
    checkToken()
  }, [])

  const signIn = async (email: string, password: string) => {
    const res = await fetch("https://ton-api.com/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error("Login failed")
    const data = await res.json()
    await AsyncStorage.setItem("token", data.access_token)
    setUser(data.user)
  }

  const signUp = async (email: string, password: string, name?: string) => {
    const res = await fetch("https://ton-api.com/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    })
    if (!res.ok) throw new Error("Register failed")
    const data = await res.json()
    await AsyncStorage.setItem("token", data.access_token)
    setUser(data.user)
  }

  const signOut = async () => {
    await AsyncStorage.removeItem("token")
    setUser(null)
  }

  const updateProfile = async (data: { name?: string; email?: string }) => {
    const token = await AsyncStorage.getItem("token")
    const res = await fetch("https://ton-api.com/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error("Update failed")
    const updatedUser = await res.json()
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
