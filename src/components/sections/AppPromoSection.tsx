import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

export function AppPromoSection() {
  return (
    <section className="px-6 py-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-zinc-800/50 bg-gradient-to-br from-zinc-900 via-zinc-900/80 to-zinc-800/40 overflow-hidden"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 mb-6">
                <Icon name="Smartphone" size={14} />
                Мобильное приложение
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
                iPro в вашем кармане
              </h2>
              <p className="text-zinc-400 mb-6 leading-relaxed">
                Отслеживайте статус ремонта, управляйте бонусами, заказывайте технику и записывайтесь на ремонт — прямо со смартфона.
              </p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { icon: "Bell", text: "Уведомления о статусе" },
                  { icon: "Gift", text: "Бонусы и скидки" },
                  { icon: "Package", text: "История заказов" },
                  { icon: "ShoppingBag", text: "Магазин техники" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-zinc-400">
                    <Icon name={icon} size={16} className="text-zinc-500" />
                    {text}
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-100 text-zinc-900 hover:bg-zinc-200 transition-colors"
                >
                  <Icon name="Apple" size={20} />
                  <div>
                    <p className="text-[10px] leading-none text-zinc-600">Скачать в</p>
                    <p className="text-sm font-semibold leading-tight">App Store</p>
                  </div>
                </a>
                <a
                  href="https://play.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  <Icon name="Smartphone" size={20} />
                  <div>
                    <p className="text-[10px] leading-none text-zinc-500">Скачать в</p>
                    <p className="text-sm font-semibold leading-tight">Google Play</p>
                  </div>
                </a>
                <a
                  href="https://rustore.ru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  <Icon name="Store" size={20} />
                  <div>
                    <p className="text-[10px] leading-none text-blue-500/70">Скачать в</p>
                    <p className="text-sm font-semibold leading-tight">RuStore</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center p-8 relative">
              <div className="relative">
                <div className="w-48 h-80 rounded-[2.5rem] bg-zinc-800 border-4 border-zinc-700 shadow-2xl flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-b from-zinc-900 to-zinc-800 p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-zinc-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-zinc-900">i</span>
                      </div>
                      <span className="text-xs font-semibold text-zinc-100">iPro</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 bg-zinc-700 rounded-full w-full" />
                      <div className="h-2 bg-zinc-700 rounded-full w-3/4" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="h-12 rounded-xl bg-zinc-700/60 border border-zinc-600/30" />
                      ))}
                    </div>
                    <div className="mt-3 h-2 bg-zinc-700 rounded-full w-1/2 mx-auto" />
                  </div>
                </div>
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <Icon name="Bell" size={16} className="text-white" />
                </div>
                <div className="absolute -bottom-3 -left-3 w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center shadow-lg">
                  <Icon name="Star" size={16} className="text-zinc-900" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AppPromoSection
