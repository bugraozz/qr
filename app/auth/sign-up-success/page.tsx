import Link from 'next/link'
import { Coffee, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Email Gonderildi!</h1>
        <p className="text-muted-foreground mb-6">
          Kaydinizi tamamlamak icin email adresinize gonderilen linke tiklayin.
        </p>
        
        <div className="space-y-3">
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Giris Sayfasina Don</Link>
          </Button>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/">
              <Coffee className="mr-2 h-4 w-4" />
              Menuye Don
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
