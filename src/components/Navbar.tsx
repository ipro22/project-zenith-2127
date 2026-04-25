import { useState, useEffect } from "react"
import { Menu, X, Search, User, ChevronDown, Phone } from "lucide-react"
import { SearchDialog } from "@/components/SearchDialog"
import { siteConfig } from "@/config/siteConfig"
import { motion, AnimatePresence } from "framer-motion"

const repairLinks = [
  { href: "/device/iphone", label: "iPhone" },
  { href: "/device/ipad", label: "iPad" },
  { href: "/device/macbook", label: "MacBook / iMac" },
  { href: "/device/samsung", label: "Samsung" },
  { href: "/device/xiaomi", label: "Xiaomi / Redmi" },
  { href: "/device/realme", label: "Realme / OPPO" },
  { href: "/device/other", label: "Другие устройства" },
]

const navLinks = [
  { href: "/calculator", label: "Прайс" },
  { href: "/shop", label: "Магазин" },
  { href: "/privileges", label: "Бонусы" },
  { href: "/warranty", label: "Гарантия" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [repairOpen, setRepairOpen] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  return (
    <>
      {/* Top info bar */}
      <div className="bg-blue-600 text-white text-xs py-1.5 px-4 text-center">
        <span className="hidden sm:inline">📍 г. Барнаул, ул. Молодёжная 34 · </span>
        <a href="tel:+79993231817" className="font-medium hover:underline">+7 (999) 323-18-17</a>
        <span className="mx-2">·</span>
        <span>Пн–Вс 9:00–20:00 · Диагностика бесплатно</span>
      </div>

      {/* Main navbar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4 lg:px-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img src={siteConfig.logo} alt="iPro" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-gray-900 text-lg tracking-tight">iPro</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {/* Ремонт dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setRepairOpen(true)}
              onMouseLeave={() => setRepairOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors">
                Ремонт
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${repairOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {repairOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-0 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden z-50"
                  >
                    {repairLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm rounded-lg text-gray-700 hover:bg-gray-100 font-medium transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Поиск"
            >
              <Search className="w-4 h-4" />
            </button>
            <a
              href="/account"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Личный кабинет"
            >
              <User className="w-4 h-4" />
            </a>
            <a
              href="tel:+79993231817"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Позвонить
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Меню"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col divide-y divide-gray-50">
                <div className="pb-2">
                  <p className="px-2 py-1 text-xs font-bold text-gray-400 uppercase tracking-widest">Ремонт</p>
                  {repairLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center px-2 py-2.5 text-sm text-gray-700 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="py-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center px-2 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <a href="/account" onClick={() => setOpen(false)} className="flex items-center gap-2 px-2 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                    <User className="w-4 h-4" /> Личный кабинет
                  </a>
                  <a href="tel:+79993231817" className="flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl bg-blue-600 text-white">
                    <Phone className="w-4 h-4" /> +7 (999) 323-18-17
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
