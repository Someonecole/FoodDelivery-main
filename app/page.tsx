import { FoodMenu } from "@/components/food-menu"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <FoodMenu />
    </main>
  )
}
