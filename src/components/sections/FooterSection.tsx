import { Phone, MapPin, Instagram } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"

const footerLinks = {
  product: [
    { label: "Ремонт iPhone", href: "/device/iphone" },
    { label: "Ремонт Samsung", href: "/device/samsung" },
    { label: "Ремонт Xiaomi", href: "/device/xiaomi" },
    { label: "Ремонт iPad", href: "/device/ipad" },
    { label: "Ремонт MacBook", href: "/device/macbook" },
    { label: "Ремонт Apple Watch", href: "/device/apple-watch" },
    { label: "Ремонт AirPods", href: "/device/airpods" },
    { label: "Ремонт Huawei/Honor", href: "/device/huawei" },
  ],
  company: [
    { label: "Магазин техники", href: "/shop" },
    { label: "Калькулятор ремонта", href: "/calculator" },
    { label: "О нас", href: "/about" },
    { label: "Контакты", href: "/contacts" },
    { label: "Сотрудничество", href: "/partnership" },
    { label: "Личный кабинет", href: "/account" },
  ],
  legal: [
    { label: "Гарантия", href: "/warranty" },
    { label: "Привилегии", href: "/privileges" },
    { label: "Политика конфиденциальности", href: "/privacy" },
  ],
}

export function FooterSection() {
  return (
    <footer className="px-6 py-16 border-t border-zinc-900">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2">
              <img
                src={siteConfig.logo}
                alt="iPro logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <span className="font-display text-xl font-semibold text-zinc-100">iPro</span>
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

          <div>
            <h4 className="font-heading text-sm font-semibold text-zinc-100 mb-4">Ремонт</h4>
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

          <div>
            <h4 className="font-heading text-sm font-semibold text-zinc-100 mb-4">Информация</h4>
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