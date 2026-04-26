import { useParams } from "react-router-dom"
import { devices } from "@/data/devices"
import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { Breadcrumb } from "@/components/Breadcrumb"
import { RepairRequestForm } from "@/components/RepairRequestForm"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

export default function DeviceModelPage() {
  const { brandSlug, modelSlug } = useParams()
  const brand = devices.find((d) => d.slug === brandSlug)
  const model = brand?.models.find((m) => m.slug === modelSlug)

  if (!brand || !model) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pb-20 px-6 text-center">
          <h1 className="text-2xl text-gray-900 font-bold">Модель не найдена</h1>
          <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">На главную</a>
        </main>
        <FooterSection />
      </div>
    )
  }

  const seoTitle = `Ремонт ${model.name} в Барнауле — замена экрана, аккумулятора | iPro`
  const seoDesc = `Ремонт ${model.name} (${model.modelNumbers}) в Барнауле ✓ ${model.services[0]?.name} ${model.services[0]?.price} ✓ Гарантия до 365 дней ✓ Бесплатная диагностика`
  const otherModels = brand.models.filter((m) => m.slug !== model.slug).slice(0, 6)

  const allServices = [
    ...model.services,
    { name: "Замена динамика / микрофона", price: "от 1 490 ₽", priceNum: 1490 },
    { name: "Замена кнопки питания / громкости", price: "от 890 ₽", priceNum: 890 },
    { name: "Ремонт Face ID / Touch ID", price: "от 2 490 ₽", priceNum: 2490 },
    { name: "Замена SIM-лотка", price: "от 490 ₽", priceNum: 490 },
    { name: "Восстановление данных", price: "от 2 990 ₽", priceNum: 2990 },
    { name: "Пайка материнской платы", price: "от 3 990 ₽", priceNum: 3990 },
    { name: "Бесплатная диагностика", price: "0 ₽ (бесплатно)", priceNum: 0 },
  ]

  return (
    <div className="min-h-screen bg-white">
      <SEOHead title={seoTitle} description={seoDesc} />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "Ремонт", href: `/device/${brand.slug}` },
              { label: brand.name, href: `/device/${brand.slug}` },
              { label: model.name },
            ]} />
            <div className="mt-8 grid md:grid-cols-2 gap-10 items-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{brand.name} · {model.year}</span>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3 tracking-tight">
                  Ремонт {model.name}
                </h1>
                <p className="text-gray-500 text-sm mb-5">Модели: {model.modelNumbers}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { icon: "Shield", text: "Гарантия до 365 дней" },
                    { icon: "Clock", text: "Ремонт за 1–2 часа" },
                    { icon: "Stethoscope", text: "Диагностика бесплатно" },
                    { icon: "Car", text: "Бесплатная доставка" },
                  ].map(({ icon, text }) => (
                    <div key={text} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs text-gray-600 shadow-sm">
                      <Icon name={icon} size={13} className="text-blue-500" />
                      {text}
                    </div>
                  ))}
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-blue-600">от {model.services[0]?.priceNum?.toLocaleString("ru")} ₽</span>
                  <span className="text-gray-400 text-sm">за {model.services[0]?.name?.toLowerCase()}</span>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
                <img
                  src={brand.image}
                  alt={`Ремонт ${model.name}`}
                  className="w-full h-64 md:h-80 object-cover rounded-3xl shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1fr_380px] gap-10">
              {/* Left */}
              <div>
                {/* Services table */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8"
                >
                  <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <h2 className="font-semibold text-lg">Прайс-лист — {model.name}</h2>
                    <p className="text-blue-100 text-xs mt-1">Цены под ключ: запчасть + работа · г. Барнаул 2026</p>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {allServices.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.03 }}
                        className="flex items-center justify-between px-6 py-4 hover:bg-blue-50/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <Icon name="Wrench" size={14} className="text-blue-600" />
                          </div>
                          <span className="text-gray-800 text-sm font-medium">{item.name}</span>
                        </div>
                        <span className={`font-bold text-sm tabular-nums ${item.priceNum === 0 ? "text-green-600" : "text-gray-900"}`}>
                          {item.price}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      * Точная стоимость определяется после бесплатной диагностики. Диагностика проводится при вас.
                    </p>
                  </div>
                </motion.div>

                {/* Why us */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {[
                    { icon: "Droplets", title: "Попала вода?", desc: "Немедленно выключите и привезите к нам. Чем быстрее — тем выше шанс спасти устройство." },
                    { icon: "BadgeCheck", title: "Оригинальные запчасти", desc: "Сертифицированные комплектующие. Гарантия на каждую деталь до 365 дней." },
                    { icon: "Zap", title: "Ремонт при вас", desc: "Большинство ремонтов — 1–2 часа. Ждите в нашем уютном зале с кофе." },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                      <Icon name={icon} size={22} className="text-blue-600 mb-3" />
                      <h3 className="font-semibold text-gray-900 text-sm mb-1.5">{title}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>

                {/* Other models */}
                {otherModels.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg mb-4">Другие модели {brand.name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {otherModels.map((m) => (
                        <a
                          key={m.slug}
                          href={`/device/${brand.slug}/${m.slug}`}
                          className="flex items-center justify-between px-4 py-3.5 rounded-2xl border border-gray-100 bg-white hover:border-blue-200 hover:bg-blue-50 transition-all group"
                        >
                          <div>
                            <span className="text-sm text-gray-800 font-medium group-hover:text-blue-700">{m.name}</span>
                            <p className="text-xs text-gray-400">{m.year} · от {m.services[0]?.priceNum?.toLocaleString("ru")} ₽</p>
                          </div>
                          <Icon name="ChevronRight" size={16} className="text-gray-400 group-hover:text-blue-500" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Form */}
              <div className="lg:sticky lg:top-24 self-start">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <RepairRequestForm
                    deviceBrand={brand.name}
                    deviceModel={model.name}
                    serviceName={model.services[0]?.name}
                    servicePrice={model.services[0]?.priceNum}
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href="tel:+79993231817"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-gray-200 text-gray-700 text-sm font-medium hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    <Icon name="Phone" size={16} />
                    +7 (999) 323-18-17
                  </a>
                  <a
                    href="/calculator"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-50 text-gray-600 text-sm font-medium hover:bg-gray-100 transition-all border border-gray-100"
                  >
                    <Icon name="Calculator" size={16} />
                    Рассчитать точную цену
                  </a>
                </div>

                {/* Guarantees */}
                <div className="mt-4 bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-sm font-semibold text-blue-900 mb-2">Наши гарантии</p>
                  <div className="flex flex-col gap-1.5">
                    {[
                      "Диагностика 0 ₽, даже при отказе",
                      "Гарантия на ремонт 365 дней",
                      "Оригинальные запчасти",
                      "Видеозапись всего процесса",
                      "Бесплатная доставка по Барнаулу",
                    ].map((g) => (
                      <div key={g} className="flex items-center gap-2 text-xs text-blue-700">
                        <Icon name="CheckCircle" size={13} className="text-blue-500 shrink-0" />
                        {g}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Other device block */}
                <div className="mt-4 bg-amber-50 rounded-2xl p-4 border border-amber-100">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Другое устройство или вопрос?</p>
                  <p className="text-xs text-amber-700 mb-3">
                    Оставьте заявку — мы перезвоним в течение 15 минут и ответим на любой вопрос.
                  </p>
                  <a
                    href="tel:+79993231817"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-600 transition-colors"
                  >
                    <Icon name="Phone" size={14} />
                    +7 (999) 323-18-17
                  </a>
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