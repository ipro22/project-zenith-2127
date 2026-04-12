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
    <section className="px-6 py-16 bg-zinc-900/20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Видео</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-3">
            Разборка техники Apple
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto">Смотрите, как устроена ваша техника изнутри</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {videos.map((v, i) => (
            <button
              key={v.id}
              onClick={() => { setActive(i); setPlaying(null) }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm transition-all ${active === i ? "bg-zinc-100 text-zinc-900 font-medium" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
            >
              {v.title}
            </button>
          ))}
        </div>

        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl overflow-hidden border border-zinc-800/50 bg-zinc-900/40"
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
                  <Icon name="Play" size={24} className="text-zinc-900 ml-1" />
                </div>
              </div>
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-semibold text-lg drop-shadow-lg">{videos[active].title}</p>
                <p className="text-zinc-300 text-sm">{videos[active].channel}</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default VideoSection
