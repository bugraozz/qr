import { createClient } from "@/lib/supabase/server"
import { Hero } from "@/components/menu/hero"
import { MenuClient } from "@/components/menu/menu-client"
import type { MenuCategoryWithItems } from "@/lib/types"

// Category images mapping based on slug
const categoryImages: Record<string, string> = {
  "sicak-icecekler": "/images/hot-drinks.jpg",
  "soguk-icecekler": "/images/cold-drinks.jpg",
  "kahvalti": "/images/breakfast.jpg",
  "atistirmaliklar": "/images/snacks.jpg",
  "tatlilar": "/images/desserts.jpg",
}

const defaultImage = "/images/hero-cafe.jpg"

export default async function MenuPage() {
  const supabase = await createClient()

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })

  console.log("[v0] Categories query result:", { categories, catError })

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("is_available", true)
    .order("sort_order", { ascending: true })

  console.log("[v0] Items query result:", { items, itemsError })

  const menuCategories: MenuCategoryWithItems[] = (categories || []).map((cat) => ({
    ...cat,
    image: categoryImages[cat.slug] || defaultImage,
    items: (items || []).filter((item) => item.category_id === cat.id),
  }))

  return (
    <main className="min-h-screen max-w-lg mx-auto bg-background">
      <Hero />
      <MenuClient categories={menuCategories} />
    </main>
  )
}
