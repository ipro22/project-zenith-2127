import { motion } from "framer-motion"
import { Phone, Calculator, ArrowRight } from "lucide-react"
import { RepairRequestForm } from "@/components/RepairRequestForm"

export function CtaSection() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Оставить заявку</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              Сдайте технику сегодня
            </h2>
            <p className="text-gray-500 text-lg mb-8">
              Диагностика бесплатно. Ремонт в большинстве случаев за 1–2 часа. Привезём и отвезём бесплатно.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="tel:+79993231817"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm"
              >
                <Phone className="w-4 h-4" />
                Позвонить сейчас
              </a>
              <a
                href="/calculator"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                <Calculator className="w-4 h-4 text-blue-500" />
                Рассчитать цену
              </a>
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-gray-500">
              {["Гарантия до 365 дней", "Оригинальные запчасти", "Бесплатная диагностика", "Доставка по Барнаулу"].map((g) => (
                <span key={g} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {g}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
          >
            <RepairRequestForm compact />
          </motion.div>
        </div>
      </div>
    </section>
  )
}