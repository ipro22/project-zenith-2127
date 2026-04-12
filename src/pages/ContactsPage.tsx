import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import { ArrowLeft, Phone, MapPin, Clock, MessageCircle } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

const contacts = [
  {
    icon: Phone,
    title: "Телефон",
    value: "+7 (999) 323-18-17",
    sub: "Звонки принимаем с 9:00 до 20:00",
    href: "tel:+79993231817",
  },
  {
    icon: MapPin,
    title: "Адрес",
    value: "ул. Молодёжная 34, 1 этаж",
    sub: "г. Барнаул, центр города",
    href: "https://yandex.ru/maps/?text=Барнаул+Молодежная+34",
  },
  {
    icon: Clock,
    title: "Режим работы",
    value: "Пн–Сб: 9:00 – 20:00",
    sub: "Вс: 10:00 – 18:00",
    href: null,
  },
  {
    icon: MessageCircle,
    title: "WhatsApp / Telegram",
    value: "+7 (999) 323-18-17",
    sub: "Отвечаем в течение 15 минут",
    href: "https://wa.me/79993231817",
  },
]

export default function ContactsPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead
        title="Контакты iPro Барнаул — адрес, телефон, режим работы"
        description="Сервисный центр iPro: г. Барнаул, ул. Молодёжная 34, 1 этаж. Телефон: +7 (999) 323-18-17. Режим работы: Пн-Сб 9:00-20:00, Вс 10:00-18:00."
      />
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Связь</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Контакты</h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Позвоните, напишите или приходите к нам — мы всегда рады помочь с вашей техникой.
            </p>
          </motion.div>

          {/* Contact cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {contacts.map((c, i) => {
              const Inner = (
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 flex gap-4 h-full hover:border-zinc-700/60 transition-colors">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    <c.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">{c.title}</p>
                    <p className="text-zinc-200 font-medium mb-1">{c.value}</p>
                    <p className="text-zinc-500 text-sm">{c.sub}</p>
                  </div>
                </div>
              )
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  {c.href ? <a href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{Inner}</a> : Inner}
                </motion.div>
              )
            })}
          </div>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden mb-12"
          >
            <div className="p-6 border-b border-zinc-800/50">
              <h2 className="font-heading font-semibold text-zinc-200">Как нас найти</h2>
              <p className="text-zinc-500 text-sm mt-1">г. Барнаул, ул. Молодёжная 34, 1 этаж</p>
            </div>
            <a
              href="https://yandex.ru/maps/?text=Барнаул+Молодежная+34"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center h-48 bg-zinc-900/60 hover:bg-zinc-800/40 transition-colors group"
            >
              <div className="text-center">
                <MapPin className="w-8 h-8 text-zinc-600 group-hover:text-zinc-400 transition-colors mx-auto mb-2" />
                <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors text-sm">Открыть на Яндекс.Картах</span>
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-zinc-500 mb-6">Остались вопросы? Позвоните — ответим сразу.</p>
            <a href="tel:+79993231817">
              <LiquidCtaButton>Позвонить сейчас</LiquidCtaButton>
            </a>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}