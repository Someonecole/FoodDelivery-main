export interface AuthUser {
  uid: string
  email: string
  displayName: string | null
}

export interface UserProfile {
  uid: string
  email: string
  fullName: string
  phone: string
  address: string
  city: string
  zipCode: string
  createdAt?: unknown
  updatedAt?: unknown
}

export type EditableProfile = Omit<UserProfile, "uid" | "createdAt" | "updatedAt">
