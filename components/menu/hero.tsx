import Image from "next/image"
import { MapPin, Clock, Wifi } from "lucide-react"

export function Hero() {
  return (
    <section className="relative h-[50vh] min-h-[360px] flex items-end overflow-hidden">
      <Image
        src="/images/hero-cafe.jpg"
        alt="Maison Cafe ambiance"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      <div className="relative z-10 w-full px-5 pb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-block w-8 h-[2px] bg-primary" />
          <span className="text-xs tracking-[0.25em] uppercase text-primary font-sans">
            Est. 2020
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground text-balance">
          Maison Cafe
        </h1>
        <p className="mt-2 text-sm text-muted-foreground font-sans leading-relaxed max-w-xs">
          Her yudumda bir hikaye, her lokmada bir lezzet yolculugu
        </p>
        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground font-sans">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            Kadikoy, Istanbul
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            08:00 - 00:00
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-primary" />
            Wi-Fi
          </span>
        </div>
      </div>
    </section>
  )
}
