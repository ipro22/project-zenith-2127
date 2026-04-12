import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"
import { Order, statusColors, statusLabels, statusSteps } from "./account.types"

interface Props {
  phone: string
  setPhone: (v: string) => void
  code: string
  setCode: (v: string) => void
  codeSent: boolean
  setCodeSent: (v: boolean) => void
  trackNumber: string
  setTrackNumber: (v: string) => void
  trackResult: Order | null
  handleSendCode: () => void
  handleVerifyCode: () => void
  handleTrack: () => void
}

export function AccountLoginView({
  phone, setPhone, code, setCode, codeSent, setCodeSent,
  trackNumber, setTrackNumber, trackResult,
  handleSendCode, handleVerifyCode, handleTrack,
}: Props) {
  return (
    <div className="max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
          <Icon name="User" size={28} className="text-zinc-400" />
        </div>
        <h1 className="font-display text-3xl font-bold text-zinc-100 mb-3">Личный кабинет</h1>
        <p className="text-zinc-500 text-sm">Войдите для отслеживания заказов и управления бонусами</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6"
      >
        {!codeSent ? (
          <>
            <label className="block text-sm text-zinc-400 mb-2">Номер телефона</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors mb-4"
            />
            <button
              onClick={handleSendCode}
              disabled={phone.length < 10}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-40 disabled:hover:bg-zinc-100"
            >
              Получить код
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-400 mb-4">Код отправлен на {phone}</p>
            <label className="block text-sm text-zinc-400 mb-2">Код подтверждения</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="0000"
              maxLength={4}
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm text-center tracking-[0.5em] outline-none focus:border-zinc-600 transition-colors mb-4"
            />
            <button
              onClick={handleVerifyCode}
              disabled={code.length !== 4}
              className="w-full px-4 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-40 mb-3"
            >
              Войти
            </button>
            <button
              onClick={() => setCodeSent(false)}
              className="w-full text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Изменить номер
            </button>
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6"
      >
        <h3 className="font-heading font-semibold text-zinc-200 text-sm mb-3">Проверить статус заказа</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={trackNumber}
            onChange={(e) => setTrackNumber(e.target.value)}
            placeholder="IPR-2025-0412"
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors"
          />
          <button
            onClick={handleTrack}
            className="px-4 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
          >
            <Icon name="Search" size={16} />
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
            <p className="text-xs text-zinc-500">{trackResult.device} — {trackResult.service}</p>
            <div className="flex items-center gap-1 mt-3">
              {statusSteps.map((step, i) => {
                const currentIdx = statusSteps.indexOf(trackResult.status)
                const isActive = i <= currentIdx
                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`w-3 h-3 rounded-full ${isActive ? "bg-zinc-100" : "bg-zinc-700"}`} />
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 ${i < currentIdx ? "bg-zinc-100" : "bg-zinc-700"}`} />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-1">
              {statusSteps.map((step) => (
                <span key={step} className="text-[10px] text-zinc-600">{statusLabels[step]}</span>
              ))}
            </div>
          </div>
        )}
        {trackNumber && !trackResult && (
          <p className="mt-3 text-xs text-zinc-500">Заказ не найден. Проверьте номер.</p>
        )}
      </motion.div>
    </div>
  )
}