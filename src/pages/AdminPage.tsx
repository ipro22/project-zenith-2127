import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Loader2, Users, Package, Gift, TrendingUp, Plus, Search,
  Check, X, Edit2, LogOut, LayoutDashboard, ShoppingBag,
  FileText, ChevronDown, Trash2, Save, RefreshCw, AlertCircle,
  Eye, Star, Phone, Mail, Calendar
} from "lucide-react"
import { SEOHead } from "@/components/SEOHead"
import { API } from "@/hooks/useApi"

// ─── Types ───────────────────────────────────────────────────────────────────
interface Client { id: number; phone: string; name: string | null; email: string | null; bonus_balance: number; loyalty_level: string; visits_count: number; total_spent: number; created_at: string }
interface Order { order_number: string; client_name: string; client_phone: string; device_brand: string; device_model: string; service_name: string; service_price: number; status: string; bonus_earned: number; created_at: string; comment?: string }
interface Stats { total_clients: number; total_orders: number; new_orders: number; total_revenue: number; total_bonuses: number }
interface ContentItem { key: string; value: string; type: string; label: string }
interface ContentMap { [section: string]: ContentItem[] }
interface Product { id?: number; name: string; brand: string; category: string; description: string; price: number; old_price?: number; image_url: string; badge: string; in_stock: boolean; sort_order: number; created_at?: string }
interface BonusTx { type: string; amount: number; description: string; created_at: string }

// ─── Constants ────────────────────────────────────────────────────────────────
const loyaltyOptions = ["standard", "regular", "vip"]
const loyaltyLabels: Record<string, string> = { standard: "Стандарт", regular: "Постоянный", vip: "VIP" }
const loyaltyColors: Record<string, string> = { standard: "bg-gray-100 text-gray-600", regular: "bg-blue-100 text-blue-700", vip: "bg-amber-100 text-amber-700" }
const statusLabels: Record<string, string> = { received: "Принят", diagnostics: "Диагностика", repair: "В ремонте", ready: "Готов", completed: "Выдан" }
const statusColors: Record<string, string> = { received: "bg-blue-100 text-blue-700", diagnostics: "bg-yellow-100 text-yellow-700", repair: "bg-orange-100 text-orange-700", ready: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-500" }

const EMPTY_PRODUCT: Product = { name: "", brand: "", category: "", description: "", price: 0, image_url: "", badge: "", in_stock: true, sort_order: 0 }

// ─── API helper ───────────────────────────────────────────────────────────────
async function adminFetch(action: string, body: object = {}, token: string) {
  const res = await fetch(API.admin, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body: JSON.stringify({ action: `admin_${action}`, ...body }),
  })
  const raw = await res.json()
  return typeof raw === "string" ? JSON.parse(raw) : raw
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: string }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
}

function Pill({ children, onClick, variant = "default" }: { children: React.ReactNode; onClick?: () => void; variant?: "default" | "danger" | "success" | "ghost" }) {
  const cls = { default: "bg-blue-600 text-white hover:bg-blue-700", danger: "bg-red-50 text-red-600 hover:bg-red-100", success: "bg-green-50 text-green-700 hover:bg-green-100", ghost: "bg-gray-100 text-gray-600 hover:bg-gray-200" }
  return <button onClick={onClick} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${cls[variant]}`}>{children}</button>
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("ipro_admin_token") || "")
  const [tokenInput, setTokenInput] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [tab, setTab] = useState<"dashboard" | "orders" | "clients" | "shop" | "editor">("dashboard")

  // Dashboard
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  // Orders
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderSearch, setOrderSearch] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Clients
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(false)
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientTx, setClientTx] = useState<BonusTx[]>([])
  const [clientOrders, setClientOrders] = useState<Order[]>([])
  const [clientDetailLoading, setClientDetailLoading] = useState(false)
  // Bonus adjust
  const [bonusAmount, setBonusAmount] = useState("")
  const [bonusDesc, setBonusDesc] = useState("")
  const [bonusLoading, setBonusLoading] = useState(false)
  const [bonusDone, setBonusDone] = useState(false)
  // Add/edit client
  const [showAddClient, setShowAddClient] = useState(false)
  const [editClientData, setEditClientData] = useState<Partial<Client>>({})
  const [clientSaving, setClientSaving] = useState(false)

  // Shop
  const [products, setProducts] = useState<Product[]>([])
  const [shopLoading, setShopLoading] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [productSaving, setProductSaving] = useState(false)

  // Editor
  const [content, setContent] = useState<ContentMap>({})
  const [contentLoading, setContentLoading] = useState(false)
  const [contentDirty, setContentDirty] = useState<Record<string, boolean>>({})
  const [contentSaving, setContentSaving] = useState(false)
  const [contentSaved, setContentSaved] = useState(false)
  const [editorSection, setEditorSection] = useState("hero")

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setAuthLoading(true); setAuthError("")
    try {
      const data = await adminFetch("stats", {}, tokenInput)
      if (data.total_clients !== undefined) {
        localStorage.setItem("ipro_admin_token", tokenInput)
        setToken(tokenInput); setAuthed(true); setStats(data)
      } else { setAuthError("Неверный пароль") }
    } catch { setAuthError("Ошибка подключения") }
    setAuthLoading(false)
  }

  useEffect(() => {
    if (!authed && token) {
      adminFetch("stats", {}, token).then((d) => { if (d.total_clients !== undefined) { setAuthed(true); setStats(d) } }).catch(() => {})
    }
  }, [])

  // ── Data loaders ─────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    const [s, o] = await Promise.all([
      adminFetch("stats", {}, token),
      adminFetch("search_orders", { limit: 5 }, token),
    ])
    setStats(s)
    setRecentOrders(o.orders || [])
  }, [token])

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true)
    const data = await adminFetch("search_orders", { query: orderSearch, status: orderStatusFilter, limit: 100 }, token)
    setOrders(data.orders || [])
    setOrdersLoading(false)
  }, [token, orderSearch, orderStatusFilter])

  const loadClients = useCallback(async () => {
    setClientsLoading(true)
    const data = await adminFetch("list_clients", { search: clientSearch }, token)
    setClients(data.clients || [])
    setClientsLoading(false)
  }, [token, clientSearch])

  const loadProducts = useCallback(async () => {
    setShopLoading(true)
    const data = await adminFetch("list_products", {}, token)
    setProducts(data.products || [])
    setShopLoading(false)
  }, [token])

  const loadContent = useCallback(async () => {
    setContentLoading(true)
    const data = await adminFetch("get_content", {}, token)
    setContent(data.content || {})
    setContentLoading(false)
  }, [token])

  const loadClientDetail = async (c: Client) => {
    setSelectedClient(c); setEditClientData({ ...c })
    setClientDetailLoading(true)
    const data = await adminFetch("client_bonus_history", { client_id: c.id }, token)
    setClientTx(data.transactions || [])
    setClientOrders(data.orders || [])
    setClientDetailLoading(false)
  }

  useEffect(() => {
    if (!authed) return
    if (tab === "dashboard") loadDashboard()
    if (tab === "orders") loadOrders()
    if (tab === "clients") loadClients()
    if (tab === "shop") loadProducts()
    if (tab === "editor") loadContent()
  }, [tab, authed])

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderNumber: string, status: string) => {
    await adminFetch("update_order_status", { order_number: orderNumber, status }, token)
    loadOrders()
  }

  const handleConfirmOrder = async (orderNumber: string) => {
    await adminFetch("confirm_order_bonus", { order_number: orderNumber }, token)
    loadOrders()
  }

  const handleDeleteOrder = async (orderNumber: string) => {
    if (!confirm(`Удалить заказ ${orderNumber}?`)) return
    await adminFetch("delete_order", { order_number: orderNumber }, token)
    setSelectedOrder(null); loadOrders()
  }

  const handleAdjustBonus = async () => {
    if (!selectedClient || !bonusAmount) return
    setBonusLoading(true)
    await adminFetch("adjust_bonus", { client_id: selectedClient.id, amount: parseInt(bonusAmount), description: bonusDesc || "Ручное начисление" }, token)
    setBonusDone(true)
    setTimeout(() => { setBonusDone(false); setBonusAmount(""); setBonusDesc(""); loadClientDetail(selectedClient) }, 1500)
    setBonusLoading(false)
  }

  const handleSaveClient = async () => {
    setClientSaving(true)
    if (editClientData.id) {
      await adminFetch("update_client", { client_id: editClientData.id, ...editClientData }, token)
    } else {
      await adminFetch("add_client", { ...editClientData }, token)
    }
    setClientSaving(false); setShowAddClient(false); setSelectedClient(null); loadClients()
  }

  const handleDeleteClient = async (cid: number) => {
    if (!confirm("Удалить клиента и все его данные?")) return
    await adminFetch("delete_client", { client_id: cid }, token)
    setSelectedClient(null); loadClients()
  }

  const handleSaveProduct = async () => {
    if (!editProduct) return
    setProductSaving(true)
    await adminFetch("save_product", editProduct, token)
    setProductSaving(false); setEditProduct(null); loadProducts()
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Удалить товар?")) return
    await adminFetch("delete_product", { id }, token)
    loadProducts()
  }

  const handleSaveContent = async () => {
    setContentSaving(true)
    const updates: { section: string; key: string; value: string }[] = []
    Object.entries(content).forEach(([sec, items]) => {
      items.forEach((item) => {
        if (contentDirty[`${sec}:${item.key}`]) {
          updates.push({ section: sec, key: item.key, value: item.value })
        }
      })
    })
    await adminFetch("update_content", { updates }, token)
    setContentDirty({}); setContentSaved(true)
    setTimeout(() => setContentSaved(false), 2000)
    setContentSaving(false)
  }

  const updateContent = (section: string, key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: prev[section].map((i) => i.key === key ? { ...i, value } : i),
    }))
    setContentDirty((prev) => ({ ...prev, [`${section}:${key}`]: true }))
  }

  const handleLogout = () => { localStorage.removeItem("ipro_admin_token"); setToken(""); setAuthed(false) }

  const sectionLabels: Record<string, string> = {
    hero: "Главный экран", contacts: "Контакты", loyalty: "Лояльность", seo: "SEO", about: "О компании",
  }

  // ── Login Screen ─────────────────────────────────────────────────────────
  if (!authed) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEOHead title="Администратор — iPro" description="" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-5">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Панель управления</h1>
        <p className="text-gray-400 text-sm mb-6">iPro Барнаул · Только для сотрудников</p>
        <input type="password" placeholder="Пароль администратора" value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {authError && <p className="text-red-500 text-xs mb-3 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{authError}</p>}
        <button onClick={handleLogin} disabled={authLoading}
          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Войти"}
        </button>
      </motion.div>
    </div>
  )

  const tabs = [
    { key: "dashboard", label: "Дашборд", icon: LayoutDashboard },
    { key: "orders", label: "Заказы", icon: Package },
    { key: "clients", label: "Клиенты", icon: Users },
    { key: "shop", label: "Магазин", icon: ShoppingBag },
    { key: "editor", label: "Редактор", icon: FileText },
  ] as const

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SEOHead title="Администратор — iPro" description="" />

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 shrink-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">iPro Admin</p>
              <p className="text-xs text-gray-400">Барнаул</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {tabs.map(({ key, label, icon: Ico }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${tab === key ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
              <Ico className="w-4 h-4 shrink-0" />{label}
              {key === "orders" && stats?.new_orders ? (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.new_orders}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 px-3 py-2 flex gap-1 overflow-x-auto">
        {tabs.map(({ key, label, icon: Ico }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${tab === key ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
            <Ico className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ═══════════════════════════════ DASHBOARD ═══════════════════════ */}
          {tab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-gray-900">Дашборд</h1>
                <button onClick={loadDashboard} className="w-8 h-8 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  {[
                    { label: "Клиентов", value: stats.total_clients, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Заказов", value: stats.total_orders, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
                    { label: "Новых", value: stats.new_orders, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                    { label: "Выручка", value: `${Math.round(stats.total_revenue / 1000)}к ₽`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
                    { label: "Бонусов", value: stats.total_bonuses, icon: Gift, color: "text-amber-600", bg: "bg-amber-50" },
                  ].map(({ label, value, icon: Ico, color, bg }) => (
                    <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4">
                      <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                        <Ico className={`w-4 h-4 ${color}`} />
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{value}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900 text-sm">Последние заявки</h2>
                  <button onClick={() => setTab("orders")} className="text-xs text-blue-600 hover:underline">Все заявки →</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {recentOrders.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm py-8">Заявок нет</p>
                  ) : recentOrders.map((o) => (
                    <div key={o.order_number} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{o.client_name || "—"} · {o.client_phone}</p>
                        <p className="text-xs text-gray-400">{o.device_brand} {o.device_model} · {o.service_name}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[o.status]}`}>{statusLabels[o.status]}</span>
                        <span className="text-sm font-bold text-gray-900">{(o.service_price || 0).toLocaleString("ru")} ₽</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════ ORDERS CRM ══════════════════════ */}
          {tab === "orders" && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h1 className="text-xl font-bold text-gray-900">CRM — Заказы</h1>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadOrders()}
                    placeholder="Поиск по клиенту, устройству, номеру..."
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <select value={orderStatusFilter} onChange={(e) => { setOrderStatusFilter(e.target.value) }}
                  className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
                  <option value="">Все статусы</option>
                  {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <button onClick={loadOrders} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                  Найти
                </button>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["Номер", "Клиент", "Устройство / Услуга", "Сумма", "Статус", "Дата", ""].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map((o) => (
                        <tr key={o.order_number} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-blue-600 font-medium">{o.order_number}</td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-900">{o.client_name || "—"}</p>
                            <p className="text-xs text-gray-400">{o.client_phone}</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-gray-800">{o.device_brand} {o.device_model}</p>
                            <p className="text-xs text-gray-400 truncate max-w-[180px]">{o.service_name}</p>
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-900">{(o.service_price || 0).toLocaleString("ru")} ₽</td>
                          <td className="px-4 py-3">
                            <select value={o.status} onChange={(e) => handleUpdateOrderStatus(o.order_number, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-lg border-0 font-medium cursor-pointer ${statusColors[o.status]}`}>
                              {Object.entries(statusLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                            {o.created_at ? new Date(o.created_at).toLocaleDateString("ru-RU") : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setSelectedOrder(o)} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                              {o.status !== "completed" && (
                                <button onClick={() => handleConfirmOrder(o.order_number)} className="p-1.5 rounded-lg text-gray-400 hover:bg-green-50 hover:text-green-600 transition-colors" title="Выдать + начислить бонусы"><Check className="w-4 h-4" /></button>
                              )}
                              <button onClick={() => handleDeleteOrder(o.order_number)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && !ordersLoading && (
                    <p className="text-center text-gray-400 text-sm py-10">Заявок не найдено</p>
                  )}
                </div>
              )}

              {/* Order detail modal */}
              <AnimatePresence>
                {selectedOrder && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedOrder(null)}>
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                      className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
                      onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">Заказ {selectedOrder.order_number}</h3>
                          <Badge label={statusLabels[selectedOrder.status]} color={statusColors[selectedOrder.status]} />
                        </div>
                        <button onClick={() => setSelectedOrder(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="space-y-2 text-sm">
                        {[
                          ["Клиент", selectedOrder.client_name || "—"],
                          ["Телефон", selectedOrder.client_phone],
                          ["Устройство", `${selectedOrder.device_brand} ${selectedOrder.device_model}`],
                          ["Услуга", selectedOrder.service_name],
                          ["Стоимость", `${(selectedOrder.service_price || 0).toLocaleString("ru")} ₽`],
                          ["Бонусов начислено", selectedOrder.bonus_earned || 0],
                          ["Комментарий", selectedOrder.comment || "—"],
                          ["Дата", selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleString("ru-RU") : "—"],
                        ].map(([l, v]) => (
                          <div key={l as string} className="flex gap-3">
                            <span className="text-gray-400 w-36 shrink-0">{l}</span>
                            <span className="text-gray-900 font-medium">{v}</span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 flex gap-2">
                        {selectedOrder.status !== "completed" && (
                          <Pill variant="success" onClick={() => { handleConfirmOrder(selectedOrder.order_number); setSelectedOrder(null) }}>
                            ✓ Выдать + бонусы
                          </Pill>
                        )}
                        <Pill variant="danger" onClick={() => handleDeleteOrder(selectedOrder.order_number)}>Удалить</Pill>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══════════════════════════════ CLIENTS ═════════════════════════ */}
          {tab === "clients" && (
            <motion.div key="clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-xl font-bold text-gray-900">Клиенты и бонусы</h1>
                <Pill onClick={() => { setEditClientData({}); setShowAddClient(true) }}>
                  <Plus className="w-3.5 h-3.5 inline mr-1" />Добавить клиента
                </Pill>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input value={clientSearch} onChange={(e) => setClientSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadClients()}
                    placeholder="Поиск по телефону, имени, email..."
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <button onClick={loadClients} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">Найти</button>
              </div>

              {clientsLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["Клиент", "Телефон", "Уровень", "Бонусы", "Ремонтов", "Потрачено", ""].map((h) => (
                          <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
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
                          <td className="px-4 py-3"><Badge label={loyaltyLabels[c.loyalty_level] || c.loyalty_level} color={loyaltyColors[c.loyalty_level] || "bg-gray-100 text-gray-600"} /></td>
                          <td className="px-4 py-3 font-bold text-blue-600">{c.bonus_balance}</td>
                          <td className="px-4 py-3 text-gray-700">{c.visits_count}</td>
                          <td className="px-4 py-3 text-gray-700">{(c.total_spent || 0).toLocaleString("ru")} ₽</td>
                          <td className="px-4 py-3">
                            <button onClick={() => loadClientDetail(c)} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {clients.length === 0 && <p className="text-center text-gray-400 text-sm py-10">Клиентов не найдено</p>}
                </div>
              )}

              {/* Client detail panel */}
              <AnimatePresence>
                {selectedClient && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedClient(null)}>
                    <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                      className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-start justify-between mb-5">
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">{selectedClient.name || "Клиент"}</h3>
                          <p className="text-gray-400 text-sm">{selectedClient.phone} · {selectedClient.email || "email не указан"}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge label={loyaltyLabels[selectedClient.loyalty_level]} color={loyaltyColors[selectedClient.loyalty_level]} />
                            <Badge label={`${selectedClient.bonus_balance} бонусов`} color="bg-blue-50 text-blue-700" />
                            <Badge label={`${selectedClient.visits_count} ремонтов`} color="bg-green-50 text-green-700" />
                          </div>
                        </div>
                        <button onClick={() => setSelectedClient(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        {/* Редактирование данных */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 text-sm">Данные клиента</h4>
                          {[
                            { field: "name", label: "Имя", type: "text" },
                            { field: "phone", label: "Телефон", type: "tel" },
                            { field: "email", label: "Email", type: "email" },
                          ].map(({ field, label, type }) => (
                            <div key={field}>
                              <label className="block text-xs text-gray-400 mb-1">{label}</label>
                              <input type={type} value={(editClientData as Record<string, string>)[field] || ""}
                                onChange={(e) => setEditClientData((p) => ({ ...p, [field]: e.target.value }))}
                                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                          ))}
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Уровень лояльности</label>
                            <select value={editClientData.loyalty_level || "standard"}
                              onChange={(e) => setEditClientData((p) => ({ ...p, loyalty_level: e.target.value }))}
                              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                              {loyaltyOptions.map((l) => <option key={l} value={l}>{loyaltyLabels[l]}</option>)}
                            </select>
                          </div>
                          <button onClick={handleSaveClient} disabled={clientSaving}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
                            {clientSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Сохранить
                          </button>
                          <button onClick={() => handleDeleteClient(selectedClient.id)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-500 text-sm font-medium hover:bg-red-100 transition-colors">
                            <Trash2 className="w-4 h-4" />Удалить клиента
                          </button>
                        </div>

                        {/* Начисление/списание бонусов */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-800 text-sm">Бонусы (баланс: {selectedClient.bonus_balance})</h4>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Сумма (+ начислить / - списать)</label>
                            <input type="number" value={bonusAmount} onChange={(e) => setBonusAmount(e.target.value)}
                              placeholder="Например: 500 или -200"
                              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Комментарий</label>
                            <input type="text" value={bonusDesc} onChange={(e) => setBonusDesc(e.target.value)}
                              placeholder="Причина начисления/списания"
                              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                          <button onClick={handleAdjustBonus} disabled={bonusLoading || !bonusAmount}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-60">
                            {bonusLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : bonusDone ? <Check className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                            {bonusDone ? "Начислено!" : "Применить бонусы"}
                          </button>

                          {/* История бонусов */}
                          {clientDetailLoading ? <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> : (
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                              <p className="text-xs text-gray-400 font-medium">История операций</p>
                              {clientTx.length === 0 ? <p className="text-xs text-gray-300">Операций нет</p> :
                                clientTx.map((tx, i) => (
                                  <div key={i} className="flex justify-between text-xs">
                                    <span className="text-gray-500 truncate max-w-[160px]">{tx.description}</span>
                                    <span className={tx.type === "earn" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                                      {tx.type === "earn" ? "+" : "-"}{tx.amount}
                                    </span>
                                  </div>
                                ))
                              }
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Заказы клиента */}
                      {clientOrders.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-gray-100">
                          <h4 className="font-semibold text-gray-800 text-sm mb-3">Заказы клиента ({clientOrders.length})</h4>
                          <div className="space-y-2">
                            {clientOrders.map((o) => (
                              <div key={o.order_number} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm">
                                <div>
                                  <p className="font-medium text-gray-900">{o.device_brand} {o.device_model}</p>
                                  <p className="text-xs text-gray-400">{o.order_number} · {o.service_name}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">{(o.service_price || 0).toLocaleString("ru")} ₽</p>
                                  <Badge label={statusLabels[o.status] || o.status} color={statusColors[o.status] || "bg-gray-100 text-gray-600"} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add client modal */}
              <AnimatePresence>
                {showAddClient && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowAddClient(false)}>
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                      className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
                      onClick={(e) => e.stopPropagation()}>
                      <h3 className="font-bold text-gray-900 mb-4">Новый клиент</h3>
                      {[
                        { field: "phone", label: "Телефон *", type: "tel" },
                        { field: "name", label: "Имя", type: "text" },
                        { field: "email", label: "Email", type: "email" },
                        { field: "bonus_balance", label: "Начальные бонусы", type: "number" },
                      ].map(({ field, label, type }) => (
                        <div key={field} className="mb-3">
                          <label className="block text-xs text-gray-500 mb-1">{label}</label>
                          <input type={type} value={(editClientData as Record<string, string>)[field] || ""}
                            onChange={(e) => setEditClientData((p) => ({ ...p, [field]: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      ))}
                      <div className="mb-4">
                        <label className="block text-xs text-gray-500 mb-1">Уровень</label>
                        <select value={editClientData.loyalty_level || "standard"}
                          onChange={(e) => setEditClientData((p) => ({ ...p, loyalty_level: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none">
                          {loyaltyOptions.map((l) => <option key={l} value={l}>{loyaltyLabels[l]}</option>)}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={handleSaveClient} disabled={clientSaving}
                          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                          {clientSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Добавить"}
                        </button>
                        <button onClick={() => setShowAddClient(false)} className="px-4 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">Отмена</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══════════════════════════════ SHOP ════════════════════════════ */}
          {tab === "shop" && (
            <motion.div key="shop" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-xl font-bold text-gray-900">Каталог магазина</h1>
                <Pill onClick={() => setEditProduct({ ...EMPTY_PRODUCT })}>
                  <Plus className="w-3.5 h-3.5 inline mr-1" />Добавить товар
                </Pill>
              </div>

              {shopLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                      {p.image_url && <img src={p.image_url} alt={p.name} className="w-full h-40 object-cover bg-gray-50" />}
                      {!p.image_url && <div className="w-full h-40 bg-gray-50 flex items-center justify-center"><ShoppingBag className="w-10 h-10 text-gray-200" /></div>}
                      <div className="p-4">
                        {p.badge && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium mb-2 inline-block">{p.badge}</span>}
                        <p className="font-semibold text-gray-900 text-sm">{p.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.brand} · {p.category}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div>
                            <span className="font-bold text-gray-900">{p.price.toLocaleString("ru")} ₽</span>
                            {p.old_price && <span className="text-xs text-gray-400 line-through ml-2">{p.old_price.toLocaleString("ru")} ₽</span>}
                          </div>
                          <span className={`text-xs font-medium ${p.in_stock ? "text-green-600" : "text-red-500"}`}>{p.in_stock ? "В наличии" : "Нет"}</span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => setEditProduct({ ...p })} className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
                            <Edit2 className="w-3 h-3" />Редактировать
                          </button>
                          <button onClick={() => handleDeleteProduct(p.id!)} className="py-2 px-3 rounded-xl bg-red-50 text-red-500 text-xs hover:bg-red-100 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <div className="col-span-3 py-16 text-center text-gray-400">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                      <p>Товаров пока нет. Добавьте первый!</p>
                    </div>
                  )}
                </div>
              )}

              {/* Product edit modal */}
              <AnimatePresence>
                {editProduct && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                    onClick={() => setEditProduct(null)}>
                    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                      className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-5">
                        <h3 className="font-bold text-gray-900">{editProduct.id ? "Редактировать товар" : "Новый товар"}</h3>
                        <button onClick={() => setEditProduct(null)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { field: "name", label: "Название *", type: "text", span: true },
                          { field: "brand", label: "Бренд", type: "text" },
                          { field: "category", label: "Категория", type: "text" },
                          { field: "price", label: "Цена ₽ *", type: "number" },
                          { field: "old_price", label: "Старая цена ₽", type: "number" },
                          { field: "badge", label: "Бейдж (Новинка, Хит...)", type: "text" },
                          { field: "sort_order", label: "Порядок", type: "number" },
                        ].map(({ field, label, type, span }) => (
                          <div key={field} className={span ? "col-span-2" : ""}>
                            <label className="block text-xs text-gray-500 mb-1">{label}</label>
                            <input type={type}
                              value={(editProduct as Record<string, string | number>)[field] as string || ""}
                              onChange={(e) => setEditProduct((p) => ({ ...p!, [field]: type === "number" ? Number(e.target.value) : e.target.value }))}
                              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                          </div>
                        ))}
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">URL изображения</label>
                          <input type="text" value={editProduct.image_url || ""}
                            onChange={(e) => setEditProduct((p) => ({ ...p!, image_url: e.target.value }))}
                            placeholder="https://cdn.poehali.dev/..."
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">Описание</label>
                          <textarea rows={3} value={editProduct.description || ""}
                            onChange={(e) => setEditProduct((p) => ({ ...p!, description: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                        </div>
                        <div className="col-span-2 flex items-center gap-3">
                          <label className="text-sm text-gray-700 font-medium">В наличии</label>
                          <button onClick={() => setEditProduct((p) => ({ ...p!, in_stock: !p!.in_stock }))}
                            className={`w-10 h-6 rounded-full transition-colors ${editProduct.in_stock ? "bg-green-500" : "bg-gray-300"} relative`}>
                            <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${editProduct.in_stock ? "left-4" : "left-0.5"}`} />
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-5">
                        <button onClick={handleSaveProduct} disabled={productSaving}
                          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                          {productSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Сохранить
                        </button>
                        <button onClick={() => setEditProduct(null)} className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">Отмена</button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ═══════════════════════════════ EDITOR ══════════════════════════ */}
          {tab === "editor" && (
            <motion.div key="editor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h1 className="text-xl font-bold text-gray-900">Редактор сайта</h1>
                <div className="flex items-center gap-2">
                  <a href="/" target="_blank" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 text-gray-600 text-sm hover:bg-gray-200 transition-colors">
                    <Eye className="w-4 h-4" />Просмотр
                  </a>
                  <button onClick={handleSaveContent} disabled={contentSaving || Object.keys(contentDirty).length === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {contentSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : contentSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {contentSaved ? "Сохранено!" : `Сохранить${Object.keys(contentDirty).length ? ` (${Object.keys(contentDirty).length})` : ""}`}
                  </button>
                </div>
              </div>

              {contentLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
              ) : (
                <div className="flex gap-4">
                  {/* Section tabs */}
                  <div className="shrink-0 w-40 bg-white rounded-2xl border border-gray-100 p-2 space-y-0.5 self-start">
                    {Object.keys(content).map((sec) => (
                      <button key={sec} onClick={() => setEditorSection(sec)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${editorSection === sec ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
                        {sectionLabels[sec] || sec}
                        {Object.keys(contentDirty).some((k) => k.startsWith(`${sec}:`)) && (
                          <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full inline-block" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Fields */}
                  <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
                    <h2 className="font-semibold text-gray-900">{sectionLabels[editorSection] || editorSection}</h2>
                    {(content[editorSection] || []).map((item) => (
                      <div key={item.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">{item.label || item.key}</label>
                        {item.type === "textarea" ? (
                          <textarea rows={4} value={item.value}
                            onChange={(e) => updateContent(editorSection, item.key, e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-colors ${contentDirty[`${editorSection}:${item.key}`] ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`} />
                        ) : (
                          <input type={item.type === "number" ? "number" : "text"} value={item.value}
                            onChange={(e) => updateContent(editorSection, item.key, e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${contentDirty[`${editorSection}:${item.key}`] ? "border-blue-300 bg-blue-50" : "border-gray-200 bg-gray-50"}`} />
                        )}
                        {contentDirty[`${editorSection}:${item.key}`] && (
                          <p className="text-xs text-blue-500 mt-1">Изменено · не забудь сохранить</p>
                        )}
                      </div>
                    ))}
                    {(content[editorSection] || []).length === 0 && (
                      <p className="text-gray-400 text-sm">Нет полей для редактирования</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
