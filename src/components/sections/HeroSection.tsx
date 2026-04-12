import { motion } from "framer-motion"
import { Shield, ArrowRight, Phone, Calculator, MapPin, Star } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-6 pt-40 pb-16 relative overflow-hidden min-h-screen">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={siteConfig.heroBg}
          alt="iPro сервисный центр"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080c0c] via-[#080c0c]/50 to-[#080c0c]/20" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080c0c]/70 via-transparent to-[#080c0c]/95" />
      </div>

      {/* Aqua glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[hsl(174,72%,56%)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-sm mb-8"
        >
          <Shield className="w-4 h-4 text-[hsl(174,72%,56%)]" />
          <span className="text-sm text-zinc-400">Гарантия на все работы до 365 дней</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 drop-shadow-2xl"
        >
          <span className="text-white block">iPro — ремонт техники</span>
          <span className="bg-gradient-to-r from-[hsl(174,72%,56%)] via-[hsl(174,72%,72%)] to-[hsl(174,72%,56%)] bg-clip-text text-transparent">
            Apple и других брендов
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-4 leading-relaxed text-balance drop-shadow-lg"
        >
          Профессиональный ремонт iPhone, iPad, MacBook, Samsung, Xiaomi и ноутбуков.
          Бесплатная диагностика, ремонт в день обращения.
        </motion.p>

        {/* Key stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-10 text-sm text-zinc-400"
        >
          {["Диагностика бесплатно", "Ремонт от 30 минут", "10 лет на рынке Барнаула"].map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(174,72%,56%)]" />
              {t}
            </span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 flex-wrap mb-6"
        >
          <a
            href="tel:+79993231817"
            className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-[hsl(174,72%,56%)] text-[#080c0c] text-sm font-bold hover:bg-[hsl(174,72%,65%)] transition-all duration-300 shadow-lg shadow-[hsl(174,72%,56%)/25] animate-aqua-pulse"
          >
            <Phone className="w-4 h-4" />
            Записаться на ремонт
          </a>
          <a
            href="/calculator"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-700/60 text-sm font-medium text-zinc-200 hover:bg-zinc-800/80 hover:border-[hsl(174,72%,56%)]/40 transition-all duration-300"
          >
            <Calculator className="w-4 h-4" />
            Рассчитать стоимость
          </a>
          <a
            href="tel:+79993231817"
            className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900/70 backdrop-blur-sm border border-zinc-700/60 text-sm font-medium text-zinc-200 hover:bg-zinc-800/80 transition-all duration-300"
          >
            <Phone className="w-4 h-4" />
            +7 (999) 323-18-17
          </a>
        </motion.div>

        {/* Map buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          <a
            href="https://2gis.ru/barnaul/search/iPro"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-300"
          >
            <MapPin className="w-3.5 h-3.5 text-[hsl(174,72%,56%)]" />
            Открыть на 2ГИС
          </a>
          <a
            href="https://yandex.ru/maps/?text=iPro+Барнаул"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm text-xs text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition-all duration-300"
          >
            <MapPin className="w-3.5 h-3.5 text-[hsl(174,72%,56%)]" />
            Яндекс Карты
          </a>
          <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5" />
            ул. Молодёжная 34, 1 этаж
          </span>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="Клиент"
                  className="w-9 h-9 rounded-full border-2 border-[#080c0c] object-cover"
                  style={{ zIndex: i + 1 }}
                />
              ))}
            </div>
            <div className="h-8 w-px bg-zinc-800" />
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-zinc-200 font-bold ml-1.5 text-sm">5.0</span>
              </div>
              <a
                href="#reviews"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1 group mt-0.5"
              >
                <span>Нам доверяют <strong className="text-zinc-200">3 000+</strong> клиентов</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-zinc-400">Работаем <strong className="text-zinc-300">Пн–Вс 09:00–20:00</strong></span>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex justify-center"
        >
          <a href="#features" className="group flex flex-col items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
            <span>Наши услуги</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-5 h-5 rounded-full border border-zinc-700 flex items-center justify-center"
            >
              <ArrowRight className="w-3 h-3 rotate-90" />
            </motion.div>
          </a>
        </motion.div>
      </div>
    </section>
  )
}
