import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import Icon from "@/components/ui/icon"

const promos = [
  { icon: "Zap", text: "Диагностика БЕСПЛАТНО для всех устройств", sub: "Узнайте причину поломки без оплаты" },
  { icon: "Gift", text: "Скидка 5% при повторном обращении", sub: "Накапливайте бонусы с каждым ремонтом" },
  { icon: "Shield", text: "Гарантия 365 дней на все работы", sub: "Бесплатный ремонт при гарантийном случае" },
  { icon: "Clock", text: "Ремонт за 1-2 часа при вас", sub: "Ждите результата прямо в нашем офисе" },
]

export function MarketingBanners() {
  const [current, setCurrent] = useState(0)
  const [showPromo, setShowPromo] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % promos.length), 4000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setShowPromo(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      {/* Ticker bar — fixed поверх навбара */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800/60 py-1.5 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="flex items-center justify-center gap-3"
            >
              <Icon name={promos[current].icon} size={13} className="text-zinc-400 shrink-0" />
              <span className="text-xs text-zinc-300 font-medium">{promos[current].text}</span>
              <span className="text-xs text-zinc-600 hidden sm:block">— {promos[current].sub}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Exit-intent promo popup */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-6 z-40 max-w-xs"
          >
            <div className="rounded-2xl bg-zinc-900 border border-zinc-700/60 shadow-2xl p-5">
              <button
                onClick={() => setShowPromo(false)}
                className="absolute top-3 right-3 text-zinc-600 hover:text-zinc-400"
              >
                <Icon name="X" size={14} />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Icon name="Gift" size={18} className="text-yellow-400" />
                <span className="text-sm font-semibold text-zinc-100">Акция!</span>
              </div>
              <p className="text-sm text-zinc-400 mb-3">
                Запишитесь сегодня и получите <span className="text-zinc-200 font-medium">бесплатную диагностику</span> + <span className="text-zinc-200 font-medium">300 бонусов</span> на первый ремонт
              </p>
              <a
                href="tel:+79993231817"
                className="block text-center px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors"
              >
                Записаться
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default MarketingBanners