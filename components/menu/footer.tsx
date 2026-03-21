import { Instagram, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-4">
      <div className="px-5 py-8">
        <div className="text-center mb-6">
          <h3 className="font-serif text-lg text-foreground">Maison Cafe</h3>
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground font-sans mt-1">
            Her yudumda bir hikaye
          </p>
        </div>

        <div className="flex flex-col gap-3 items-center text-xs text-muted-foreground font-sans">
          <a
            href="tel:+902161234567"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            +90 216 123 45 67
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-primary transition-colors"
          >
            <Instagram className="w-3.5 h-3.5" />
            @maisoncafe
          </a>
          <span className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            Moda Cad. No:42, Kadikoy / Istanbul
          </span>
        </div>

        <div className="mt-8 pt-4 border-t border-border text-center">
          <p className="text-[10px] text-muted-foreground/60 font-sans">
            Fiyatlarimiza KDV dahildir. Alerjen bilgisi icin personelimize danisabilirsiniz.
          </p>
        </div>
      </div>
    </footer>
  )
}
