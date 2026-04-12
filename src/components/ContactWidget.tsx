import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Icon from "@/components/ui/icon"

export function ContactWidget() {
  const [open, setOpen] = useState(false)
  const [callbackOpen, setCallbackOpen] = useState(false)
  const [cbPhone, setCbPhone] = useState("")
  const [cbSent, setCbSent] = useState(false)

  const handleCallback = () => {
    if (cbPhone.length >= 10) { setCbSent(true); setTimeout(() => { setCbSent(false); setCallbackOpen(false); setCbPhone("") }, 3000) }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
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
              className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#0088cc] text-white text-sm font-medium shadow-lg hover:bg-[#0077b5] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.932z"/></svg>
              Чат в MAX
            </a>

            {/* Позвонить */}
            <a
              href="tel:+79993231817"
              className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm font-medium shadow-lg hover:bg-zinc-800 transition-colors"
            >
              <Icon name="Phone" size={16} className="text-green-400" />
              Позвонить
            </a>

            {/* Обратный звонок */}
            <button
              onClick={() => setCallbackOpen(!callbackOpen)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-200 text-sm font-medium shadow-lg hover:bg-zinc-800 transition-colors"
            >
              <Icon name="PhoneCall" size={16} className="text-yellow-400" />
              Обратный звонок
            </button>

            {/* Callback form */}
            <AnimatePresence>
              {callbackOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="w-72 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl p-5"
                >
                  {!cbSent ? (
                    <>
                      <p className="font-heading font-semibold text-zinc-100 text-sm mb-3">Перезвоним в течение 5 минут</p>
                      <input
                        type="tel"
                        value={cbPhone}
                        onChange={(e) => setCbPhone(e.target.value)}
                        placeholder="+7 (___) ___-__-__"
                        className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none mb-3"
                      />
                      <button
                        onClick={handleCallback}
                        disabled={cbPhone.length < 10}
                        className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-40"
                      >
                        Перезвоните мне
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-2">
                      <Icon name="CheckCircle" size={28} className="text-green-400 mx-auto mb-2" />
                      <p className="text-zinc-200 text-sm font-medium">Перезвоним скоро!</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={() => { setOpen(!open); if (open) setCallbackOpen(false) }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-zinc-100 text-zinc-900 shadow-xl flex items-center justify-center hover:bg-zinc-200 transition-colors"
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
