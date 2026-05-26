"use client"

import { ShoppingCart, UtensilsCrossed, Sun, Moon, Languages, UserCircle, LogOut } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/lib/cart-context"
import { useTheme } from "@/lib/theme-context"
import { useLanguage } from "@/lib/language-context"
import { useAuth } from "@/lib/auth-context"
import { CartDrawer } from "@/components/cart-drawer"
import { useState } from "react"

export function Header() {
  const { totalItems } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { language, toggleLanguage, t } = useLanguage()
  const { user, profile, logOut } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)

  const accountLabel = user ? profile?.fullName?.split(" ")[0] || "Account" : "Sign in"

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-none">FreshBite</span>
              <span className="text-xs text-muted-foreground">{t.foodDelivery}</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link href={user ? "/account" : "/login"}>
              <Button variant="outline" size="sm" className="bg-transparent gap-1.5">
                <UserCircle className="h-4 w-4" />
                <span className="hidden sm:inline text-xs font-medium">{accountLabel}</span>
              </Button>
            </Link>

            {user && (
              <Button variant="outline" size="icon" className="bg-transparent" onClick={() => void logOut()}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="bg-transparent gap-1.5"
              onClick={toggleLanguage}
              aria-label={language === "en" ? "Switch to Bulgarian" : "Switch to English"}
            >
              <Languages className="h-4 w-4" />
              <span className="text-xs font-medium">{language === "en" ? "BG" : "EN"}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="bg-transparent"
              onClick={toggleTheme}
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Button variant="outline" size="icon" className="relative bg-transparent" onClick={() => setIsCartOpen(true)}>
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-2 -top-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                >
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>

      <CartDrawer open={isCartOpen} onOpenChange={setIsCartOpen} />
    </>
  )
}
