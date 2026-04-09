import { createClient } from '@/lib/supabase/server'
import { ItemsClient } from './items-client'

export default async function ItemsPage() {
  const supabase = await createClient()
  
  const [itemsResult, categoriesResult] = await Promise.all([
    supabase
      .from('menu_items')
      .select('*, categories(id, name)')
      .order('category_id')
      .order('sort_order', { ascending: true }),
    supabase
      .from('categories')
      .select('id, name, is_active')
      .order('sort_order', { ascending: true }),
  ])

  const items = (itemsResult.data || []).map(item => ({
    ...item,
    category_name: item.categories?.name || 'Kategorisiz',
  }))

  const categories = (categoriesResult.data || []).filter((category) => {
    if (typeof category.is_active === 'boolean') {
      return category.is_active
    }

    return true
  }).map(({ id, name }) => ({ id, name }))

  return (
    <ItemsClient 
      initialItems={items} 
      categories={categories} 
    />
  )
}
