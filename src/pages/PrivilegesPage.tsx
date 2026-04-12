import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import { ArrowLeft, Gift, Star, Repeat, Zap, Trophy, Heart } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

const privileges = [
  {
    icon: Gift,
    title: "Бесплатная диагностика",
    desc: "Для всех клиентов диагностика абсолютно бесплатна. Определяем неисправность и называем точную стоимость ещё до начала ремонта.",
    badge: "Всем",
  },
  {
    icon: Star,
    title: "Скидка постоянным клиентам",
    desc: "При каждом повторном обращении вы получаете скидку 5% на все виды ремонта. Скидки накапливаются и не сгорают.",
    badge: "С 2-го визита",
  },
  {
    icon: Repeat,
    title: "Программа лояльности",
    desc: "За каждый выполненный ремонт начисляем бонусные баллы. 1 балл = 1 рубль. Оплачивайте баллами до 30% стоимости ремонта.",
    badge: "Накопительная",
  },
  {
    icon: Zap,
    title: "Срочный ремонт без наценки",
    desc: "Постоянные клиенты получают приоритет в очереди на срочный ремонт. Ваше устройство попадает в работу первым.",
    badge: "Приоритет",
  },
  {
    icon: Trophy,
    title: "VIP-статус от 5 обращений",
    desc: "После 5 обращений вы получаете VIP-статус: скидка 10% на все услуги, бесплатная чистка устройства при каждом ремонте.",
    badge: "VIP",
  },
  {
    icon: Heart,
    title: "Реферальная программа",
    desc: "Приведите друга — получите 500 рублей на баланс. Ваш друг также получит скидку 300 рублей на первый ремонт.",
    badge: "Для друзей",
  },
]

const levels = [
  {
    name: "Стандарт",
    visits: "1–2 обращения",
    perks: ["Бесплатная диагностика", "Скидка 5% с 2-го визита", "Накопление баллов"],
    color: "border-zinc-700",
  },
  {
    name: "Постоянный",
    visits: "3–4 обращения",
    perks: ["Все из Стандарт", "Скидка 7% на ремонт", "Приоритетная очередь", "Двойные баллы"],
    color: "border-zinc-500",
    highlight: true,
  },
  {
    name: "VIP",
    visits: "5+ обращений",
    perks: ["Все из Постоянный", "Скидка 10% на всё", "Бесплатная чистка", "Персональный мастер", "Выезд на дом"],
    color: "border-zinc-300",
  },
]

export default function PrivilegesPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead
        title="Привилегии клиентов iPro — скидки, бонусы, VIP-статус | Барнаул"
        description="Программа лояльности iPro: скидки до 10%, накопительные бонусы, VIP-статус, бесплатная чистка, персональный мастер."
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
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Бонусы</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Привилегии клиентов</h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Мы ценим каждого клиента. Чем чаще вы с нами — тем больше бонусов и привилегий вы получаете.
            </p>
          </motion.div>

          {/* Privileges grid */}
          <div className="grid md:grid-cols-2 gap-4 mb-16">
            {privileges.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center">
                    <p.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <span className="text-xs text-zinc-500 bg-zinc-800 px-2.5 py-1 rounded-full">{p.badge}</span>
                </div>
                <h3 className="font-heading font-semibold text-zinc-200 mb-2">{p.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Levels */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold text-zinc-100 mb-8 text-center">Уровни клиентов</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {levels.map((l, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border ${l.color} ${l.highlight ? "bg-zinc-800/60" : "bg-zinc-900/40"} p-6`}
                >
                  <h3 className="font-heading font-bold text-zinc-100 text-lg mb-1">{l.name}</h3>
                  <p className="text-xs text-zinc-500 mb-4">{l.visits}</p>
                  <ul className="space-y-2">
                    {l.perks.map((perk, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-zinc-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0" />
                        {perk}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-zinc-500 mb-6">Начните копить баллы уже с первого ремонта!</p>
            <a href="tel:+79993231817">
              <LiquidCtaButton>Записаться на ремонт</LiquidCtaButton>
            </a>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}