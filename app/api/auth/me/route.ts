import { NextResponse } from "next/server"
import { clearSessionCookie, getCurrentUser, toAuthUser, toPublicProfile } from "@/lib/auth-server"

export async function GET() {
  const user = await getCurrentUser()

  if (!user) {
    await clearSessionCookie()
    return NextResponse.json({ user: null, profile: null })
  }

  return NextResponse.json({ user: toAuthUser(user), profile: toPublicProfile(user) })
}
