import { useState, useEffect } from "react"
import { Menu, X, Search, User, ChevronDown, Phone, MapPin, Clock } from "lucide-react"
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("keydown", handler)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("keydown", handler)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      {/* Top info bar — ультрамарин */}
      <div className="bg-[#1d4ed8] text-white text-[12px] px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-9">
          <div className="hidden md:flex items-center gap-5 text-blue-100">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> г. Барнаул, ул. Молодёжная 34
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Пн–Пт 11:00–20:00 · Сб 12:00–18:00 · Вс — выходной
            </span>
          </div>
          <a href="tel:+79993231817" className="font-semibold hover:underline mx-auto md:mx-0">
            +7 (999) 323-18-17
          </a>
          <a href="/account" className="hidden md:inline-block text-blue-100 hover:text-white transition-colors">
            Личный кабинет
          </a>
        </div>
      </div>

      {/* Main navbar */}
      <header
        className={`sticky top-0 z-40 bg-white border-b transition-all duration-300 ${
          scrolled ? "border-gray-200 shadow-md" : "border-transparent shadow-sm"
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-6 gap-4">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <img src={siteConfig.logo} alt="iPro" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-gray-900 text-lg tracking-tight">iPro</span>
              <span className="text-[10px] text-gray-400 tracking-wider uppercase">сервис · Барнаул</span>
            </div>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            <div
              className="relative"
              onMouseEnter={() => setRepairOpen(true)}
              onMouseLeave={() => setRepairOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-[14px] rounded-lg text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] font-medium transition-colors">
                Ремонт
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${repairOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {repairOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 overflow-hidden z-50"
                  >
                    {repairLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] transition-colors"
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
                className="px-3 py-2 text-[14px] rounded-lg text-gray-700 hover:bg-blue-50 hover:text-[#1d4ed8] font-medium transition-colors whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-blue-50 hover:text-[#1d4ed8] transition-colors"
              aria-label="Поиск"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
            <a
              href="/account"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-blue-50 hover:text-[#1d4ed8] transition-colors"
              aria-label="Личный кабинет"
            >
              <User className="w-4.5 h-4.5" />
            </a>
            <a
              href="tel:+79993231817"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold rounded-xl bg-[#1d4ed8] text-white hover:bg-[#1e40af] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5" />
              Позвонить
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-blue-50 transition-colors"
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
                      className="flex items-center px-2 py-2.5 text-sm text-gray-700 hover:text-[#1d4ed8] rounded-lg hover:bg-blue-50 transition-colors"
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
                  <a href="tel:+79993231817" className="flex items-center justify-center gap-2 py-3 text-sm font-bold rounded-xl bg-[#1d4ed8] text-white">
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
