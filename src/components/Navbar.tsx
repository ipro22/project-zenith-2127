import { useState } from "react"
import { Menu, X } from "lucide-react"

const navLinks = [
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
  { href: "/#testimonials", label: "Отзывы" },
  { href: "/privileges", label: "Привилегии" },
  { href: "/warranty", label: "Гарантия" },
  { href: "/partnership", label: "Сотрудничество" },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4">
      <nav className="max-w-6xl mx-auto px-6 rounded-full bg-zinc-900/70 border border-zinc-800/50 backdrop-blur-md">
        {/* Main row */}
        <div className="flex items-center justify-between h-12">
          <a href="/" className="font-display text-lg font-semibold text-zinc-100 shrink-0">
            iPro
          </a>

          {/* Desktop links */}
          <div className="hidden xl:flex items-center gap-0.5">
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
            <a
              href="tel:+79993231817"
              className="px-4 py-1.5 text-sm rounded-full bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap"
            >
              Позвонить
            </a>
            {/* Burger for < xl */}
            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 transition-colors text-zinc-300"
              aria-label="Меню"
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="xl:hidden pb-4 pt-2 flex flex-col gap-1">
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
          </div>
        )}
      </nav>
    </header>
  )
}
