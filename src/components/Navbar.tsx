import { useState, useEffect } from "react"
import { Menu, X, Search, User, ChevronDown, Phone, MapPin, Clock, ShoppingBag, Gift } from "lucide-react"
import { SearchDialog } from "@/components/SearchDialog"
import { siteConfig } from "@/config/siteConfig"
import { motion, AnimatePresence } from "framer-motion"

const repairLinks = [
  { href: "/device/iphone", label: "iPhone", icon: "📱" },
  { href: "/device/ipad", label: "iPad", icon: "📋" },
  { href: "/device/macbook", label: "MacBook / iMac", icon: "💻" },
  { href: "/device/samsung", label: "Samsung", icon: "📱" },
  { href: "/device/xiaomi", label: "Xiaomi / Redmi", icon: "📱" },
  { href: "/device/realme", label: "Realme / OPPO", icon: "📱" },
  { href: "/device/other", label: "Другие устройства", icon: "🔧" },
]

const navLinks = [
  { href: "/calculator", label: "Прайс" },
  { href: "/shop", label: "Магазин" },
  { href: "/giveaway", label: "🎁 Розыгрыш" },
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
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("keydown", handler)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.removeEventListener("keydown", handler)
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  return (
    <>
      {/* Top info strip */}
      <div className="bg-[#1d4ed8] text-white text-[11.5px] px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-8 gap-4">
          <div className="hidden md:flex items-center gap-4 text-blue-100 min-w-0">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <MapPin className="w-3 h-3 shrink-0" /> г. Барнаул, ул. Молодёжная 34
            </span>
            <span className="text-blue-300">·</span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3 h-3 shrink-0" /> Пн–Пт 11–20 · Сб 12–18 · Вс выходной
            </span>
          </div>
          <a href="tel:+79993231817" className="font-semibold hover:underline whitespace-nowrap mx-auto md:mx-0">
            +7 (999) 323-18-17
          </a>
          <a href="/account" className="hidden md:inline-flex items-center gap-1 text-blue-100 hover:text-white transition-colors whitespace-nowrap">
            <User className="w-3 h-3" /> Личный кабинет
          </a>
        </div>
      </div>

      {/* Floating glass navbar */}
      <div className="sticky top-0 z-40 px-3 pt-2 pb-1.5">
        <motion.header
          initial={false}
          animate={{
            backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "blur(16px) saturate(150%)",
          }}
          className={`
            mx-auto max-w-6xl rounded-[2rem] border transition-all duration-300
            ${scrolled
              ? "bg-white/80 border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.12)] shadow-blue-900/5"
              : "bg-white/70 border-white/50 shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
            }
          `}
          style={{ backdropFilter: "blur(20px) saturate(160%)" }}
        >
          <nav className="flex items-center h-14 px-4 lg:px-5 gap-3">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 shrink-0 group mr-2">
              <div className="w-8 h-8 rounded-[14px] bg-gradient-to-br from-[#1d4ed8] to-[#3b82f6] flex items-center justify-center shadow-md shadow-blue-500/30 group-hover:shadow-blue-500/50 group-hover:scale-105 transition-all">
                <img src={siteConfig.logo} alt="iPro" className="w-5 h-5 object-contain" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-gray-900 text-[15px] tracking-tight">iPro</span>
                <span className="text-[9px] text-gray-400 tracking-wider uppercase font-medium">сервис</span>
              </div>
            </a>

            {/* Desktop nav — centred */}
            <div className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
              {/* Ремонт dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setRepairOpen(true)}
                onMouseLeave={() => setRepairOpen(false)}
              >
                <button className="flex items-center gap-1 px-3 py-1.5 text-[13.5px] rounded-2xl text-gray-700 hover:bg-blue-50/80 hover:text-[#1d4ed8] font-medium transition-all">
                  Ремонт
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${repairOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {repairOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 w-56 rounded-[1.5rem] shadow-2xl shadow-black/10 border border-white/80 py-2 overflow-hidden z-50"
                      style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)" }}
                    >
                      {repairLinks.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50/80 hover:text-[#1d4ed8] transition-colors mx-1 rounded-xl"
                        >
                          <span className="text-base">{link.icon}</span>
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
                  className={`px-3 py-1.5 text-[13.5px] rounded-2xl font-medium transition-all whitespace-nowrap
                    ${link.href === "/giveaway"
                      ? "text-amber-600 hover:bg-amber-50/80 hover:text-amber-700"
                      : "text-gray-700 hover:bg-blue-50/80 hover:text-[#1d4ed8]"
                    }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1 ml-auto shrink-0">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-2xl text-gray-500 hover:bg-blue-50/80 hover:text-[#1d4ed8] transition-all"
                aria-label="Поиск"
              >
                <Search className="w-4 h-4" />
              </button>
              <a
                href="/account"
                className="w-9 h-9 flex items-center justify-center rounded-2xl text-gray-500 hover:bg-blue-50/80 hover:text-[#1d4ed8] transition-all"
                aria-label="Личный кабинет"
              >
                <User className="w-4 h-4" />
              </a>
              <a
                href="/shop"
                className="w-9 h-9 flex items-center justify-center rounded-2xl text-gray-500 hover:bg-blue-50/80 hover:text-[#1d4ed8] transition-all"
                aria-label="Магазин"
              >
                <ShoppingBag className="w-4 h-4" />
              </a>
              <a
                href="tel:+79993231817"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-2xl bg-[#1d4ed8] text-white hover:bg-[#1e40af] transition-all shadow-md shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 ml-1"
              >
                <Phone className="w-3.5 h-3.5" />
                Позвонить
              </a>
              <button
                onClick={() => setOpen(!open)}
                className="lg:hidden w-9 h-9 flex items-center justify-center rounded-2xl text-gray-500 hover:bg-blue-50 transition-colors"
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
                className="lg:hidden overflow-hidden border-t border-white/40"
              >
                <div className="px-4 py-3 flex flex-col gap-0.5">
                  <p className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ремонт</p>
                  {repairLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-[#1d4ed8] rounded-xl hover:bg-blue-50/80 transition-colors"
                    >
                      <span>{link.icon}</span>{link.label}
                    </a>
                  ))}
                  <div className="h-px bg-gray-100 my-1.5" />
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center px-3 py-2 text-sm rounded-xl transition-colors
                        ${link.href === "/giveaway"
                          ? "text-amber-600 hover:bg-amber-50/80 font-semibold"
                          : "text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="h-px bg-gray-100 my-1.5" />
                  <a href="/account" onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl">
                    <User className="w-4 h-4" /> Личный кабинет
                  </a>
                  <a href="tel:+79993231817"
                    className="flex items-center justify-center gap-2 py-3 mt-1 text-sm font-bold rounded-2xl bg-[#1d4ed8] text-white">
                    <Phone className="w-4 h-4" /> +7 (999) 323-18-17
                  </a>
                  <div className="pb-1" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.header>
      </div>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
