import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const promos = [
  { icon: "Zap", text: "Диагностика БЕСПЛАТНО для всех устройств", sub: "Узнайте причину без оплаты" },
  { icon: "Gift", text: "Скидка 5% при повторном обращении", sub: "Накапливайте бонусы" },
  { icon: "Shield", text: "Гарантия 365 дней на все работы", sub: "Бесплатное гарантийное обслуживание" },
  { icon: "Clock", text: "Ремонт за 1-2 часа при вас", sub: "Ждите в нашем офисе" },
]

export function MarketingBanners() {
  const [current, setCurrent] = useState(0)
  const [showPromo, setShowPromo] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % promos.length), 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 10000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Ticker bar — светлый стиль */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 py-1.5 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center justify-center gap-3"
            >
              <Icon name={promos[current].icon} size={12} className="text-blue-200 shrink-0" />
              <span className="text-xs text-white font-medium">{promos[current].text}</span>
              <span className="text-xs text-blue-200 hidden sm:block">— {promos[current].sub}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Promo popup */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            className="fixed bottom-24 left-6 z-40 max-w-xs"
          >
            <div className="relative rounded-2xl bg-white border border-gray-100 shadow-2xl p-5">
              <button
                onClick={() => setShowPromo(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Icon name="X" size={14} />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Gift" size={18} className="text-yellow-500" />
                <span className="text-sm font-bold text-gray-900">Специальное предложение!</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                Запишитесь сегодня — получите <strong className="text-gray-900">бесплатную диагностику</strong> и{" "}
                <strong className="text-blue-600">300 бонусов</strong> на первый ремонт
              </p>
              <a
                href="/calculator"
                className="block text-center px-4 py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
              >
                Рассчитать стоимость
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MarketingBanners
