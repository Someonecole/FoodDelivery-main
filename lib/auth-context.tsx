"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import type { AuthUser, EditableProfile, UserProfile } from "@/lib/auth-types"

interface AuthResponse {
  user: AuthUser | null
  profile: UserProfile | null
}

interface AuthContextType {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  signUp: (email: string, password: string, profile: Partial<EditableProfile>) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
  updateUserProfile: (profile: Partial<EditableProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function fetchAuth(url: string, options?: RequestInit): Promise<AuthResponse> {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `Request failed: ${response.status}`)
  }

  return response.json() as Promise<AuthResponse>
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    fetchAuth("/api/auth/me")
      .then((response) => {
        if (!active) return
        setUser(response.user)
        setProfile(response.profile)
      })
      .catch((error) => {
        console.error("Failed to load account session", error)
        if (!active) return
        setUser(null)
        setProfile(null)
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      profile,
      loading,
      signUp: async (email, password, profileData) => {
        const response = await fetchAuth("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, profile: profileData }),
        })

        setUser(response.user)
        setProfile(response.profile)
      },
      signIn: async (email, password) => {
        const response = await fetchAuth("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })

        setUser(response.user)
        setProfile(response.profile)
      },
      logOut: async () => {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        })

        setUser(null)
        setProfile(null)
      },
      updateUserProfile: async (profileData) => {
        const response = await fetchAuth("/api/auth/profile", {
          method: "PATCH",
          body: JSON.stringify(profileData),
        })

        setUser(response.user)
        setProfile(response.profile)
      },
    }),
    [loading, profile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
