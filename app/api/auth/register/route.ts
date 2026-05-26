import crypto from "crypto"
import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import {
  hashPassword,
  normalizeEmail,
  setSessionCookie,
  toAuthUser,
  toPublicProfile,
  type UserDocument,
} from "@/lib/auth-server"

export async function POST(request: Request) {
  const body = await request.json()
  const email = normalizeEmail(body.email || "")
  const password = String(body.password || "")
  const profile = body.profile || {}
  const fullName = String(profile.fullName || "").trim()

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
  }

  if (!fullName) {
    return NextResponse.json({ error: "Full name is required" }, { status: 400 })
  }

  const db = await getDb()
  const users = db.collection<UserDocument>("users")
  const existingUser = await users.findOne({ email })

  if (existingUser) {
    return NextResponse.json({ error: "Account already exists" }, { status: 409 })
  }

  const now = new Date()
  const passwordFields = hashPassword(password)
  const user: UserDocument = {
    uid: crypto.randomUUID(),
    email,
    fullName,
    phone: String(profile.phone || "").trim(),
    address: String(profile.address || "").trim(),
    city: String(profile.city || "").trim(),
    zipCode: String(profile.zipCode || "").trim(),
    ...passwordFields,
    createdAt: now,
    updatedAt: now,
  }

  await users.insertOne(user)
  await setSessionCookie(user)

  return NextResponse.json({ user: toAuthUser(user), profile: toPublicProfile(user) })
}
