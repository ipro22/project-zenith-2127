import { motion } from "framer-motion"
import { ShieldCheck, Zap, BadgeCheck, Car, Star, ChevronRight } from "lucide-react"

const brands = [
  { name: "iPhone", href: "/device/iphone", emoji: "📱" },
  { name: "iPad", href: "/device/ipad", emoji: "📋" },
  { name: "MacBook", href: "/device/macbook", emoji: "💻" },
  { name: "Samsung", href: "/device/samsung", emoji: "📱" },
  { name: "Xiaomi", href: "/device/xiaomi", emoji: "📱" },
  { name: "Huawei", href: "/device/huawei", emoji: "📱" },
  { name: "Apple Watch", href: "/device/apple-watch", emoji: "⌚" },
  { name: "AirPods", href: "/device/airpods", emoji: "🎧" },
]

const features = [
  { icon: ShieldCheck, title: "Гарантия 365 дней", desc: "На все виды работ и запчасти. Бесплатное гарантийное обслуживание.", color: "bg-blue-50 text-blue-600" },
  { icon: Zap, title: "Ремонт за 1–2 часа", desc: "Большинство поломок устраняем пока вы ждёте. Срочный ремонт в приоритете.", color: "bg-orange-50 text-orange-600" },
  { icon: BadgeCheck, title: "Оригинальные запчасти", desc: "Только сертифицированные комплектующие от проверенных поставщиков.", color: "bg-green-50 text-green-600" },
  { icon: Car, title: "Бесплатная доставка", desc: "Бесплатно привезём и вернём отремонтированное устройство по Барнаулу.", color: "bg-purple-50 text-purple-600" },
]

const stats = [
  { num: "10 000+", label: "отремонтировано устройств" },
  { num: "10 лет", label: "на рынке Барнаула" },
  { num: "98%", label: "довольных клиентов" },
  { num: "0 ₽", label: "за диагностику" },
]

export function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-50 px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Почему выбирают нас</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            С НАМИ
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Профессиональный ремонт, диагностика и продажа техники — в одном месте.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {features.map(({ icon: Icon, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {stats.map(({ num, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm text-center"
            >
              <p className="text-3xl font-bold text-blue-600 mb-1">{num}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Devices grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl font-bold text-gray-900">Ремонтируем все устройства</h3>
            <a href="/calculator" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Калькулятор цен
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {brands.map(({ name, href, emoji }, i) => (
              <motion.a
                key={name}
                href={href}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50 transition-all group"
              >
                <span className="text-3xl">{emoji}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600 transition-colors">{name}</span>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Rating */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 text-center"
        >
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1,2,3,4,5].map((i) => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
            </div>
            <span className="font-bold text-gray-900 text-lg">5.0</span>
            <span className="text-gray-400 text-sm">на всех платформах</span>
          </div>
          <div className="h-6 w-px bg-gray-200 hidden sm:block" />
          <p className="text-gray-500 text-sm">
            Мы в <a href="https://2gis.ru" className="text-blue-600 hover:underline">2ГИС</a>, <a href="https://yandex.ru/maps" className="text-blue-600 hover:underline">Яндекс Картах</a> и <a href="https://maps.google.com" className="text-blue-600 hover:underline">Google Maps</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
