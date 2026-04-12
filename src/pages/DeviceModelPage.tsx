import { useParams } from "react-router-dom"
import { devices } from "@/data/devices"
import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"

export default function DeviceModelPage() {
  const { brandSlug, modelSlug } = useParams()
  const brand = devices.find((d) => d.slug === brandSlug)
  const model = brand?.models.find((m) => m.slug === modelSlug)

  if (!brand || !model) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <main className="pt-24 pb-20 px-6 text-center">
          <h1 className="text-2xl text-zinc-100 font-bold">Модель не найдена</h1>
          <a href="/" className="text-zinc-400 hover:text-zinc-200 mt-4 inline-block">На главную</a>
        </main>
        <FooterSection />
      </div>
    )
  }

  const seoTitle = `Ремонт ${model.name} в Барнауле — замена экрана, аккумулятора | iPro`
  const seoDesc = `Ремонт ${model.name} (${model.modelNumbers}) в Барнауле ✓ ${model.services[0]?.name} ${model.services[0]?.price} ✓ Гарантия 365 дней ✓ Бесплатная диагностика`

  const otherModels = brand.models.filter((m) => m.slug !== model.slug).slice(0, 4)

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title={seoTitle} description={seoDesc} />
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.a
            href={`/device/${brand.slug}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-10"
          >
            <Icon name="ArrowLeft" size={16} />
            Все модели {brand.name}
          </motion.a>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="rounded-2xl overflow-hidden border border-zinc-800/50">
                <img
                  src={brand.image}
                  alt={`Ремонт ${model.name}`}
                  className="w-full h-64 object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">
                {brand.name} · {model.year}
              </p>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
                Ремонт {model.name}
              </h1>
              <p className="text-zinc-500 text-sm mb-4">
                Модели: {model.modelNumbers}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { icon: "Shield", text: "Гарантия 365 дней" },
                  { icon: "Clock", text: "Ремонт за 1–2 часа" },
                  { icon: "Phone", text: "Бесплатная диагностика" },
                ].map(({ icon, text }) => (
                  <div key={text} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400">
                    <Icon name={icon} size={14} />
                    {text}
                  </div>
                ))}
              </div>

              <a href="tel:+79993231817">
                <LiquidCtaButton>Записаться на ремонт</LiquidCtaButton>
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden mb-12"
          >
            <div className="px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/60">
              <h2 className="font-heading font-semibold text-zinc-200 text-base">
                Услуги и цены — {model.name}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">Цены указаны под ключ (запчасть + работа)</p>
            </div>
            <div className="divide-y divide-zinc-800/40">
              {model.services.map((item, ii) => (
                <div
                  key={ii}
                  className="flex items-center justify-between px-6 py-4 hover:bg-zinc-800/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon name="Wrench" size={16} className="text-zinc-600" />
                    <span className="text-zinc-300 text-sm">{item.name}</span>
                  </div>
                  <span className="text-zinc-100 font-semibold text-sm tabular-nums">{item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          >
            {[
              {
                icon: "Droplets",
                title: "Попала вода?",
                desc: "Немедленно выключите устройство и принесите к нам. Чем быстрее — тем выше шанс восстановления.",
              },
              {
                icon: "ShieldCheck",
                title: "Оригинальные запчасти",
                desc: "Используем сертифицированные комплектующие с гарантией качества до 365 дней.",
              },
              {
                icon: "Zap",
                title: "Ремонт при вас",
                desc: "Большинство ремонтов выполняем за 1-2 часа. Вы можете подождать в зоне ожидания.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                <Icon name={icon} size={24} className="text-zinc-500 mb-3" />
                <h3 className="font-heading font-semibold text-zinc-200 text-sm mb-2">{title}</h3>
                <p className="text-zinc-500 text-xs">{desc}</p>
              </div>
            ))}
          </motion.div>

          {otherModels.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mb-12"
            >
              <h3 className="font-heading font-semibold text-zinc-200 text-lg mb-4">
                Другие модели {brand.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {otherModels.map((m) => (
                  <a
                    key={m.slug}
                    href={`/device/${brand.slug}/${m.slug}`}
                    className="flex items-center justify-between px-5 py-4 rounded-xl border border-zinc-800/50 bg-zinc-900/40 hover:bg-zinc-800/40 transition-colors group"
                  >
                    <div>
                      <span className="text-sm text-zinc-200 group-hover:text-zinc-100">{m.name}</span>
                      <p className="text-xs text-zinc-500">{m.year} · {m.modelNumbers}</p>
                    </div>
                    <Icon name="ChevronRight" size={16} className="text-zinc-600 group-hover:text-zinc-400" />
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-zinc-500 mb-6">Нужна консультация? Позвоните — ответим на любые вопросы.</p>
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
