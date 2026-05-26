"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"sign-in" | "create-account">("sign-in")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  })
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.")
      return
    }

    if (mode === "create-account" && !formData.fullName.trim()) {
      setError("Full name is required.")
      return
    }

    if (mode === "create-account" && formData.password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setIsSubmitting(true)

    try {
      if (mode === "sign-in") {
        await signIn(formData.email.trim(), formData.password)
      } else {
        await signUp(formData.email.trim(), formData.password, {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        })
      }

      router.push("/account")
    } catch (authError) {
      console.error("Authentication failed", authError)
      setError("Could not complete account request. Check your MongoDB connection and credentials, then try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{mode === "sign-in" ? "Sign in" : "Create account"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "create-account" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(event) => setFormData({ ...formData, fullName: event.target.value })}
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(event) => setFormData({ ...formData, password: event.target.value })}
                  placeholder="At least 6 characters"
                />
              </div>

              {mode === "create-account" && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              )}

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : mode === "sign-in" ? "Sign in" : "Create account"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "sign-in" ? (
                <button type="button" className="text-primary hover:underline" onClick={() => setMode("create-account")}>
                  Create a new account
                </button>
              ) : (
                <button type="button" className="text-primary hover:underline" onClick={() => setMode("sign-in")}>
                  Already have an account? Sign in
                </button>
              )}
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-sm text-primary hover:underline">
                Back to menu
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
