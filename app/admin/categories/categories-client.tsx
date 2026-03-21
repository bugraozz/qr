'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import { Plus, Pencil, Trash2, GripVertical, Loader2 } from 'lucide-react'

interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  sort_order: number
  is_active: boolean
  itemCount: number
}

interface CategoriesClientProps {
  initialCategories: Category[]
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [isOpen, setIsOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({ name: '', slug: '', icon: '' })
  const router = useRouter()
  const supabase = createClient()

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  function openCreate() {
    setEditingCategory(null)
    setFormData({ name: '', slug: '', icon: '' })
    setIsOpen(true)
  }

  function openEdit(category: Category) {
    setEditingCategory(category)
    setFormData({ 
      name: category.name, 
      slug: category.slug, 
      icon: category.icon || '' 
    })
    setIsOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const slug = formData.slug || generateSlug(formData.name)

    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update({
          name: formData.name,
          slug,
          icon: formData.icon || null,
        })
        .eq('id', editingCategory.id)

      if (!error) {
        setCategories(cats => 
          cats.map(c => c.id === editingCategory.id 
            ? { ...c, name: formData.name, slug, icon: formData.icon || null } 
            : c
          )
        )
      }
    } else {
      const maxOrder = Math.max(...categories.map(c => c.sort_order), 0)
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: formData.name,
          slug,
          icon: formData.icon || null,
          sort_order: maxOrder + 1,
        })
        .select()
        .single()

      if (!error && data) {
        setCategories([...categories, { ...data, itemCount: 0 }])
      }
    }

    setIsLoading(false)
    setIsOpen(false)
    router.refresh()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (!error) {
      setCategories(cats => cats.filter(c => c.id !== id))
      router.refresh()
    }
  }

  async function handleToggleActive(category: Category) {
    const { error } = await supabase
      .from('categories')
      .update({ is_active: !category.is_active })
      .eq('id', category.id)

    if (!error) {
      setCategories(cats =>
        cats.map(c => c.id === category.id ? { ...c, is_active: !c.is_active } : c)
      )
      router.refresh()
    }
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">Kategoriler</h1>
          <p className="text-muted-foreground mt-1">Menu kategorilerini yonetin</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kategori
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Kategori Duzenle' : 'Yeni Kategori'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Kategori Adi</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    name: e.target.value,
                    slug: formData.slug || generateSlug(e.target.value)
                  })}
                  placeholder="Sicak Icecekler"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="sicak-icecekler"
                />
                <p className="text-xs text-muted-foreground">
                  Bos birakirsaniz otomatik olusturulur
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Ikon (Emoji)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="☕"
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">Iptal</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {editingCategory ? 'Kaydet' : 'Olustur'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Henuz kategori yok.</p>
            <Button onClick={openCreate} variant="outline" className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Ilk Kategorinizi Ekleyin
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <Card key={category.id} className={!category.is_active ? 'opacity-50' : ''}>
              <CardContent className="flex items-center gap-4 py-4">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {category.icon && <span className="text-lg">{category.icon}</span>}
                    <h3 className="font-medium">{category.name}</h3>
                    {!category.is_active && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded">Pasif</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.itemCount} urun • /{category.slug}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(category)}
                  >
                    {category.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEdit(category)}
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
                        <AlertDialogTitle>Kategoriyi Sil</AlertDialogTitle>
                        <AlertDialogDescription>
                          &quot;{category.name}&quot; kategorisini silmek istediginize emin misiniz?
                          Bu kategorideki {category.itemCount} urun de silinecek.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Iptal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(category.id)}
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
    </div>
  )
}
