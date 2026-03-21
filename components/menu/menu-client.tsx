"use client"

import { useState, useEffect, useCallback } from "react"
import type { MenuCategoryWithItems } from "@/lib/types"
import { CategoryNav } from "./category-nav"
import { CategorySection } from "./category-section"
import { QrSection } from "./qr-section"
import { Footer } from "./footer"

interface MenuClientProps {
  categories: MenuCategoryWithItems[]
}

export function MenuClient({ categories }: MenuClientProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "")

  const handleScroll = useCallback(() => {
    const sections = categories.map((cat) => ({
      id: cat.id,
      el: document.getElementById(cat.id),
    }))

    const scrollPosition = window.scrollY + 120

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i]
      if (section.el && section.el.offsetTop <= scrollPosition) {
        setActiveCategory(section.id)
        break
      }
    }
  }, [categories])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id)
    const el = document.getElementById(id)
    if (el) {
      const offset = 60
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  if (categories.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p>Menu henuz yuklenmedi.</p>
      </div>
    )
  }

  return (
    <>
      <CategoryNav
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />

      <div className="pb-6">
        {categories.map((category) => (
          <CategorySection key={category.id} category={category} />
        ))}
      </div>

      <QrSection />
      <Footer />
    </>
  )
}
