import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { LiquidCtaButton } from "@/components/buttons/LiquidCtaButton"
import Icon from "@/components/ui/icon"

interface Product {
  id: number
  name: string
  category: string
  price: number
  oldPrice?: number
  image: string
  badge?: string
  description: string
  specs?: string[]
  inStock: boolean
}

const initialProducts: Product[] = [
  { id: 1, name: "iPhone 16 Pro Max 256GB", category: "iPhone", price: 129990, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop", badge: "Хит", description: "Топовый iPhone с камерой Camera Control и чипом A18 Pro.", specs: ["Дисплей: 6.9\" Super Retina XDR OLED", "Процессор: A18 Pro", "Память: 8GB RAM / 256GB", "Камера: 48MP + 12MP + 12MP", "Аккумулятор: 4685 mAh", "Гарантия: 1 год"], inStock: true },
  { id: 2, name: "iPhone 16 Pro 128GB", category: "iPhone", price: 109990, image: "https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=600&h=600&fit=crop", description: "iPhone 16 Pro с Action Button и ProMotion 120Hz.", specs: ["Дисплей: 6.3\" Super Retina XDR OLED", "Процессор: A18 Pro", "Память: 8GB RAM / 128GB", "Камера: 48MP тройная система", "Аккумулятор: 3582 mAh", "Гарантия: 1 год"], inStock: true },
  { id: 3, name: "iPhone 15 128GB", category: "iPhone", price: 79990, oldPrice: 89990, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop", badge: "Скидка", description: "iPhone 15 с USB-C и Dynamic Island.", specs: ["Дисплей: 6.1\" Super Retina XDR OLED", "Процессор: A16 Bionic", "Память: 6GB RAM / 128GB", "Камера: 48MP + 12MP", "Аккумулятор: 3877 mAh", "Гарантия: 1 год"], inStock: true },
  { id: 4, name: "iPhone 14 128GB", category: "iPhone", price: 64990, oldPrice: 74990, image: "https://images.unsplash.com/photo-1574755393849-623942496936?w=600&h=600&fit=crop", description: "iPhone 14 — надёжный выбор за разумные деньги.", specs: ["Дисплей: 6.1\" Super Retina XDR OLED", "Процессор: A15 Bionic", "Память: 6GB RAM / 128GB", "Камера: 12MP + 12MP", "Аккумулятор: 3279 mAh", "Гарантия: 1 год"], inStock: true },
  { id: 5, name: "MacBook Air 13\" M3", category: "MacBook", price: 139990, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop", badge: "Новинка", description: "Самый тонкий MacBook Air на чипе Apple M3.", specs: ["Дисплей: 13.6\" Liquid Retina 2560×1664", "Процессор: Apple M3 (8 ядер)", "Память: 8GB / SSD 256GB", "Автономность: до 18 часов", "Порты: 2× USB-C, MagSafe 3", "Гарантия: 1 год"], inStock: true },
  { id: 6, name: "MacBook Pro 14\" M4", category: "MacBook", price: 189990, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop", description: "MacBook Pro 14 с M4 Pro и дисплеем Liquid Retina XDR.", specs: ["Дисплей: 14.2\" Liquid Retina XDR 3024×1964", "Процессор: Apple M4 Pro (12 ядер)", "Память: 24GB / SSD 512GB", "Автономность: до 22 часов", "Порты: 3× USB-C, HDMI, SD, MagSafe", "Гарантия: 1 год"], inStock: true },
  { id: 7, name: "iPad Pro 11\" M4", category: "iPad", price: 99990, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop", badge: "Хит", description: "iPad Pro с OLED дисплеем и чипом M4 — тоньше MacBook Air.", specs: ["Дисплей: 11\" Ultra Retina XDR OLED", "Процессор: Apple M4", "Память: 8GB / 256GB", "Камера: 12MP + LiDAR", "Аккумулятор: ~10 часов", "Гарантия: 1 год"], inStock: true },
  { id: 8, name: "iPad Air 11\" M2", category: "iPad", price: 74990, image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop", description: "iPad Air на M2 — мощный планшет для работы и творчества.", specs: ["Дисплей: 11\" Liquid Retina 2360×1640", "Процессор: Apple M2", "Память: 8GB / 128GB", "Камера: 12MP", "Аккумулятор: ~10 часов", "Гарантия: 1 год"], inStock: true },
  { id: 9, name: "AirPods Pro 2 (USB-C)", category: "Аксессуары", price: 24990, oldPrice: 27990, image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&h=600&fit=crop", badge: "Скидка", description: "AirPods Pro с активным шумоподавлением и Adaptive Audio.", specs: ["Шумоподавление: Adaptive ANC", "Разъём: USB-C", "Автономность: 6ч + 24ч (кейс)", "Чип: H2", "Пылевлагозащита: IP54", "Гарантия: 1 год"], inStock: true },
  { id: 10, name: "AirPods 4", category: "Аксессуары", price: 18990, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop", description: "AirPods 4 — open-ear дизайн нового поколения.", specs: ["Дизайн: Open-ear без вкладышей", "Чип: H2", "ANC: опционально", "Автономность: 5ч + 30ч (кейс)", "Разъём кейса: USB-C", "Гарантия: 1 год"], inStock: true },
  { id: 11, name: "Apple Watch Series 10", category: "Apple Watch", price: 49990, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop", description: "Apple Watch Series 10 — самые тонкие Apple Watch.", specs: ["Дисплей: OLED Always-On 46mm", "Процессор: S10 SiP", "GPS + Cellular (версия)", "Датчики: ЧСС, ЭКГ, SpO2, температура", "Пылевлагозащита: IP6X / 50м", "Гарантия: 1 год"], inStock: true },
  { id: 12, name: "Apple Watch Ultra 2", category: "Apple Watch", price: 89990, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop", badge: "Premium", description: "Apple Watch Ultra 2 — для экстремальных нагрузок.", specs: ["Корпус: Титан 49mm", "Дисплей: OLED 2000 нит", "GPS: Dual-frequency L1/L5", "Автономность: до 60 часов", "Пылевлагозащита: IP6X / 100м", "Гарантия: 1 год"], inStock: false },
  { id: 13, name: "Чехол MagSafe iPhone 16 Pro", category: "Аксессуары", price: 3990, image: "https://images.unsplash.com/photo-1592813952479-15e4b9c1af26?w=600&h=600&fit=crop", description: "Оригинальный прозрачный чехол MagSafe с противоударной защитой.", specs: ["Совместимость: iPhone 16 Pro", "MagSafe: да", "Материал: поликарбонат + силикон", "Защита: углы усилены"], inStock: true },
  { id: 14, name: "Кабель Apple USB-C 2м", category: "Аксессуары", price: 2490, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop", description: "Оригинальный кабель Apple USB-C для быстрой зарядки.", specs: ["Длина: 2 метра", "Тип: USB-C — USB-C", "Мощность: до 60W", "Совместимость: iPhone, iPad, MacBook"], inStock: true },
  { id: 15, name: "MagSafe зарядка 15W", category: "Аксессуары", price: 4990, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop", description: "Беспроводная зарядка MagSafe 15W для iPhone 12 и новее.", specs: ["Мощность: 15W (с адаптером 20W)", "Совместимость: iPhone 12 и новее", "Разъём: USB-C", "Длина кабеля: 1 метр"], inStock: true },
  { id: 16, name: "Apple Pencil Pro", category: "Аксессуары", price: 12990, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop", badge: "Новинка", description: "Apple Pencil Pro с Barrel Roll и функцией Hover.", specs: ["Функции: Hover, Barrel Roll, Squeeze", "Совместимость: iPad Pro M4, iPad Air M2", "Зарядка: MagSafe", "Задержка: < 9ms"], inStock: true },
]

const categories = ["Все", "iPhone", "MacBook", "iPad", "Apple Watch", "Аксессуары"]
const badgeColors: Record<string, string> = {
  "Хит": "bg-orange-500/90 text-white",
  "Новинка": "bg-blue-500/90 text-white",
  "Premium": "bg-yellow-500/90 text-zinc-900",
  "Скидка": "bg-red-500/90 text-white",
}

interface CartItem extends Product { qty: number }

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [activeCategory, setActiveCategory] = useState("Все")
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderStep, setOrderStep] = useState<"cart" | "form" | "done">("cart")
  const [orderName, setOrderName] = useState("")
  const [orderPhone, setOrderPhone] = useState("")
  const [addedId, setAddedId] = useState<number | null>(null)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [editMode, setEditMode] = useState(false)

  const filtered = activeCategory === "Все" ? products : products.filter((p) => p.category === activeCategory)

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }

  const removeFromCart = (id: number) => setCart((prev) => prev.filter((i) => i.id !== id))
  const changeQty = (id: number, delta: number) => setCart((prev) => prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i))
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  const handleOrder = () => { if (orderName && orderPhone) setOrderStep("done") }

  const saveEdit = () => {
    if (!editProduct) return
    setProducts((prev) => prev.map((p) => p.id === editProduct.id ? editProduct : p))
    setEditMode(false)
    setEditProduct(null)
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead
        title="Магазин Apple техники в Барнауле — iPro | iPhone, MacBook, iPad"
        description="Купить iPhone, MacBook, iPad, AirPods, Apple Watch в Барнауле. Оригинальная техника Apple с гарантией. Самовывоз из сервисного центра iPro."
      />
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2 text-center">Магазин техники</p>
              <h1 className="font-display text-4xl font-bold text-zinc-100 text-center">iStore</h1>
              <p className="text-zinc-500 mt-2 text-center">Оригинальная техника. Самовывоз из центра в Барнауле.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                <Icon name="ShoppingCart" size={18} />
                Корзина
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold flex items-center justify-center">{cartCount}</span>
                )}
              </button>
            </div>
          </motion.div>

          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 mb-8 flex flex-wrap gap-5">
            {[
              { icon: "Store", text: "Самовывоз — ул. Молодёжная 34" },
              { icon: "Shield", text: "Гарантия Apple 1 год" },
              { icon: "BadgeCheck", text: "100% оригинальная техника" },
              { icon: "CreditCard", text: "Оплата при получении" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-zinc-400">
                <Icon name={icon} size={15} className="text-zinc-500" />
                {text}
              </div>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm transition-all ${activeCategory === cat ? "bg-zinc-100 text-zinc-900 font-medium" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden hover:border-zinc-700/60 transition-all group flex flex-col"
              >
                <div className="relative cursor-pointer" onClick={() => setDetailProduct(product)}>
                  <img src={product.image} alt={product.name} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.badge && (
                    <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full ${badgeColors[product.badge] ?? "bg-zinc-700 text-zinc-200"}`}>
                      {product.badge}
                    </span>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-xs text-white font-medium bg-zinc-800/80 px-3 py-1 rounded-full">Нет в наличии</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-zinc-500 mb-1">{product.category}</p>
                  <h3
                    className="font-heading font-semibold text-zinc-200 text-sm mb-1 leading-tight cursor-pointer hover:text-white transition-colors"
                    onClick={() => setDetailProduct(product)}
                  >
                    {product.name}
                  </h3>
                  <p className="text-xs text-zinc-600 mb-3 flex-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="font-bold text-zinc-100">{product.price.toLocaleString("ru-RU")} ₽</p>
                      {product.oldPrice && <p className="text-xs text-zinc-600 line-through">{product.oldPrice.toLocaleString("ru-RU")} ₽</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditProduct({ ...product }); setEditMode(true) }}
                        className="w-8 h-8 rounded-xl bg-zinc-800 text-zinc-500 hover:text-zinc-300 flex items-center justify-center transition-colors"
                        title="Редактировать"
                      >
                        <Icon name="Pencil" size={13} />
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={!product.inStock}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${addedId === product.id ? "bg-green-500/20 text-green-400 border border-green-500/30" : product.inStock ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" : "bg-zinc-800/30 text-zinc-600 cursor-not-allowed"}`}
                      >
                        {addedId === product.id ? <><Icon name="Check" size={13} />OK</> : <><Icon name="ShoppingCart" size={13} />Купить</>}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Detail modal */}
      <AnimatePresence>
        {detailProduct && !editMode && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50" onClick={() => setDetailProduct(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setDetailProduct(null)}
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative">
                    <img src={detailProduct.image} alt={detailProduct.name} className="w-full h-64 md:h-full object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />
                    {detailProduct.badge && (
                      <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${badgeColors[detailProduct.badge] ?? "bg-zinc-700 text-zinc-200"}`}>
                        {detailProduct.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-zinc-500 mb-1">{detailProduct.category}</p>
                        <h2 className="font-display text-xl font-bold text-zinc-100">{detailProduct.name}</h2>
                      </div>
                      <button onClick={() => setDetailProduct(null)} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200 shrink-0 ml-2">
                        <Icon name="X" size={15} />
                      </button>
                    </div>

                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="font-display text-2xl font-bold text-zinc-100">{detailProduct.price.toLocaleString("ru-RU")} ₽</span>
                      {detailProduct.oldPrice && <span className="text-sm text-zinc-600 line-through">{detailProduct.oldPrice.toLocaleString("ru-RU")} ₽</span>}
                    </div>

                    <p className="text-sm text-zinc-400 mb-4">{detailProduct.description}</p>

                    {detailProduct.specs && (
                      <div className="rounded-xl bg-zinc-800/40 border border-zinc-700/30 p-4 mb-5">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Характеристики</p>
                        <ul className="space-y-1">
                          {detailProduct.specs.map((s, i) => (
                            <li key={i} className="text-sm text-zinc-300 flex gap-2">
                              <span className="text-zinc-600">•</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!detailProduct.inStock ? (
                      <p className="text-sm text-zinc-500 text-center py-2">Нет в наличии — уточните по телефону</p>
                    ) : (
                      <button
                        onClick={() => { addToCart(detailProduct); setDetailProduct(null) }}
                        className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 font-semibold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icon name="ShoppingCart" size={16} />
                        В корзину
                      </button>
                    )}

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => { setEditProduct({ ...detailProduct }); setDetailProduct(null); setEditMode(true) }}
                        className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icon name="Pencil" size={14} />
                        Редактировать
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Edit modal */}
      <AnimatePresence>
        {editMode && editProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/70 z-50" onClick={() => { setEditMode(false); setEditProduct(null) }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-semibold text-zinc-100">Редактировать товар</h2>
                  <button onClick={() => { setEditMode(false); setEditProduct(null) }} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200">
                    <Icon name="X" size={15} />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Название</label>
                    <input value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-zinc-600" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">Цена (₽)</label>
                      <input type="number" value={editProduct.price} onChange={(e) => setEditProduct({ ...editProduct, price: +e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-zinc-600" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">Старая цена (₽)</label>
                      <input type="number" value={editProduct.oldPrice ?? ""} onChange={(e) => setEditProduct({ ...editProduct, oldPrice: e.target.value ? +e.target.value : undefined })} placeholder="Без скидки" className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-zinc-600 placeholder:text-zinc-600" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Ссылка на фото</label>
                    <input value={editProduct.image} onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })} className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-zinc-600" />
                  </div>
                  {editProduct.image && (
                    <img src={editProduct.image} alt="preview" className="w-full h-32 object-cover rounded-xl border border-zinc-700" />
                  )}
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Описание</label>
                    <textarea value={editProduct.description} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} rows={2} className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none focus:border-zinc-600 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">Бейдж</label>
                      <select value={editProduct.badge ?? ""} onChange={(e) => setEditProduct({ ...editProduct, badge: e.target.value || undefined })} className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none">
                        <option value="">Без бейджа</option>
                        <option value="Хит">Хит</option>
                        <option value="Новинка">Новинка</option>
                        <option value="Скидка">Скидка</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">Наличие</label>
                      <select value={editProduct.inStock ? "yes" : "no"} onChange={(e) => setEditProduct({ ...editProduct, inStock: e.target.value === "yes" })} className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm outline-none">
                        <option value="yes">В наличии</option>
                        <option value="no">Нет в наличии</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => { setEditMode(false); setEditProduct(null) }} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors">
                    Отмена
                  </button>
                  <button onClick={saveEdit} className="flex-1 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-sm hover:bg-zinc-200 transition-colors">
                    Сохранить
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart sidebar */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50" onClick={() => { setCartOpen(false); setOrderStep("cart") }} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-900 border-l border-zinc-800 z-50 flex flex-col">
              <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
                <h2 className="font-heading font-semibold text-zinc-100">
                  {orderStep === "cart" ? "Корзина" : orderStep === "form" ? "Оформление" : "Заказ принят!"}
                </h2>
                <button onClick={() => { setCartOpen(false); setOrderStep("cart") }} className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-200">
                  <Icon name="X" size={16} />
                </button>
              </div>

              {orderStep === "cart" && (
                <>
                  <div className="flex-1 overflow-y-auto px-6 py-4">
                    {cart.length === 0 ? (
                      <div className="text-center py-16 text-zinc-500">
                        <Icon name="ShoppingCart" size={40} className="mx-auto mb-3 opacity-30" />
                        <p>Корзина пуста</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-200 leading-tight truncate">{item.name}</p>
                              <p className="text-sm font-bold text-zinc-100 mt-1">{(item.price * item.qty).toLocaleString("ru-RU")} ₽</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button onClick={() => changeQty(item.id, -1)} className="w-6 h-6 rounded-md bg-zinc-700 text-zinc-300 flex items-center justify-center hover:bg-zinc-600 text-xs">-</button>
                                <span className="text-xs text-zinc-400 w-4 text-center">{item.qty}</span>
                                <button onClick={() => changeQty(item.id, 1)} className="w-6 h-6 rounded-md bg-zinc-700 text-zinc-300 flex items-center justify-center hover:bg-zinc-600 text-xs">+</button>
                                <button onClick={() => removeFromCart(item.id)} className="ml-auto text-zinc-600 hover:text-red-400 transition-colors">
                                  <Icon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {cart.length > 0 && (
                    <div className="px-6 py-5 border-t border-zinc-800">
                      <div className="flex justify-between mb-4">
                        <span className="text-zinc-400">Итого:</span>
                        <span className="font-bold text-xl text-zinc-100">{total.toLocaleString("ru-RU")} ₽</span>
                      </div>
                      <button onClick={() => setOrderStep("form")} className="w-full py-3 rounded-xl bg-zinc-100 text-zinc-900 font-semibold hover:bg-zinc-200 transition-colors">
                        Оформить заказ
                      </button>
                      <p className="text-xs text-zinc-600 text-center mt-2">Самовывоз — ул. Молодёжная 34</p>
                    </div>
                  )}
                </>
              )}

              {orderStep === "form" && (
                <div className="flex-1 px-6 py-5 flex flex-col">
                  <div className="flex-1 space-y-4">
                    <div className="rounded-xl bg-zinc-800/40 p-4 mb-4">
                      {cart.map((i) => <div key={i.id} className="flex justify-between text-sm text-zinc-400 py-0.5"><span>{i.name} ×{i.qty}</span><span>{(i.price * i.qty).toLocaleString("ru-RU")} ₽</span></div>)}
                      <div className="flex justify-between font-bold text-zinc-200 border-t border-zinc-700/30 mt-2 pt-2"><span>Итого</span><span>{total.toLocaleString("ru-RU")} ₽</span></div>
                    </div>
                    <input type="text" value={orderName} onChange={(e) => setOrderName(e.target.value)} placeholder="Ваше имя" className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none" />
                    <input type="tel" value={orderPhone} onChange={(e) => setOrderPhone(e.target.value)} placeholder="+7 (___) ___-__-__" className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none" />
                    <p className="text-xs text-zinc-500">Мы свяжемся для подтверждения и согласования времени самовывоза</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setOrderStep("cart")} className="px-4 py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm">Назад</button>
                    <button onClick={handleOrder} disabled={!orderName || !orderPhone} className="flex-1 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-semibold disabled:opacity-30">Подтвердить</button>
                  </div>
                </div>
              )}

              {orderStep === "done" && (
                <div className="flex-1 flex items-center justify-center px-6">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-5">
                      <Icon name="CheckCircle" size={32} className="text-green-400" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-zinc-100 mb-2">Заказ оформлен!</h3>
                    <p className="text-zinc-500 text-sm mb-6">Перезвоним в течение 30 минут для подтверждения</p>
                    <a href="tel:+79993231817" className="block mb-3">
                      <LiquidCtaButton>Позвонить сейчас</LiquidCtaButton>
                    </a>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  )
}