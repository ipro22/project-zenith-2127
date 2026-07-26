import { Dispatch, SetStateAction } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2, Plus, Edit2, X, Save, Trash2, ShoppingBag, Layers } from "lucide-react"
import { Pill, type AdminTab, type Product, type Story } from "./adminShared"

interface AdminCatalogProps {
  tab: AdminTab
  // Shop
  products: Product[]
  shopLoading: boolean
  editProduct: Product | null
  setEditProduct: Dispatch<SetStateAction<Product | null>>
  productSaving: boolean
  handleSaveProduct: () => void
  handleDeleteProduct: (id: number) => void
  EMPTY_PRODUCT: Product
  // Stories
  stories: Story[]
  storiesLoading: boolean
  editStory: Story | null
  setEditStory: Dispatch<SetStateAction<Story | null>>
  storySaving: boolean
  handleSaveStory: () => void
  handleDeleteStory: (id: number) => void
  EMPTY_STORY: Story
}

export default function AdminCatalog({
  tab,
  products, shopLoading, editProduct, setEditProduct, productSaving, handleSaveProduct, handleDeleteProduct, EMPTY_PRODUCT,
  stories, storiesLoading, editStory, setEditStory, storySaving, handleSaveStory, handleDeleteStory, EMPTY_STORY,
}: AdminCatalogProps) {
  return (
    <>
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

      {/* ═══════════════════════════════ STORIES ════════════════════════ */}
      {tab === "stories" && (
        <motion.div key="stories" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-xl font-bold text-gray-900">Истории (Stories)</h1>
            <Pill onClick={() => setEditStory({ ...EMPTY_STORY })}>
              <Plus className="w-3.5 h-3.5 inline mr-1" />Добавить историю
            </Pill>
          </div>
          <p className="text-sm text-gray-400">Истории отображаются на главной странице в виде кружков, как в Instagram. Нажатие открывает полноэкранный баннер.</p>

          {storiesLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stories.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="h-28 relative" style={{ background: `linear-gradient(135deg, ${s.gradient_from}, ${s.gradient_to})` }}>
                    {s.image_url && <img src={s.image_url} alt={s.title} className="w-full h-full object-cover opacity-60" />}
                    <div className="absolute inset-0 flex items-end p-3">
                      <div>
                        <p className="text-white font-bold text-sm drop-shadow">{s.title}</p>
                        {s.subtitle && <p className="text-white/80 text-xs">{s.subtitle}</p>}
                      </div>
                    </div>
                    {!s.is_active && (
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">Скрыто</div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div className="text-xs text-gray-400">
                      {s.link_url ? <span className="text-blue-500 truncate max-w-[140px] block">{s.link_url}</span> : "Без ссылки"}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditStory({ ...s })} className="p-1.5 rounded-lg text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDeleteStory(s.id!)} className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                </div>
              ))}
              {stories.length === 0 && (
                <div className="col-span-3 py-12 text-center text-gray-400">
                  <Layers className="w-10 h-10 mx-auto mb-2 text-gray-200" />
                  <p>Историй нет. Добавьте первую!</p>
                </div>
              )}
            </div>
          )}

          {/* Story modal */}
          <AnimatePresence>
            {editStory && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                onClick={() => setEditStory(null)}>
                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-gray-900">{editStory.id ? "Редактировать историю" : "Новая история"}</h3>
                    <button onClick={() => setEditStory(null)}><X className="w-5 h-5 text-gray-400" /></button>
                  </div>
                  <div className="space-y-3">
                    {[
                      { field: "title", label: "Заголовок *", placeholder: "Розыгрыш iPhone 17" },
                      { field: "subtitle", label: "Подзаголовок", placeholder: "Участвуй и выигрывай!" },
                      { field: "image_url", label: "URL картинки", placeholder: "https://..." },
                      { field: "link_url", label: "Ссылка при нажатии", placeholder: "/giveaway" },
                      { field: "link_label", label: "Текст кнопки", placeholder: "Подробнее" },
                      { field: "gradient_from", label: "Цвет фона (начало)", placeholder: "#1d4ed8" },
                      { field: "gradient_to", label: "Цвет фона (конец)", placeholder: "#7c3aed" },
                      { field: "sort_order", label: "Порядок (0 = первый)", placeholder: "0" },
                    ].map(({ field, label, placeholder }) => (
                      <div key={field}>
                        <label className="block text-xs text-gray-500 mb-1">{label}</label>
                        <input type={field === "sort_order" ? "number" : "text"}
                          value={(editStory as Record<string, string | number | boolean>)[field] as string || ""}
                          onChange={(e) => setEditStory((p) => ({ ...p!, [field]: field === "sort_order" ? Number(e.target.value) : e.target.value }))}
                          placeholder={placeholder}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    ))}
                    <div className="flex items-center gap-3 pt-1">
                      <label className="text-sm text-gray-700 font-medium">Показывать на сайте</label>
                      <button onClick={() => setEditStory((p) => ({ ...p!, is_active: !p!.is_active }))}
                        className={`w-10 h-6 rounded-full transition-colors relative ${editStory.is_active ? "bg-blue-500" : "bg-gray-300"}`}>
                        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${editStory.is_active ? "left-4" : "left-0.5"}`} />
                      </button>
                    </div>
                    {/* Preview */}
                    <div className="mt-2 h-20 rounded-2xl overflow-hidden relative"
                      style={{ background: `linear-gradient(135deg, ${editStory.gradient_from || "#1d4ed8"}, ${editStory.gradient_to || "#7c3aed"})` }}>
                      {editStory.image_url && <img src={editStory.image_url} className="w-full h-full object-cover opacity-50" alt="" />}
                      <div className="absolute inset-0 flex items-end p-3">
                        <p className="text-white font-bold text-sm drop-shadow">{editStory.title || "Предпросмотр"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button onClick={handleSaveStory} disabled={storySaving}
                      className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60 flex items-center justify-center gap-2">
                      {storySaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Сохранить
                    </button>
                    <button onClick={() => setEditStory(null)} className="px-5 py-3 rounded-xl bg-gray-100 text-gray-600 text-sm">Отмена</button>
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
