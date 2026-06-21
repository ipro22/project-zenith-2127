import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { API, apiPost } from "@/hooks/useApi"

interface Story {
  id: number
  title: string
  subtitle: string
  image_url: string
  link_url: string
  link_label: string
  gradient_from: string
  gradient_to: string
}

const DURATION = 6000

export function StoriesBar() {
  const [stories, setStories] = useState<Story[]>([])
  const [viewed, setViewed] = useState<Set<number>>(
    new Set(JSON.parse(localStorage.getItem("ipro_viewed_stories") || "[]"))
  )
  const [open, setOpen] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    apiPost<{ stories: Story[] }>(API.auth, { action: "get_stories" })
      .then((d) => setStories(d.stories || []))
      .catch(() => {})
  }, [])

  const markViewed = (id: number) => {
    const next = new Set(viewed).add(id)
    setViewed(next)
    localStorage.setItem("ipro_viewed_stories", JSON.stringify([...next]))
  }

  const openStory = (id: number) => {
    setOpen(id)
    setProgress(0)
    markViewed(id)
  }

  const closeStory = () => {
    setOpen(null)
    setProgress(0)
    if (timerRef.current) clearInterval(timerRef.current)
  }

  const nextStory = () => {
    if (open === null) return
    const idx = stories.findIndex((s) => s.id === open)
    if (idx < stories.length - 1) openStory(stories[idx + 1].id)
    else closeStory()
  }

  const prevStory = () => {
    if (open === null) return
    const idx = stories.findIndex((s) => s.id === open)
    if (idx > 0) openStory(stories[idx - 1].id)
  }

  useEffect(() => {
    if (open === null) return
    setProgress(0)
    if (timerRef.current) clearInterval(timerRef.current)
    const step = 50
    timerRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timerRef.current!)
          nextStory()
          return 100
        }
        return p + (step / DURATION) * 100
      })
    }, step)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [open])

  if (stories.length === 0) return null

  const activeStory = stories.find((s) => s.id === open)

  return (
    <>
      {/* ── Stories strip — центрованный, минималистичный ── */}
      <div className="w-full bg-gradient-to-b from-gray-50/80 to-white border-b border-gray-100/60">
        <div className="flex justify-center px-4 py-3">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide max-w-2xl w-full justify-center">
            {stories.map((story, idx) => {
              const isViewed = viewed.has(story.id)
              return (
                <motion.button
                  key={story.id}
                  onClick={() => openStory(story.id)}
                  whileTap={{ scale: 0.94 }}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 group"
                >
                  {/* Ring + avatar */}
                  <div className="relative">
                    <div
                      className={`w-[62px] h-[62px] rounded-full p-[2.5px] transition-all duration-300
                        ${isViewed
                          ? "bg-gray-200"
                          : "bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 shadow-md shadow-pink-200/50"
                        }`}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative bg-gray-100">
                        {story.image_url ? (
                          <img
                            src={story.image_url}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                          />
                        ) : null}
                        {/* Gradient overlay with icon */}
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: `linear-gradient(135deg, ${story.gradient_from}cc, ${story.gradient_to}cc)` }}
                        >
                          <span className="text-xl select-none">
                            {idx === 0 ? "🎁" : idx === 1 ? "🔧" : idx === 2 ? "🛡️" : idx === 3 ? "⭐" : idx === 4 ? "💰" : idx === 5 ? "📱" : "✨"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {/* "NEW" badge */}
                    {!isViewed && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-white text-[7px] font-bold">N</span>
                      </span>
                    )}
                  </div>
                  {/* Label */}
                  <span
                    className={`text-[10.5px] font-medium max-w-[62px] text-center leading-tight line-clamp-2 transition-colors
                      ${isViewed ? "text-gray-400" : "text-gray-700"}`}
                  >
                    {story.title}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Story viewer ── */}
      <AnimatePresence>
        {open !== null && activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
            onClick={closeStory}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative w-full max-w-[380px] h-[640px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/40"
              onClick={(e) => e.stopPropagation()}
            >
              {/* BG */}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(160deg, ${activeStory.gradient_from}, ${activeStory.gradient_to})` }}
              >
                {activeStory.image_url && (
                  <img
                    src={activeStory.image_url}
                    alt={activeStory.title}
                    className="w-full h-full object-cover"
                    style={{ opacity: 0.55 }}
                  />
                )}
                {/* Bottom fade */}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0.9) 100%)" }}
                />
              </div>

              {/* Progress bars */}
              <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
                {stories.map((s, i) => {
                  const curr = stories.findIndex((x) => x.id === open)
                  const filled = i < curr ? 100 : i === curr ? progress : 0
                  return (
                    <div key={s.id} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-white rounded-full"
                        style={{ width: `${filled}%` }}
                      />
                    </div>
                  )
                })}
              </div>

              {/* Header */}
              <div className="absolute top-10 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="text-sm">📱</span>
                  </div>
                  <span className="text-white text-xs font-semibold opacity-90">iPro Барнаул</span>
                </div>
                <button
                  onClick={closeStory}
                  className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Tap nav zones */}
              <button
                onClick={(e) => { e.stopPropagation(); prevStory() }}
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
              />
              <button
                onClick={(e) => { e.stopPropagation(); nextStory() }}
                className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
              />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <motion.div
                  key={open}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-white text-[1.6rem] font-bold leading-tight mb-2 drop-shadow">
                    {activeStory.title}
                  </h2>
                  {activeStory.subtitle && (
                    <p className="text-white/75 text-sm leading-relaxed mb-5">
                      {activeStory.subtitle}
                    </p>
                  )}
                  {activeStory.link_url && (
                    <a
                      href={activeStory.link_url}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-50 transition-colors shadow-lg shadow-black/20"
                    >
                      {activeStory.link_label || "Подробнее"}
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </motion.div>
              </div>

              {/* Arrow hints */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <ChevronLeft className="w-5 h-5 text-white/40" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 pointer-events-none">
                <ChevronRight className="w-5 h-5 text-white/40" />
              </div>
            </motion.div>

            {/* Story count */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-xs">
              {stories.findIndex((x) => x.id === open) + 1} / {stories.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
