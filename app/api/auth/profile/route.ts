import { NextResponse } from "next/server"
import { getCurrentSession, toAuthUser, toPublicProfile, type UserDocument } from "@/lib/auth-server"
import { getDb } from "@/lib/mongodb"

export async function PATCH(request: Request) {
  const session = await getCurrentSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const profile = {
    fullName: String(body.fullName || "").trim(),
    phone: String(body.phone || "").trim(),
    address: String(body.address || "").trim(),
    city: String(body.city || "").trim(),
    zipCode: String(body.zipCode || "").trim(),
    updatedAt: new Date(),
  }

  if (!profile.fullName) {
    return NextResponse.json({ error: "Full name is required" }, { status: 400 })
  }

  const db = await getDb()
  const user = await db.collection<UserDocument>("users").findOneAndUpdate(
    { uid: session.uid },
    { $set: profile },
    { returnDocument: "after" },
  )

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  return NextResponse.json({ user: toAuthUser(user), profile: toPublicProfile(user) })
}
