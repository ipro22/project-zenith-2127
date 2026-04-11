const navLinks = [
  { href: "/about", label: "О нас" },
  { href: "/contacts", label: "Контакты" },
  { href: "#testimonials", label: "Отзывы" },
  { href: "/privileges", label: "Привилегии" },
  { href: "/warranty", label: "Гарантия" },
  { href: "/partnership", label: "Сотрудничество" },
]

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4">
      <nav className="max-w-6xl mx-auto flex items-center justify-between h-12 px-6 rounded-full bg-zinc-900/70 border border-zinc-800/50 backdrop-blur-md">
        <a href="/" className="font-display text-lg font-semibold text-zinc-100 shrink-0">
          iPro
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
          <a
            href="tel:+79993231817"
            className="ml-2 px-4 py-1.5 text-sm rounded-full bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors whitespace-nowrap"
          >
            Позвонить
          </a>
        </div>
        <a
          href="tel:+79993231817"
          className="lg:hidden px-4 py-1.5 text-sm rounded-full bg-zinc-100 text-zinc-900 font-medium hover:bg-zinc-200 transition-colors"
        >
          Позвонить
        </a>
      </nav>
    </header>
  )
}