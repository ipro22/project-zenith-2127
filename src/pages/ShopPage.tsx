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
}

const products: Product[] = [
  { id: 1, name: "iPhone 16 Pro Max 256GB", category: "iPhone", price: 129990, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop", badge: "Хит", description: "Titanium Design · Camera Control · 48MP" },
  { id: 2, name: "iPhone 16 Pro 128GB", category: "iPhone", price: 109990, image: "https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=400&h=400&fit=crop", description: "A18 Pro · Action Button · ProMotion 120Hz" },
  { id: 3, name: "iPhone 15 128GB", category: "iPhone", price: 79990, oldPrice: 89990, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=400&fit=crop", badge: "Скидка", description: "USB-C · Dynamic Island · 48MP" },
  { id: 4, name: "iPhone 14 128GB", category: "iPhone", price: 64990, oldPrice: 74990, image: "https://images.unsplash.com/photo-1574755393849-623942496936?w=400&h=400&fit=crop", description: "A15 Bionic · 12MP · Emergency SOS" },
  { id: 5, name: "MacBook Air 13\" M3", category: "MacBook", price: 139990, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", badge: "Новинка", description: "M3 · 8GB / 256GB · Liquid Retina" },
  { id: 6, name: "MacBook Pro 14\" M4", category: "MacBook", price: 189990, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop", description: "M4 Pro · 24GB / 512GB · XDR Display" },
  { id: 7, name: "iPad Pro 11\" M4", category: "iPad", price: 99990, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop", badge: "Хит", description: "M4 · OLED · 256GB · Wi-Fi" },
  { id: 8, name: "iPad Air 11\" M2", category: "iPad", price: 74990, image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=400&fit=crop", description: "M2 · Liquid Retina · 128GB" },
  { id: 9, name: "AirPods Pro 2", category: "Аксессуары", price: 24990, oldPrice: 27990, image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=400&fit=crop", badge: "Скидка", description: "ANC · USB-C · Adaptive Audio" },
  { id: 10, name: "AirPods 4", category: "Аксессуары", price: 18990, image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&h=400&fit=crop", description: "ANC · Open-ear Design · H2 chip" },
  { id: 11, name: "Apple Watch Series 10", category: "Apple Watch", price: 49990, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", description: "OLED · Always-On · GPS" },
  { id: 12, name: "Apple Watch Ultra 2", category: "Apple Watch", price: 89990, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop", badge: "Premium", description: "Titanium · 49mm · Action Button" },
  { id: 13, name: "Чехол MagSafe для iPhone 16 Pro", category: "Аксессуары", price: 3990, image: "https://images.unsplash.com/photo-1592813952479-15e4b9c1af26?w=400&h=400&fit=crop", description: "Прозрачный · MagSafe · Противоударный" },
  { id: 14, name: "Apple USB-C кабель 2м", category: "Аксессуары", price: 2490, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", description: "Оригинальный · Быстрая зарядка 60W" },
  { id: 15, name: "MagSafe зарядка 15W", category: "Аксессуары", price: 4990, image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop", description: "15W · Совместима с iPhone 12+" },
  { id: 16, name: "Apple Pencil Pro", category: "Аксессуары", price: 12990, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop", badge: "Новинка", description: "Для iPad Pro M4 · Hover · Barrel Roll" },
]

const categories = ["Все", "iPhone", "MacBook", "iPad", "Apple Watch", "Аксессуары"]

interface CartItem extends Product { qty: number }

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState("Все")
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [orderStep, setOrderStep] = useState<"cart" | "form" | "done">("cart")
  const [orderName, setOrderName] = useState("")
  const [orderPhone, setOrderPhone] = useState("")
  const [addedId, setAddedId] = useState<number | null>(null)

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

  const handleOrder = () => {
    if (orderName && orderPhone) setOrderStep("done")
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
              <p className="text-sm text-zinc-500 uppercase tracking-wider mb-2">Магазин техники</p>
              <h1 className="font-display text-4xl font-bold text-zinc-100">Apple Store</h1>
              <p className="text-zinc-500 mt-2">Оригинальная техника Apple. Самовывоз из нашего центра в Барнауле.</p>
            </div>
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-sm text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <Icon name="ShoppingCart" size={18} />
              Корзина
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-100 text-zinc-900 text-xs font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </motion.div>

          {/* Info banner */}
          <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 mb-8 flex flex-wrap gap-6">
            {[
              { icon: "Store", text: "Самовывоз из офиса (ул. Молодёжная 34)" },
              { icon: "Shield", text: "Официальная гарантия Apple" },
              { icon: "BadgeCheck", text: "100% оригинальная техника" },
              { icon: "CreditCard", text: "Оплата при получении или онлайн" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-zinc-400">
                <Icon name={icon} size={16} className="text-zinc-500" />
                {text}
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${activeCategory === cat ? "bg-zinc-100 text-zinc-900 font-medium" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden hover:border-zinc-700/60 transition-all group"
              >
                <div className="relative">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  {product.badge && (
                    <span className={`absolute top-3 left-3 text-xs font-medium px-2.5 py-1 rounded-full ${product.badge === "Хит" ? "bg-orange-500/90 text-white" : product.badge === "Новинка" ? "bg-blue-500/90 text-white" : product.badge === "Premium" ? "bg-yellow-500/90 text-zinc-900" : "bg-red-500/90 text-white"}`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-zinc-500 mb-1">{product.category}</p>
                  <h3 className="font-heading font-semibold text-zinc-200 text-sm mb-1 leading-tight">{product.name}</h3>
                  <p className="text-xs text-zinc-600 mb-3">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-zinc-100">{product.price.toLocaleString("ru-RU")} ₽</p>
                      {product.oldPrice && <p className="text-xs text-zinc-600 line-through">{product.oldPrice.toLocaleString("ru-RU")} ₽</p>}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${addedId === product.id ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`}
                    >
                      {addedId === product.id ? <><Icon name="Check" size={14} />Добавлено</> : <><Icon name="ShoppingCart" size={14} />В корзину</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

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
                      <p className="text-xs text-zinc-600 text-center mt-2">Самовывоз из офиса, ул. Молодёжная 34</p>
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
                    <p className="text-xs text-zinc-500">Мы свяжемся с вами для подтверждения заказа и согласования времени самовывоза</p>
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
                    <p className="text-zinc-500 text-sm mb-6">Мы перезвоним в течение 30 минут для подтверждения</p>
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
