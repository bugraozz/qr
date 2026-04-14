import { createClient } from "@/lib/supabase/server"
import { Hero } from "@/components/menu/hero"
import { MenuClient } from "@/components/menu/menu-client"
import { menuCategories as staticMenuCategories } from "@/lib/menu-data"
import type { MenuCategoryWithItems } from "@/lib/types"

type RawCategory = {
  id: string
  name: string
  slug?: string | null
  icon?: string | null
  sort_order?: number | null
  is_active?: boolean | null
}

type RawMenuItem = {
  id: string
  name: string
  description?: string | null
  price: number
  category_id: string
  sort_order?: number | null
  is_popular?: boolean | null
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

function buildStaticFallbackMenu(): MenuCategoryWithItems[] {
  return staticMenuCategories.map((category, categoryIndex) => {
    const slug = toSlug(category.id || category.name)

    return {
      id: category.id,
      name: category.name,
      slug,
      icon: category.icon || "coffee",
      sort_order: categoryIndex,
      is_active: true,
      image: category.image || categoryImages[slug] || defaultImage,
      items: category.items.map((item, itemIndex) => ({
        id: item.id,
        name: item.name,
        description: item.description || null,
        price: Number(item.price),
        category_id: category.id,
        is_available: true,
        is_popular: Boolean(item.isPopular),
        sort_order: itemIndex,
      })),
    }
  })
}

export default async function MenuPage() {
  const staticFallbackMenu = buildStaticFallbackMenu()
  let menuCategories = staticFallbackMenu

  try {
    const supabase = await createClient()

    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })

    const { data: items, error: itemsError } = await supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })

    const visibleCategories = ((categories || []) as RawCategory[]).filter((cat) =>
      isVisible(cat.is_active),
    )

    const visibleItems = ((items || []) as RawMenuItem[]).filter(
      (item) => isVisible(item.is_available) && isVisible(item.is_active),
    )

    const dynamicMenuCategories: MenuCategoryWithItems[] = visibleCategories.map((cat, index) => {
      const slug = cat.slug || toSlug(cat.name)

      return {
        id: cat.id,
        name: cat.name,
        slug,
        icon: cat.icon || "coffee",
        sort_order: cat.sort_order ?? index,
        is_active: isVisible(cat.is_active),
        image: categoryImages[slug] || defaultImage,
        items: visibleItems
          .filter((item) => item.category_id === cat.id)
          .map((item, itemIndex) => ({
            id: item.id,
            name: item.name,
            description: item.description || null,
            price: Number(item.price),
            category_id: item.category_id,
            is_available: isVisible(item.is_available) && isVisible(item.is_active),
            is_popular: Boolean(item.is_popular),
            sort_order: item.sort_order ?? itemIndex,
          })),
      }
    })

    const hasDynamicData =
      !catError &&
      !itemsError &&
      dynamicMenuCategories.some((category) => category.items.length > 0)

    if (hasDynamicData) {
      menuCategories = dynamicMenuCategories
    }
  } catch (error) {
    console.error("[menu] Using static fallback due to Supabase error", error)
  }

  return (
    <main className="min-h-screen max-w-lg mx-auto bg-background">
      <Hero />
      <MenuClient categories={menuCategories} />
    </main>
  )
}
