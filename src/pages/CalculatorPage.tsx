import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"
import Icon from "@/components/ui/icon"

const catalog = [
  {
    brand: "iPhone",
    models: [
      { name: "iPhone 17 Pro Max", services: [{ name: "Замена экрана", price: 12500 }, { name: "Замена аккумулятора", price: 4500 }, { name: "Попадание воды", price: 5500 }, { name: "Замена камеры", price: 8500 }, { name: "Ремонт разъёма", price: 3500 }] },
      { name: "iPhone 17 Pro", services: [{ name: "Замена экрана", price: 11500 }, { name: "Замена аккумулятора", price: 4200 }, { name: "Попадание воды", price: 5000 }, { name: "Замена камеры", price: 7500 }, { name: "Ремонт разъёма", price: 3200 }] },
      { name: "iPhone 17", services: [{ name: "Замена экрана", price: 9500 }, { name: "Замена аккумулятора", price: 3800 }, { name: "Попадание воды", price: 4500 }, { name: "Замена камеры", price: 6000 }, { name: "Ремонт разъёма", price: 2800 }] },
      { name: "iPhone 16 Pro Max", services: [{ name: "Замена экрана", price: 9500 }, { name: "Замена аккумулятора", price: 3800 }, { name: "Попадание воды", price: 5000 }, { name: "Замена камеры", price: 7000 }, { name: "Ремонт разъёма", price: 3000 }] },
      { name: "iPhone 16 Pro", services: [{ name: "Замена экрана", price: 8500 }, { name: "Замена аккумулятора", price: 3500 }, { name: "Попадание воды", price: 4500 }, { name: "Замена камеры", price: 6500 }, { name: "Ремонт разъёма", price: 2800 }] },
      { name: "iPhone 16", services: [{ name: "Замена экрана", price: 7500 }, { name: "Замена аккумулятора", price: 3200 }, { name: "Попадание воды", price: 4000 }, { name: "Замена камеры", price: 5500 }, { name: "Ремонт разъёма", price: 2500 }] },
      { name: "iPhone 15 Pro Max", services: [{ name: "Замена экрана", price: 8000 }, { name: "Замена аккумулятора", price: 3200 }, { name: "Попадание воды", price: 4500 }, { name: "Замена камеры", price: 6500 }, { name: "Ремонт разъёма", price: 2500 }] },
      { name: "iPhone 15 / 15 Pro", services: [{ name: "Замена экрана", price: 6500 }, { name: "Замена аккумулятора", price: 2800 }, { name: "Попадание воды", price: 3500 }, { name: "Замена камеры", price: 5500 }, { name: "Ремонт разъёма", price: 2000 }] },
      { name: "iPhone 14 Pro Max", services: [{ name: "Замена экрана", price: 7000 }, { name: "Замена аккумулятора", price: 2800 }, { name: "Попадание воды", price: 4000 }, { name: "Замена камеры", price: 5500 }, { name: "Ремонт разъёма", price: 2200 }] },
      { name: "iPhone 14 / 14 Pro", services: [{ name: "Замена экрана", price: 5500 }, { name: "Замена аккумулятора", price: 2500 }, { name: "Попадание воды", price: 3000 }, { name: "Замена камеры", price: 4500 }, { name: "Ремонт разъёма", price: 1800 }] },
      { name: "iPhone 13 / 13 Pro Max", services: [{ name: "Замена экрана", price: 4500 }, { name: "Замена аккумулятора", price: 2000 }, { name: "Попадание воды", price: 2500 }, { name: "Замена камеры", price: 3500 }, { name: "Ремонт разъёма", price: 1500 }] },
      { name: "iPhone 12 / 12 Pro", services: [{ name: "Замена экрана", price: 3500 }, { name: "Замена аккумулятора", price: 1600 }, { name: "Попадание воды", price: 2000 }, { name: "Замена камеры", price: 2800 }, { name: "Ремонт разъёма", price: 1200 }] },
      { name: "iPhone 11 / XS Max", services: [{ name: "Замена экрана", price: 2200 }, { name: "Замена аккумулятора", price: 1300 }, { name: "Попадание воды", price: 1800 }, { name: "Замена камеры", price: 2200 }, { name: "Ремонт разъёма", price: 1000 }] },
    ],
  },
  {
    brand: "Samsung",
    models: [
      { name: "Galaxy S25 Ultra", services: [{ name: "Замена экрана", price: 14000 }, { name: "Замена аккумулятора", price: 3500 }, { name: "Попадание воды", price: 5000 }, { name: "Замена камеры", price: 7000 }, { name: "Ремонт разъёма", price: 2500 }] },
      { name: "Galaxy S25 / S25+", services: [{ name: "Замена экрана", price: 9000 }, { name: "Замена аккумулятора", price: 2800 }, { name: "Попадание воды", price: 4000 }, { name: "Замена камеры", price: 5000 }, { name: "Ремонт разъёма", price: 2000 }] },
      { name: "Galaxy S24 Ultra", services: [{ name: "Замена экрана", price: 12000 }, { name: "Замена аккумулятора", price: 3200 }, { name: "Попадание воды", price: 4500 }, { name: "Замена камеры", price: 6500 }, { name: "Ремонт разъёма", price: 2200 }] },
      { name: "Galaxy S24 / S23", services: [{ name: "Замена экрана", price: 7000 }, { name: "Замена аккумулятора", price: 2200 }, { name: "Попадание воды", price: 3000 }, { name: "Замена камеры", price: 4000 }, { name: "Ремонт разъёма", price: 1500 }] },
      { name: "Galaxy A55 / A54", services: [{ name: "Замена экрана", price: 4000 }, { name: "Замена аккумулятора", price: 1500 }, { name: "Попадание воды", price: 2200 }, { name: "Замена камеры", price: 2500 }, { name: "Ремонт разъёма", price: 1000 }] },
      { name: "Galaxy Z Fold5", services: [{ name: "Замена внутреннего экрана", price: 25000 }, { name: "Замена аккумулятора", price: 4000 }, { name: "Попадание воды", price: 6000 }, { name: "Ремонт петли", price: 8000 }] },
      { name: "Galaxy Z Flip5", services: [{ name: "Замена внутреннего экрана", price: 18000 }, { name: "Замена аккумулятора", price: 3500 }, { name: "Попадание воды", price: 5000 }, { name: "Ремонт петли", price: 6500 }] },
    ],
  },
  {
    brand: "Xiaomi / Redmi / POCO",
    models: [
      { name: "Xiaomi 15 Pro", services: [{ name: "Замена экрана", price: 9000 }, { name: "Замена аккумулятора", price: 2800 }, { name: "Попадание воды", price: 4000 }, { name: "Замена камеры", price: 5500 }, { name: "Ремонт разъёма", price: 1800 }] },
      { name: "Xiaomi 14 Ultra", services: [{ name: "Замена экрана", price: 8500 }, { name: "Замена аккумулятора", price: 2500 }, { name: "Попадание воды", price: 3800 }, { name: "Замена камеры", price: 5000 }, { name: "Ремонт разъёма", price: 1600 }] },
      { name: "Redmi Note 13 Pro", services: [{ name: "Замена экрана", price: 4000 }, { name: "Замена аккумулятора", price: 1500 }, { name: "Попадание воды", price: 2200 }, { name: "Замена камеры", price: 2500 }, { name: "Ремонт разъёма", price: 1000 }] },
      { name: "POCO X6 Pro / F6", services: [{ name: "Замена экрана", price: 4500 }, { name: "Замена аккумулятора", price: 1800 }, { name: "Попадание воды", price: 2500 }, { name: "Замена камеры", price: 3000 }, { name: "Ремонт разъёма", price: 1100 }] },
    ],
  },
  {
    brand: "iPad",
    models: [
      { name: "iPad Pro 13\" M4", services: [{ name: "Замена экрана", price: 18000 }, { name: "Замена аккумулятора", price: 5000 }, { name: "Попадание воды", price: 6000 }, { name: "Ремонт разъёма", price: 3500 }] },
      { name: "iPad Pro 11\" M4", services: [{ name: "Замена экрана", price: 15000 }, { name: "Замена аккумулятора", price: 4500 }, { name: "Попадание воды", price: 5500 }, { name: "Ремонт разъёма", price: 3200 }] },
      { name: "iPad Air M2", services: [{ name: "Замена экрана", price: 10000 }, { name: "Замена аккумулятора", price: 3500 }, { name: "Попадание воды", price: 4500 }, { name: "Ремонт разъёма", price: 2500 }] },
      { name: "iPad 10 / mini 7", services: [{ name: "Замена экрана", price: 7500 }, { name: "Замена аккумулятора", price: 3000 }, { name: "Попадание воды", price: 3500 }, { name: "Ремонт разъёма", price: 2000 }] },
    ],
  },
  {
    brand: "MacBook",
    models: [
      { name: "MacBook Pro 16\" M4", services: [{ name: "Замена экрана", price: 35000 }, { name: "Замена аккумулятора", price: 12000 }, { name: "Восстановление после залития", price: 15000 }, { name: "Замена клавиатуры", price: 8000 }, { name: "Замена SSD", price: 5000 }] },
      { name: "MacBook Pro 14\" M4", services: [{ name: "Замена экрана", price: 28000 }, { name: "Замена аккумулятора", price: 10000 }, { name: "Восстановление после залития", price: 12000 }, { name: "Замена клавиатуры", price: 7000 }, { name: "Замена SSD", price: 4500 }] },
      { name: "MacBook Air 15\" M3", services: [{ name: "Замена экрана", price: 22000 }, { name: "Замена аккумулятора", price: 8000 }, { name: "Восстановление после залития", price: 10000 }, { name: "Замена клавиатуры", price: 6000 }, { name: "Замена SSD", price: 4000 }] },
      { name: "MacBook Air 13\" M3/M2", services: [{ name: "Замена экрана", price: 16000 }, { name: "Замена аккумулятора", price: 6500 }, { name: "Восстановление после залития", price: 8000 }, { name: "Замена клавиатуры", price: 5000 }, { name: "Замена SSD", price: 3200 }] },
      { name: "MacBook Air 13\" M1", services: [{ name: "Замена экрана", price: 12000 }, { name: "Замена аккумулятора", price: 5000 }, { name: "Восстановление после залития", price: 7000 }, { name: "Замена клавиатуры", price: 4000 }, { name: "Замена SSD", price: 2800 }] },
    ],
  },
  {
    brand: "Apple Watch / AirPods",
    models: [
      { name: "Apple Watch Ultra 2", services: [{ name: "Замена экрана", price: 12000 }, { name: "Замена аккумулятора", price: 5000 }, { name: "Восстановление после воды", price: 5500 }] },
      { name: "Apple Watch Series 9/10", services: [{ name: "Замена экрана", price: 7000 }, { name: "Замена аккумулятора", price: 3500 }, { name: "Восстановление после воды", price: 4000 }] },
      { name: "AirPods Pro 2", services: [{ name: "Замена аккумулятора наушника", price: 2000 }, { name: "Замена аккумулятора кейса", price: 2500 }, { name: "Чистка", price: 800 }] },
    ],
  },
]

export default function CalculatorPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const brandData = catalog.find((b) => b.brand === selectedBrand)
  const modelData = brandData?.models.find((m) => m.name === selectedModel)

  const toggleService = (svc: string) => {
    setSelectedServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    )
  }

  const total = modelData?.services
    .filter((s) => selectedServices.includes(s.name))
    .reduce((sum, s) => sum + s.price, 0) ?? 0

  const handleSubmit = () => {
    if (name && phone) setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead
        title="Калькулятор стоимости ремонта — iPro Барнаул"
        description="Рассчитайте стоимость ремонта iPhone, Samsung, MacBook, iPad онлайн. Точная цена под ключ — запчасть + работа. Бесплатная диагностика."
      />
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
              <Icon name="Calculator" size={16} className="text-zinc-400" />
              <span className="text-sm text-zinc-400">Бесплатный расчёт</span>
            </div>
            <h1 className="font-display text-4xl font-bold text-zinc-100 mb-3">Калькулятор ремонта</h1>
            <p className="text-zinc-500">Выберите устройство и виды работ — получите точную цену под ключ</p>
          </motion.div>

          {/* Steps */}
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${step >= s ? "bg-zinc-100 text-zinc-900" : "bg-zinc-800 text-zinc-500"}`}>
                  {s}
                </div>
                <span className={`text-xs hidden sm:block ${step >= s ? "text-zinc-300" : "text-zinc-600"}`}>
                  {s === 1 ? "Устройство" : s === 2 ? "Услуги" : "Заявка"}
                </span>
                {s < 3 && <div className={`flex-1 h-px ${step > s ? "bg-zinc-600" : "bg-zinc-800"}`} />}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1 — Выбор устройства */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 mb-4">
                  <h2 className="font-heading font-semibold text-zinc-200 mb-4">Выберите бренд</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {catalog.map((b) => (
                      <button
                        key={b.brand}
                        onClick={() => { setSelectedBrand(b.brand); setSelectedModel(null); setSelectedServices([]) }}
                        className={`px-4 py-3 rounded-xl text-sm text-left transition-all border ${selectedBrand === b.brand ? "bg-zinc-100 text-zinc-900 border-zinc-100 font-medium" : "bg-zinc-800/40 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800/80 hover:text-zinc-200"}`}
                      >
                        {b.brand}
                      </button>
                    ))}
                  </div>
                </div>

                {brandData && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 mb-4">
                    <h2 className="font-heading font-semibold text-zinc-200 mb-4">Выберите модель</h2>
                    <div className="grid grid-cols-1 gap-2">
                      {brandData.models.map((m) => (
                        <button
                          key={m.name}
                          onClick={() => { setSelectedModel(m.name); setSelectedServices([]) }}
                          className={`px-4 py-3 rounded-xl text-sm text-left transition-all border ${selectedModel === m.name ? "bg-zinc-100 text-zinc-900 border-zinc-100 font-medium" : "bg-zinc-800/40 text-zinc-400 border-zinc-700/50 hover:bg-zinc-800/80 hover:text-zinc-200"}`}
                        >
                          {m.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <button
                  onClick={() => setStep(2)}
                  disabled={!selectedModel}
                  className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-30"
                >
                  Далее — выбрать услуги
                </button>
              </motion.div>
            )}

            {/* Step 2 — Выбор услуг */}
            {step === 2 && modelData && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 mb-4">
                  <h2 className="font-heading font-semibold text-zinc-200 mb-1">Выберите виды ремонта</h2>
                  <p className="text-zinc-500 text-xs mb-4">{selectedModel} — цены под ключ (запчасть + работа)</p>
                  <div className="space-y-2">
                    {modelData.services.map((svc) => {
                      const checked = selectedServices.includes(svc.name)
                      return (
                        <button
                          key={svc.name}
                          onClick={() => toggleService(svc.name)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all border ${checked ? "bg-zinc-100 text-zinc-900 border-zinc-100" : "bg-zinc-800/40 text-zinc-300 border-zinc-700/50 hover:bg-zinc-800/80"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${checked ? "bg-zinc-900" : "bg-zinc-700"}`}>
                              {checked && <Icon name="Check" size={12} className="text-zinc-100" />}
                            </div>
                            <span>{svc.name}</span>
                          </div>
                          <span className="font-semibold tabular-nums">{svc.price.toLocaleString("ru-RU")} ₽</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Total */}
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/60 p-5 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-zinc-400 text-sm">Итоговая стоимость</p>
                      <p className="text-xs text-zinc-600 mt-0.5">+ бесплатная диагностика</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-3xl font-bold text-zinc-100">
                        {total > 0 ? `${total.toLocaleString("ru-RU")} ₽` : "0 ₽"}
                      </p>
                      {selectedServices.length > 0 && (
                        <p className="text-xs text-green-400 mt-0.5">+{Math.round(total * 0.05)} бонусов</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors">
                    Назад
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={selectedServices.length === 0}
                    className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors disabled:opacity-30"
                  >
                    Оставить заявку
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Заявка */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {!submitted ? (
                  <>
                    <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6 mb-4">
                      <h2 className="font-heading font-semibold text-zinc-200 mb-4">Ваши данные</h2>

                      <div className="rounded-xl bg-zinc-800/40 border border-zinc-700/30 p-4 mb-5">
                        <p className="text-sm font-medium text-zinc-300 mb-2">{selectedModel}</p>
                        {selectedServices.map((s) => (
                          <div key={s} className="flex justify-between text-sm text-zinc-500 py-0.5">
                            <span>{s}</span>
                            <span>{modelData?.services.find((sv) => sv.name === s)?.price.toLocaleString("ru-RU")} ₽</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold text-zinc-200 border-t border-zinc-700/30 mt-3 pt-3">
                          <span>Итого</span>
                          <span>{total.toLocaleString("ru-RU")} ₽</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors" />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep(2)} className="px-5 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors">
                        Назад
                      </button>
                      <button onClick={handleSubmit} disabled={!name || !phone} className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-30">
                        Отправить заявку
                      </button>
                    </div>
                  </>
                ) : (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                      <Icon name="CheckCircle" size={32} className="text-green-400" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-zinc-100 mb-2">Заявка отправлена!</h2>
                    <p className="text-zinc-500 mb-2">Мы перезвоним вам в течение 15 минут</p>
                    <p className="text-zinc-600 text-sm mb-6">Предварительная стоимость: <span className="text-zinc-300 font-medium">{total.toLocaleString("ru-RU")} ₽</span></p>
                    <a href="tel:+79993231817">
                      <LiquidCtaButton>Позвонить сразу</LiquidCtaButton>
                    </a>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
