import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"
import { API, apiPost } from "@/hooks/useApi"

export function ContactWidget() {
  const [open, setOpen] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [cbPhone, setCbPhone] = useState("")
  const [cbName, setCbName] = useState("")
  const [cbSent, setCbSent] = useState(false)
  const [cbLoading, setCbLoading] = useState(false)

  const handleCallback = async () => {
    if (cbPhone.length < 10) return
    setCbLoading(true)
    try {
      await apiPost(API.orders, {
        action: "create",
        client_name: cbName || "Обратный звонок",
        client_phone: cbPhone,
        device_brand: "Обратный звонок",
        device_model: "",
        service_name: "Консультация / обратный звонок",
        service_price: 0,
        source: "callback_widget",
      })
    } catch { /* ignore */ }
    setCbSent(true)
    setCbLoading(false)
    setTimeout(() => { setCbSent(false); setCallbackOpen(false); setCbPhone(""); setCbName("") }, 3500)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="flex flex-col gap-2 items-end"
          >
            {/* MAX Chat */}
            <a
              href="https://max.ru/+79779771616"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#0088cc] text-white text-sm font-medium shadow-lg hover:bg-[#0077b5] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/></svg>
              Написать в MAX
            </a>

            {/* Позвонить */}
            <a
              href="tel:+79993231817"
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-lg hover:bg-gray-50 transition-colors"
            >
              <Icon name="Phone" size={15} className="text-green-500" />
              Позвонить
            </a>

            {/* Обратный звонок */}
            <button
              onClick={() => setCallbackOpen(!callbackOpen)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-lg hover:bg-gray-50 transition-colors"
            >
              <Icon name="PhoneCall" size={15} className="text-blue-500" />
              Обратный звонок
            </button>

            {/* Callback form */}
            <AnimatePresence>
              {callbackOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  className="w-72 rounded-2xl bg-white border border-gray-100 shadow-2xl p-5"
                >
                  {!cbSent ? (
                    <>
                      <p className="font-semibold text-gray-900 text-sm mb-1">Перезвоним за 5 минут</p>
                      <p className="text-gray-500 text-xs mb-3">Оставьте номер — мы свяжемся с вами</p>
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={cbName}
                          onChange={(e) => setCbName(e.target.value)}
                          placeholder="Ваше имя"
                          className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 text-sm outline-none focus:border-blue-400 transition-colors"
                        />
                        <input
                          type="tel"
                          value={cbPhone}
                          onChange={(e) => setCbPhone(e.target.value)}
                          placeholder="+7 (999) 000-00-00"
                          className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-800 placeholder:text-gray-400 text-sm outline-none focus:border-blue-400 transition-colors"
                          onKeyDown={(e) => e.key === "Enter" && handleCallback()}
                        />
                        <button
                          onClick={handleCallback}
                          disabled={cbPhone.length < 10 || cbLoading}
                          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                        >
                          {cbLoading ? <Icon name="Loader2" size={14} className="animate-spin" /> : null}
                          Перезвоните мне
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-3">
                      <Icon name="CheckCircle" size={32} className="text-green-500 mx-auto mb-2" />
                      <p className="text-gray-900 text-sm font-semibold">Скоро перезвоним!</p>
                      <p className="text-gray-500 text-xs mt-1">Обычно в течение 5 минут</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        onClick={() => { setOpen(!open); if (open) setCallbackOpen(false) }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-200 flex items-center justify-center hover:bg-blue-700 transition-colors"
        aria-label="Контакты"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <Icon name="X" size={22} />
            </motion.div>
          ) : (
            <motion.div key="msg" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Icon name="MessageCircle" size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

export default ContactWidget
