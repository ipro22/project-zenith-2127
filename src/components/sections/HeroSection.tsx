import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"
import { Shield, ArrowRight, Phone, Calculator } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-40 pb-16 relative overflow-hidden">
      {/* MacBook background image */}
      <div className="absolute inset-0">
        <img
          src={siteConfig.heroBg}
          alt="MacBook"
          className="w-full h-full object-cover object-center"
        />
        {/* Multi-layer darkening for text readability */}
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm mb-8">
          <Shield className="w-4 h-4 text-zinc-400" />
          <span className="text-sm text-zinc-400">Официальная гарантия на все работы</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-5 drop-shadow-2xl">
          <span className="text-white block">Ремонт Apple</span>
          <span className="bg-gradient-to-r from-zinc-400 via-white to-zinc-400 bg-clip-text text-transparent">
            быстро и надёжно.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-10 leading-relaxed text-balance drop-shadow-lg">
          Сервисный центр iPro в центре Барнаула — профессиональный ремонт iPhone, iPad, MacBook и другой техники. Диагностика бесплатно, ремонт — в день обращения.
        </p>

        {/* CTAs — 3 кнопки */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap">
          <a href="tel:+79993231817">
            <LiquidCtaButton>Записаться на ремонт</LiquidCtaButton>
          </a>
          <a
            href="tel:+79993231817"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-700/60 text-sm font-medium text-zinc-200 hover:bg-zinc-800/80 transition-all"
          >
            <Phone className="w-4 h-4" />
            Позвонить
          </a>
          <a
            href="/calculator"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-700/60 text-sm font-medium text-zinc-200 hover:bg-zinc-800/80 transition-all"
          >
            <Calculator className="w-4 h-4" />
            Рассчитать стоимость
          </a>
        </div>

        {/* Scroll hint */}
        <div className="mt-8 flex justify-center">
          <a
            href="#features"
            className="group flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span>Наши услуги</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Клиент"
                  className={`w-10 h-10 rounded-full border-2 border-zinc-950 object-cover z-[${i + 1}]`}
                />
              ))}
            </div>
            <div className="h-8 w-px bg-zinc-700" />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FACC15" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
                  </svg>
                ))}
                <span className="text-zinc-300 font-medium ml-1 text-sm">5.0</span>
              </div>
              <p className="text-sm text-zinc-400">
                Нам доверяют <span className="text-white font-medium">3 000+</span> жителей Барнаула
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}