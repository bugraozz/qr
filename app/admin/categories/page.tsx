import { createClient } from '@/lib/supabase/server'
import { CategoriesClient } from './categories-client'

export default async function CategoriesPage() {
  const supabase = await createClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*, menu_items(id)')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
  }

  const categoriesWithCount = (categories || []).map(cat => ({
    ...cat,
    itemCount: cat.menu_items?.length || 0,
    menu_items: undefined,
  }))

  return <CategoriesClient initialCategories={categoriesWithCount} />
}
