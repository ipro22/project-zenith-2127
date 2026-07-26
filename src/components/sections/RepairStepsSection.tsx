import { motion } from "framer-motion"

const steps = [
  { num: "01", title: "Консультация и диагностика", desc: "Обсуждаем симптомы и называем примерную вилку цен. Проверяем устройство" },
  { num: "02", title: "Согласование и ремонт", desc: "Утверждаем стоимость и сроки. Инженер приступает к ремонту, сохраняя ваши данные" },
  { num: "03", title: "Проверка устройства", desc: "Тестируем все функции устройства по чек-листу из 40 пунктов." },
  { num: "04", title: "Выдача и гарантия", desc: "Вы получаете исправное устройство и гарантийный талон." },
]

interface Props {
  imageUrl?: string
}

export function RepairStepsSection({ imageUrl = "https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/ac868a9d-0a3f-4164-ad00-17c415755dc7.jpg" }: Props) {
  return (
    <section className="bg-white px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-[420px_1fr] gap-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden min-h-[280px]"
          >
            <img src={imageUrl} alt="Этапы ремонта техники iPro" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <h2 className="absolute bottom-6 left-6 font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
              Этапы ремонта
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map(({ num, title, desc }, i) => (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative bg-gray-50 rounded-2xl p-6 border border-gray-100 min-h-[180px] flex flex-col"
              >
                <h3 className="font-semibold text-gray-900 mb-2 pr-8">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{desc}</p>
                <span className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center">
                  {num}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
