import { Dispatch, SetStateAction } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Plus, Search, Check, X, Eye, Save, Trash2, Gift } from "lucide-react"
import {
  Badge, Pill, loyaltyOptions, loyaltyLabels, loyaltyColors,
  statusLabels, statusColors,
  type AdminTab, type Client, type BonusTx, type Order,
} from "./adminShared"

interface AdminClientsProps {
  tab: AdminTab
  clients: Client[]
  clientsLoading: boolean
  clientSearch: string
  setClientSearch: (v: string) => void
  loadClients: () => void
  selectedClient: Client | null
  setSelectedClient: (c: Client | null) => void
  clientTx: BonusTx[]
  clientOrders: Order[]
  clientDetailLoading: boolean
  loadClientDetail: (c: Client) => void
  bonusAmount: string
  setBonusAmount: (v: string) => void
  bonusDesc: string
  setBonusDesc: (v: string) => void
  bonusLoading: boolean
  bonusDone: boolean
  handleAdjustBonus: () => void
  showAddClient: boolean
  setShowAddClient: (v: boolean) => void
  editClientData: Partial<Client>
  setEditClientData: Dispatch<SetStateAction<Partial<Client>>>
  clientSaving: boolean
  handleSaveClient: () => void
  handleDeleteClient: (id: number) => void
}

export default function AdminClients({
  tab, clients, clientsLoading, clientSearch, setClientSearch, loadClients,
  selectedClient, setSelectedClient, clientTx, clientOrders, clientDetailLoading, loadClientDetail,
  bonusAmount, setBonusAmount, bonusDesc, setBonusDesc, bonusLoading, bonusDone, handleAdjustBonus,
  showAddClient, setShowAddClient, editClientData, setEditClientData, clientSaving, handleSaveClient, handleDeleteClient,
}: AdminClientsProps) {
  if (tab !== "clients") return null

  return (
    <motion.div key="clients" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold text-gray-900">Клиенты и бонусы</h1>
        <Pill onClick={() => { setEditClientData(() => ({})); setShowAddClient(true) }}>
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
  )
}