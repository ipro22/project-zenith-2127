import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { Breadcrumb } from "@/components/Breadcrumb"
import { API, apiPost } from "@/hooks/useApi"
import Icon from "@/components/ui/icon"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useCallback } from "react"

// ─── Types ───────────────────────────────────────────────────────────────────

interface Product {
  id: number
  name: string
  brand: string
  category: string
  storage?: string
  hasNfc?: boolean
  price: number
  oldPrice?: number
  image: string
  badge?: string
  description: string
  specs?: string[]
  inStock: boolean
}

interface CartItem extends Product {
  qty: number
}

// ─── Product Data ─────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "iPhone 16 Pro Max 256GB",
    brand: "Apple",
    category: "iPhone",
    storage: "256GB",
    hasNfc: true,
    price: 129990,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&h=600&fit=crop",
    badge: "Хит",
    description: "Топовый iPhone с камерой Camera Control и чипом A18 Pro. Дисплей 6.9\" Super Retina XDR OLED ProMotion 120Hz.",
    specs: ["Дисплей: 6.9\" Super Retina XDR OLED", "Процессор: A18 Pro", "Память: 8GB RAM / 256GB", "Камера: 48MP + 12MP + 12MP", "Аккумулятор: 4685 mAh", "NFC: есть", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 2,
    name: "iPhone 16 Pro 128GB",
    brand: "Apple",
    category: "iPhone",
    storage: "128GB",
    hasNfc: true,
    price: 109990,
    image: "https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=600&h=600&fit=crop",
    description: "iPhone 16 Pro с Action Button и ProMotion 120Hz.",
    specs: ["Дисплей: 6.3\" Super Retina XDR OLED", "Процессор: A18 Pro", "Память: 8GB RAM / 128GB", "Камера: 48MP тройная система", "Аккумулятор: 3582 mAh", "NFC: есть", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 3,
    name: "iPhone 15 128GB",
    brand: "Apple",
    category: "iPhone",
    storage: "128GB",
    hasNfc: true,
    price: 79990,
    oldPrice: 89990,
    image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&h=600&fit=crop",
    badge: "Скидка",
    description: "iPhone 15 с USB-C и Dynamic Island.",
    specs: ["Дисплей: 6.1\" Super Retina XDR OLED", "Процессор: A16 Bionic", "Память: 6GB RAM / 128GB", "Камера: 48MP + 12MP", "Аккумулятор: 3877 mAh", "NFC: есть", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 4,
    name: "iPhone 14 128GB",
    brand: "Apple",
    category: "iPhone",
    storage: "128GB",
    hasNfc: true,
    price: 64990,
    oldPrice: 74990,
    image: "https://images.unsplash.com/photo-1574755393849-623942496936?w=600&h=600&fit=crop",
    description: "iPhone 14 — надёжный выбор за разумные деньги.",
    specs: ["Дисплей: 6.1\" Super Retina XDR OLED", "Процессор: A15 Bionic", "Память: 6GB RAM / 128GB", "Камера: 12MP + 12MP", "Аккумулятор: 3279 mAh", "NFC: есть", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 5,
    name: "MacBook Air 13\" M3",
    brand: "Apple",
    category: "MacBook",
    storage: "256GB",
    hasNfc: false,
    price: 139990,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop",
    badge: "Новинка",
    description: "Самый тонкий MacBook Air на чипе Apple M3.",
    specs: ["Дисплей: 13.6\" Liquid Retina 2560×1664", "Процессор: Apple M3 (8 ядер)", "Память: 8GB / SSD 256GB", "Автономность: до 18 часов", "Порты: 2× USB-C, MagSafe 3", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 6,
    name: "MacBook Pro 14\" M4",
    brand: "Apple",
    category: "MacBook",
    storage: "512GB",
    hasNfc: false,
    price: 189990,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop",
    description: "MacBook Pro 14 с M4 Pro и дисплеем Liquid Retina XDR.",
    specs: ["Дисплей: 14.2\" Liquid Retina XDR 3024×1964", "Процессор: Apple M4 Pro (12 ядер)", "Память: 24GB / SSD 512GB", "Автономность: до 22 часов", "Порты: 3× USB-C, HDMI, SD, MagSafe", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 7,
    name: "iPad Pro 11\" M4",
    brand: "Apple",
    category: "iPad",
    storage: "256GB",
    hasNfc: true,
    price: 99990,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
    badge: "Хит",
    description: "iPad Pro с OLED дисплеем и чипом M4 — тоньше MacBook Air.",
    specs: ["Дисплей: 11\" Ultra Retina XDR OLED", "Процессор: Apple M4", "Память: 8GB / 256GB", "Камера: 12MP + LiDAR", "Аккумулятор: ~10 часов", "NFC: есть", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 8,
    name: "iPad Air 11\" M2",
    brand: "Apple",
    category: "iPad",
    storage: "128GB",
    hasNfc: true,
    price: 74990,
    image: "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop",
    description: "iPad Air на M2 — мощный планшет для работы и творчества.",
    specs: ["Дисплей: 11\" Liquid Retina 2360×1640", "Процессор: Apple M2", "Память: 8GB / 128GB", "Камера: 12MP", "Аккумулятор: ~10 часов", "NFC: есть", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 9,
    name: "AirPods Pro 2 (USB-C)",
    brand: "Apple",
    category: "Аксессуары",
    hasNfc: false,
    price: 24990,
    oldPrice: 27990,
    image: "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&h=600&fit=crop",
    badge: "Скидка",
    description: "AirPods Pro с активным шумоподавлением и Adaptive Audio.",
    specs: ["Шумоподавление: Adaptive ANC", "Разъём: USB-C", "Автономность: 6ч + 24ч (кейс)", "Чип: H2", "Пылевлагозащита: IP54", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 10,
    name: "AirPods 4",
    brand: "Apple",
    category: "Аксессуары",
    hasNfc: false,
    price: 18990,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop",
    description: "AirPods 4 — open-ear дизайн нового поколения.",
    specs: ["Дизайн: Open-ear без вкладышей", "Чип: H2", "ANC: опционально", "Автономность: 5ч + 30ч (кейс)", "Разъём кейса: USB-C", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 11,
    name: "Apple Watch Series 10",
    brand: "Apple",
    category: "Apple Watch",
    hasNfc: true,
    price: 49990,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop",
    description: "Apple Watch Series 10 — самые тонкие Apple Watch.",
    specs: ["Дисплей: OLED Always-On 46mm", "Процессор: S10 SiP", "GPS + Cellular (версия)", "Датчики: ЧСС, ЭКГ, SpO2, температура", "NFC: есть", "Пылевлагозащита: IP6X / 50м", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 12,
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "Apple Watch",
    hasNfc: true,
    price: 89990,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop",
    badge: "Premium",
    description: "Apple Watch Ultra 2 — для экстремальных нагрузок.",
    specs: ["Корпус: Титан 49mm", "Дисплей: OLED 2000 нит", "GPS: Dual-frequency L1/L5", "Автономность: до 60 часов", "NFC: есть", "Пылевлагозащита: IP6X / 100м", "Гарантия: 1 год"],
    inStock: false,
  },
  {
    id: 13,
    name: "Чехол MagSafe iPhone 16 Pro",
    brand: "Apple",
    category: "Аксессуары",
    hasNfc: false,
    price: 3990,
    image: "https://images.unsplash.com/photo-1592813952479-15e4b9c1af26?w=600&h=600&fit=crop",
    description: "Оригинальный прозрачный чехол MagSafe с противоударной защитой.",
    specs: ["Совместимость: iPhone 16 Pro", "MagSafe: да", "Материал: поликарбонат + силикон", "Защита: углы усилены"],
    inStock: true,
  },
  {
    id: 14,
    name: "Кабель Apple USB-C 2м",
    brand: "Apple",
    category: "Аксессуары",
    hasNfc: false,
    price: 2490,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop",
    description: "Оригинальный кабель Apple USB-C для быстрой зарядки.",
    specs: ["Длина: 2 метра", "Тип: USB-C — USB-C", "Мощность: до 60W", "Совместимость: iPhone, iPad, MacBook"],
    inStock: true,
  },
  {
    id: 15,
    name: "MagSafe зарядка 15W",
    brand: "Apple",
    category: "Аксессуары",
    hasNfc: false,
    price: 4990,
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&h=600&fit=crop",
    description: "Беспроводная зарядка MagSafe 15W для iPhone 12 и новее.",
    specs: ["Мощность: 15W (с адаптером 20W)", "Совместимость: iPhone 12 и новее", "Разъём: USB-C", "Длина кабеля: 1 метр"],
    inStock: true,
  },
  {
    id: 16,
    name: "Apple Pencil Pro",
    brand: "Apple",
    category: "Аксессуары",
    hasNfc: false,
    price: 12990,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop",
    badge: "Новинка",
    description: "Apple Pencil Pro с Barrel Roll и функцией Hover.",
    specs: ["Функции: Hover, Barrel Roll, Squeeze", "Совместимость: iPad Pro M4, iPad Air M2", "Зарядка: MagSafe", "Задержка: < 9ms"],
    inStock: true,
  },
  {
    id: 17,
    name: "Samsung Galaxy S25 Ultra 256GB",
    brand: "Samsung",
    category: "Samsung",
    storage: "256GB",
    hasNfc: true,
    price: 119990,
    oldPrice: 129990,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop",
    badge: "Хит",
    description: "Samsung Galaxy S25 Ultra с S Pen и камерой 200MP на чипе Snapdragon 8 Elite.",
    specs: ["Дисплей: 6.9\" Dynamic AMOLED 2X 120Hz", "Процессор: Snapdragon 8 Elite", "Память: 12GB RAM / 256GB", "Камера: 200MP + 50MP + 10MP + 12MP", "Аккумулятор: 5000 mAh", "NFC: есть", "Гарантия: 1 год"],
    inStock: true,
  },
  {
    id: 18,
    name: "Samsung Galaxy S25+ 512GB",
    brand: "Samsung",
    category: "Samsung",
    storage: "512GB",
    hasNfc: true,
    price: 99990,
    image: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=600&h=600&fit=crop",
    badge: "Новинка",
    description: "Samsung Galaxy S25+ — тонкий флагман с большим дисплеем и Galaxy AI.",
    specs: ["Дисплей: 6.7\" Dynamic AMOLED 2X 120Hz", "Процессор: Snapdragon 8 Elite", "Память: 12GB RAM / 512GB", "Камера: 50MP + 10MP + 12MP", "Аккумулятор: 4900 mAh", "NFC: есть", "Гарантия: 1 год"],
    inStock: true,
  },
]

// ─── Filter constants ─────────────────────────────────────────────────────────

const BRANDS = ["Все", "Apple", "Samsung"]
const CATEGORIES = ["Все", "iPhone", "MacBook", "iPad", "Apple Watch", "Аксессуары", "Samsung"]
const STORAGES = ["Все", "64GB", "128GB", "256GB", "512GB", "1TB"]
const NFC_OPTIONS = ["Все", "Есть", "Нет"]
const SORT_OPTIONS = ["По умолчанию", "Цена: сначала дешевле", "Цена: сначала дороже", "Новинки"]

const BADGE_STYLES: Record<string, string> = {
  "Хит": "bg-orange-500 text-white",
  "Новинка": "bg-blue-500 text-white",
  "Premium": "bg-yellow-500 text-gray-900",
  "Скидка": "bg-red-500 text-white",
}

const CART_STORAGE_KEY = "ipro_shop_cart"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(p: number) {
  return p.toLocaleString("ru-RU") + " ₽"
}

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border ${
        active
          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
          : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"
      }`}
    >
      {label}
    </button>
  )
}

function ProductCard({
  product,
  onAdd,
  onDetail,
  isAdded,
}: {
  product: Product
  onAdd: (p: Product) => void
  onDetail: (p: Product) => void
  isAdded: boolean
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden group hover:shadow-md transition-shadow"
    >
      {/* Image */}
      <div
        className="relative cursor-pointer bg-gray-50"
        onClick={() => onDetail(product)}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[product.badge] ?? "bg-gray-500 text-white"}`}
          >
            {product.badge}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500 bg-white px-3 py-1.5 rounded-full border border-gray-200">
              Нет в наличии
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <p className="text-xs text-blue-500 font-medium mb-0.5">{product.brand} · {product.category}</p>
          <h3
            className="text-sm font-semibold text-gray-900 leading-tight cursor-pointer hover:text-blue-600 transition-colors line-clamp-2"
            onClick={() => onDetail(product)}
          >
            {product.name}
          </h3>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {product.storage && (
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">
              {product.storage}
            </span>
          )}
          {product.hasNfc !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-lg ${product.hasNfc ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
              NFC {product.hasNfc ? "есть" : "нет"}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onDetail(product)}
            className="flex-1 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            Подробнее
          </button>
          <button
            disabled={!product.inStock}
            onClick={() => product.inStock && onAdd(product)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              isAdded
                ? "bg-green-500 text-white"
                : product.inStock
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Icon name={isAdded ? "Check" : "ShoppingCart"} size={14} />
            {isAdded ? "Добавлено" : "В корзину"}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ShopPage() {
  // Filters
  const [filterBrand, setFilterBrand] = useState("Все")
  const [filterCategory, setFilterCategory] = useState("Все")
  const [filterStorage, setFilterStorage] = useState("Все")
  const [filterNfc, setFilterNfc] = useState("Все")
  const [sortOption, setSortOption] = useState("По умолчанию")

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => loadCartFromStorage())
  const [cartOpen, setCartOpen] = useState(false)
  const [orderStep, setOrderStep] = useState<"cart" | "form" | "done">("cart")
  const [orderName, setOrderName] = useState("")
  const [orderPhone, setOrderPhone] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // UI
  const [addedId, setAddedId] = useState<number | null>(null)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)

  // Persist cart
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  // Close modal on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDetailProduct(null)
        setCartOpen(false)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  // ─── Filter & Sort logic ───────────────────────────────────────────────────

  const filtered = PRODUCTS.filter((p) => {
    if (filterBrand !== "Все" && p.brand !== filterBrand) return false
    if (filterCategory !== "Все" && p.category !== filterCategory) return false
    if (filterStorage !== "Все" && p.storage !== filterStorage) return false
    if (filterNfc === "Есть" && !p.hasNfc) return false
    if (filterNfc === "Нет" && p.hasNfc !== false) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sortOption === "Цена: сначала дешевле") return a.price - b.price
    if (sortOption === "Цена: сначала дороже") return b.price - a.price
    if (sortOption === "Новинки") return (b.badge === "Новинка" ? 1 : 0) - (a.badge === "Новинка" ? 1 : 0)
    return 0
  })

  // ─── Cart actions ──────────────────────────────────────────────────────────

  const addToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) return prev.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { ...product, qty: 1 }]
    })
    setAddedId(product.id)
    setTimeout(() => setAddedId(null), 1500)
  }, [])

  const removeFromCart = useCallback((id: number) => {
    setCart((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const changeQty = useCallback((id: number, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
    )
  }, [])

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0)

  // ─── Order submit ──────────────────────────────────────────────────────────

  const handleOrder = async () => {
    if (!orderName.trim() || !orderPhone.trim()) return
    setSubmitting(true)
    setSubmitError("")
    try {
      await apiPost(API.orders, {
        action: "create",
        client_name: orderName.trim(),
        client_phone: orderPhone.trim(),
        device_brand: "Магазин",
        device_model: cart.map((i) => i.name).join(", "),
        service_name: "Покупка товаров",
        service_price: total,
        source: "shop",
      })
      setOrderStep("done")
      setCart([])
    } catch {
      setSubmitError("Не удалось отправить заказ. Попробуйте ещё раз.")
    } finally {
      setSubmitting(false)
    }
  }

  const resetCart = () => {
    setCartOpen(false)
    setOrderStep("cart")
    setOrderName("")
    setOrderPhone("")
    setSubmitError("")
  }

  // ─── Filter reset ──────────────────────────────────────────────────────────

  const hasActiveFilters =
    filterBrand !== "Все" ||
    filterCategory !== "Все" ||
    filterStorage !== "Все" ||
    filterNfc !== "Все" ||
    sortOption !== "По умолчанию"

  const resetFilters = () => {
    setFilterBrand("Все")
    setFilterCategory("Все")
    setFilterStorage("Все")
    setFilterNfc("Все")
    setSortOption("По умолчанию")
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEOHead
        title="Магазин Apple-техники — iPro Service"
        description="Купите iPhone, MacBook, iPad, Apple Watch и аксессуары в магазине iPro Service. Гарантия 1 год, быстрая доставка."
      />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Магазин", href: "/shop" }]} />
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Магазин Apple-техники</h1>
          <p className="text-gray-500 text-base">iPhone, MacBook, iPad, Apple Watch и аксессуары с гарантией 1 год</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
          <div className="flex flex-wrap gap-y-4 gap-x-6">
            {/* Brand */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Бренд</p>
              <div className="flex flex-wrap gap-1.5">
                {BRANDS.map((b) => (
                  <FilterPill key={b} label={b} active={filterBrand === b} onClick={() => setFilterBrand(b)} />
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Категория</p>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <FilterPill key={c} label={c} active={filterCategory === c} onClick={() => setFilterCategory(c)} />
                ))}
              </div>
            </div>

            {/* Storage */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Объём памяти</p>
              <div className="flex flex-wrap gap-1.5">
                {STORAGES.map((s) => (
                  <FilterPill key={s} label={s} active={filterStorage === s} onClick={() => setFilterStorage(s)} />
                ))}
              </div>
            </div>

            {/* NFC */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">NFC</p>
              <div className="flex flex-wrap gap-1.5">
                {NFC_OPTIONS.map((n) => (
                  <FilterPill key={n} label={n} active={filterNfc === n} onClick={() => setFilterNfc(n)} />
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-xs text-gray-400 font-medium mb-2 uppercase tracking-wide">Сортировка</p>
              <div className="flex flex-wrap gap-1.5">
                {SORT_OPTIONS.map((s) => (
                  <FilterPill key={s} label={s} active={sortOption === s} onClick={() => setSortOption(s)} />
                ))}
              </div>
            </div>
          </div>

          {/* Reset */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <Icon name="X" size={14} />
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm text-gray-500">
            Найдено: <span className="font-semibold text-gray-900">{sorted.length}</span> товаров
          </p>
        </div>

        {/* Product Grid */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Icon name="SearchX" size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-semibold text-gray-500">Ничего не найдено</p>
            <p className="text-sm text-gray-400 mt-1">Попробуйте изменить фильтры</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            <AnimatePresence mode="popLayout">
              {sorted.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAdd={addToCart}
                  onDetail={setDetailProduct}
                  isAdded={addedId === product.id}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* ─── Floating Cart Button ─── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            onClick={() => { setCartOpen(true) }}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 bg-blue-600 text-white px-5 py-3.5 rounded-2xl shadow-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
          >
            <Icon name="ShoppingCart" size={18} />
            Корзина
            <span className="bg-white text-blue-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ─── Cart Drawer ─── */}
      <AnimatePresence>
        {cartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetCart}
              className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
            >
              {/* Cart Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Icon name="ShoppingCart" size={20} className="text-blue-600" />
                  {orderStep === "cart" && "Корзина"}
                  {orderStep === "form" && "Оформление заказа"}
                  {orderStep === "done" && "Заказ принят"}
                </h2>
                <button
                  onClick={resetCart}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                >
                  <Icon name="X" size={18} className="text-gray-500" />
                </button>
              </div>

              {/* Cart Body */}
              <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {/* ── Step: Cart items ── */}
                  {orderStep === "cart" && (
                    <motion.div
                      key="cart"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 flex flex-col gap-4"
                    >
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                          <Icon name="ShoppingCart" size={40} className="text-gray-200 mb-3" />
                          <p className="text-gray-400 text-sm">Корзина пуста</p>
                        </div>
                      ) : (
                        cart.map((item) => (
                          <div key={item.id} className="flex gap-3 bg-gray-50 rounded-xl p-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">{item.name}</p>
                              <p className="text-sm font-bold text-blue-600 mt-1">{formatPrice(item.price)}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => changeQty(item.id, -1)}
                                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  <Icon name="Minus" size={12} />
                                </button>
                                <span className="text-sm font-semibold text-gray-800 w-5 text-center">{item.qty}</span>
                                <button
                                  onClick={() => changeQty(item.id, 1)}
                                  className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                >
                                  <Icon name="Plus" size={12} />
                                </button>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="ml-auto w-7 h-7 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                                >
                                  <Icon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* ── Step: Order form ── */}
                  {orderStep === "form" && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-6 flex flex-col gap-5"
                    >
                      {/* Order summary */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-xs text-gray-500 font-medium mb-2">Ваш заказ:</p>
                        {cart.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm py-1">
                            <span className="text-gray-700 truncate max-w-[200px]">{item.name} × {item.qty}</span>
                            <span className="text-gray-900 font-medium ml-2">{formatPrice(item.price * item.qty)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-200 mt-2 pt-2">
                          <span>Итого</span>
                          <span className="text-blue-600">{formatPrice(total)}</span>
                        </div>
                      </div>

                      {/* Contacts */}
                      <div className="flex flex-col gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Ваше имя <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={orderName}
                            onChange={(e) => setOrderName(e.target.value)}
                            placeholder="Иван Иванов"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Телефон <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={orderPhone}
                            onChange={(e) => setOrderPhone(e.target.value)}
                            placeholder="+7 (999) 000-00-00"
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
                          />
                        </div>
                      </div>

                      {submitError && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
                          <Icon name="AlertCircle" size={16} />
                          {submitError}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── Step: Done ── */}
                  {orderStep === "done" && (
                    <motion.div
                      key="done"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-8 flex flex-col items-center justify-center text-center gap-5 min-h-[400px]"
                    >
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                        <Icon name="CheckCircle" size={44} className="text-green-500" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Заказ принят!</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                          Спасибо! Наш менеджер свяжется с вами в течение 15 минут.
                        </p>
                      </div>
                      <button
                        onClick={resetCart}
                        className="mt-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Закрыть
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart Footer */}
              {orderStep !== "done" && (
                <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-3">
                  {orderStep === "cart" && cart.length > 0 && (
                    <>
                      <div className="flex justify-between text-base font-bold text-gray-900">
                        <span>Итого:</span>
                        <span className="text-blue-600">{formatPrice(total)}</span>
                      </div>
                      <button
                        onClick={() => setOrderStep("form")}
                        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Icon name="CreditCard" size={16} />
                        Оформить заказ
                      </button>
                    </>
                  )}
                  {orderStep === "form" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setOrderStep("cart")}
                        className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Icon name="ChevronLeft" size={16} />
                        Назад
                      </button>
                      <button
                        onClick={handleOrder}
                        disabled={!orderName.trim() || !orderPhone.trim() || submitting}
                        className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <Icon name="Loader2" size={16} className="animate-spin" />
                            Отправляем...
                          </>
                        ) : (
                          <>
                            <Icon name="Send" size={16} />
                            Подтвердить заказ
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ─── Product Detail Modal ─── */}
      <AnimatePresence>
        {detailProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailProduct(null)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, y: 16 }}
                transition={{ type: "spring", damping: 26, stiffness: 300 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-xl pointer-events-auto overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal header */}
                <div className="relative">
                  <img
                    src={detailProduct.image}
                    alt={detailProduct.name}
                    className="w-full h-56 object-cover"
                  />
                  {detailProduct.badge && (
                    <span className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_STYLES[detailProduct.badge] ?? "bg-gray-500 text-white"}`}>
                      {detailProduct.badge}
                    </span>
                  )}
                  {!detailProduct.inStock && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200">
                        Нет в наличии
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => setDetailProduct(null)}
                    className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                  >
                    <Icon name="X" size={18} className="text-gray-600" />
                  </button>
                </div>

                {/* Modal body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <p className="text-xs text-blue-500 font-medium mb-1">{detailProduct.brand} · {detailProduct.category}</p>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{detailProduct.name}</h2>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {detailProduct.storage && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{detailProduct.storage}</span>
                    )}
                    {detailProduct.hasNfc !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-lg ${detailProduct.hasNfc ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        NFC {detailProduct.hasNfc ? "есть" : "нет"}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{detailProduct.description}</p>

                  {/* Specs */}
                  {detailProduct.specs && detailProduct.specs.length > 0 && (
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Характеристики</p>
                      <ul className="flex flex-col gap-2">
                        {detailProduct.specs.map((spec, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <Icon name="Check" size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(detailProduct.price)}</span>
                      {detailProduct.oldPrice && (
                        <span className="ml-2 text-sm text-gray-400 line-through">{formatPrice(detailProduct.oldPrice)}</span>
                      )}
                    </div>
                    <button
                      disabled={!detailProduct.inStock}
                      onClick={() => {
                        if (detailProduct.inStock) {
                          addToCart(detailProduct)
                          setDetailProduct(null)
                        }
                      }}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        detailProduct.inStock
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Icon name="ShoppingCart" size={16} />
                      {detailProduct.inStock ? "В корзину" : "Нет в наличии"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <FooterSection />
    </div>
  )
}
