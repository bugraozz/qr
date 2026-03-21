export interface DbCategory {
  id: string
  name: string
  slug: string
  icon: string | null
  sort_order: number
  is_active: boolean
}

export interface DbMenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string
  is_available: boolean
  is_popular: boolean
  sort_order: number
}

export interface MenuCategoryWithItems extends DbCategory {
  items: DbMenuItem[]
  image: string
}
