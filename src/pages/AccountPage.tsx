import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import {
  Loader2, LogOut, User, Phone, Mail, AlertCircle,
  Package, Gift, Settings, ChevronRight, Star,
  TrendingUp, Check, Search, Shield, Zap
} from "lucide-react"
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

export default function AccountPage() {
  // Auth
  const [client, setClient] = useState<ClientData | null>(null)
  const [token, setToken] = useState(getAuthToken())
  const [loading, setLoading] = useState(true)

  // Login form
  const [loginTab, setLoginTab] = useState<"phone" | "email">("phone")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [devCode, setDevCode] = useState("")
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")

  // Email login
  const [emailValue, setEmailValue] = useState("")
  const [emailName, setEmailName] = useState("")
  const [emailCode, setEmailCode] = useState("")
  const [emailCodeSent, setEmailCodeSent] = useState(false)
  const [emailDevCode, setEmailDevCode] = useState("")

  // Dashboard
  const [tab, setTab] = useState<"orders" | "bonuses" | "profile">("orders")
  const [orders, setOrders] = useState<Order[]>([])
  const [bonusTx, setBonusTx] = useState<BonusEntry[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  // Profile edit
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Track order (public)
  const [trackNumber, setTrackNumber] = useState("")
  const [trackResult, setTrackResult] = useState<Order | null>(null)
  const [trackLoading, setTrackLoading] = useState(false)
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
      removeAuthToken(); setToken(""); setClient(null)
    }
  }, [])

  const loadOrders = useCallback(async (t: string) => {
    setDataLoading(true)
    try {
      const data = await apiPost<{ orders: Order[] }>(API.orders, { action: "my_orders" }, t)
      setOrders(data.orders || [])
    } catch { /* ignore */ }
    setDataLoading(false)
  }, [])

  const loadBonuses = useCallback(async (t: string) => {
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
  }, [])

  useEffect(() => {
    const stored = getStoredClient()
    const t = getAuthToken()
    if (stored && t) {
      setClient(stored); setToken(t)
      setProfileName(stored.name || ""); setProfileEmail(stored.email || "")
      loadProfile(t).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [loadProfile])

  useEffect(() => {
    if (!token || !client) return
    if (tab === "orders") loadOrders(token)
    if (tab === "bonuses") loadBonuses(token)
  }, [tab, token, client, loadOrders, loadBonuses])

  const handleSendCode = async () => {
    if (phone.replace(/\D/g, "").length < 10) { setAuthError("Введите корректный номер"); return }
    setAuthError(""); setAuthLoading(true)
    try {
      const data = await apiPost<{ success: boolean; dev_code?: string }>(API.auth, { action: "send_code", phone })
      setCodeSent(true)
      if (data.dev_code) setDevCode(data.dev_code)
    } catch { setAuthError("Ошибка. Попробуйте позже.") }
    setAuthLoading(false)
  }

  const handleVerify = async () => {
    if (code.length < 4) { setAuthError("Введите 4-значный код"); return }
    setAuthError(""); setAuthLoading(true)
    try {
      const data = await apiPost<{ success: boolean; token: string; client: ClientData }>(API.auth, { action: "verify_code", phone, code })
      setAuthToken(data.token); setToken(data.token)
      setClient(data.client); storeClient(data.client)
      setProfileName(data.client.name || ""); setProfileEmail(data.client.email || "")
    } catch { setAuthError("Неверный код. Попробуйте ещё раз.") }
    setAuthLoading(false)
  }

  const handleEmailSend = async () => {
    if (!emailValue.includes("@")) { setAuthError("Введите корректный email"); return }
    setAuthError(""); setAuthLoading(true)
    try {
      const data = await apiPost<{ success: boolean; dev_code?: string }>(API.auth, { action: "email_register", email: emailValue })
      setEmailCodeSent(true)
      if (data.dev_code) setEmailDevCode(data.dev_code)
    } catch { setAuthError("Ошибка отправки кода") }
    setAuthLoading(false)
  }

  const handleEmailVerify = async () => {
    if (emailCode.length < 4) { setAuthError("Введите 4-значный код"); return }
    setAuthError(""); setAuthLoading(true)
    try {
      const data = await apiPost<{ success: boolean; token: string; client: ClientData }>(API.auth, {
        action: "email_verify", email: emailValue, code: emailCode, name: emailName,
      })
      setAuthToken(data.token); setToken(data.token)
      setClient(data.client); storeClient(data.client)
      setProfileName(data.client.name || ""); setProfileEmail(data.client.email || "")
    } catch { setAuthError("Неверный код") }
    setAuthLoading(false)
  }

  const handleLogout = async () => {
    if (token) await apiPost(API.auth, { action: "logout" }, token).catch(() => {})
    removeAuthToken(); setToken(""); setClient(null); setOrders([]); setBonusTx([])
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
    setTrackError(""); setTrackLoading(true); setTrackResult(null)
    try {
      const data = await apiPost<{ order?: Order; error?: string }>(API.orders, { action: "check_status", order_number: trackNumber.trim().toUpperCase() })
      if (data.order) setTrackResult(data.order)
      else setTrackError("Заказ не найден. Проверьте номер.")
    } catch { setTrackError("Ошибка запроса. Попробуйте позже.") }
    setTrackLoading(false)
  }

  const level = client?.loyalty_level || "standard"
  const nextLevelVisits = level === "standard" ? 3 : level === "regular" ? 5 : null

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  )

  // ─── LOGIN / GUEST ─────────────────────────────────────────────────────────
  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SEOHead title="Личный кабинет — iPro Барнаул" description="Войдите в личный кабинет iPro для отслеживания заказов и управления бонусами." />
        <Navbar />
        <main className="px-4 py-10 pb-20">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

            {/* Login card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-5">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Войти в кабинет</h1>
              <p className="text-gray-500 text-sm mb-6">Заказы, бонусы и персональные скидки</p>

              {/* Tab switcher */}
              <div className="flex gap-1 p-1 rounded-2xl bg-gray-100 mb-6">
                {([{ key: "phone", label: "По телефону" }, { key: "email", label: "По email" }] as const).map(({ key, label }) => (
                  <button key={key} onClick={() => { setLoginTab(key); setAuthError("") }}
                    className={`flex-1 py-2 text-sm rounded-xl font-medium transition-all ${loginTab === key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                    {label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {loginTab === "phone" && (
                  <motion.div key="phone" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-3">
                    {!codeSent ? (
                      <>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="tel" placeholder="+7 (999) 000-00-00" value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                        </div>
                        {authError && <p className="text-red-500 text-xs">{authError}</p>}
                        <button onClick={handleSendCode} disabled={authLoading}
                          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                          {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Получить код"}
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">Код отправлен на <strong>{phone}</strong></p>
                        {devCode && (
                          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-700">Тестовый код: <strong>{devCode}</strong></p>
                          </div>
                        )}
                        <input type="text" inputMode="numeric" maxLength={4} placeholder="0 0 0 0"
                          value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-xl font-bold text-center tracking-[1em] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {authError && <p className="text-red-500 text-xs">{authError}</p>}
                        <button onClick={handleVerify} disabled={authLoading}
                          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                          {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Войти"}
                        </button>
                        <button onClick={() => { setCodeSent(false); setCode(""); setDevCode("") }}
                          className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-center py-1">
                          Изменить номер
                        </button>
                      </>
                    )}
                  </motion.div>
                )}

                {loginTab === "email" && (
                  <motion.div key="email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
                    {!emailCodeSent ? (
                      <>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input type="email" placeholder="email@example.com" value={emailValue}
                            onChange={(e) => setEmailValue(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                        </div>
                        <input type="text" placeholder="Ваше имя (необязательно)" value={emailName}
                          onChange={(e) => setEmailName(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all" />
                        {authError && <p className="text-red-500 text-xs">{authError}</p>}
                        <button onClick={handleEmailSend} disabled={authLoading}
                          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                          {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Получить код на email"}
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600">Код отправлен на <strong>{emailValue}</strong></p>
                        {emailDevCode && (
                          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                            <p className="text-xs text-amber-700">Тестовый код: <strong>{emailDevCode}</strong></p>
                          </div>
                        )}
                        <input type="text" inputMode="numeric" maxLength={4} placeholder="0 0 0 0"
                          value={emailCode} onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ""))}
                          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-xl font-bold text-center tracking-[1em] focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        {authError && <p className="text-red-500 text-xs">{authError}</p>}
                        <button onClick={handleEmailVerify} disabled={authLoading}
                          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                          {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Войти"}
                        </button>
                        <button onClick={() => { setEmailCodeSent(false); setEmailCode(""); setEmailDevCode("") }}
                          className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors text-center py-1">
                          Изменить email
                        </button>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Right column: track + loyalty */}
            <div className="flex flex-col gap-5">
              {/* Track order */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Search className="w-4 h-4 text-blue-600" />
                  </div>
                  <h2 className="font-semibold text-gray-900">Статус заказа</h2>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="IPR-2026-XXXX" value={trackNumber}
                    onChange={(e) => setTrackNumber(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  <button onClick={handleTrack} disabled={trackLoading}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
                    {trackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Найти"}
                  </button>
                </div>
                {trackError && <p className="text-red-500 text-xs mt-2">{trackError}</p>}
                {trackResult && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm">{trackResult.device_brand} {trackResult.device_model}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{trackResult.service_name}</p>
                    <div className="mt-3">
                      <div className="flex items-center gap-1 mb-2">
                        {statusSteps.map((step, i) => {
                          const curr = statusSteps.indexOf(trackResult.status)
                          const active = i <= curr
                          return (
                            <div key={step} className="flex items-center flex-1">
                              <div className={`w-3 h-3 rounded-full ${active ? "bg-blue-600" : "bg-gray-200"}`} />
                              {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 ${i < curr ? "bg-blue-600" : "bg-gray-200"}`} />}
                            </div>
                          )
                        })}
                      </div>
                      <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[trackResult.status]}`}>
                        {statusLabels[trackResult.status]}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Loyalty info */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-blue-200" />
                  <p className="font-semibold">Программа лояльности</p>
                </div>
                <div className="space-y-2.5 text-sm text-blue-100">
                  {[
                    { icon: Shield, text: "Стандарт — 5% бонусами от каждого ремонта" },
                    { icon: Zap, text: "Постоянный (3+ визита) — 7% бонусами" },
                    { icon: Star, text: "VIP (5+ визитов) — 10% бонусами" },
                  ].map(({ icon: Ico, text }) => (
                    <div key={text} className="flex items-start gap-2">
                      <Ico className="w-4 h-4 shrink-0 mt-0.5 text-blue-300" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-blue-500/40 text-xs text-blue-200">
                  1 бонус = 1 рубль · оплата до 30% суммы заказа
                </div>
              </motion.div>
            </div>
          </div>
        </main>
        <FooterSection />
      </div>
    )
  }

  // ─── DASHBOARD ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Личный кабинет — iPro Барнаул" description="Личный кабинет iPro: ваши заказы, бонусы и профиль." />
      <Navbar />
      <main className="px-4 pb-20">
        <div className="max-w-4xl mx-auto pt-8">

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {client.yandex_avatar_url ? (
                  <img src={client.yandex_avatar_url} alt="" className="w-14 h-14 rounded-2xl object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
                    <User className="w-7 h-7 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{client.name || "Клиент iPro"}</h1>
                  <p className="text-gray-500 text-sm">{client.phone || client.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${loyaltyColors[level]}`}>
                  {loyaltyLabels[level]}
                </span>
                <button onClick={handleLogout}
                  className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { label: "Бонусов", value: (client.bonus_balance || 0).toLocaleString("ru"), color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Ремонтов", value: client.visits_count || 0, color: "text-green-600", bg: "bg-green-50" },
                { label: "Скидка", value: loyaltyDiscounts[level], color: "text-amber-600", bg: "bg-amber-50" },
              ].map((s) => (
                <div key={s.label} className={`${s.bg} rounded-2xl p-3 text-center`}>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Loyalty progress */}
            {nextLevelVisits && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                  <span>Прогресс до уровня «{level === "standard" ? loyaltyLabels["regular"] : loyaltyLabels["vip"]}»</span>
                  <span>{client.visits_count || 0}/{nextLevelVisits}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(((client.visits_count || 0) / nextLevelVisits) * 100, 100)}%` }} />
                </div>
              </div>
            )}
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-1 w-fit">
            {([
              { key: "orders", label: "Заказы", icon: Package },
              { key: "bonuses", label: "Бонусы", icon: Gift },
              { key: "profile", label: "Профиль", icon: Settings },
            ] as const).map(({ key, label, icon: Ico }) => (
              <button key={key} onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === key ? "bg-blue-600 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}>
                <Ico className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">

            {/* ORDERS */}
            {tab === "orders" && (
              <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Track */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 text-sm">Проверить статус по номеру</h3>
                  <div className="flex gap-2">
                    <input type="text" placeholder="IPR-2026-XXXX" value={trackNumber}
                      onChange={(e) => setTrackNumber(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={handleTrack} disabled={trackLoading}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
                      {trackLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Найти"}
                    </button>
                  </div>
                  {trackError && <p className="text-red-500 text-xs mt-2">{trackError}</p>}
                  {trackResult && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-gray-900 text-sm">{trackResult.device_brand} {trackResult.device_model}</p>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[trackResult.status]}`}>{statusLabels[trackResult.status]}</span>
                      </div>
                      <p className="text-gray-500 text-xs mt-1">{trackResult.service_name}</p>
                    </div>
                  )}
                </div>

                {/* Orders list */}
                <h3 className="font-semibold text-gray-900 px-1">Мои заказы</h3>
                {dataLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">Заказов пока нет</p>
                    <a href="/calculator" className="mt-3 inline-block text-sm text-blue-600 hover:underline">Рассчитать стоимость ремонта →</a>
                  </div>
                ) : orders.map((order) => (
                  <div key={order.order_number} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{order.device_brand} {order.device_model}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{order.service_name}</p>
                        <p className="text-gray-400 text-xs mt-0.5">№ {order.order_number}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-1 my-3">
                      {statusSteps.map((step, i) => {
                        const curr = statusSteps.indexOf(order.status)
                        const active = i <= curr
                        return (
                          <div key={step} className="flex items-center flex-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${active ? "bg-blue-600" : "bg-gray-200"}`} />
                            {i < statusSteps.length - 1 && <div className={`flex-1 h-0.5 ${i < curr ? "bg-blue-600" : "bg-gray-200"}`} />}
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-sm font-bold text-gray-900">{(order.service_price || 0).toLocaleString("ru")} ₽</span>
                      {order.bonus_earned > 0 && (
                        <span className="text-xs text-green-600 font-medium">+{order.bonus_earned} бонусов</span>
                      )}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {/* BONUSES */}
            {tab === "bonuses" && (
              <motion.div key="bonuses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Баланс бонусов", value: (client.bonus_balance || 0).toLocaleString("ru"), sub: "1 бонус = 1 рубль", icon: Gift, color: "bg-blue-600" },
                    { label: "Уровень", value: loyaltyLabels[level], sub: `Скидка ${loyaltyDiscounts[level]}`, icon: Star, color: "bg-amber-500" },
                    { label: "Начислено всего", value: bonusTx.filter(t => t.type === "earn").reduce((s, t) => s + t.amount, 0).toLocaleString("ru"), sub: "5–10% от заказов", icon: TrendingUp, color: "bg-green-600" },
                  ].map((c) => (
                    <div key={c.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                      <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center mb-3`}>
                        <c.icon className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{c.value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{c.label}</p>
                      <p className="text-xs text-gray-400">{c.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Progress */}
                {nextLevelVisits && (
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium text-gray-900">До следующего уровня</span>
                      <span className="text-gray-500">{client.visits_count || 0} / {nextLevelVisits}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(((client.visits_count || 0) / nextLevelVisits) * 100, 100)}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      Ещё {nextLevelVisits - (client.visits_count || 0)} обращений до уровня «{level === "standard" ? loyaltyLabels["regular"] : loyaltyLabels["vip"]}»
                    </p>
                  </div>
                )}

                {/* History */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-4 border-b border-gray-50">
                    <h3 className="font-semibold text-gray-900 text-sm">История операций</h3>
                  </div>
                  {bonusTx.length === 0 ? (
                    <div className="py-8 text-center">
                      <p className="text-gray-400 text-sm">Операций пока нет</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {bonusTx.map((tx, i) => (
                        <div key={i} className="flex items-center justify-between px-5 py-3.5">
                          <div>
                            <p className="text-sm text-gray-800">{tx.description}</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(tx.date).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          </div>
                          <span className={`text-sm font-bold ${tx.type === "earn" ? "text-green-600" : "text-red-500"}`}>
                            {tx.type === "earn" ? "+" : "-"}{tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Rules */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Как работают бонусы</h3>
                  <div className="space-y-2 text-sm text-gray-500">
                    {[
                      "5% от суммы каждого ремонта начисляется бонусами",
                      "1 бонус = 1 рубль. Оплачивайте до 30% стоимости заказа",
                      "Постоянный клиент (3+ заказов) — 7% бонусов",
                      "VIP (5+ заказов) — 10% бонусов и персональный мастер",
                    ].map((text) => (
                      <div key={text} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span>{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* PROFILE */}
            {tab === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-5">Личные данные</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium">Имя</label>
                      <input type="text" placeholder="Ваше имя" value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium">Телефон</label>
                      <input type="tel" value={client.phone || ""} disabled
                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-gray-500 mb-1.5 font-medium">Email</label>
                      <input type="email" placeholder="email@example.com" value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                    </div>
                  </div>
                  <button onClick={handleSaveProfile} disabled={saving}
                    className="mt-5 flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-all disabled:opacity-60">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
                    {saved ? "Сохранено!" : "Сохранить"}
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Статистика</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { label: "Заказов", value: client.visits_count || 0 },
                      { label: "Потрачено", value: `${Math.round((client.total_spent || 0) / 1000)}к ₽` },
                      { label: "Бонусов", value: client.bonus_balance || 0 },
                      { label: "Уровень", value: loyaltyLabels[level] },
                    ].map((s) => (
                      <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                        <p className="text-xl font-bold text-gray-900">{s.value}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 font-medium transition-colors">
                    <LogOut className="w-4 h-4" /> Выйти из кабинета
                  </button>
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
