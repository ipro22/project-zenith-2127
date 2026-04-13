import { motion } from "framer-motion"
import { Shield, ArrowRight, Phone, Calculator, MapPin, Star, ChevronDown } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"

const devices = [
  { label: "iPhone", href: "/device/iphone", icon: "📱" },
  { label: "Samsung", href: "/device/samsung", icon: "📱" },
  { label: "MacBook", href: "/device/macbook", icon: "💻" },
  { label: "iPad", href: "/device/ipad", icon: "📋" },
  { label: "Xiaomi", href: "/device/xiaomi", icon: "📱" },
]

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex flex-col">
      {/* Background gradient — Apple style */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-white" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 opacity-20 blur-3xl rounded-full" />
      <div className="absolute bottom-1/4 left-0 w-72 h-72 bg-indigo-200 opacity-20 blur-3xl rounded-full" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-center max-w-5xl mx-auto px-6 pt-28 pb-12">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 shadow-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-gray-600">Работаем · Пн–Вс 09:00–20:00</span>
          <Shield className="w-3.5 h-3.5 text-blue-500" />
          <span className="text-sm text-gray-600">Гарантия 365 дней</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5"
        >
          <span className="text-gray-900 block">Ремонт техники</span>
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Apple и других брендов
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          Профессиональный ремонт iPhone, iPad, MacBook, Samsung, Xiaomi.
          Диагностика бесплатно. Ремонт в день обращения.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-6 mb-10 text-sm text-gray-400"
        >
          {[
            { num: "10+", text: "лет на рынке" },
            { num: "3000+", text: "довольных клиентов" },
            { num: "0 ₽", text: "диагностика" },
            { num: "1–2 ч", text: "срок ремонта" },
          ].map(({ num, text }) => (
            <div key={text} className="flex items-center gap-1.5">
              <span className="font-bold text-gray-800">{num}</span>
              <span>{text}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap mb-8"
        >
          <a
            href="/calculator"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95"
          >
            <Calculator className="w-4 h-4" />
            Рассчитать стоимость
          </a>
          <a
            href="tel:+79993231817"
            className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <Phone className="w-4 h-4 text-blue-500" />
            +7 (999) 323-18-17
          </a>
        </motion.div>

        {/* Device quick-links */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {devices.map((d) => (
            <a
              key={d.href}
              href={d.href}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm hover:shadow-md"
            >
              <span>{d.icon}</span>
              {d.label}
            </a>
          ))}
          <a
            href="/device/other"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-sm text-blue-600 hover:bg-blue-100 transition-all"
          >
            Другие →
          </a>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Клиент"
                  className="w-9 h-9 rounded-full border-2 border-white object-cover shadow-sm"
                  style={{ zIndex: i + 1 }}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-800 font-bold ml-1 text-sm">5.0</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Нам доверяют <strong className="text-gray-700">3 000+</strong> клиентов
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <a
              href="https://2gis.ru/barnaul/search/iPro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              2ГИС
              <ArrowRight className="w-3 h-3" />
            </a>
            <a
              href="https://yandex.ru/maps/?text=iPro+Барнаул"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Яндекс Карты
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 flex justify-center pb-8"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
          className="w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center"
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
