import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
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

export function StoriesBar() {
  const [stories, setStories] = useState<Story[]>([])
  const [viewed, setViewed] = useState<Set<number>>(new Set(JSON.parse(localStorage.getItem("ipro_viewed_stories") || "[]")))
  const [open, setOpen] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const DURATION = 5000

  useEffect(() => {
    apiPost<{ stories: Story[] }>(API.auth, { action: "get_stories" }).then((d) => setStories(d.stories || [])).catch(() => {})
  }, [])

  const markViewed = (id: number) => {
    const next = new Set(viewed).add(id)
    setViewed(next)
    localStorage.setItem("ipro_viewed_stories", JSON.stringify([...next]))
  }

  const openStory = (id: number) => {
    setOpen(id); setProgress(0); markViewed(id)
  }

  const closeStory = () => { setOpen(null); setProgress(0); if (timerRef.current) clearInterval(timerRef.current) }

  const nextStory = () => {
    if (open === null) return
    const idx = stories.findIndex((s) => s.id === open)
    if (idx < stories.length - 1) { openStory(stories[idx + 1].id) } else { closeStory() }
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
        if (p >= 100) { clearInterval(timerRef.current!); nextStory(); return 100 }
        return p + (step / DURATION) * 100
      })
    }, step)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [open])

  if (stories.length === 0) return null

  const activeStory = stories.find((s) => s.id === open)

  return (
    <>
      {/* Stories row */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
            {stories.map((story) => {
              const isViewed = viewed.has(story.id)
              return (
                <button key={story.id} onClick={() => openStory(story.id)}
                  className="flex-shrink-0 flex flex-col items-center gap-1.5 group">
                  <div className={`w-16 h-16 rounded-full p-0.5 ${isViewed ? "bg-gray-200" : "bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600"}`}>
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-white relative">
                      <img src={story.image_url} alt={story.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        style={{ background: `linear-gradient(135deg, ${story.gradient_from}, ${story.gradient_to})` }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${story.gradient_from}99, ${story.gradient_to}99)` }}>
                        <span className="text-white font-bold text-[10px] text-center leading-tight px-1">{story.title}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[11px] font-medium max-w-[64px] text-center truncate ${isViewed ? "text-gray-400" : "text-gray-700"}`}>
                    {story.title}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Story viewer */}
      <AnimatePresence>
        {open !== null && activeStory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={closeStory}>

            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
              className="relative w-full max-w-sm h-[600px] rounded-3xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}>

              {/* Background */}
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(160deg, ${activeStory.gradient_from}, ${activeStory.gradient_to})` }}>
                {activeStory.image_url && (
                  <img src={activeStory.image_url} alt={activeStory.title}
                    className="w-full h-full object-cover opacity-60" />
                )}
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(to bottom, transparent 40%, ${activeStory.gradient_to}ee)` }} />
              </div>

              {/* Progress bars */}
              <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
                {stories.map((s, i) => {
                  const idx = stories.findIndex((x) => x.id === open)
                  const filled = i < idx ? 100 : i === idx ? progress : 0
                  return (
                    <div key={s.id} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full transition-none" style={{ width: `${filled}%` }} />
                    </div>
                  )
                })}
              </div>

              {/* Close */}
              <button onClick={closeStory}
                className="absolute top-6 right-4 z-10 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Nav areas */}
              <button onClick={(e) => { e.stopPropagation(); prevStory() }}
                className="absolute left-0 top-0 bottom-0 w-1/3 z-10" />
              <button onClick={(e) => { e.stopPropagation(); nextStory() }}
                className="absolute right-0 top-0 bottom-0 w-1/3 z-10" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <h2 className="text-white text-2xl font-bold mb-1 drop-shadow">{activeStory.title}</h2>
                {activeStory.subtitle && <p className="text-white/80 text-sm mb-4">{activeStory.subtitle}</p>}
                {activeStory.link_url && (
                  <a href={activeStory.link_url}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gray-900 font-semibold text-sm hover:bg-gray-100 transition-colors">
                    {activeStory.link_label || "Подробнее"}
                  </a>
                )}
              </div>

              {/* Arrow hints */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 opacity-50">
                <ChevronLeft className="w-5 h-5 text-white" />
              </div>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 z-20 opacity-50">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
