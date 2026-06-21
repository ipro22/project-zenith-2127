import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import { Phone, Gift, Calendar, CheckCircle, Star, Trophy, Clock, Shield } from "lucide-react"

const PRIZE_IMAGE = "https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/bucket/d818cd17-a1fc-4556-96ac-9243e84e2d83.png"

const steps = [
  { icon: CheckCircle, title: "Совершите ремонт или покупку", desc: "На сумму от 3 500 ₽ в нашем сервисном центре", color: "bg-blue-50 text-blue-600" },
  { icon: Phone, title: "Уточните участие у менеджера", desc: "По телефону +7 (999) 323-18-17 или 57-18-17", color: "bg-green-50 text-green-600" },
  { icon: Trophy, title: "Получите билет участника", desc: "Ваше участие будет гарантировано при выполнении условий", color: "bg-amber-50 text-amber-600" },
  { icon: Star, title: "Ждите розыгрыша 1 ноября", desc: "Победитель определяется случайным образом среди всех участников", color: "bg-purple-50 text-purple-600" },
]

const faq = [
  { q: "Кто может участвовать?", a: "Любой клиент, совершивший ремонт или покупку на сумму от 3 500 ₽ в период акции с 22.06.2026 по 31.08.2026." },
  { q: "Нужно ли что-то регистрировать?", a: "Да, необходимо уточнить участие у менеджера по телефону +7 (999) 323-18-17 / 57-18-17. Без подтверждения участие не засчитывается." },
  { q: "Можно ли участвовать несколько раз?", a: "Каждая покупка или ремонт на сумму от 3 500 ₽ — это отдельный шанс на участие. Чем больше обращений, тем выше шансы." },
  { q: "Когда будут объявлены результаты?", a: "Розыгрыш состоится 1 ноября 2026 года. Победитель будет оповещён по телефону и опубликован в наших соцсетях." },
  { q: "Какой приз разыгрывается?", a: "iPhone 17 — флагманский смартфон Apple актуальной модели. Характеристики и цвет — по наличию на момент розыгрыша." },
]

export default function GiveawayPage() {
  const endDate = new Date("2026-08-31")
  const drawDate = new Date("2026-11-01")
  const now = new Date()
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
  const isActive = now <= endDate && now >= new Date("2026-06-22")

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Розыгрыш iPhone 17 — iPro Барнаул"
        description="Участвуй в розыгрыше iPhone 17 от сервисного центра iPro! Акция с 22.06.2026 по 31.08.2026. Совершите ремонт или покупку от 3 500 ₽ и выиграйте iPhone 17."
      />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-16 pb-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 bg-amber-500 opacity-10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-600 opacity-10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600 opacity-5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-medium mb-6">
                <Gift className="w-4 h-4" />
                {isActive ? `Акция активна · осталось ${daysLeft} дн.` : "Акция завершена"}
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Выиграй <span className="text-amber-400">iPhone 17</span>
              </h1>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Совершите ремонт или покупку от 3 500 ₽ и получите шанс стать обладателем флагманского iPhone 17
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
                  <p className="text-white font-bold text-xl">22.06</p>
                  <p className="text-gray-400 text-xs mt-0.5">Начало акции</p>
                </div>
                <div className="bg-white/10 rounded-2xl px-4 py-3 text-center">
                  <p className="text-white font-bold text-xl">31.08</p>
                  <p className="text-gray-400 text-xs mt-0.5">Конец акции</p>
                </div>
                <div className="bg-amber-500/20 border border-amber-500/30 rounded-2xl px-4 py-3 text-center">
                  <p className="text-amber-400 font-bold text-xl">01.11</p>
                  <p className="text-gray-400 text-xs mt-0.5">День розыгрыша</p>
                </div>
              </div>

              <a href="tel:+79993231817"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-amber-500 text-gray-900 font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5">
                <Phone className="w-4 h-4" />
                Уточнить условия участия
              </a>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.1 }}
              className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-purple-600 rounded-3xl blur-2xl opacity-30 scale-95" />
                <img src={PRIZE_IMAGE} alt="iPhone 17"
                  className="relative w-72 h-72 object-contain drop-shadow-2xl"
                  onError={(e) => {
                    const el = e.currentTarget
                    el.style.display = 'none'
                    const next = el.nextElementSibling as HTMLElement
                    if (next) next.style.display = 'flex'
                  }} />
                <div style={{ display: 'none' }}
                  className="relative w-72 h-72 rounded-3xl bg-gradient-to-br from-gray-700 to-gray-800 items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-3">📱</div>
                    <p className="text-white font-bold text-xl">iPhone 17</p>
                  </div>
                </div>
                {/* Glow ring */}
                <div className="absolute -inset-4 rounded-full border border-amber-500/20 animate-pulse" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Countdown / status */}
      {isActive && (
        <div className="bg-amber-50 border-b border-amber-100 py-4 px-4">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-amber-800">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">До конца акции: <strong>{daysLeft} дней</strong></span>
            </div>
            <div className="flex items-center gap-2 text-amber-700">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Розыгрыш: 1 ноября 2026</span>
            </div>
            <a href="tel:+79993231817" className="flex items-center gap-1.5 text-sm font-semibold text-amber-800 hover:underline">
              <Phone className="w-3.5 h-3.5" /> +7 (999) 323-18-17
            </a>
          </div>
        </div>
      )}

      {/* Steps */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Как участвовать</h2>
            <p className="text-gray-500">Всего 4 шага до шанса выиграть iPhone 17</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-xl bg-gray-900 text-white text-sm font-bold flex items-center justify-center shadow">
                  {i + 1}
                </div>
                <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center mb-4`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm">{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Условия участия</h2>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4 mb-6">
              {[
                { icon: "✅", text: "Совершите ремонт или покупку в нашем сервисном центре на сумму от 3 500 ₽" },
                { icon: "📅", text: "Покупка/ремонт должны быть совершены в период акции: с 22.06.2026 по 31.08.2026" },
                { icon: "📞", text: "Подтвердите участие у менеджера по телефону +7 (999) 323-18-17 или 57-18-17" },
                { icon: "🎟️", text: "Участие гарантировано при выполнении всех условий и подтверждении у менеджера" },
                { icon: "🎯", text: "Победитель определяется случайным образом 1 ноября 2026 года" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm">Об участии и подробностях</p>
                <p className="text-amber-700 text-sm mt-1">Уточняйте у менеджера по телефону:</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a href="tel:+79993231817" className="font-bold text-amber-800 hover:underline">+7 (999) 323-18-17</a>
                  <span className="text-amber-600">/</span>
                  <a href="tel:+73852571817" className="font-bold text-amber-800 hover:underline">57-18-17</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Частые вопросы</h2>
            <div className="space-y-3">
              {faq.map((item, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                  <p className="font-semibold text-gray-900 mb-2 text-sm">{item.q}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-3">Стань участником розыгрыша</h2>
            <p className="text-gray-300 mb-8">Запишитесь на ремонт прямо сейчас и получите шанс выиграть iPhone 17</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="tel:+79993231817"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 text-gray-900 font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30">
                <Phone className="w-4 h-4" /> +7 (999) 323-18-17
              </a>
              <a href="/calculator"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all border border-white/20">
                Рассчитать ремонт →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <FooterSection />
    </div>
  )
}
