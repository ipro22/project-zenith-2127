import { ArrowRight } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

export function CtaSection() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mb-6">Сдайте технику сегодня</h2>
        <p className="text-lg text-zinc-500 mb-10 text-balance">Диагностика бесплатно, ремонт в большинстве случаев за 1–2 часа.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="tel:+79993231817">
            <LiquidCtaButton>Позвонить нам</LiquidCtaButton>
          </a>
          <a
            href="/device/iphone"
            className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <span>Посмотреть услуги и цены</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </section>
  )
}