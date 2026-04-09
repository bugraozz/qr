import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FolderOpen, UtensilsCrossed, Eye, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const [categoriesResult, itemsResult] = await Promise.all([
    supabase.from('categories').select('id'),
    supabase.from('menu_items').select('id, is_available, is_active'),
  ])

  const totalCategories = categoriesResult.data?.length || 0
  const totalItems = itemsResult.data?.length || 0
  const activeItems = (itemsResult.data || []).filter((item) => {
    const hasIsAvailable = typeof item.is_available === 'boolean'
    if (hasIsAvailable) {
      return item.is_available
    }

    if (typeof item.is_active === 'boolean') {
      return item.is_active
    }

    return true
  }).length

  const stats = [
    {
      title: 'Toplam Kategori',
      value: totalCategories,
      icon: FolderOpen,
      href: '/admin/categories',
      color: 'text-blue-500',
    },
    {
      title: 'Toplam Urun',
      value: totalItems,
      icon: UtensilsCrossed,
      href: '/admin/items',
      color: 'text-green-500',
    },
    {
      title: 'Aktif Urun',
      value: activeItems,
      icon: Eye,
      href: '/admin/items',
      color: 'text-primary',
    },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Cafe menunuzu buradan yonetin</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Kategoriler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Menu kategorilerini ekleyin, duzenleyin veya siralayin.
            </p>
            <Link 
              href="/admin/categories" 
              className="text-primary text-sm font-medium hover:underline"
            >
              Kategorileri Yonet →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5 text-primary" />
              Urunler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Menu urunlerini ekleyin, fiyatlarini guncelleyin veya aktif/pasif yapin.
            </p>
            <Link 
              href="/admin/items" 
              className="text-primary text-sm font-medium hover:underline"
            >
              Urunleri Yonet →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
