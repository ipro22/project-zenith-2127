import { motion } from "framer-motion"
import { useState } from "react"
import Icon from "@/components/ui/icon"

const videos = [
  { id: "RQr6-Gk3s_Y", title: "Разборка iPhone 15 Pro Max", channel: "JerryRigEverything", thumb: "https://img.youtube.com/vi/RQr6-Gk3s_Y/hqdefault.jpg" },
  { id: "3Lx1lbI5LK4", title: "MacBook Pro Teardown & Repair", channel: "Louis Rossmann", thumb: "https://img.youtube.com/vi/3Lx1lbI5LK4/hqdefault.jpg" },
  { id: "7B2DIAcmOGE", title: "iPad Pro разборка изнутри", channel: "iFixit", thumb: "https://img.youtube.com/vi/7B2DIAcmOGE/hqdefault.jpg" },
]

export function VideoSection() {
  const [playing, setPlaying] = useState<string | null>(null)
  const [active, setActive] = useState(0)

  return (
    <section className="px-6 py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Видео</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Разборка техники Apple
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">Смотрите, как устроена ваша техника изнутри</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => { setActive(i); setPlaying(null) }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm transition-all ${active === i ? "bg-blue-600 text-white font-medium" : "bg-white border border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
            >
              {v.title}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm"
        >
          {playing === videos[active].id ? (
            <iframe
              src={`https://www.youtube.com/embed/${videos[active].id}?autoplay=1&rel=0`}
              className="w-full aspect-video"
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={videos[active].title}
            />
          ) : (
            <div className="relative aspect-video group cursor-pointer" onClick={() => setPlaying(videos[active].id)}>
              <img
                src={videos[active].thumb}
                alt={videos[active].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name="Play" size={24} className="text-gray-900 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-semibold text-lg drop-shadow-lg">{videos[active].title}</p>
                <p className="text-gray-200 text-sm">{videos[active].channel}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default VideoSection
