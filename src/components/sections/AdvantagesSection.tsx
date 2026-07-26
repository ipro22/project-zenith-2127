import { motion } from "framer-motion"
import { Stethoscope, Zap, Cpu, ShieldCheck, Award, Wallet } from "lucide-react"

const advantages = [
  { icon: Stethoscope, title: "Диагностика бесплатно", desc: "Диагностика остаётся бесплатной даже при отказе от ремонта" },
  { icon: Zap, title: "Срочный ремонт", desc: "Доступна услуга срочного ремонта — приоритетный ремонт, при наличии нужных запчастей" },
  { icon: Cpu, title: "Оригинальные запчасти", desc: "Свой склад оригинальных запчастей. Не тратим время на заказ, что ускоряет ремонт" },
  { icon: ShieldCheck, title: "Гарантия", desc: "Гарантия до 1 года. Если случай гарантийный — отремонтируем бесплатно" },
  { icon: Award, title: "Квалификация", desc: "Опытные мастера с опытом 10+ лет и более 2 500 успешно выполненных ремонтов техники" },
  { icon: Wallet, title: "Кешбэк", desc: "Вернём стоимость работ в виде бонусов, на следующую покупку или ремонт" },
]

interface Props {
  imageUrl?: string
}

export function AdvantagesSection({ imageUrl = "https://cdn.poehali.dev/projects/081a6fe6-0440-47e4-833b-a4633500179a/files/ac868a9d-0a3f-4164-ad00-17c415755dc7.jpg" }: Props) {
  return (
    <section className="bg-gray-50 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display text-2xl md:text-3xl font-bold text-gray-900 mb-8 tracking-tight"
        >
          Преимущества
        </motion.h2>

        <div className="grid lg:grid-cols-[1fr_1fr_420px] gap-4">
          <div className="grid sm:grid-cols-2 lg:col-span-2 gap-4">
            {advantages.map(({ icon: Ico, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-2xl bg-[#1d4ed8] flex items-center justify-center mb-4">
                  <Ico className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="hidden lg:block rounded-3xl overflow-hidden min-h-[280px]"
          >
            <img src={imageUrl} alt="Ремонт техники в сервисе iPro" className="w-full h-full object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
