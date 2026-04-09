import { createClient } from "@/lib/supabase/server"
import { Hero } from "@/components/menu/hero"
import { MenuClient } from "@/components/menu/menu-client"
import type { MenuCategoryWithItems } from "@/lib/types"

type RawCategory = {
  id: string
  name: string
  slug?: string | null
  is_active?: boolean | null
}

type RawMenuItem = {
  id: string
  category_id: string
  is_available?: boolean | null
  is_active?: boolean | null
}

// Category images mapping based on slug
const categoryImages: Record<string, string> = {
  "sicak-icecekler": "/images/hot-drinks.jpg",
  "soguk-icecekler": "/images/cold-drinks.jpg",
  "kahvalti": "/images/breakfast.jpg",
  "atistirmaliklar": "/images/snacks.jpg",
  "tatlilar": "/images/desserts.jpg",
}

const defaultImage = "/images/hero-cafe.jpg"

function isVisible(value: boolean | null | undefined) {
  return value !== false
}

function toSlug(value: string | null | undefined) {
  if (!value) return ""
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export default async function MenuPage() {
  const supabase = await createClient()

  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })

  console.log("[v0] Categories query result:", { categories, catError })

  const { data: items, error: itemsError } = await supabase
    .from("menu_items")
    .select("*")
    .order("sort_order", { ascending: true })

  console.log("[v0] Items query result:", { items, itemsError })

  const visibleCategories = ((categories || []) as RawCategory[]).filter((cat) =>
    isVisible(cat.is_active),
  )

  const visibleItems = ((items || []) as RawMenuItem[]).filter(
    (item) => isVisible(item.is_available) && isVisible(item.is_active),
  )

  const menuCategories: MenuCategoryWithItems[] = visibleCategories.map((cat) => {
    const slug = cat.slug || toSlug(cat.name)

    return {
      ...cat,
      slug,
      image: categoryImages[slug] || defaultImage,
      items: visibleItems.filter((item) => item.category_id === cat.id),
    } as MenuCategoryWithItems
  })

  return (
    <main className="min-h-screen max-w-lg mx-auto bg-background">
      <Hero />
      <MenuClient categories={menuCategories} />
    </main>
  )
}
