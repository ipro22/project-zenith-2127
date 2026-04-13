import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { Breadcrumb } from "@/components/Breadcrumb"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { useState, useEffect, useCallback } from "react"
import { Loader2, LogOut, Package, Gift, User, ChevronRight, Star, Phone, Mail, Edit3, Check, AlertCircle, ExternalLink } from "lucide-react"
import {
  statusLabels, statusColors, statusSteps,
  loyaltyLabels, loyaltyColors, loyaltyDiscounts,
  type Order, type BonusEntry,
} from "@/pages/account/account.types"
import {
  API, apiPost, apiGet, getAuthToken, setAuthToken,
  removeAuthToken, getStoredClient, storeClient,
  type ClientData,
} from "@/hooks/useApi"

const YANDEX_CLIENT_ID = "ваш_client_id_яндекс"

export default function AccountPage() {
  const [client, setClient] = useState<ClientData | null>(null)
  const [token, setToken] = useState(getAuthToken())
  const [tab, setTab] = useState<"orders" | "bonuses" | "profile">("orders")
  const [loading, setLoading] = useState(true)

  // Auth state
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [devCode, setDevCode] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")

  // Data state
  const [orders, setOrders] = useState<Order[]>([])
  const [bonusTx, setBonusTx] = useState<BonusEntry[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  // Profile
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Track order
  const [trackNumber, setTrackNumber] = useState("")
  const [trackResult, setTrackResult] = useState<Order | null>(null)
  const [trackError, setTrackError] = useState("")

  const loadProfile = useCallback(async (t: string) => {
    try {
      const data = await apiGet<{ client: ClientData }>(API.auth, { action: "get_profile" }, t)
      if (data.client) {
        setClient(data.client)
        storeClient(data.client)
        setProfileName(data.client.name || "")
        setProfileEmail(data.client.email || "")
      }
    } catch {
      removeAuthToken()
      setToken("")
      setClient(null)
    }
  }, [])

  const loadOrders = async (t: string) => {
    setDataLoading(true)
    try {
      const data = await apiPost<{ orders: Order[] }>(API.orders, { action: "my_orders" }, t)
      setOrders(data.orders || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }

  const loadBonuses = async (t: string) => {
    try {
      const data = await apiPost<{ transactions: { type: string; amount: number; description: string; created_at: string }[] }>(
        API.orders, { action: "bonus_history" }, t
      )
      setBonusTx((data.transactions || []).map((tx) => ({
        date: tx.created_at,
        description: tx.description,
        amount: tx.amount,
        type: tx.type as "earn" | "spend",
      })))
    } catch { /* ignore */ }
  }

  useEffect(() => {
    const stored = getStoredClient()
    const t = getAuthToken()
    if (stored && t) {
      setClient(stored)
      setProfileName(stored.name || "")
      setProfileEmail(stored.email || "")
      setToken(t)
      loadProfile(t).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [loadProfile])

  useEffect(() => {
    if (token && client) {
      if (tab === "orders") loadOrders(token)
      if (tab === "bonuses") loadBonuses(token)
    }
  }, [tab, token, client])

  const handleSendCode = async () => {
    if (phone.length < 10) { setAuthError("Введите корректный номер телефона"); return }
    setAuthError("")
    setAuthLoading(true)
    try {
      const data = await apiPost<{ success: boolean; dev_code?: string }>(API.auth, { action: "send_code", phone })
      setCodeSent(true)
      if (data.dev_code) setDevCode(data.dev_code)
    } catch {
      setAuthError("Ошибка отправки кода. Попробуйте позже.")
    }
    setAuthLoading(false)
  }

  const handleVerify = async () => {
    if (code.length < 4) { setAuthError("Введите 4-значный код"); return }
    setAuthError("")
    setAuthLoading(true)
    try {
      const data = await apiPost<{ success: boolean; token: string; client: ClientData }>(API.auth, {
        action: "verify_code", phone, code,
      })
      setAuthToken(data.token)
      setToken(data.token)
      setClient(data.client)
      storeClient(data.client)
      setProfileName(data.client.name || "")
      setProfileEmail(data.client.email || "")
    } catch {
      setAuthError("Неверный код. Попробуйте ещё раз.")
    }
    setAuthLoading(false)
  }

  const handleYandexAuth = () => {
    const returnUrl = encodeURIComponent(window.location.origin + "/account?yandex_callback=1")
    window.location.href = `https://oauth.yandex.ru/authorize?response_type=token&client_id=${YANDEX_CLIENT_ID}&redirect_uri=${returnUrl}`
  }

  const handleLogout = async () => {
    if (token) {
      await apiPost(API.auth, { action: "logout" }, token).catch(() => {})
    }
    removeAuthToken()
    setToken("")
    setClient(null)
    setOrders([])
    setBonusTx([])
  }

  const handleSaveProfile = async () => {
    if (!token) return
    setSaving(true)
    try {
      await apiPost(API.auth, { action: "update_profile", name: profileName, email: profileEmail }, token)
      setSaved(true)
      setClient((c) => c ? { ...c, name: profileName, email: profileEmail } : c)
      storeClient({ ...client!, name: profileName, email: profileEmail })
      setTimeout(() => setSaved(false), 2000)
    } catch { /* ignore */ }
    setSaving(false)
  }

  const handleTrack = async () => {
    if (!trackNumber.trim()) return
    setTrackError("")
    try {
      const data = await apiPost<{ order?: Order; error?: string }>(API.orders, {
        action: "check_status", order_number: trackNumber,
      })
      if (data.order) setTrackResult(data.order)
      else setTrackError("Заказ не найден")
    } catch {
      setTrackError("Заказ не найден в системе")
    }
  }

  const level = client?.loyalty_level || "standard"
  const visits = client?.visits_count || 0
  const nextLevelVisits = level === "standard" ? 3 : level === "regular" ? 5 : null

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-white">
        <SEOHead title="Личный кабинет — iPro Барнаул" description="Войдите в личный кабинет iPro." />
        <Navbar />
        <main className="pt-20 pb-20 px-6">
          <div className="max-w-4xl mx-auto mt-8">
            <Breadcrumb items={[{ label: "Личный кабинет" }]} />

            <div className="mt-8 grid md:grid-cols-2 gap-8">
              {/* Login */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Войти в кабинет</h1>
                <p className="text-gray-500 text-sm mb-8">Получите доступ к заказам, бонусам и персональным скидкам</p>

                {/* Яндекс ID */}
                <button
                  onClick={handleYandexAuth}
                  className="w-full flex items-center justify-center gap-3 py-3 px-6 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white transition-all mb-4 group"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#FC3F1D"/>
                    <path d="M13.8 6H12.2C10.1 6 8.9 7.1 8.9 8.9C8.9 10.4 9.6 11.3 11 12.2L12 12.8L8.8 18H11L14 13.1L14.1 13.2C15.2 13.9 15.8 14.5 15.8 15.8C15.8 17.2 14.9 17.9 13.7 17.9H12.9V18H15.1C16.9 18 18.1 16.9 18.1 15.1C18.1 13.5 17.3 12.6 15.7 11.5L14.7 10.9L15.1 10.2C15.7 9.3 16.1 8.5 16.1 7.8C16.1 6.7 15.2 6 13.8 6ZM13.5 10.4L12.6 11.8L11.7 11.3C10.8 10.7 10.4 10.2 10.4 9.2C10.4 8.1 11.1 7.4 12.3 7.4H13.1V7.5C13.7 7.5 14.1 7.9 14.1 8.4C14.1 9 13.9 9.6 13.5 10.4Z" fill="white"/>
                  </svg>
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">Войти через Яндекс ID</span>
                  <ExternalLink className="w-4 h-4 text-gray-400 ml-auto" />
                </button>

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">или по номеру телефона</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {!codeSent ? (
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="+7 (999) 000-00-00"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-9 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                      />
                    </div>
                    <AnimatePresence>
                      {authError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs">{authError}</motion.p>}
                    </AnimatePresence>
                    <button
                      onClick={handleSendCode}
                      disabled={authLoading}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all disabled:opacity-60"
                    >
                      {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Получить код"}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <p className="text-sm text-gray-600">Код отправлен на <strong>{phone}</strong></p>
                    {devCode && (
                      <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                        <p className="text-xs text-amber-700">Тестовый режим: ваш код <strong>{devCode}</strong></p>
                      </div>
                    )}
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="Введите 4-значный код"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm text-center tracking-widest text-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    />
                    <AnimatePresence>
                      {authError && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-xs">{authError}</motion.p>}
                    </AnimatePresence>
                    <button
                      onClick={handleVerify}
                      disabled={authLoading}
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all disabled:opacity-60"
                    >
                      {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Подтвердить"}
                    </button>
                    <button onClick={() => { setCodeSent(false); setCode(""); setDevCode("") }} className="text-xs text-gray-400 hover:text-gray-600 transition-colors text-center">
                      Изменить номер
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Track order */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
                <div className="bg-gray-50 rounded-3xl border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Проверить статус заказа</h2>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="IPR-2026-XXXX"
                      value={trackNumber}
                      onChange={(e) => setTrackNumber(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    />
                    <button
                      onClick={handleTrack}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Найти
                    </button>
                  </div>
                  {trackError && <p className="text-red-500 text-xs mt-2">{trackError}</p>}
                  {trackResult && (
                    <div className="mt-4 p-4 bg-white rounded-2xl border border-gray-100">
                      <p className="font-semibold text-gray-900 text-sm">{trackResult.device_brand} {trackResult.device_model}</p>
                      <p className="text-gray-500 text-xs">{trackResult.service_name}</p>
                      <span className={`mt-2 inline-block text-xs px-3 py-1 rounded-full font-medium ${statusColors[trackResult.status]}`}>
                        {statusLabels[trackResult.status]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Loyalty preview */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white">
                  <p className="text-blue-100 text-sm mb-1">Программа лояльности</p>
                  <p className="font-bold text-xl mb-3">Накапливайте бонусы</p>
                  <div className="flex flex-col gap-2 text-sm text-blue-100">
                    <span>✓ 5% от каждого ремонта бонусами</span>
                    <span>✓ Скидка от 5% с первого визита</span>
                    <span>✓ VIP-статус от 5 обращений</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        <FooterSection />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Личный кабинет — iPro Барнаул" description="Личный кабинет iPro: заказы, бонусы, профиль." />
      <Navbar />
      <main className="pt-20 pb-20 px-6">
        <div className="max-w-4xl mx-auto mt-8">
          <Breadcrumb items={[{ label: "Личный кабинет" }]} />

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {client.yandex_avatar_url ? (
                <img src={client.yandex_avatar_url} alt="" className="w-14 h-14 rounded-2xl object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <User className="w-7 h-7 text-blue-600" />
                </div>
              )}
              <div>
                <h1 className="font-display text-2xl font-bold text-gray-900">
                  {client.name || "Личный кабинет"}
                </h1>
                <p className="text-gray-500 text-sm">{client.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${loyaltyColors[level]}`}>
                {loyaltyLabels[level]} · {loyaltyDiscounts[level]}
              </span>
              <button
                onClick={handleLogout}
                className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-red-500 hover:border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              { label: "Бонусов", value: client.bonus_balance?.toLocaleString("ru") || "0", icon: "Gift", color: "text-blue-600" },
              { label: "Ремонтов", value: client.visits_count || 0, icon: "Wrench", color: "text-green-600" },
              { label: "Потрачено", value: `${((client.total_spent || 0) / 1000).toFixed(0)}к ₽`, icon: "TrendingUp", color: "text-purple-600" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 p-4"
              >
                <Icon name={stat.icon} size={18} className={`mb-2 ${stat.color}`} />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6 mb-6 p-1 rounded-2xl bg-white border border-gray-100 shadow-sm w-fit">
            {([
              { key: "orders", label: "Мои заказы", icon: "Package" },
              { key: "bonuses", label: "Бонусы", icon: "Gift" },
              { key: "profile", label: "Профиль", icon: "User" },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  tab === key ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon name={icon} size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab: Orders */}
          <AnimatePresence mode="wait">
            {tab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {dataLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p>Заказов пока нет</p>
                    <a href="/calculator" className="mt-3 inline-block text-blue-600 text-sm hover:underline">Рассчитать стоимость ремонта</a>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {orders.map((o, i) => (
                      <motion.div key={o.order_number} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">{o.order_number}</p>
                            <p className="font-semibold text-gray-900">{o.device_brand} {o.device_model}</p>
                            <p className="text-sm text-gray-600">{o.service_name}</p>
                          </div>
                          <span className={`text-xs px-3 py-1 rounded-full font-medium shrink-0 ${statusColors[o.status]}`}>
                            {statusLabels[o.status]}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-gray-500 text-xs">{new Date(o.created_at).toLocaleDateString("ru")}</span>
                          <div className="flex items-center gap-3">
                            {o.bonus_earned > 0 && (
                              <span className="text-green-600 text-xs font-medium">+{o.bonus_earned} бонусов</span>
                            )}
                            <span className="font-bold text-gray-900">{(o.service_price || 0).toLocaleString("ru")} ₽</span>
                          </div>
                        </div>
                        {/* Progress */}
                        <div className="mt-3 flex gap-1">
                          {statusSteps.map((step, idx) => {
                            const currentIdx = statusSteps.indexOf(o.status)
                            return (
                              <div
                                key={step}
                                className={`flex-1 h-1.5 rounded-full transition-colors ${
                                  idx <= currentIdx ? "bg-blue-500" : "bg-gray-100"
                                }`}
                              />
                            )
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {tab === "bonuses" && (
              <motion.div key="bonuses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Virtual card */}
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-6 text-white mb-4">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-12 translate-x-12" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-blue-100 text-sm">iPro Бонусная карта</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        level === "vip" ? "bg-yellow-400 text-yellow-900" :
                        level === "regular" ? "bg-white/20 text-white" :
                        "bg-white/10 text-white"
                      }`}>
                        {loyaltyLabels[level]}
                      </span>
                    </div>
                    <p className="text-4xl font-bold mb-1">{(client.bonus_balance || 0).toLocaleString("ru")}</p>
                    <p className="text-blue-200 text-sm">бонусных рублей</p>
                    <div className="mt-4 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <p className="text-sm text-blue-100">{client.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Loyalty level */}
                {nextLevelVisits && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold text-gray-900 text-sm">До следующего уровня</p>
                      <span className="text-xs text-gray-500">{visits} / {nextLevelVisits} ремонтов</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${Math.min(100, (visits / nextLevelVisits) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Ещё {nextLevelVisits - visits} {nextLevelVisits - visits === 1 ? "ремонт" : "ремонта"} — и вы получите уровень{" "}
                      <strong>{level === "standard" ? "Постоянный (скидка 7%)" : "VIP (скидка 10%)"}</strong>
                    </p>
                  </div>
                )}

                {/* Rules */}
                <div className="bg-blue-50 rounded-2xl p-5 mb-4">
                  <p className="font-semibold text-gray-900 text-sm mb-3">Как использовать бонусы</p>
                  <div className="flex flex-col gap-2 text-sm text-gray-600">
                    <span>• 1 бонус = 1 рубль</span>
                    <span>• 5% от каждого ремонта начисляется бонусами</span>
                    <span>• Оплатить бонусами можно до 30% стоимости ремонта</span>
                    <span>• Просто скажите мастеру: «Хочу списать бонусы»</span>
                  </div>
                </div>

                {/* History */}
                {bonusTx.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="font-semibold text-gray-900 text-sm mb-3">История операций</p>
                    <div className="flex flex-col gap-2">
                      {bonusTx.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                          <div>
                            <p className="text-sm text-gray-700">{tx.description}</p>
                            <p className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString("ru")}</p>
                          </div>
                          <span className={`font-bold text-sm ${tx.amount > 0 ? "text-green-600" : "text-red-500"}`}>
                            {tx.amount > 0 ? "+" : ""}{tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {tab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-semibold text-gray-900 mb-5">Личные данные</h2>
                  <div className="flex flex-col gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Имя</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Введите имя"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Телефон</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          value={client.phone}
                          disabled
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm text-gray-500 cursor-not-allowed"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    {client.yandex_login && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#FC3F1D"/><path d="M13.8 6H12.2C10.1 6 8.9 7.1 8.9 8.9C8.9 10.4 9.6 11.3 11 12.2L12 12.8L8.8 18H11L14 13.1L14.1 13.2C15.2 13.9 15.8 14.5 15.8 15.8C15.8 17.2 14.9 17.9 13.7 17.9H12.9V18H15.1C16.9 18 18.1 16.9 18.1 15.1C18.1 13.5 17.3 12.6 15.7 11.5L14.7 10.9L15.1 10.2C15.7 9.3 16.1 8.5 16.1 7.8C16.1 6.7 15.2 6 13.8 6Z" fill="white"/></svg>
                        <p className="text-xs text-gray-600">Аккаунт Яндекс: <strong>@{client.yandex_login}</strong></p>
                      </div>
                    )}
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                        saved ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      {saving ? "Сохраняем..." : saved ? "Сохранено!" : "Сохранить изменения"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
