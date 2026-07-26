import { Dispatch, SetStateAction } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Loader2, Plus, Edit2, X, Save, Trash2, RefreshCw,
  Eye, Check, DollarSign, Send, Search,
} from "lucide-react"
import { Pill, type AdminTab, type Price, type ContentMap } from "./adminShared"

interface AdminContentProps {
  tab: AdminTab
  // Prices
  filteredPrices: Price[]
  pricesLoading: boolean
  editPrice: Price | null
  setEditPrice: Dispatch<SetStateAction<Price | null>>
  priceSaving: boolean
  pricesBrand: string
  setPricesBrand: (v: string) => void
  pricesSearch: string
  setPricesSearch: (v: string) => void
  loadPrices: () => void
  handleSavePrice: () => void
  handleDeletePrice: (id: number) => void
  EMPTY_PRICE: Price
  // Editor
  content: ContentMap
  contentLoading: boolean
  contentDirty: Record<string, boolean>
  contentSaving: boolean
  contentSaved: boolean
  editorSection: string
  setEditorSection: (v: string) => void
  updateContent: (section: string, key: string, value: string) => void
  handleSaveContent: () => void
  sectionLabels: Record<string, string>
  tgTestMsg: string
  setTgTestMsg: (v: string) => void
  tgSending: boolean
  tgResult: string
  handleTelegramTest: () => void
}

export default function AdminContent({
  tab,
  filteredPrices, pricesLoading, editPrice, setEditPrice, priceSaving,
  pricesBrand, setPricesBrand, pricesSearch, setPricesSearch, loadPrices,
  handleSavePrice, handleDeletePrice, EMPTY_PRICE,
  content, contentLoading, contentDirty, contentSaving, contentSaved,
  editorSection, setEditorSection, updateContent, handleSaveContent, sectionLabels,
  tgTestMsg, setTgTestMsg, tgSending, tgResult, handleTelegramTest,
}: AdminContentProps) {
  return (
    <>
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

                {/* Telegram test block */}
                {editorSection === "telegram" && (
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Send className="w-4 h-4 text-blue-500" />Тестовое уведомление
                    </p>
                    <p className="text-xs text-gray-400 mb-3">Сохраните токен и chat_id выше, затем проверьте доставку тестового сообщения в Telegram.</p>
                    <div className="flex gap-2">
                      <input value={tgTestMsg} onChange={(e) => setTgTestMsg(e.target.value)}
                        placeholder="Текст тестового сообщения (необязательно)"
                        className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button onClick={handleTelegramTest} disabled={tgSending}
                        className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2">
                        {tgSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    </div>
                    {tgResult && <p className={`text-xs mt-2 ${tgResult.startsWith("✓") ? "text-green-600" : "text-red-500"}`}>{tgResult}</p>}
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl text-xs text-blue-700 space-y-1">
                      <p className="font-semibold">Как подключить Telegram:</p>
                      <p>1. Создайте бота через @BotFather → получите токен</p>
                      <p>2. Добавьте бота в группу/канал и сделайте его администратором</p>
                      <p>3. Chat ID для группы: запустите бота, напишите сообщение, откройте <code className="bg-blue-100 px-1 rounded">api.telegram.org/bot{"<token>"}/getUpdates</code></p>
                      <p>4. Вставьте токен и chat_id в поля выше, сохраните, затем проверьте тестом</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ═══════════════════════════════ PRICES ══════════════════════════ */}
      {tab === "prices" && (
        <motion.div key="prices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-xl font-bold text-gray-900">Прайс-лист услуг</h1>
            <Pill onClick={() => setEditPrice({ ...EMPTY_PRICE })}>
              <Plus className="w-3.5 h-3.5 inline mr-1" />Добавить цену
            </Pill>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <select value={pricesBrand} onChange={(e) => { setPricesBrand(e.target.value) }}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none">
              <option value="">Все бренды</option>
              {["iphone", "samsung", "macbook", "ipad", "xiaomi", "realme", "other"].map((b) => (
                <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>
              ))}
            </select>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={pricesSearch} onChange={(e) => setPricesSearch(e.target.value)}
                placeholder="Поиск по модели, услуге..."
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={loadPrices} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {pricesLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["Бренд", "Модель", "Услуга", "Цена", "Числовая цена", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredPrices.map((p) => (
                    <tr key={p.id} className={`hover:bg-gray-50 transition-colors ${!p.is_active ? "opacity-50" : ""}`}>
                      <td className="px-4 py-3 font-medium text-gray-700">{p.brand_name}</td>
                      <td className="px-4 py-3 text-gray-700">{p.model_name}</td>
                      <td className="px-4 py-3 text-gray-600">{p.service_name}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{p.price_text}</td>
                      <td className="px-4 py-3 text-gray-500">{p.price_num.toLocaleString("ru")} ₽</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => setEditPrice({ ...p })} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDeletePrice(p.id!)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredPrices.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  <DollarSign className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                  <p>Цен нет. Добавьте первую или выберите другой бренд.</p>
                </div>
              )}
            </div>
          )}

          {/* Price edit modal */}
          <AnimatePresence>
            {editPrice && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                onClick={() => setEditPrice(null)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-gray-900">{editPrice.id ? "Редактировать цену" : "Новая цена"}</h3>
                    <button onClick={() => setEditPrice(null)}><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { field: "brand_slug", label: "Slug бренда *", placeholder: "iphone" },
                      { field: "brand_name", label: "Название бренда *", placeholder: "iPhone" },
                      { field: "model_slug", label: "Slug модели *", placeholder: "iphone-15-pro" },
                      { field: "model_name", label: "Название модели *", placeholder: "iPhone 15 Pro" },
                      { field: "service_name", label: "Услуга *", placeholder: "Замена экрана" },
                      { field: "price_text", label: "Текст цены", placeholder: "от 8 500 ₽" },
                      { field: "price_num", label: "Цена (число) *", placeholder: "8500" },
                      { field: "sort_order", label: "Порядок", placeholder: "0" },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field} className={field === "service_name" || field === "price_text" ? "col-span-2" : ""}>
                        <label className="block text-xs text-gray-500 mb-1">{label}</label>
                        <input type={["price_num", "sort_order"].includes(field) ? "number" : "text"}
                          value={(editPrice as Record<string, string | number | boolean>)[field] as string || ""}
                          onChange={(e) => setEditPrice((p) => ({ ...p!, [field]: ["price_num", "sort_order"].includes(field) ? Number(e.target.value) : e.target.value }))}
                          placeholder={placeholder}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    ))}
                    <div className="col-span-2 flex items-center gap-3">
                      <label className="text-sm text-gray-700 font-medium">Активна</label>
                      <button onClick={() => setEditPrice((p) => ({ ...p!, is_active: !p!.is_active }))}
                        className={`w-10 h-6 rounded-full transition-colors relative ${editPrice.is_active ? "bg-blue-500" : "bg-gray-300"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${editPrice.is_active ? "left-4" : "left-0.5"}`} />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button onClick={handleSavePrice} disabled={priceSaving}
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                      {priceSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Сохранить
                    </button>
                    <button onClick={() => setEditPrice(null)} className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm">Отмена</button>
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