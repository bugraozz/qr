import Image from "next/image"
import type { MenuCategoryWithItems } from "@/lib/types"
import { MenuItemCard } from "./menu-item-card"

interface CategorySectionProps {
  category: MenuCategoryWithItems
}

export function CategorySection({ category }: CategorySectionProps) {
  if (category.items.length === 0) {
    return null
  }

  return (
    <section id={category.id} className="scroll-mt-16">
      {/* Category Banner */}
      <div className="relative h-40 overflow-hidden rounded-xl mx-5 mt-6 mb-4">
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
        <div className="relative z-10 flex items-end h-full px-5 pb-4">
          <div>
            <h2 className="font-serif text-2xl text-foreground">{category.name}</h2>
            <p className="text-xs text-muted-foreground font-sans mt-1">
              {category.items.length} cesit
            </p>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="px-5">
        <div className="bg-card rounded-xl px-4 py-1">
          {category.items.map((item, index) => (
            <MenuItemCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
