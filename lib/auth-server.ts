import crypto from "crypto"
import { cookies } from "next/headers"
import { getDb } from "@/lib/mongodb"
import type { AuthUser, UserProfile } from "@/lib/auth-types"

export const SESSION_COOKIE_NAME = "fooddelivery_session"
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7
const PASSWORD_ITERATIONS = 310_000
const PASSWORD_KEY_LENGTH = 32
const PASSWORD_DIGEST = "sha256"

interface SessionPayload {
  uid: string
  email: string
  exp: number
}

export interface UserDocument extends UserProfile {
  passwordHash: string
  passwordSalt: string
}

function base64UrlEncode(value: Buffer | string) {
  return Buffer.from(value).toString("base64url")
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET

  if (secret) {
    return secret
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("Missing AUTH_SECRET environment variable")
  }

  return "development-only-auth-secret-change-before-deploy"
}

function signData(data: string) {
  return crypto.createHmac("sha256", getAuthSecret()).update(data).digest("base64url")
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("base64url")) {
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)
    .toString("base64url")

  return { passwordHash, passwordSalt: salt }
}

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const { passwordHash } = hashPassword(password, salt)
  const passwordHashBuffer = Buffer.from(passwordHash)
  const expectedHashBuffer = Buffer.from(expectedHash)

  return (
    passwordHashBuffer.length === expectedHashBuffer.length &&
    crypto.timingSafeEqual(passwordHashBuffer, expectedHashBuffer)
  )
}

function createSessionToken(payload: Omit<SessionPayload, "exp">) {
  const sessionPayload: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  }

  const encodedPayload = base64UrlEncode(JSON.stringify(sessionPayload))
  const signature = signData(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export function verifySessionToken(token?: string): SessionPayload | null {
  if (!token) {
    return null
  }

  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = signData(encodedPayload)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expectedSignature)

  if (signatureBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null
  }

  try {
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as SessionPayload

    if (!payload.uid || !payload.email || payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function setSessionCookie(user: Pick<UserDocument, "uid" | "email">) {
  const token = createSessionToken({ uid: user.uid, email: user.email })
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  })
}

export async function getCurrentSession() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE_NAME)?.value)
}

export async function getCurrentUser() {
  const session = await getCurrentSession()

  if (!session) {
    return null
  }

  const db = await getDb()
  return db.collection<UserDocument>("users").findOne({ uid: session.uid })
}

export function toPublicProfile(user: UserDocument): UserProfile {
  return {
    uid: user.uid,
    email: user.email,
    fullName: user.fullName || "",
    phone: user.phone || "",
    address: user.address || "",
    city: user.city || "",
    zipCode: user.zipCode || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }
}

export function toAuthUser(user: UserDocument): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.fullName || null,
  }
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}
