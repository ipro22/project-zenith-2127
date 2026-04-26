import { Phone, MapPin, Instagram, MessageCircle } from "lucide-react"
import { siteConfig } from "@/config/siteConfig"

const footerLinks = {
  repair: [
    { label: "Ремонт iPhone", href: "/device/iphone" },
    { label: "Ремонт Samsung", href: "/device/samsung" },
    { label: "Ремонт Xiaomi", href: "/device/xiaomi" },
    { label: "Ремонт iPad", href: "/device/ipad" },
    { label: "Ремонт MacBook", href: "/device/macbook" },
    { label: "Ремонт Apple Watch", href: "/device/apple-watch" },
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
  info: [
    { label: "Гарантия", href: "/warranty" },
    { label: "Программа лояльности", href: "/privileges" },
  ],
}

export function FooterSection() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img
                src={siteConfig.logo}
                alt="iPro logo"
                className="w-8 h-8 rounded-xl object-cover"
              />
              <span className="font-display text-xl font-bold text-gray-900 tracking-tight">iPro</span>
            </a>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed mb-4">
              Сервисный центр по ремонту Apple и другой техники в центре Барнаула.
            </p>
            <div className="flex flex-col gap-2.5">
              <a href="tel:+79993231817" className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4 text-blue-500" />
                +7 (999) 323-18-17
              </a>
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-blue-500" />
                г. Барнаул, ул. Молодёжная 34
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Ремонт</h4>
            <ul className="space-y-2.5">
              {footerLinks.repair.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Компания</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Информация</h4>
            <ul className="space-y-2.5">
              {footerLinks.info.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Режим работы</h4>
              <p className="text-sm text-gray-500">Пн–Пт: 11:00 – 20:00</p>
              <p className="text-sm text-gray-500">Сб: 12:00 – 18:00</p>
              <p className="text-xs text-gray-400 mt-1">Воскресенье — выходной</p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} iPro Барнаул. Все права защищены.</p>
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-200 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://vk.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-200 transition-colors"
              aria-label="ВКонтакте"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
            <a
              href="tel:+79993231817"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Позвонить
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}