
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
import React, { createContext, useContext, useState } from "react"
import * as SecureStore from "expo-secure-store"
import { auth } from "@/lib/api/axios-instance.api"
import { jwtDecode } from "jwt-decode";

interface User {
  sub: string
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
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(() => {
    const token = SecureStore.getItem("token");
    if (token) {
      const userData = jwtDecode(token) as User;
      return userData;
    }
    return null;
  })

  // console.log("User in AuthProvider:", user);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const res = await auth.post("/signin", { email, password });
    if(res.data){
      await SecureStore.setItemAsync("token", res.data.access_token);
      const userData = jwtDecode(res.data.access_token) ;
      setUser(userData as User) ;
      setLoading(false);
    }
  }

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    const res = await auth.post("/signup", { email, password, name });
    console.log("Sign up response:", res.data);
    if (!res.data) throw new Error("Sign up failed")
    await SecureStore.setItemAsync("token", res.data.access_token)
    const userData = jwtDecode(res.data.access_token) as User;
    setUser(userData);
    setLoading(false);
  }

  const signOut = async () => {
    await SecureStore.deleteItemAsync("token")
    setUser(null)
  }


   // todo: will be in the future
  const updateProfile = async (data: { name?: string; email?: string }) => {
    const token = await SecureStore.getItemAsync("token")
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

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    const token = await SecureStore.getItemAsync("token");
    console.log(currentPassword, newPassword);

    const res = await auth.patch("/updatePassword", {
      currentPassword,
      newPassword,
      confirmNewPassword: newPassword, 
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    // console.log(res);

    if (!res.data) throw new Error("Password update failed")
    await SecureStore.setItemAsync("token", res.data.access_token)  
    const userData = jwtDecode(res.data.access_token) as User;

    setUser(userData);  
    console.log("Password updated successfully");

    return res.data;
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
        updatePassword
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
