import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import { ArrowLeft, Shield, CheckCircle, XCircle, FileText } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

const covered = [
  "Дефекты установленных запчастей",
  "Ошибки при выполнении ремонтных работ",
  "Повторная неисправность по той же причине",
  "Некорректная работа заменённого модуля",
  "Отклейка дисплея или задней крышки после замены",
  "Выход из строя аккумулятора до 80% ёмкости",
]

const notCovered = [
  "Механические повреждения после ремонта",
  "Попадание влаги после ремонта",
  "Самостоятельный разбор устройства",
  "Программные сбои и вирусы",
  "Естественный износ расходных материалов",
  "Повреждения, не связанные с выполненным ремонтом",
]

const faq = [
  {
    q: "Как воспользоваться гарантией?",
    a: "Просто приходите к нам с устройством и чеком об оплате ремонта. Мы бесплатно устраним гарантийный случай в течение дня.",
  },
  {
    q: "Что такое 365 дней гарантии?",
    a: "Это полный год — 365 календарных дней с момента получения устройства после ремонта. Гарантия распространяется на выполненную работу и установленные запчасти.",
  },
  {
    q: "Можно ли продлить гарантию?",
    a: "VIP-клиенты нашего сервисного центра получают расширенную гарантию на 18 месяцев автоматически.",
  },
  {
    q: "Что делать, если устройство сломалось повторно?",
    a: "Звоните нам по номеру +7 (999) 323-18-17 или приходите напрямую. Мы разберёмся в ситуации и примем решение в вашу пользу.",
  },
]

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead
        title="Гарантия на ремонт до 365 дней — iPro Барнаул"
        description="Гарантия iPro до 365 дней на все виды ремонта и запчасти. Бесплатный повторный ремонт при гарантийном случае."
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
            <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Условия</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mb-4">Гарантия</h1>
            <p className="text-zinc-500 text-lg max-w-2xl">
              Мы уверены в качестве своей работы — поэтому даём гарантию 365 дней на все виды ремонта и используемые запчасти.
            </p>
          </motion.div>

          {/* Big guarantee badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-zinc-700 bg-zinc-900/60 p-8 text-center mb-12"
          >
            <Shield className="w-16 h-16 text-zinc-400 mx-auto mb-4" />
            <div className="font-display text-6xl font-bold text-zinc-100 mb-2">365</div>
            <div className="text-zinc-400 text-xl font-medium mb-3">дней гарантии</div>
            <p className="text-zinc-500 max-w-md mx-auto text-sm">
              На все виды ремонта и запасные части. Гарантийный документ выдаётся вместе с отремонтированным устройством.
            </p>
          </motion.div>

          {/* Covered / Not covered */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-4 mb-12"
          >
            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle className="w-5 h-5 text-zinc-400" />
                <h2 className="font-heading font-semibold text-zinc-200">Что покрывает гарантия</h2>
              </div>
              <ul className="space-y-3">
                {covered.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
              <div className="flex items-center gap-2 mb-5">
                <XCircle className="w-5 h-5 text-zinc-600" />
                <h2 className="font-heading font-semibold text-zinc-200">Что не покрывает гарантия</h2>
              </div>
              <ul className="space-y-3">
                {notCovered.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-zinc-500" />
              <h2 className="font-display text-2xl font-bold text-zinc-100">Частые вопросы</h2>
            </div>
            <div className="space-y-3">
              {faq.map((item, i) => (
                <div key={i} className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
                  <h3 className="font-heading font-semibold text-zinc-200 mb-2">{item.q}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <p className="text-zinc-500 mb-6">Есть вопросы по гарантии? Позвоните — всё объясним.</p>
            <a href="tel:+79993231817">
              <LiquidCtaButton>Позвонить нам</LiquidCtaButton>
            </a>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}