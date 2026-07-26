import { AnimatePresence, motion } from "framer-motion"
import {
  Loader2, Users, Package, Gift, TrendingUp, Search,
  Check, X, RefreshCw, AlertCircle, Eye, Trash2,
} from "lucide-react"
import {
  Badge, Pill, statusLabels, statusColors,
  type AdminTab, type Stats, type Order,
} from "./adminShared"

interface AdminDashboardOrdersProps {
  tab: AdminTab
  setTab: (t: AdminTab) => void
  // Dashboard
  stats: Stats | null
  recentOrders: Order[]
  loadDashboard: () => void
  // Orders
  orders: Order[]
  ordersLoading: boolean
  orderSearch: string
  setOrderSearch: (v: string) => void
  orderStatusFilter: string
  setOrderStatusFilter: (v: string) => void
  loadOrders: () => void
  selectedOrder: Order | null
  setSelectedOrder: (o: Order | null) => void
  handleUpdateOrderStatus: (orderNumber: string, status: string) => void
  handleConfirmOrder: (orderNumber: string) => void
  handleDeleteOrder: (orderNumber: string) => void
}

export default function AdminDashboardOrders({
  tab, setTab, stats, recentOrders, loadDashboard,
  orders, ordersLoading, orderSearch, setOrderSearch,
  orderStatusFilter, setOrderStatusFilter, loadOrders,
  selectedOrder, setSelectedOrder, handleUpdateOrderStatus,
  handleConfirmOrder, handleDeleteOrder,
}: AdminDashboardOrdersProps) {
  return (
    <>
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
    </>
  )
}
