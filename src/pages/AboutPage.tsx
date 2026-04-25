import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import { ArrowLeft, Award, Users, Wrench, MapPin } from "lucide-react"

const stats = [
  { value: "5 лет", label: "на рынке Барнаула" },
  { value: "10 000+", label: "отремонтированных устройств" },
  { value: "98%", label: "довольных клиентов" },
  { value: "365 дней", label: "гарантия на все работы" },
]

const team = [
  {
    name: "Алексей Громов",
    role: "Старший мастер по Apple",
    exp: "8 лет опыта",
    desc: "Специализируется на ремонте MacBook и iPhone. Сертифицирован по работе с техникой Apple.",
  },
  {
    name: "Денис Коваль",
    role: "Мастер по мобильным устройствам",
    exp: "5 лет опыта",
    desc: "Эксперт по ремонту Samsung, Xiaomi, Huawei. Специалист по водному повреждению.",
  },
  {
    name: "Михаил Зайцев",
    role: "Мастер по планшетам и ноутбукам",
    exp: "6 лет опыта",
    desc: "Занимается ремонтом iPad, MacBook и ноутбуков других производителей.",
  },
]

const values = [
  {
    icon: Award,
    title: "Качество без компромиссов",
    desc: "Используем только оригинальные и сертифицированные запчасти. Каждый ремонт проходит многоэтапный контроль качества.",
  },
  {
    icon: Users,
    title: "Клиент — главный приоритет",
    desc: "Честная диагностика, прозрачное ценообразование. Никаких скрытых платежей — цену называем до начала работ.",
  },
  {
    icon: Wrench,
    title: "Профессиональный подход",
    desc: "Наши мастера постоянно проходят обучение и следят за новинками. Ремонтируем даже самые сложные случаи.",
  },
  {
    icon: MapPin,
    title: "Удобное расположение",
    desc: "Находимся в центре Барнаула — ул. Молодёжная 34, 1 этаж. Легко добраться из любой части города.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead title="О компании iPro — сервисный центр в Барнауле | 10 лет опыта" description="Сервисный центр iPro в Барнауле. 10 лет опыта, 10 000+ отремонтированных устройств, 98% довольных клиентов. Команда профессионалов." />
      <Navbar />
      <main className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.a
            href="/"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </motion.a>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Компания</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 mb-6">О нас</h1>
            <p className="text-gray-600 text-lg max-w-2xl leading-relaxed">
              iPro — сервисный центр в Барнауле, который с 2019 года занимается профессиональным ремонтом и продажей техники Apple, Samsung, Xiaomi и других брендов.
            </p>
            <p className="text-gray-500 text-base max-w-2xl leading-relaxed mt-4">
              Мы начинали как небольшая мастерская и выросли в полноценный сервисный центр с командой опытных мастеров. Наша цель — вернуть вашу технику к жизни быстро, качественно и честно.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          >
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center shadow-sm">
                <div className="font-display text-3xl font-bold text-gray-900 mb-1">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Наши принципы</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {values.map((v, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                    <v.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <h3 className="font-heading font-semibold text-gray-800 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Наша команда</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {team.map((member, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-500 font-bold text-lg">
                    {member.name[0]}
                  </div>
                  <h3 className="font-heading font-semibold text-gray-800 mb-0.5">{member.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{member.role}</p>
                  <p className="text-xs text-gray-400 mb-3">{member.exp}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}