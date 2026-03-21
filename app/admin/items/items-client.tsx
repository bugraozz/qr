'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Plus, Pencil, Trash2, Search, Filter, Loader2, Eye, EyeOff } from 'lucide-react'

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string
  category_name: string
  is_available: boolean
  is_popular: boolean
  sort_order: number
}

interface Category {
  id: string
  name: string
}

interface ItemsClientProps {
  initialItems: MenuItem[]
  categories: Category[]
}

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category_id: '',
  is_available: true,
  is_popular: false,
}

export function ItemsClient({ initialItems, categories }: ItemsClientProps) {
  const [items, setItems] = useState(initialItems)
  const [isOpen, setIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const router = useRouter()
  const supabase = createClient()

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = filterCategory === 'all' || item.category_id === filterCategory
      return matchesSearch && matchesCategory
    })
  }, [items, search, filterCategory])

  function openCreate() {
    setEditingItem(null)
    setFormData(emptyForm)
    setIsOpen(true)
  }

  function openEdit(item: MenuItem) {
    setEditingItem(item)
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price.toString(),
      category_id: item.category_id,
      is_available: item.is_available,
      is_popular: item.is_popular,
    })
    setIsOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const itemData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category_id: formData.category_id,
      is_available: formData.is_available,
      is_popular: formData.is_popular,
    }

    if (editingItem) {
      const { error } = await supabase
        .from('menu_items')
        .update(itemData)
        .eq('id', editingItem.id)

      if (!error) {
        const categoryName = categories.find(c => c.id === formData.category_id)?.name || 'Kategorisiz'
        setItems(items => 
          items.map(i => i.id === editingItem.id 
            ? { ...i, ...itemData, category_name: categoryName } 
            : i
          )
        )
      }
    } else {
      const maxOrder = Math.max(...items.filter(i => i.category_id === formData.category_id).map(i => i.sort_order), 0)
      const { data, error } = await supabase
        .from('menu_items')
        .insert({ ...itemData, sort_order: maxOrder + 1 })
        .select()
        .single()

      if (!error && data) {
        const categoryName = categories.find(c => c.id === formData.category_id)?.name || 'Kategorisiz'
        setItems([...items, { ...data, category_name: categoryName }])
      }
    }

    setIsLoading(false)
    setIsOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (!error) {
      setItems(items => items.filter(i => i.id !== id))
      router.refresh()
    }
  }

  async function handleToggleAvailable(item: MenuItem) {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !item.is_available })
      .eq('id', item.id)

    if (!error) {
      setItems(items =>
        items.map(i => i.id === item.id ? { ...i, is_available: !i.is_available } : i)
      )
      router.refresh()
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Urunler</h1>
          <p className="text-muted-foreground mt-1">Menu urunlerini yonetin</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Urun
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Urun Duzenle' : 'Yeni Urun'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Urun Adi</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Cappuccino"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Aciklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kremali, yumusak kopuklu..."
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Fiyat (TL)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="45.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select 
                    value={formData.category_id} 
                    onValueChange={(v) => setFormData({ ...formData, category_id: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Secin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Mevcut</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="rounded border-border"
                  />
                  <span className="text-sm">Populer</span>
                </label>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Iptal</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading || !formData.category_id}>
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingItem ? 'Kaydet' : 'Olustur'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Urun ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Kategori filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tum Kategoriler</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              {search || filterCategory !== 'all' 
                ? 'Aramaniza uygun urun bulunamadi.' 
                : 'Henuz urun yok.'}
            </p>
            {!search && filterCategory === 'all' && (
              <Button onClick={openCreate} variant="outline" className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Ilk Urununuzu Ekleyin
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredItems.map((item) => (
            <Card key={item.id} className={!item.is_available ? 'opacity-50' : ''}>
              <CardContent className="flex items-center gap-4 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    {item.is_popular && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">Populer</span>
                    )}
                    {!item.is_available && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Mevcut Degil</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.category_name} • {item.description || 'Aciklama yok'}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold text-primary">{item.price.toFixed(2)} TL</p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleAvailable(item)}
                    title={item.is_available ? 'Mevcut degil yap' : 'Mevcut yap'}
                  >
                    {item.is_available ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Urunu Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          &quot;{item.name}&quot; urununu silmek istediginize emin misiniz?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Iptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(item.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Sil
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      <p className="text-sm text-muted-foreground mt-4 text-center">
        Toplam {filteredItems.length} urun
      </p>
    </div>
  )
}
