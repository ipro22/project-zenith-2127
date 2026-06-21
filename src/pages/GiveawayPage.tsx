import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import { Phone, Gift, CheckCircle, Star, Trophy, Shield, Zap, Award } from "lucide-react"

const PRIZE_IMAGE = "https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/bucket/d818cd17-a1fc-4556-96ac-9243e84e2d83.png"

const prizes = [
  { place: "1", label: "iPhone 17", desc: "Флагманский смартфон Apple", emoji: "📱", color: "from-amber-400 to-orange-500", big: true },
  { place: "2", label: "Сертификат 10 000 ₽", desc: "На ремонт или покупку в iPro", emoji: "🎫", color: "from-slate-400 to-slate-600", big: false },
  { place: "3", label: "Сертификат 5 000 ₽", desc: "На ремонт или покупку в iPro", emoji: "🎫", color: "from-amber-600 to-yellow-700", big: false },
  { place: "4", label: "Сертификат 2 000 ₽", desc: "На ремонт или покупку в iPro", emoji: "🎟️", color: "from-blue-400 to-blue-600", big: false },
  { place: "5", label: "Сертификат 1 000 ₽", desc: "На ремонт или покупку в iPro", emoji: "🎟️", color: "from-green-400 to-green-600", big: false },
]

const steps = [
  { icon: CheckCircle, title: "Совершите ремонт или покупку", desc: "На сумму от 3 500 ₽ в нашем сервисном центре iPro", color: "bg-blue-50 text-blue-600", border: "border-blue-100" },
  { icon: Phone, title: "Уточните участие у менеджера", desc: "По телефону +7 (999) 323-18-17 или 57-18-17", color: "bg-green-50 text-green-600", border: "border-green-100" },
  { icon: Trophy, title: "Получите номер участника", desc: "Ваше участие гарантировано при выполнении всех условий", color: "bg-amber-50 text-amber-600", border: "border-amber-100" },
  { icon: Star, title: "Ждите розыгрыша 1 ноября", desc: "5 победителей определяются случайным образом", color: "bg-purple-50 text-purple-600", border: "border-purple-100" },
]

const faq = [
  { q: "Кто может участвовать?", a: "Любой клиент, совершивший ремонт или покупку от 3 500 ₽ в период с 22.06.2026 по 31.08.2026." },
  { q: "Сколько призовых мест?", a: "5 призовых мест: iPhone 17 и 4 сертификата на суммы 10 000 ₽, 5 000 ₽, 2 000 ₽ и 1 000 ₽." },
  { q: "Нужно ли регистрироваться?", a: "Да, уточните участие у менеджера по телефону +7 (999) 323-18-17 / 57-18-17. Без подтверждения участие не засчитывается." },
  { q: "Можно ли участвовать несколько раз?", a: "Да! Каждое обращение от 3 500 ₽ — отдельный шанс. Чем больше заказов, тем выше вероятность." },
  { q: "Когда объявят победителей?", a: "1 ноября 2026 года. Победители получат звонок и будут опубликованы в наших соцсетях." },
]

export default function GiveawayPage() {
  const startDate = new Date("2026-06-22")
  const endDate = new Date("2026-08-31")
  const drawDate = new Date("2026-11-01")
  const now = new Date()
  const isActive = now >= startDate && now <= endDate
  const isEnded = now > endDate
  const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Розыгрыш iPhone 17 и сертификатов — iPro Барнаул"
        description="🎁 АКЦИЯ НАЧАТА! Розыгрыш iPhone 17 + сертификаты 10 000/5 000/2 000/1 000 ₽. Совершите ремонт или покупку от 3 500 ₽. Акция 22.06–31.08.2026, розыгрыш 1 ноября."
      />
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] pt-14 pb-20 px-4">
        {/* Ambient glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[60px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[70px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          {/* Status badge */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8">
            {isActive && (
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-semibold">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                🎉 АКЦИЯ НАЧАТА! Осталось {daysLeft} дней
              </div>
            )}
            {isEnded && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-500/30 bg-gray-500/10 text-gray-400 text-sm font-semibold">
                Акция завершена · Розыгрыш 1 ноября 2026
              </div>
            )}
            {!isActive && !isEnded && (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-semibold">
                <Zap className="w-4 h-4" /> Акция скоро начнётся · 22.06.2026
              </div>
            )}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                Розыгрыш<br />
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">iPhone 17</span>
                <span className="text-white"> + призы</span>
              </h1>
              <p className="text-gray-300 text-[15px] leading-relaxed mb-7">
                Совершите ремонт или покупку от <strong className="text-white">3 500 ₽</strong> — и получите шанс выиграть iPhone 17 или один из сертификатов на сумму до 10 000 ₽
              </p>

              {/* Dates */}
              <div className="flex flex-wrap gap-3 mb-8">
                {[
                  { label: "Начало", value: "22.06.2026", active: true },
                  { label: "Конец", value: "31.08.2026", active: false },
                  { label: "Розыгрыш", value: "01.11.2026", active: false, highlight: true },
                ].map((d) => (
                  <div key={d.label}
                    className={`px-4 py-2.5 rounded-2xl text-center min-w-[90px] ${
                      d.highlight ? "bg-amber-500/20 border border-amber-500/40" :
                      d.active ? "bg-green-500/15 border border-green-500/30" :
                      "bg-white/8 border border-white/15"
                    }`}>
                    <p className={`text-lg font-bold ${d.highlight ? "text-amber-400" : d.active ? "text-green-400" : "text-white"}`}>{d.value}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{d.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a href="tel:+79993231817"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-500 text-gray-900 font-bold text-sm hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-0.5">
                  <Phone className="w-4 h-4" />+7 (999) 323-18-17
                </a>
                <a href="/calculator"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all border border-white/20">
                  Рассчитать ремонт →
                </a>
              </div>
            </motion.div>

            {/* Right — prizes visual */}
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center gap-4">
              {/* iPhone */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/30 to-orange-600/30 rounded-3xl blur-2xl scale-90" />
                <img src={PRIZE_IMAGE} alt="iPhone 17"
                  className="relative w-56 h-56 object-contain drop-shadow-2xl"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none"
                    const sib = e.currentTarget.nextElementSibling as HTMLElement
                    if (sib) sib.style.display = "flex"
                  }} />
                <div className="w-56 h-56 rounded-3xl bg-gradient-to-br from-gray-700 to-gray-800 items-center justify-center hidden">
                  <div className="text-center"><div className="text-5xl mb-2">📱</div><p className="text-white font-bold">iPhone 17</p></div>
                </div>
              </div>
              {/* Mini prize cards */}
              <div className="flex gap-2 flex-wrap justify-center">
                {[
                  { v: "10 000 ₽", c: "from-slate-500 to-slate-700" },
                  { v: "5 000 ₽", c: "from-amber-600 to-yellow-700" },
                  { v: "2 000 ₽", c: "from-blue-500 to-blue-700" },
                  { v: "1 000 ₽", c: "from-green-500 to-green-700" },
                ].map((c) => (
                  <div key={c.v}
                    className={`px-3 py-2 rounded-xl bg-gradient-to-r ${c.c} text-white text-center shadow-lg`}>
                    <p className="text-xs text-white/70 mb-0.5">Сертификат</p>
                    <p className="font-bold text-sm">{c.v}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ACTIVE STATUS BAR ── */}
      {isActive && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-3 px-4">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-white">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="font-bold text-sm">🎉 Акция идёт прямо сейчас!</span>
              <span className="text-green-100 text-sm">· До конца осталось {daysLeft} дн.</span>
            </div>
            <a href="tel:+79993231817"
              className="text-white font-bold text-sm hover:underline flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" /> Позвонить и уточнить участие
            </a>
          </div>
        </div>
      )}

      {/* ── PRIZES ── */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">5 призовых мест</h2>
            <p className="text-gray-500">Каждый участник претендует сразу на все призы</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {prizes.map((prize, i) => (
              <motion.div key={prize.place}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className={`relative rounded-3xl overflow-hidden text-white shadow-lg ${prize.big ? "md:col-span-2 md:row-span-1" : ""}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${prize.color}`} />
                <div className="relative p-5 flex flex-col gap-2 h-full">
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{prize.emoji}</span>
                    <span className="text-white/60 text-xs font-bold uppercase tracking-wider">{prize.place} место</span>
                  </div>
                  <p className="font-bold text-lg leading-tight mt-auto">{prize.label}</p>
                  <p className="text-white/75 text-xs">{prize.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Как участвовать</h2>
            <p className="text-gray-500">Всего 4 шага</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`bg-white rounded-3xl border ${s.border} shadow-sm p-6 relative`}
              >
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-900 text-white text-sm font-bold rounded-xl flex items-center justify-center shadow">{i + 1}</div>
                <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center mb-4`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONDITIONS ── */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Условия участия</h2>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3.5 mb-5">
              {[
                { e: "✅", t: "Совершите ремонт или покупку в iPro на сумму от 3 500 ₽" },
                { e: "📅", t: "Акция действует с 22.06.2026 по 31.08.2026 включительно" },
                { e: "📞", t: "Обязательно уточните участие у менеджера: +7 (999) 323-18-17 или 57-18-17" },
                { e: "🎟️", t: "Участие гарантировано при выполнении всех условий и подтверждении" },
                { e: "🎯", t: "Розыгрыш 5 призов состоится 1 ноября 2026 года случайным образом" },
                { e: "📢", t: "Победители будут уведомлены по телефону и опубликованы в соцсетях iPro" },
              ].map((item) => (
                <div key={item.t} className="flex items-start gap-3">
                  <span className="text-xl shrink-0">{item.e}</span>
                  <p className="text-gray-700 text-sm leading-relaxed">{item.t}</p>
                </div>
              ))}
            </div>
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 flex items-start gap-3">
              <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-800 text-sm mb-1">Об участии и подробностях</p>
                <p className="text-amber-700 text-sm">Уточняйте у менеджера по телефону:</p>
                <div className="flex flex-wrap gap-3 mt-2">
                  <a href="tel:+79993231817" className="font-bold text-amber-800 hover:underline text-sm">+7 (999) 323-18-17</a>
                  <span className="text-amber-400">/</span>
                  <a href="tel:+73852571817" className="font-bold text-amber-800 hover:underline text-sm">57-18-17</a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Часто задаваемые вопросы</h2>
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

      {/* ── CTA ── */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-900 via-[#1e293b] to-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-3">Стань участником прямо сейчас</h2>
            <p className="text-gray-300 mb-8">
              {isActive ? `Акция активна! Осталось ${daysLeft} дней. Не упусти шанс!` : "Запишись на ремонт и получи шанс выиграть iPhone 17 + сертификаты"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="tel:+79993231817"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-amber-500 text-gray-900 font-bold hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-0.5">
                <Phone className="w-4 h-4" /> +7 (999) 323-18-17
              </a>
              <a href="/calculator"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white font-semibold hover:bg-white/15 transition-all border border-white/20">
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
