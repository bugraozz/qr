import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Bir Hata Olustu</h1>
        <p className="text-muted-foreground mb-6">
          Giris sirasinda bir sorun yasandi. Lutfen tekrar deneyin.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link href="/auth/login">Tekrar Dene</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">Menuye Don</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
