import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"
import { Order, demoOrders, statusColors, statusLabels, statusSteps } from "./account.types"

interface Props {
  trackNumber: string
  setTrackNumber: (v: string) => void
  trackResult: Order | null
  handleTrack: () => void
}

export function AccountTabOrders({ trackNumber, setTrackNumber, trackResult, handleTrack }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
        <h3 className="font-heading font-semibold text-zinc-200 text-sm mb-3">Проверить статус заказа</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={trackNumber}
            onChange={(e) => setTrackNumber(e.target.value)}
            placeholder="Введите номер заказа"
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors"
          />
          <button
            onClick={handleTrack}
            className="px-4 py-2.5 rounded-xl bg-zinc-100 text-zinc-900 text-sm font-medium hover:bg-zinc-200 transition-colors"
          >
            Найти
          </button>
        </div>
        {trackResult && (
          <div className="mt-4 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-zinc-200">{trackResult.id}</span>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[trackResult.status]}`}>
                {statusLabels[trackResult.status]}
              </span>
            </div>
            <p className="text-xs text-zinc-500">{trackResult.device} — {trackResult.service} — {trackResult.price}</p>
            <div className="flex items-center gap-1 mt-3">
              {statusSteps.map((step, i) => {
                const currentIdx = statusSteps.indexOf(trackResult.status)
                const isActive = i <= currentIdx
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`w-3 h-3 rounded-full transition-colors ${isActive ? "bg-zinc-100" : "bg-zinc-700"}`} />
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 transition-colors ${i < currentIdx ? "bg-zinc-100" : "bg-zinc-700"}`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="font-heading font-semibold text-zinc-200 text-base">Ваши заказы</h3>
        {demoOrders.map((order) => (
          <div key={order.id} className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-zinc-200">{order.id}</span>
                <span className="text-xs text-zinc-600">{order.date}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                {statusLabels[order.status]}
              </span>
            </div>
            <p className="text-sm text-zinc-400">{order.device}</p>
            <p className="text-xs text-zinc-500">{order.service}</p>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/30">
              <span className="text-sm font-semibold text-zinc-200">{order.price}</span>
              <span className="text-xs text-green-400">+{order.bonusEarned} бонусов</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
