import { useParams } from "react-router-dom"
import { devices } from "@/data/devices"
import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"
import { useState } from "react"

export default function DevicePage() {
  const { brandSlug } = useParams()
  const brand = devices.find((d) => d.slug === brandSlug)
  const [expandedModel, setExpandedModel] = useState<string | null>(null)

  if (!brand) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <main className="pt-24 pb-20 px-6 text-center">
          <h1 className="text-2xl text-zinc-100 font-bold">Устройство не найдено</h1>
          <a href="/" className="text-zinc-400 hover:text-zinc-200 mt-4 inline-block">На главную</a>
        </main>
        <FooterSection />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title={brand.seoTitle} description={brand.seoDescription} />
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-10"
          >
            <Icon name="ArrowLeft" size={16} />
            На главную
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <div className="relative rounded-2xl overflow-hidden mb-8 h-48 md:h-64">
              <img
                src={brand.image}
                alt={`Ремонт ${brand.name}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-2">Услуги</p>
                <h1 className="font-display text-3xl md:text-5xl font-bold text-zinc-100">
                  Ремонт {brand.name}
                </h1>
              </div>
            </div>

            <p className="text-zinc-500 text-lg max-w-2xl">{brand.seoDescription}</p>

            <div className="flex flex-wrap gap-3 mt-6">
              {[
                { icon: "Shield", text: "Гарантия 365 дней" },
                { icon: "Clock", text: "Ремонт за 1–2 часа" },
                { icon: "Phone", text: "Бесплатная диагностика" },
              ].map(({ icon, text }) => (
                <div key={text} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-400">
                  <Icon name={icon} size={16} />
                  {text}
                </div>
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {brand.models.map((model, gi) => {
              const isExpanded = expandedModel === model.slug
              return (
                <motion.div
                  key={model.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: gi * 0.05 }}
                  className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedModel(isExpanded ? null : model.slug)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-800/20 transition-colors"
                  >
                    <div className="text-left">
                      <h2 className="font-heading font-semibold text-zinc-200 text-base">{model.name}</h2>
                      <p className="text-xs text-zinc-500 mt-1">Модели: {model.modelNumbers} · {model.year} г.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-500 hidden sm:block">
                        {model.services.length} услуг
                      </span>
                      <Icon
                        name="ChevronDown"
                        size={18}
                        className={`text-zinc-500 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-zinc-800/50"
                    >
                      <div className="divide-y divide-zinc-800/40">
                        {model.services.map((item, ii) => (
                          <div
                            key={ii}
                            className="flex items-center justify-between px-6 py-3.5 hover:bg-zinc-800/20 transition-colors"
                          >
                            <span className="text-zinc-400 text-sm">{item.name}</span>
                            <span className="text-zinc-200 font-medium text-sm tabular-nums">{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="px-6 py-3 bg-zinc-900/60">
                        <a
                          href={`/device/${brand.slug}/${model.slug}`}
                          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
                        >
                          Подробнее о ремонте {model.name}
                          <Icon name="ArrowRight" size={14} />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 text-center"
          >
            <p className="text-zinc-500 mb-6">Не нашли свою модель? Позвоните — уточним стоимость.</p>
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
