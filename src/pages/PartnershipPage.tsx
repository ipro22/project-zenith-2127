import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { motion } from "framer-motion"
import { ArrowLeft, Building2, Handshake, Truck, GraduationCap, ArrowRight } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

const formats = [
  {
    icon: Building2,
    title: "Корпоративное обслуживание",
    desc: "Комплексное обслуживание техники для компаний и организаций. Обслуживаем парк устройств любого размера: от 5 до 500+ девайсов.",
    perks: ["Выделенный менеджер", "Ежемесячные счета", "Скидка до 20%", "Приоритетный ремонт", "Выезд в офис"],
  },
  {
    icon: Handshake,
    title: "Агентское партнёрство",
    desc: "Приводите клиентов — зарабатывайте с каждого ремонта. Подходит для частных лиц, блогеров, автосервисов и магазинов.",
    perks: ["Комиссия до 15%", "Прозрачная статистика", "Еженедельные выплаты", "Промо-материалы", "Личный кабинет"],
  },
  {
    icon: Truck,
    title: "Б/у техника и выкуп",
    desc: "Скупаем технику Apple и Android у юридических лиц. Быстрая оценка, честные цены, расчёт в день обращения.",
    perks: ["Оценка за 30 минут", "Расчёт наличными", "Выезд курьера", "Любые объёмы", "Документы для бухгалтерии"],
  },
  {
    icon: GraduationCap,
    title: "Учебные заведения и НКО",
    desc: "Специальные условия для школ, университетов и некоммерческих организаций. Помогаем поддерживать технику в рабочем состоянии.",
    perks: ["Скидка 25%", "Рассрочка оплаты", "Выезд на место", "Сервисный договор", "Отчётные документы"],
  },
]

const steps = [
  { num: "01", title: "Оставьте заявку", desc: "Позвоните или напишите нам — расскажите о своих за��ачах и объёмах." },
  { num: "02", title: "Встреча и обсуждение", desc: "Встретимся лично или онлайн, обсудим условия сотрудничества." },
  { num: "03", title: "Договор", desc: "П��дпишем договор с фиксированными условиями и ценами." },
  { num: "04", title: "Начало работы", desc: "Уже с первого дня начинаем работать по согласованным условиям." },
]

export default function PartnershipPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
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
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Бизнес</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Сотрудничество</h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Предлагаем выгодные форматы партнёрства для компаний, предпринимателей и организаций Барнаула и Алтайского края.
            </p>
          </motion.div>

          {/* Formats */}
          <div className="space-y-4 mb-16">
            {formats.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.09 }}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0">
                    <f.icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-zinc-200 text-lg mb-2">{f.title}</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-4">{f.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {f.perks.map((perk, j) => (
                        <span key={j} className="text-xs text-zinc-400 bg-zinc-800/60 border border-zinc-700/50 px-3 py-1 rounded-full">
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="font-display text-2xl font-bold text-zinc-100 mb-8">Как начать сотрудничество</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {steps.map((s, i) => (
                <div key={i} className="relative">
                  <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                    <div className="font-display text-3xl font-bold text-zinc-700 mb-3">{s.num}</div>
                    <h3 className="font-heading font-semibold text-zinc-200 mb-2 text-sm">{s.title}</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700 z-10" />
                  )}
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
            <p className="text-zinc-500 mb-6">Готовы обсудить условия? Свяжитесь с нами — ответим быстро.</p>
            <a href="tel:+79993231817">
              <LiquidCtaButton>Обсудить сотрудничество</LiquidCtaButton>
            </a>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
