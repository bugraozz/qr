import { Star } from "lucide-react"
import type { DbMenuItem } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MenuItemCardProps {
  item: DbMenuItem
  index: number
}

export function MenuItemCard({ item, index }: MenuItemCardProps) {
  return (
    <div
      className={cn(
        "group flex items-start justify-between gap-3 py-4 transition-all duration-300",
        index > 0 && "border-t border-border/50"
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-serif text-base text-foreground group-hover:text-primary transition-colors">
            {item.name}
          </h3>
          {item.is_popular && (
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          )}
        </div>
        {item.description && (
          <p className="mt-1 text-xs text-muted-foreground font-sans leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
      <div className="flex-shrink-0 text-right">
        <span className="inline-flex items-baseline gap-0.5 font-serif text-lg text-foreground">
          {item.price.toFixed(0)}
          <span className="text-[10px] text-muted-foreground font-sans">TL</span>
        </span>
      </div>
    </div>
  )
}
