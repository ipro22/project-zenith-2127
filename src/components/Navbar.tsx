import { useState, useEffect } from "react"
import { Menu, X, Search, User } from "lucide-react"
import { SearchDialog } from "@/components/SearchDialog"
import { siteConfig } from "@/config/siteConfig"

const navLinks = [
  { href: "/device/iphone", label: "Ремонт" },
  { href: "/shop", label: "Магазин" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
  { href: "/privileges", label: "Бонусы" },
  { href: "/warranty", label: "Гарантия" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

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
      <header className="fixed top-8 left-0 right-0 z-40 p-4 py-0">
        <nav className="max-w-6xl mx-auto flex items-center justify-between h-12 px-6 rounded-full bg-zinc-900/70 border border-zinc-800/50 backdrop-blur-md my-[22px]">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <img
              src={siteConfig.logo}
              alt="iPro logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="font-display text-lg font-semibold text-zinc-100">iPro</span>
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm rounded-full transition-colors text-zinc-400 hover:text-zinc-100 whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300"
              aria-label="Поиск"
            >
              <Search className="w-4 h-4" />
            </button>
            <a
              href="/account"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300"
              aria-label="Личный кабинет"
            >
              <User className="w-4 h-4" />
            </a>
            <a
              href="tel:+79993231817"
              className="hidden sm:inline-flex px-4 py-1.5 text-sm rounded-full bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap"
            >
              Позвонить
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300"
              aria-label="Меню"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="lg:hidden max-w-6xl mx-auto mt-2 px-2">
            <div className="rounded-2xl bg-zinc-900/95 border border-zinc-800/50 backdrop-blur-md p-2 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-4 py-2.5 text-sm rounded-xl transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/account"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 text-sm rounded-xl transition-colors text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Личный кабинет
              </a>
              <a
                href="tel:+79993231817"
                className="mx-2 mt-1 mb-1 px-4 py-2.5 text-sm rounded-xl bg-zinc-100 text-zinc-900 font-medium text-center"
              >
                Позвонить
              </a>
            </div>
          </div>
        )}
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}