import { useParams } from "react-router-dom"
import { devices } from "@/data/devices"
import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { Breadcrumb } from "@/components/Breadcrumb"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { useState } from "react"

export default function DevicePage() {
  const { brandSlug } = useParams()
  const brand = devices.find((d) => d.slug === brandSlug)
  const [expandedModel, setExpandedModel] = useState<string | null>(null)

  if (!brand) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pb-20 px-6 text-center">
          <h1 className="text-2xl text-gray-900 font-bold">Устройство не найдено</h1>
          <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">На главную</a>
        </main>
        <FooterSection />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title={brand.seoTitle} description={brand.seoDescription} />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="relative h-52 md:h-72">
            <img
              src={brand.image}
              alt={`Ремонт ${brand.name}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
              <div className="max-w-6xl mx-auto">
                <Breadcrumb items={[{ label: `Ремонт ${brand.name}` }]} />
                <h1 className="font-display text-3xl md:text-5xl font-bold text-white mt-3 tracking-tight">
                  Ремонт {brand.name}
                </h1>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            {/* Description + stats */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <p className="text-gray-600 text-base max-w-3xl mb-6">{brand.seoDescription}</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: "Shield", text: "Гарантия 365 дней" },
                  { icon: "Clock", text: "Ремонт за 1–2 часа" },
                  { icon: "Stethoscope", text: "Диагностика 0 ₽" },
                  { icon: "Car", text: "Доставка по Барнаулу" },
                  { icon: "BadgeCheck", text: "Оригинальные запчасти" },
                ].map(({ icon, text }) => (
                  <div key={text} className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-700">
                    <Icon name={icon} size={14} className="text-blue-500" />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Models list */}
            <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
              <div className="space-y-2">
                {brand.models.map((model, gi) => {
                  const isExpanded = expandedModel === model.slug
                  return (
                    <motion.div
                      key={model.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: gi * 0.04 }}
                      className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <button
                        onClick={() => setExpandedModel(isExpanded ? null : model.slug)}
                        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="text-left">
                          <h2 className="font-semibold text-gray-900 text-base">{model.name}</h2>
                          <p className="text-xs text-gray-400 mt-0.5">{model.year} · {model.modelNumbers}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-blue-600 font-semibold text-sm hidden sm:block">
                            от {model.services[0]?.priceNum?.toLocaleString("ru")} ₽
                          </span>
                          <Icon
                            name="ChevronDown"
                            size={18}
                            className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border-t border-gray-100 overflow-hidden"
                          >
                            <div className="divide-y divide-gray-50">
                              {model.services.map((item, ii) => (
                                <div
                                  key={ii}
                                  className="flex items-center justify-between px-5 py-3 hover:bg-blue-50/50 transition-colors"
                                >
                                  <span className="text-gray-700 text-sm">{item.name}</span>
                                  <span className="text-gray-900 font-semibold text-sm tabular-nums">{item.price}</span>
                                </div>
                              ))}
                            </div>
                            <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
                              <a
                                href={`/device/${brand.slug}/${model.slug}`}
                                className="text-sm text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5 font-medium"
                              >
                                Подробнее — прайс и заявка
                                <Icon name="ArrowRight" size={14} />
                              </a>
                              <a
                                href={`/device/${brand.slug}/${model.slug}`}
                                className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                              >
                                Записаться
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </div>

              {/* Sidebar CTA */}
              <div className="lg:sticky lg:top-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white mb-4">
                  <h3 className="font-bold text-xl mb-1">Не нашли модель?</h3>
                  <p className="text-blue-100 text-sm mb-1">У вас другое устройство или вопрос?</p>
                  <p className="text-blue-200 text-xs mb-5">Оставьте заявку — перезвоним в течение 15 минут</p>
                  <a
                    href="tel:+79993231817"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-white text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors"
                  >
                    <Icon name="Phone" size={16} />
                    +7 (999) 323-18-17
                  </a>
                  <a
                    href="/calculator"
                    className="flex items-center justify-center gap-2 w-full mt-2 py-3 rounded-2xl bg-blue-500/30 text-white text-sm font-medium hover:bg-blue-500/50 transition-colors"
                  >
                    <Icon name="Calculator" size={15} />
                    Калькулятор ремонта
                  </a>
                </div>

                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <p className="text-sm font-semibold text-green-800 mb-2">Диагностика — 0 ₽</p>
                  <p className="text-xs text-green-700 leading-relaxed">
                    Бесплатная диагностика при любом результате. Даже если вы откажетесь от ремонта.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterSection />
    </div>
  )
}