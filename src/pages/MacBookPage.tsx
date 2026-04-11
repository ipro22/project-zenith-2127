import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, Clock, Phone } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

const services = [
  {
    model: "MacBook Air (M1, M2, M3)",
    items: [
      { name: "Замена дисплея в сборе", price: "от 18 000 ₽" },
      { name: "Замена аккумулятора", price: "от 9 500 ₽" },
      { name: "Чистка и замена термопасты", price: "от 3 000 ₽" },
      { name: "Ремонт клавиатуры / замена клавиши", price: "от 2 500 ₽" },
      { name: "Восстановление после залития", price: "от 4 500 ₽" },
      { name: "Диагностика (бесплатно)", price: "0 ₽" },
    ],
  },
  {
    model: "MacBook Pro 14\" / 16\" (M1, M2, M3)",
    items: [
      { name: "Замена дисплея (Liquid Retina XDR)", price: "от 35 000 ₽" },
      { name: "Замена аккумулятора", price: "от 12 000 ₽" },
      { name: "Чистка и замена термопасты", price: "от 4 000 ₽" },
      { name: "Ремонт клавиатуры", price: "от 3 500 ₽" },
      { name: "Восстановление после залития", price: "от 5 500 ₽" },
    ],
  },
  {
    model: "MacBook Pro 13\" (Intel, M1, M2)",
    items: [
      { name: "Замена дисплея в сборе", price: "от 14 000 ₽" },
      { name: "Замена аккумулятора", price: "от 8 000 ₽" },
      { name: "Чистка и замена термопасты", price: "от 3 000 ₽" },
      { name: "Ремонт клавиатуры / замена клавиши", price: "от 2 500 ₽" },
      { name: "Восстановление после залития", price: "от 4 500 ₽" },
      { name: "Замена SSD", price: "от 5 000 ₽" },
    ],
  },
  {
    model: "MacBook Air 13\" (Intel)",
    items: [
      { name: "Замена дисплея в сборе", price: "от 10 000 ₽" },
      { name: "Замена аккумулятора", price: "от 6 500 ₽" },
      { name: "Чистка и замена термопасты", price: "от 2 500 ₽" },
      { name: "Ремонт клавиатуры", price: "от 2 000 ₽" },
      { name: "Восстановление после залития", price: "от 3 500 ₽" },
      { name: "Замена SSD", price: "от 4 000 ₽" },
    ],
  },
  {
    model: "iMac 24\" / 27\"",
    items: [
      { name: "Замена дисплея", price: "от 25 000 ₽" },
      { name: "Чистка системы охлаждения", price: "от 4 000 ₽" },
      { name: "Замена HDD/SSD", price: "от 5 000 ₽" },
      { name: "Восстановление после залития", price: "от 6 000 ₽" },
      { name: "Увеличение RAM", price: "от 3 500 ₽" },
    ],
  },
]

export default function MacBookPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
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
              Ремонт MacBook и iMac
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Ремонт всех моделей MacBook Air, MacBook Pro и iMac в Барнауле. Опытные мастера, сертифицированные запчасти, гарантия на работу.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { icon: Shield, text: "Гарантия 6 месяцев" },
                { icon: Clock, text: "Срочный ремонт за 1 день" },
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
            <p className="text-zinc-500 mb-6">Не нашли свою модель? Позвоните — диагностика бесплатно, стоимость назовём сразу.</p>
            <a href="tel:+73852000000">
              <LiquidCtaButton>Позвонить и записаться</LiquidCtaButton>
            </a>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
