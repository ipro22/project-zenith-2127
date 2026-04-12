import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, Clock, Phone } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

const services = [
  {
    model: "iPhone 15 / 15 Plus / 15 Pro / 15 Pro Max",
    items: [
      { name: "Замена стекла / экрана (OLED)", price: "от 6 500 ₽" },
      { name: "Замена аккумулятора", price: "от 3 200 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 2 500 ₽" },
      { name: "Замена задней крышки", price: "от 4 000 ₽" },
      { name: "Замена камеры", price: "от 5 500 ₽" },
    ],
  },
  {
    model: "iPhone 14 / 14 Plus / 14 Pro / 14 Pro Max",
    items: [
      { name: "Замена стекла / экрана (OLED)", price: "от 5 500 ₽" },
      { name: "Замена аккумулятора", price: "от 2 800 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 2 200 ₽" },
      { name: "Замена задней крышки", price: "от 3 500 ₽" },
      { name: "Замена камеры", price: "от 4 500 ₽" },
    ],
  },
  {
    model: "iPhone 13 / 13 mini / 13 Pro / 13 Pro Max",
    items: [
      { name: "Замена стекла / экрана (OLED)", price: "от 4 500 ₽" },
      { name: "Замена аккумулятора", price: "от 2 200 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 1 800 ₽" },
      { name: "Замена задней крышки", price: "от 2 800 ₽" },
      { name: "Замена камеры", price: "от 3 500 ₽" },
    ],
  },
  {
    model: "iPhone 12 / 12 mini / 12 Pro / 12 Pro Max",
    items: [
      { name: "Замена стекла / экрана (OLED)", price: "от 3 500 ₽" },
      { name: "Замена аккумулятора", price: "от 1 800 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 1 500 ₽" },
      { name: "Замена задней крышки", price: "от 2 200 ₽" },
      { name: "Замена камеры", price: "от 2 800 ₽" },
    ],
  },
  {
    model: "iPhone 11 / 11 Pro / 11 Pro Max",
    items: [
      { name: "Замена стекла / экрана (LCD/OLED)", price: "от 2 200 ₽" },
      { name: "Замена аккумулятора", price: "от 1 500 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 1 200 ₽" },
      { name: "Замена задней крышки", price: "от 1 800 ₽" },
      { name: "Замена камеры", price: "от 2 200 ₽" },
    ],
  },
  {
    model: "iPhone X / XS / XS Max / XR",
    items: [
      { name: "Замена стекла / экрана (OLED)", price: "от 1 800 ₽" },
      { name: "Замена аккумулятора", price: "от 1 200 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 1 000 ₽" },
      { name: "Замена задней крышки", price: "от 1 500 ₽" },
      { name: "Замена камеры", price: "от 1 800 ₽" },
    ],
  },
]

export default function IPhonePage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead
        title="Ремонт iPhone в Барнауле — цены на все модели | iPro"
        description="Ремонт iPhone всех моделей в Барнауле. Замена экрана, аккумулятора, ремонт после воды. Гарантия 365 дней. Бесплатная диагностика."
      />
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back */}
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Услуги</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mb-4">
              Ремонт iPhone
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Профессиональный ремонт всех моделей iPhone в Барнауле. Оригинальные и сертифицированные запчасти, гарантия 6 месяцев.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { icon: Shield, text: "Гарантия 365 дней" },
                { icon: Clock, text: "Ремонт за 1–2 часа" },
                { icon: Phone, text: "Бесплатная диагностика" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400">
                  <Icon className="w-4 h-4" />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <div className="space-y-6">
            {services.map((group, gi) => (
              <motion.div
                key={group.model}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: gi * 0.08 }}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/60">
                  <h2 className="font-heading font-semibold text-zinc-200 text-base">{group.model}</h2>
                </div>
                <div className="divide-y divide-zinc-800/40">
                  {group.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-800/20 transition-colors"
                    >
                      <span className="text-zinc-400 text-sm">{item.name}</span>
                      <span className="text-zinc-200 font-medium text-sm tabular-nums">{item.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-zinc-500 mb-6">Не нашли свою модель или вид ремонта? Позвоните — уточним стоимость.</p>
            <a href="tel:+79993231817">
              <LiquidCtaButton>Позвонить и записаться</LiquidCtaButton>
            </a>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}