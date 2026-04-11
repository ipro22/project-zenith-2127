import { motion } from "framer-motion"
import { TestimonialsColumn } from "@/components/ui/testimonials-column"

const testimonials = [
  {
    text: "Разбил экран на iPhone 14 Pro — отремонтировали за 2 часа. Качество отличное, цена адекватная. Однозначно рекомендую!",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    name: "Анна Смирнова",
    role: "Клиент сервиса",
  },
  {
    text: "MacBook не включался уже неделю. Ребята сделали диагностику бесплатно и починили за день. Ноутбук как новый!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    name: "Максим Волков",
    role: "Постоянный клиент",
  },
  {
    text: "Заменили батарею на iPad быстро и качественно. Теперь держит заряд как в первый день. Спасибо мастерам!",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    name: "Елена Крылова",
    role: "Клиент сервиса",
  },
  {
    text: "Купил здесь восстановленный iPhone 13 — отличное состояние, хорошая цена. Проверили при мне, всё работает идеально.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    name: "Дмитрий Петров",
    role: "Покупатель техники",
  },
  {
    text: "Залил телефон водой, думал всё. Спасли Samsung Galaxy S23 за 4 часа. Очень внимательный персонал, объяснили всё подробно.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    name: "Марина Ковалёва",
    role: "Клиент сервиса",
  },
  {
    text: "Обращаюсь уже третий раз — каждый раз отличный результат. Быстро, честно, с гарантией. Больше никуда не пойду!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    name: "Алексей Громов",
    role: "Постоянный клиент",
  },
  {
    text: "Сломалась кнопка Home на старом iPhone SE. Починили быстро и по очень приятной цене. Сервис на высшем уровне!",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    name: "Светлана Орлова",
    role: "Клиент сервиса",
  },
  {
    text: "Ремонт Xiaomi — сделали за 3 часа. Редко встретишь такой профессиональный подход в сервисном центре. Отличная работа!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    name: "Михаил Захаров",
    role: "Клиент сервиса",
  },
  {
    text: "Приобрела здесь AirPods — оригинал, полный комплект, цена ниже чем в других магазинах. Очень довольна покупкой!",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    name: "Наталья Белова",
    role: "Покупатель техники",
  },
]

const firstColumn = testimonials.slice(0, 3)
const secondColumn = testimonials.slice(3, 6)
const thirdColumn = testimonials.slice(6, 9)

const logos = ["Apple", "Samsung", "Xiaomi", "Huawei", "Honor", "Sony", "OnePlus", "Realme"]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-24 bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-xl mx-auto mb-12"
        >
          <div className="border border-zinc-800 py-1.5 px-4 rounded-full text-sm text-zinc-400">Отзывы</div>

          <h2 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mt-6 text-center tracking-tight">
            Что говорят наши клиенты
          </h2>
          <p className="text-center mt-4 text-zinc-500 text-lg text-balance">
            Более 3 000 довольных клиентов доверяют нам свою технику.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>

        <div className="mt-16 pt-16 border-t border-zinc-800/50">
          <p className="text-center text-sm text-zinc-500 mb-8">Работаем с техникой всех популярных брендов</p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <motion.div
              className="flex gap-12 md:gap-16"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate logos for seamless loop */}
              {[...logos, ...logos].map((logo, index) => (
                <span
                  key={`${logo}-${index}`}
                  className="text-xl font-semibold text-zinc-700 whitespace-nowrap flex-shrink-0"
                >
                  {logo}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}