import { useState, useEffect } from "react"
import { Menu, X, Search, User, ChevronDown } from "lucide-react"
import { SearchDialog } from "@/components/SearchDialog"
import { siteConfig } from "@/config/siteConfig"
import { motion, AnimatePresence } from "framer-motion"

const repairLinks = [
  { href: "/device/iphone", label: "iPhone" },
  { href: "/device/ipad", label: "iPad" },
  { href: "/device/macbook", label: "MacBook" },
  { href: "/device/samsung", label: "Samsung" },
  { href: "/device/xiaomi", label: "Xiaomi" },
  { href: "/device/other", label: "Другие" },
]

const navLinks = [
  { href: "/shop", label: "Магазин" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
  { href: "/privileges", label: "Бонусы" },
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
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-8 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
          <a href="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src={siteConfig.logo}
              alt="iPro logo"
              className="w-8 h-8 rounded-xl object-cover"
            />
            <span className="font-display text-lg font-bold text-gray-900 tracking-tight">iPro</span>
          </a>

          <div className="hidden lg:flex items-center gap-1">
            {/* Ремонт dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setRepairOpen(true)}
              onMouseLeave={() => setRepairOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm rounded-xl transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium">
                Ремонт
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${repairOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {repairOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1 w-44 bg-white rounded-2xl shadow-xl border border-gray-100 p-1.5 overflow-hidden"
                  >
                    {repairLinks.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
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
                className="px-3 py-2 text-sm rounded-xl transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
              aria-label="Поиск"
            >
              <Search className="w-4 h-4" />
            </button>
            <a
              href="/account"
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
              aria-label="Личный кабинет"
            >
              <User className="w-4 h-4" />
            </a>
            <a
              href="tel:+79993231817"
              className="hidden sm:inline-flex px-4 py-2 text-sm rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors whitespace-nowrap shadow-sm"
            >
              Позвонить
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600"
              aria-label="Меню"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-0.5">
                <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Ремонт</p>
                {repairLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 text-sm rounded-xl transition-colors text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="h-px bg-gray-100 my-1" />
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 text-sm rounded-xl transition-colors text-gray-700 hover:bg-gray-50"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm rounded-xl transition-colors text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Личный кабинет
                </a>
                <a
                  href="tel:+79993231817"
                  className="mx-1 mt-2 mb-1 px-4 py-2.5 text-sm rounded-xl bg-blue-600 text-white font-medium text-center"
                >
                  Позвонить
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}