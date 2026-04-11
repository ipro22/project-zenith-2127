import { Phone, MapPin, Instagram } from "lucide-react"

const footerLinks = {
  product: [
    { label: "Ремонт iPhone", href: "/iphone" },
    { label: "Ремонт MacBook", href: "/macbook" },
    { label: "Другие устройства", href: "/other" },
    { label: "Продажа техники", href: "#" },
  ],
  company: [
    { label: "О нас", href: "#" },
    { label: "Отзывы", href: "#testimonials" },
    { label: "Контакты", href: "#" },
    { label: "Адрес", href: "#" },
  ],
  legal: [
    { label: "Политика конфиденциальности", href: "#" },
    { label: "Условия обслуживания", href: "#" },
    { label: "Гарантия", href: "#" },
  ],
}

export function FooterSection() {
  return (
    <footer className="px-6 py-16 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="font-display text-xl font-semibold text-zinc-100">
              iPro
            </a>
            <p className="mt-4 text-sm text-zinc-500 max-w-xs">
              Сервисный центр по ремонту Apple и другой техники в центре Барнаула.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <a href="tel:+79993231817" className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                <Phone className="w-4 h-4" />
                +7 (999) 323-18-17
              </a>
              <span className="flex items-center gap-2 text-sm text-zinc-500">
                <MapPin className="w-4 h-4" />
                г. Барнаул, ул. Молодёжная 34, 1 этаж
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-zinc-100 mb-4">Продукт</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-zinc-100 mb-4">Компания</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold text-zinc-100 mb-4">Правовая информация</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-600">© {new Date().getFullYear()} iPro Барнаул. Все права защищены.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="tel:+79993231817" className="text-zinc-500 hover:text-zinc-300 transition-colors" aria-label="Телефон">
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}