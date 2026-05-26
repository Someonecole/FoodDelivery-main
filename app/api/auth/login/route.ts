import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import {
  normalizeEmail,
  setSessionCookie,
  toAuthUser,
  toPublicProfile,
  verifyPassword,
  type UserDocument,
} from "@/lib/auth-server"

export async function POST(request: Request) {
  const body = await request.json()
  const email = normalizeEmail(body.email || "")
  const password = String(body.password || "")

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
  }

  const db = await getDb()
  const user = await db.collection<UserDocument>("users").findOne({ email })

  if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  }

  await setSessionCookie(user)

  return NextResponse.json({ user: toAuthUser(user), profile: toPublicProfile(user) })
}
