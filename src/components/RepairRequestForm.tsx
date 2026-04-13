import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, Loader2, Phone, User, MessageSquare, Wrench } from "lucide-react"
import { API, apiPost, getAuthToken } from "@/hooks/useApi"

interface Props {
  deviceBrand?: string
  deviceModel?: string
  serviceName?: string
  servicePrice?: number
  compact?: boolean
  className?: string
}

export function RepairRequestForm({
  deviceBrand = "",
  deviceModel = "",
  serviceName = "",
  servicePrice,
  compact = false,
  className = "",
}: Props) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phone.trim()) { setError("Укажите номер телефона"); return }
    setError("")
    setLoading(true)

    try {
      await apiPost(API.orders, {
        action: "create",
        client_name: name,
        client_phone: phone,
        device_brand: deviceBrand,
        device_model: deviceModel,
        service_name: serviceName,
        service_price: servicePrice || 0,
        comment,
        source: "site_form",
      }, getAuthToken())
      setDone(true)
    } catch {
      setError("Ошибка отправки. Попробуйте ещё раз или позвоните нам.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex flex-col items-center justify-center text-center py-8 px-6 ${className}`}
      >
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Заявка принята!</h3>
        <p className="text-gray-600 leading-relaxed">
          Наш менеджер свяжется с вами<br />
          <strong>в течение 15 минут.</strong><br />
          Спасибо, что выбрали iPro!
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-3 ${className}`}>
      {!compact && (
        <div className="mb-1">
          <h3 className="text-lg font-bold text-gray-900">Оставить заявку</h3>
          {deviceModel && (
            <p className="text-sm text-gray-500 mt-0.5">
              {deviceBrand} {deviceModel}{serviceName ? ` — ${serviceName}` : ""}
              {servicePrice ? ` · от ${servicePrice.toLocaleString("ru")} ₽` : ""}
            </p>
          )}
        </div>
      )}

      <div className="relative">
        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="tel"
          placeholder="Номер телефона *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      <div className="relative">
        <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <textarea
          placeholder="Опишите проблему (необязательно)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={compact ? 2 : 3}
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wrench className="w-4 h-4" />
        )}
        {loading ? "Отправляем..." : "Записаться на ремонт"}
      </button>

      <p className="text-xs text-gray-400 text-center leading-tight">
        Нажимая кнопку, вы соглашаетесь на обработку персональных данных
      </p>
    </form>
  )
}
