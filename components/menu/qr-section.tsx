"use client"

import { useEffect, useRef, useState } from "react"
import { Share2, QrCode, Download } from "lucide-react"
import QRCode from "qrcode"

export function QrSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [menuUrl, setMenuUrl] = useState("")

  useEffect(() => {
    setMenuUrl(window.location.href)
  }, [])

  useEffect(() => {
    if (!menuUrl || !canvasRef.current) return

    QRCode.toCanvas(canvasRef.current, menuUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#1a1510",
        light: "#faf6f1",
      },
      errorCorrectionLevel: "H",
    })
  }, [menuUrl])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Maison Cafe Menu",
          text: "Maison Cafe menusune goz atin!",
          url: menuUrl,
        })
      } catch {
        // User cancelled share
      }
    } else {
      await navigator.clipboard.writeText(menuUrl)
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const link = document.createElement("a")
    link.download = "maison-cafe-qr.png"
    link.href = canvas.toDataURL("image/png")
    link.click()
  }

  return (
    <section className="px-5 py-10">
      <div className="relative overflow-hidden bg-card rounded-2xl p-8 flex flex-col items-center text-center">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/30 rounded-br-2xl" />

        <div className="flex items-center gap-2 mb-2">
          <QrCode className="w-5 h-5 text-primary" />
          <h3 className="font-serif text-xl text-foreground">
            QR Menu Paylas
          </h3>
        </div>

        <p className="text-xs text-muted-foreground font-sans mb-6 max-w-[260px] leading-relaxed">
          Bu QR kodu telefonunuzla okutarak menuye erisebilir veya arkadaslarinizla paylasabilirsiniz
        </p>

        {/* QR Code with elegant frame */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-2xl border border-primary/20" />
          <div className="absolute -inset-1.5 rounded-xl bg-primary/5" />
          <div className="relative bg-[#faf6f1] p-5 rounded-xl shadow-lg">
            <canvas
              ref={canvasRef}
              className="w-[160px] h-[160px] rounded-sm"
            />
            {/* Center logo overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-[#faf6f1] rounded-lg flex items-center justify-center shadow-sm">
                <span className="font-serif text-[#1a1510] text-sm font-bold leading-none">M</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-7">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-sans font-medium transition-all hover:opacity-90 active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            Paylas
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-secondary-foreground text-xs font-sans font-medium transition-all hover:opacity-90 active:scale-95 border border-border"
          >
            <Download className="w-3.5 h-3.5" />
            Indir
          </button>
        </div>
      </div>
    </section>
  )
}
