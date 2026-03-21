"use client"

import { useRef, useEffect, useState } from "react"
import { Coffee, GlassWater, Egg, Sandwich, Cake, UtensilsCrossed } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MenuCategoryWithItems } from "@/lib/types"

const iconMap: Record<string, React.ElementType> = {
  coffee: Coffee,
  "glass-water": GlassWater,
  egg: Egg,
  sandwich: Sandwich,
  cake: Cake,
}

// Map slug to icon
function getIconForCategory(slug: string): React.ElementType {
  if (slug.includes("sicak") || slug.includes("hot") || slug.includes("coffee")) return Coffee
  if (slug.includes("soguk") || slug.includes("cold") || slug.includes("ice")) return GlassWater
  if (slug.includes("kahvalti") || slug.includes("breakfast")) return Egg
  if (slug.includes("atistirma") || slug.includes("snack") || slug.includes("sandwich")) return Sandwich
  if (slug.includes("tatli") || slug.includes("dessert") || slug.includes("cake")) return Cake
  return UtensilsCrossed
}

interface CategoryNavProps {
  categories: MenuCategoryWithItems[]
  activeCategory: string
  onCategoryClick: (id: string) => void
}

export function CategoryNav({ categories, activeCategory, onCategoryClick }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 360)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      const activeBtn = scrollRef.current.querySelector(`[data-category="${activeCategory}"]`)
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [activeCategory])

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isSticky
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg shadow-background/20"
          : "bg-background"
      )}
    >
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto px-4 py-3 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => {
          const Icon = cat.icon ? (iconMap[cat.icon] || getIconForCategory(cat.slug)) : getIconForCategory(cat.slug)
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              data-category={cat.id}
              onClick={() => onCategoryClick(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
