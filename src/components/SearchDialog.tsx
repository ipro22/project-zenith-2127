import { useState, useEffect, useMemo, useRef } from "react"
import { searchIndex } from "@/data/devices"
import Icon from "@/components/ui/icon"

interface Props {
  open: boolean
  onClose: () => void
}

export function SearchDialog({ open, onClose }: Props) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQuery("")
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [open, onClose])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return searchIndex
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      )
      .slice(0, 20)
  }, [query])

  const grouped = useMemo(() => {
    const map: Record<string, typeof results> = {}
    results.forEach((r) => {
      if (!map[r.category]) map[r.category] = []
      map[r.category].push(r)
    })
    return map
  }, [results])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl mx-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800">
          <Icon name="Search" size={20} className="text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по услугам, устройствам..."
            className="flex-1 bg-transparent text-zinc-100 placeholder:text-zinc-600 outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs text-zinc-600 bg-zinc-800 rounded border border-zinc-700">
            ESC
          </kbd>
        </div>

        <div className="max-h-[50vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <div className="px-5 py-10 text-center text-zinc-500 text-sm">
              Ничего не найдено по запросу «{query}»
            </div>
          )}

          {!query.trim() && (
            <div className="px-5 py-10 text-center text-zinc-600 text-sm">
              Начните вводить для поиска
            </div>
          )}

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <div className="px-5 py-2 text-xs font-medium text-zinc-500 uppercase tracking-wider bg-zinc-900/80 sticky top-0">
                {category}
              </div>
              {items.map((item, i) => (
                <a
                  key={`${item.href}-${i}`}
                  href={item.href}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-zinc-800/60 transition-colors group"
                >
                  <Icon name="ArrowRight" size={16} className="text-zinc-600 group-hover:text-zinc-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-zinc-200 truncate">{item.title}</div>
                    <div className="text-xs text-zinc-500 truncate">{item.description}</div>
                  </div>
                  {item.price && (
                    <span className="text-xs text-zinc-400 font-medium shrink-0">{item.price}</span>
                  )}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchDialog
