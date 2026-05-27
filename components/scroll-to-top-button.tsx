"use client"

import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

export function ScrollToTopButton() {
  const { isVisible, scrollToTop } = useScrollToTop(300)

  if (!isVisible) return null

  return (
    <Button
      type="button"
      size="icon"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-lg"
      aria-label="Scroll back to top"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  )
}