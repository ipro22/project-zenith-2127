import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Users, Package, Gift, TrendingUp, Plus, Search, Check, X, Edit2, ChevronDown, LogOut } from "lucide-react"
import { SEOHead } from "@/components/SEOHead"

const ADMIN_URL = "https://functions.poehali.dev/6a5b5cbf-1f49-4b4e-91cb-d3d5f6cf86ee"

async function adminFetch(action: string, body: object = {}, token: string) {
  const res = await fetch(ADMIN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body: JSON.stringify({ action, ...body }),
  })
  const raw = await res.json()
  return typeof raw === "string" ? JSON.parse(raw) : raw
}

const loyaltyOptions = ["standard", "regular", "vip"]
const loyaltyLabels: Record<string, string> = { standard: "Стандарт", regular: "Постоянный", vip: "VIP" }
const statusLabels: Record<string, string> = { received: "Принят", diagnostics: "Диагностика", repair: "В ремонте", ready: "Готов", completed: "Выдан" }
const statusColors: Record<string, string> = { received: "bg-blue-100 text-blue-700", diagnostics: "bg-yellow-100 text-yellow-700", repair: "bg-orange-100 text-orange-700", ready: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-600" }

interface Client {
  id: number; phone: string; name: string | null; email: string | null
  bonus_balance: number; loyalty_level: string; visits_count: number; total_spent: number; created_at: string
}
interface Order {
  order_number: string; client_name: string; client_phone: string
  device_brand: string; device_model: string; service_name: string
  service_price: number; status: string; bonus_earned: number; created_at: string
}
interface Stats { total_clients: number; total_orders: number; new_orders: number; total_revenue: number; total_bonuses: number }

export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("ipro_admin_token") || "")
  const [tokenInput, setTokenInput] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")

  const [tab, setTab] = useState<"clients" | "orders" | "stats">("stats")
  const [stats, setStats] = useState<Stats | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")

  // Bonus modal
  const [bonusClient, setBonusClient] = useState<Client | null>(null)
  const [bonusAmount, setBonusAmount] = useState("")
  const [bonusDesc, setBonusDesc] = useState("")
  const [bonusLoading, setBonusLoading] = useState(false)
  const [bonusDone, setBonusDone] = useState(false)

  // Add client modal
  const [addOpen, setAddOpen] = useState(false)
  const [addPhone, setAddPhone] = useState("")
  const [addName, setAddName] = useState("")
  const [addEmail, setAddEmail] = useState("")
  const [addBonus, setAddBonus] = useState("0")
  const [addLevel, setAddLevel] = useState("standard")
  const [addLoading, setAddLoading] = useState(false)

  // Edit client
  const [editClient, setEditClient] = useState<Client | null>(null)

  const handleLogin = async () => {
    setAuthLoading(true)
    setAuthError("")
    try {
      const data = await adminFetch("stats", {}, tokenInput)
      if (data.total_clients !== undefined) {
        localStorage.setItem("ipro_admin_token", tokenInput)
        setToken(tokenInput)
        setAuthed(true)
        setStats(data)
      } else {
        setAuthError("Неверный пароль")
      }
    } catch {
      setAuthError("Ошибка подключения")
    }
    setAuthLoading(false)
  }

  const loadStats = useCallback(async () => {
    const data = await adminFetch("stats", {}, token)
    setStats(data)
  }, [token])

  const loadClients = useCallback(async () => {
    setLoading(true)
    const data = await adminFetch("list_clients", { search }, token)
    setClients(data.clients || [])
    setLoading(false)
  }, [token, search])

  const loadOrders = useCallback(async () => {
    setLoading(true)
    const data = await adminFetch("list_orders", {}, token)
    setOrders(data.orders || [])
    setLoading(false)
  }, [token])

  useEffect(() => {
    if (!authed && token) {
      adminFetch("stats", {}, token).then((data) => {
        if (data.total_clients !== undefined) { setAuthed(true); setStats(data) }
      }).catch(() => {})
    }
  }, [authed, token])

  useEffect(() => {
    if (!authed) return
    if (tab === "stats") loadStats()
    if (tab === "clients") loadClients()
    if (tab === "orders") loadOrders()
  }, [tab, authed, loadStats, loadClients, loadOrders])

  const handleAdjustBonus = async () => {
    if (!bonusClient || !bonusAmount) return
    setBonusLoading(true)
    await adminFetch("adjust_bonus", {
      client_id: bonusClient.id,
      amount: parseInt(bonusAmount),
      description: bonusDesc || "Ручное начисление",
    }, token)
    setBonusDone(true)
    setTimeout(() => { setBonusDone(false); setBonusClient(null); setBonusAmount(""); setBonusDesc(""); loadClients() }, 1500)
    setBonusLoading(false)
  }

  const handleAddClient = async () => {
    if (!addPhone) return
    setAddLoading(true)
    await adminFetch("add_client", { phone: addPhone, name: addName, email: addEmail, bonus_balance: parseInt(addBonus) || 0, loyalty_level: addLevel }, token)
    setAddOpen(false); setAddPhone(""); setAddName(""); setAddEmail(""); setAddBonus("0"); setAddLevel("standard")
    loadClients()
    setAddLoading(false)
  }

  const handleConfirmOrder = async (orderNumber: string) => {
    await adminFetch("confirm_order_bonus", { order_number: orderNumber }, token)
    loadOrders()
  }

  const handleUpdateStatus = async (orderNumber: string, status: string) => {
    await adminFetch("update_order_status", { order_number: orderNumber, status }, token)
    loadOrders()
  }

  const handleLogout = () => {
    localStorage.removeItem("ipro_admin_token")
    setToken(""); setAuthed(false)
  }

  // ── Login screen ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <SEOHead title="Администратор — iPro" description="" />
        <div className="w-full max-w-sm bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="font-bold text-2xl text-gray-900 mb-1">Панель управления</h1>
          <p className="text-gray-500 text-sm mb-6">iPro Барнаул · Только для сотрудников</p>
          <input
            type="password"
            placeholder="Введите пароль администратора"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {authError && <p className="text-red-500 text-xs mb-3">{authError}</p>}
          <button
            onClick={handleLogin}
            disabled={authLoading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Войти"}
          </button>
        </div>
      </div>
    )
  }

  // ── Main admin panel ──
  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead title="Администратор — iPro" description="" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-bold text-gray-900 text-lg">iPro Admin</span>
          <div className="flex gap-1">
            {(["stats", "clients", "orders"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                {t === "stats" ? "Статистика" : t === "clients" ? "Клиенты" : "Заявки"}
              </button>
            ))}
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 text-sm transition-colors">
          <LogOut className="w-4 h-4" /> Выйти
        </button>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* STATS */}
        {tab === "stats" && stats && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { label: "Клиентов", value: stats.total_clients, icon: Users, color: "text-blue-600 bg-blue-50" },
                { label: "Всего заявок", value: stats.total_orders, icon: Package, color: "text-purple-600 bg-purple-50" },
                { label: "Новые заявки", value: stats.new_orders, icon: Package, color: "text-orange-600 bg-orange-50" },
                { label: "Выручка", value: `${(stats.total_revenue / 1000).toFixed(0)}к ₽`, icon: TrendingUp, color: "text-green-600 bg-green-50" },
                { label: "Бонусов выдано", value: stats.total_bonuses, icon: Gift, color: "text-yellow-600 bg-yellow-50" },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENTS */}
        {tab === "clients" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по телефону, имени, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadClients()}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" /> Добавить клиента
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Клиент", "Телефон", "Уровень", "Бонусы", "Ремонтов", "Потрачено", "Действия"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {clients.map((c) => (
                      <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{c.name || "—"}</p>
                          <p className="text-xs text-gray-400">{c.email || ""}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{c.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.loyalty_level === "vip" ? "bg-yellow-100 text-yellow-700" : c.loyalty_level === "regular" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>
                            {loyaltyLabels[c.loyalty_level] || c.loyalty_level}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-blue-600">{c.bonus_balance}</td>
                        <td className="px-4 py-3 text-gray-700">{c.visits_count}</td>
                        <td className="px-4 py-3 text-gray-700">{(c.total_spent || 0).toLocaleString("ru")} ₽</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => { setBonusClient(c); setBonusAmount(""); setBonusDesc("") }}
                              className="px-2 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                            >
                              Бонусы
                            </button>
                            <button
                              onClick={() => setEditClient({ ...c })}
                              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {clients.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-400">Клиентов не найдено</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <div className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-600" /></div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Номер", "Клиент", "Устройство", "Услуга", "Сумма", "Статус", "Действия"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o) => (
                      <tr key={o.order_number} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{o.order_number}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{o.client_name || "—"}</p>
                          <p className="text-xs text-gray-400">{o.client_phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{o.device_brand} {o.device_model}</td>
                        <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">{o.service_name}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{(o.service_price || 0).toLocaleString("ru")} ₽</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            onChange={(e) => handleUpdateStatus(o.order_number, e.target.value)}
                            className={`text-xs px-2 py-1 rounded-lg border-0 font-medium cursor-pointer ${statusColors[o.status] || "bg-gray-100 text-gray-600"}`}
                          >
                            {Object.entries(statusLabels).map(([k, v]) => (
                              <option key={k} value={k}>{v}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          {o.status !== "completed" && (
                            <button
                              onClick={() => handleConfirmOrder(o.order_number)}
                              className="px-2 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-medium hover:bg-green-100 transition-colors"
                            >
                              ✓ Выдать + бонусы
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {orders.length === 0 && !loading && (
                  <div className="text-center py-12 text-gray-400">Заявок нет</div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Bonus modal */}
      <AnimatePresence>
        {bonusClient && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setBonusClient(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {bonusDone ? (
                <div className="text-center py-4">
                  <Check className="w-10 h-10 text-green-500 mx-auto mb-2" />
                  <p className="font-semibold text-gray-900">Бонусы начислены!</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900">Начислить / списать бонусы</h3>
                    <button onClick={() => setBonusClient(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Клиент: <strong>{bonusClient.name || bonusClient.phone}</strong> · Баланс: <strong>{bonusClient.bonus_balance}</strong></p>
                  <input
                    type="number"
                    placeholder="Сумма (+ начислить, - списать)"
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Комментарий (необязательно)"
                    value={bonusDesc}
                    onChange={(e) => setBonusDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAdjustBonus}
                    disabled={bonusLoading || !bonusAmount}
                    className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {bonusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Применить"}
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add client modal */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
            onClick={() => setAddOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Добавить клиента</h3>
                <button onClick={() => setAddOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="flex flex-col gap-3">
                <input type="tel" placeholder="Телефон *" value={addPhone} onChange={(e) => setAddPhone(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="text" placeholder="Имя" value={addName} onChange={(e) => setAddName(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="email" placeholder="Email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Начальный баланс бонусов" value={addBonus} onChange={(e) => setAddBonus(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={addLevel} onChange={(e) => setAddLevel(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none">
                  {loyaltyOptions.map((l) => <option key={l} value={l}>{loyaltyLabels[l]}</option>)}
                </select>
                <button
                  onClick={handleAddClient}
                  disabled={addLoading || !addPhone}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {addLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Добавить"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
