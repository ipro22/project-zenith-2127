import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"
import { useState, useEffect } from "react"

interface UserData {
  phone: string
  name: string
  email: string
  registeredAt: string
}

interface Order {
  id: string
  device: string
  service: string
  status: "accepted" | "diagnostics" | "repair" | "ready" | "completed"
  date: string
  price: string
  bonusEarned: number
}

interface BonusEntry {
  id: string
  date: string
  description: string
  amount: number
  type: "earn" | "spend"
}

const statusLabels: Record<string, string> = {
  accepted: "Принят",
  diagnostics: "Диагностика",
  repair: "В ремонте",
  ready: "Готов к выдаче",
  completed: "Выдан",
}

const statusColors: Record<string, string> = {
  accepted: "bg-blue-500/20 text-blue-400",
  diagnostics: "bg-yellow-500/20 text-yellow-400",
  repair: "bg-orange-500/20 text-orange-400",
  ready: "bg-green-500/20 text-green-400",
  completed: "bg-zinc-500/20 text-zinc-400",
}

const statusSteps = ["accepted", "diagnostics", "repair", "ready", "completed"]

const demoOrders: Order[] = [
  { id: "IPR-2025-0412", device: "iPhone 17 Pro Max", service: "Замена экрана (OLED)", status: "repair", date: "2025-04-10", price: "12 500 ₽", bonusEarned: 625 },
  { id: "IPR-2025-0398", device: "MacBook Air 13\" M3", service: "Чистка + замена термопасты", status: "ready", date: "2025-04-08", price: "2 500 ₽", bonusEarned: 125 },
  { id: "IPR-2025-0356", device: "Samsung Galaxy S24 Ultra", service: "Замена аккумулятора", status: "completed", date: "2025-03-25", price: "3 200 ₽", bonusEarned: 160 },
]

const demoBonuses: BonusEntry[] = [
  { id: "b1", date: "2025-04-10", description: "Начислено за заказ IPR-2025-0412", amount: 625, type: "earn" },
  { id: "b2", date: "2025-04-08", description: "Начислено за заказ IPR-2025-0398", amount: 125, type: "earn" },
  { id: "b3", date: "2025-03-25", description: "Начислено за заказ IPR-2025-0356", amount: 160, type: "earn" },
  { id: "b4", date: "2025-03-20", description: "Списано при оплате заказа", amount: -500, type: "spend" },
  { id: "b5", date: "2025-02-14", description: "Бонус за регистрацию", amount: 300, type: "earn" },
]

function getUser(): UserData | null {
  const data = localStorage.getItem("ipro_user")
  return data ? JSON.parse(data) : null
}

function setUser(user: UserData) {
  localStorage.setItem("ipro_user", JSON.stringify(user))
}

export default function AccountPage() {
  const [user, setUserState] = useState<UserData | null>(null)
  const [tab, setTab] = useState<"orders" | "bonuses" | "profile">("orders")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [trackNumber, setTrackNumber] = useState("")
  const [trackResult, setTrackResult] = useState<Order | null>(null)
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const u = getUser()
    if (u) {
      setUserState(u)
      setProfileName(u.name)
      setProfileEmail(u.email)
    }
  }, [])

  const handleSendCode = () => {
    if (phone.length >= 10) setCodeSent(true)
  }

  const handleVerifyCode = () => {
    if (code.length === 4) {
      const newUser: UserData = { phone, name: "", email: "", registeredAt: new Date().toISOString() }
      setUser(newUser)
      setUserState(newUser)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("ipro_user")
    setUserState(null)
    setPhone("")
    setCode("")
    setCodeSent(false)
  }

  const handleTrack = () => {
    const found = demoOrders.find((o) => o.id.toLowerCase() === trackNumber.toLowerCase())
    setTrackResult(found || null)
  }

  const handleSaveProfile = () => {
    if (user) {
      const updated = { ...user, name: profileName, email: profileEmail }
      setUser(updated)
      setUserState(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const totalOrders = demoOrders.length
  const totalSpent = "18 200 ₽"
  const bonusBalance = demoBonuses.reduce((sum, b) => sum + b.amount, 0)
  const visits = totalOrders
  const loyaltyLevel = visits >= 5 ? "VIP" : visits >= 3 ? "Постоянный" : "Стандарт"
  const loyaltyDiscount = visits >= 5 ? "10%" : visits >= 3 ? "7%" : "5%"
  const nextLevel = visits >= 5 ? null : visits >= 3 ? { name: "VIP", need: 5, current: visits } : { name: "Постоянный", need: 3, current: visits }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <SEOHead title="Личный кабинет — iPro Барнаул" description="Войдите в личный кабинет iPro: проверка статуса заказа, бонусы, история ремонтов." />
        <Navbar />
        <main className="pt-24 pb-20 px-6">
          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                <Icon name="User" size={28} className="text-zinc-400" />
              </div>
              <h1 className="font-display text-3xl font-bold text-zinc-100 mb-3">Личный кабинет</h1>
              <p className="text-zinc-500 text-sm">Войдите для отслеживания заказов и управления бонусами</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6"
            >
              {!codeSent ? (
                <>
                  <label className="block text-sm text-zinc-400 mb-2">Номер телефона</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors mb-4"
                  />
                  <button
                    onClick={handleSendCode}
                    disabled={phone.length < 10}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:hover:bg-zinc-100"
                  >
                    Получить код
                  </button>
                </>
              ) : (
                <>
                  <p className="text-sm text-zinc-400 mb-4">Код отправлен на {phone}</p>
                  <label className="block text-sm text-zinc-400 mb-2">Код подтверждения</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="0000"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm text-center tracking-[0.5em] outline-none focus:border-zinc-600 transition-colors mb-4"
                  />
                  <button
                    onClick={handleVerifyCode}
                    disabled={code.length !== 4}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-40 mb-3"
                  >
                    Войти
                  </button>
                  <button
                    onClick={() => setCodeSent(false)}
                    className="w-full text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    Изменить номер
                  </button>
                </>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6"
            >
              <h3 className="font-heading font-semibold text-zinc-200 text-sm mb-3">Проверить статус заказа</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackNumber}
                  onChange={(e) => setTrackNumber(e.target.value)}
                  placeholder="IPR-2025-0412"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors"
                />
                <button
                  onClick={handleTrack}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
                >
                  <Icon name="Search" size={16} />
                </button>
              </div>
              {trackResult && (
                <div className="mt-4 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-200">{trackResult.id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${statusColors[trackResult.status]}`}>
                      {statusLabels[trackResult.status]}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">{trackResult.device} — {trackResult.service}</p>
                  <div className="flex items-center gap-1 mt-3">
                    {statusSteps.map((step, i) => {
                      const currentIdx = statusSteps.indexOf(trackResult.status)
                      const isActive = i <= currentIdx
                      return (
                        <div key={step} className="flex items-center flex-1">
                          <div className={`w-3 h-3 rounded-full ${isActive ? "bg-zinc-100" : "bg-zinc-700"}`} />
                          {i < statusSteps.length - 1 && (
                            <div className={`flex-1 h-0.5 ${i < currentIdx ? "bg-zinc-100" : "bg-zinc-700"}`} />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between mt-1">
                    {statusSteps.map((step) => (
                      <span key={step} className="text-[10px] text-zinc-600">{statusLabels[step]}</span>
                    ))}
                  </div>
                </div>
              )}
              {trackNumber && !trackResult && (
                <p className="mt-3 text-xs text-zinc-500">Заказ не найден. Проверьте номер.</p>
              )}
            </motion.div>
          </div>
        </main>
        <FooterSection />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title="Личный кабинет — iPro Барнаул" description="Личный кабинет iPro: ваши заказы, бонусы, профиль." />
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-zinc-100">
                {user.name || "Личный кабинет"}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">{user.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${loyaltyLevel === "VIP" ? "bg-yellow-500/20 text-yellow-400" : loyaltyLevel === "Постоянный" ? "bg-blue-500/20 text-blue-400" : "bg-zinc-500/20 text-zinc-400"}`}>
                {loyaltyLevel} · скидка {loyaltyDiscount}
              </span>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <Icon name="LogOut" size={18} />
              </button>
            </div>
          </motion.div>

          <div className="flex gap-1 mb-8 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/50 w-fit">
            {([
              { key: "orders", label: "Мои заказы", icon: "Package" },
              { key: "bonuses", label: "Бонусы", icon: "Gift" },
              { key: "profile", label: "Профиль", icon: "User" },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${tab === key ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Icon name={icon} size={16} />
                {label}
              </button>
            ))}
          </div>

          {tab === "orders" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                <h3 className="font-heading font-semibold text-zinc-200 text-sm mb-3">Проверить статус заказа</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={trackNumber}
                    onChange={(e) => setTrackNumber(e.target.value)}
                    placeholder="Введите номер заказа"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors"
                  />
                  <button
                    onClick={handleTrack}
                    className="px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors"
                  >
                    Найти
                  </button>
                </div>
                {trackResult && (
                  <div className="mt-4 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-200">{trackResult.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[trackResult.status]}`}>
                        {statusLabels[trackResult.status]}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500">{trackResult.device} — {trackResult.service} — {trackResult.price}</p>
                    <div className="flex items-center gap-1 mt-3">
                      {statusSteps.map((step, i) => {
                        const currentIdx = statusSteps.indexOf(trackResult.status)
                        const isActive = i <= currentIdx
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className={`w-3 h-3 rounded-full transition-colors ${isActive ? "bg-zinc-100" : "bg-zinc-700"}`} />
                            {i < statusSteps.length - 1 && (
                              <div className={`flex-1 h-0.5 transition-colors ${i < currentIdx ? "bg-zinc-100" : "bg-zinc-700"}`} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h3 className="font-heading font-semibold text-zinc-200 text-base">Ваши заказы</h3>
                {demoOrders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-zinc-200">{order.id}</span>
                        <span className="text-xs text-zinc-600">{order.date}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{order.device}</p>
                    <p className="text-xs text-zinc-500">{order.service}</p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/30">
                      <span className="text-sm font-semibold text-zinc-200">{order.price}</span>
                      <span className="text-xs text-green-400">+{order.bonusEarned} бонусов</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === "bonuses" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                  <p className="text-xs text-zinc-500 mb-2">Баланс бонусов</p>
                  <p className="font-display text-3xl font-bold text-zinc-100">{bonusBalance}</p>
                  <p className="text-xs text-zinc-500 mt-1">1 бонус = 1 рубль</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                  <p className="text-xs text-zinc-500 mb-2">Уровень лояльности</p>
                  <p className="font-display text-xl font-bold text-zinc-100">{loyaltyLevel}</p>
                  <p className="text-xs text-zinc-500 mt-1">Скидка {loyaltyDiscount} на все услуги</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                  <p className="text-xs text-zinc-500 mb-2">Начислений за всё время</p>
                  <p className="font-display text-xl font-bold text-zinc-100">
                    {demoBonuses.filter((b) => b.type === "earn").reduce((s, b) => s + b.amount, 0)} ₽
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">5% от суммы каждого заказа</p>
                </div>
              </div>

              {nextLevel && (
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-zinc-300">Прогресс до уровня «{nextLevel.name}»</p>
                    <span className="text-xs text-zinc-500">{nextLevel.current}/{nextLevel.need} обращений</span>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-full transition-all duration-500"
                      style={{ width: `${(nextLevel.current / nextLevel.need) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden">
                <div className="px-5 py-4 border-b border-zinc-800/50">
                  <h3 className="font-heading font-semibold text-zinc-200 text-sm">История бонусов</h3>
                </div>
                <div className="divide-y divide-zinc-800/40">
                  {demoBonuses.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between px-5 py-3">
                      <div>
                        <p className="text-sm text-zinc-300">{entry.description}</p>
                        <p className="text-xs text-zinc-600">{entry.date}</p>
                      </div>
                      <span className={`text-sm font-semibold ${entry.type === "earn" ? "text-green-400" : "text-red-400"}`}>
                        {entry.amount > 0 ? "+" : ""}{entry.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
                <h3 className="font-heading font-semibold text-zinc-200 text-sm mb-3">Как работают бонусы</h3>
                <div className="space-y-2 text-sm text-zinc-400">
                  <div className="flex items-start gap-2">
                    <Icon name="Plus" size={16} className="text-green-400 shrink-0 mt-0.5" />
                    <span>5% от суммы каждого заказа начисляется в бонусы</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="Coins" size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                    <span>1 бонус = 1 рубль. Оплачивайте бонусами до 30% стоимости заказа</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="TrendingUp" size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                    <span>Чем больше заказов — тем выше уровень и скидка</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Icon name="Gift" size={16} className="text-zinc-500 shrink-0 mt-0.5" />
                    <span>VIP-клиенты получают 2x бонусов и персонального мастера</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === "profile" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Имя</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      placeholder="Ваше имя"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={user.phone}
                      disabled
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30 text-zinc-500 text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  className="mt-4 px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors"
                >
                  {saved ? "Сохранено!" : "Сохранить"}
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 text-center">
                  <p className="text-2xl font-bold text-zinc-100">{totalOrders}</p>
                  <p className="text-xs text-zinc-500 mt-1">Заказов</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 text-center">
                  <p className="text-2xl font-bold text-zinc-100">{totalSpent}</p>
                  <p className="text-xs text-zinc-500 mt-1">Потрачено</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 text-center">
                  <p className="text-2xl font-bold text-zinc-100">{bonusBalance}</p>
                  <p className="text-xs text-zinc-500 mt-1">Бонусов</p>
                </div>
                <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 text-center">
                  <p className={`text-2xl font-bold ${loyaltyLevel === "VIP" ? "text-yellow-400" : "text-zinc-100"}`}>
                    {loyaltyLevel}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Уровень</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
