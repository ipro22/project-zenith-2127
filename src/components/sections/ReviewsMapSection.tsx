import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"

const reviews2gis = [
  { name: "Артём К.", rating: 5, text: "Отличный сервис! Быстро, качественно, с гарантией.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face", source: "2ГИС" },
  { name: "Ольга М.", rating: 5, text: "Заменили экран на iPhone за 1.5 часа. Рекомендую!", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face", source: "Яндекс" },
  { name: "Денис Р.", rating: 5, text: "Починили MacBook после залития. Думал — всё, а они спасли!", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face", source: "2ГИС" },
]

export function ReviewsMapSection() {
  return (
    <section className="px-6 py-16 bg-zinc-900/20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Репутация</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
            Нас выбирают и рекомендуют
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Реальные отзывы клиентов на крупнейших платформах</p>
        </motion.div>

        {/* Ratings block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* 2GIS */}
          <motion.a
            href="https://go.2gis.com/f9jBa"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group flex items-center gap-5 p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 hover:border-zinc-700/60 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-green-500/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-green-400">2</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-500 mb-1">2ГИС</p>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FACC15"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                  ))}
                </div>
                <span className="text-zinc-100 font-bold">4.9</span>
              </div>
              <p className="text-zinc-500 text-sm">120+ отзывов</p>
            </div>
            <Icon name="ExternalLink" size={16} className="text-zinc-600 group-hover:text-zinc-400" />
          </motion.a>

          {/* Яндекс */}
          <motion.a
            href="https://yandex.ru/maps/-/CPrwFG7O"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group flex items-center gap-5 p-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 hover:border-zinc-700/60 transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
              <span className="text-xl font-bold text-red-400">Я</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-zinc-500 mb-1">Яндекс Карты</p>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FACC15"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                  ))}
                </div>
                <span className="text-zinc-100 font-bold">4.8</span>
              </div>
              <p className="text-zinc-500 text-sm">85+ отзывов</p>
            </div>
            <Icon name="ExternalLink" size={16} className="text-zinc-600 group-hover:text-zinc-400" />
          </motion.a>
        </div>

        {/* Recent reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {reviews2gis.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-medium text-zinc-200">{r.name}</p>
                  <div className="flex items-center gap-1">
                    {[...Array(r.rating)].map((_, j) => (
                      <svg key={j} width="12" height="12" viewBox="0 0 24 24" fill="#FACC15"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
                    ))}
                    <span className="text-xs text-zinc-600 ml-1">{r.source}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-400">"{r.text}"</p>
            </motion.div>
          ))}
        </div>

        {/* Map block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-zinc-800/50"
        >
          <div className="bg-zinc-900/60 px-6 py-4 flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-zinc-200">Мы на карте</h3>
              <p className="text-zinc-500 text-sm">г. Барнаул, ул. Молодёжная 34, 1 этаж</p>
            </div>
            <div className="flex gap-2">
              <a href="https://go.2gis.com/f9jBa" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 text-sm hover:bg-green-500/30 transition-colors border border-green-500/20">
                2ГИС
              </a>
              <a href="https://yandex.ru/maps/-/CPrwFG7O" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors border border-red-500/20">
                Яндекс
              </a>
            </div>
          </div>
          <iframe
            src="https://yandex.ru/map-widget/v1/?um=constructor%3A&ll=83.776856%2C53.347609&z=16&l=map&pt=83.776856%2C53.347609%2Cpm2rdl"
            width="100%"
            height="300"
            className="block"
            style={{ border: 0 }}
            title="Карта iPro Барнаул"
          />
        </motion.div>
      </div>
    </section>
  )
}

export default ReviewsMapSection
