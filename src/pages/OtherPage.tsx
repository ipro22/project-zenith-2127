import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, Clock, Phone } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

const services = [
  {
    model: "iPad (все модели)",
    items: [
      { name: "Замена стекла / дисплея", price: "от 4 500 ₽" },
      { name: "Замена аккумулятора", price: "от 3 000 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 2 000 ₽" },
      { name: "Замена кнопки Home / Touch ID", price: "от 1 800 ₽" },
      { name: "Восстановление после залития", price: "от 3 500 ₽" },
    ],
  },
  {
    model: "Samsung Galaxy (S, A, Note серии)",
    items: [
      { name: "Замена дисплея (AMOLED)", price: "от 3 500 ₽" },
      { name: "Замена аккумулятора", price: "от 1 800 ₽" },
      { name: "Замена задней крышки", price: "от 1 500 ₽" },
      { name: "Ремонт разъёма зарядки (USB-C)", price: "от 1 200 ₽" },
      { name: "Восстановление после залития", price: "от 2 500 ₽" },
      { name: "Замена камеры", price: "от 2 200 ₽" },
    ],
  },
  {
    model: "Xiaomi / Redmi / POCO",
    items: [
      { name: "Замена дисплея", price: "от 2 500 ₽" },
      { name: "Замена аккумулятора", price: "от 1 500 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 1 000 ₽" },
      { name: "Замена задней крышки", price: "от 1 200 ₽" },
      { name: "Восстановление после залития", price: "от 2 000 ₽" },
    ],
  },
  {
    model: "Huawei / Honor",
    items: [
      { name: "Замена дисплея", price: "от 3 000 ₽" },
      { name: "Замена аккумулятора", price: "от 1 800 ₽" },
      { name: "Ремонт разъёма зарядки", price: "от 1 200 ₽" },
      { name: "Замена задней крышки", price: "от 1 500 ₽" },
      { name: "Восстановление после залития", price: "от 2 500 ₽" },
    ],
  },
  {
    model: "AirPods / AirPods Pro",
    items: [
      { name: "Замена аккумулятора (один наушник)", price: "от 1 500 ₽" },
      { name: "Замена аккумулятора кейса", price: "от 2 000 ₽" },
      { name: "Чистка наушников", price: "от 500 ₽" },
      { name: "Ремонт разъёма зарядки кейса", price: "от 1 200 ₽" },
    ],
  },
  {
    model: "Apple Watch (все серии)",
    items: [
      { name: "Замена стекла / дисплея", price: "от 4 000 ₽" },
      { name: "Замена аккумулятора", price: "от 3 000 ₽" },
      { name: "Замена корпуса", price: "от 5 000 ₽" },
      { name: "Восстановление после залития", price: "от 3 500 ₽" },
    ],
  },
]

export default function OtherPage() {
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
              Ремонт других устройств
            </h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Ремонт iPad, Samsung, Xiaomi, Huawei, AirPods, Apple Watch и других устройств в Барнауле. Быстро, качественно, с гарантией.
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { icon: Shield, text: "Гарантия 6 месяцев" },
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
            <p className="text-zinc-500 mb-6">Нет вашего устройства в списке? Позвоните — отремонтируем практически любой гаджет.</p>
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