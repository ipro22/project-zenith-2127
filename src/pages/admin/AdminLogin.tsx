import { motion } from "framer-motion"
import { Loader2, LayoutDashboard, AlertCircle } from "lucide-react"
import { SEOHead } from "@/components/SEOHead"

interface AdminLoginProps {
  tokenInput: string
  setTokenInput: (v: string) => void
  authError: string
  authLoading: boolean
  handleLogin: () => void
}

export default function AdminLogin({ tokenInput, setTokenInput, authError, authLoading, handleLogin }: AdminLoginProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEOHead title="Администратор — iPro" description="" />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-lg p-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-5">
          <LayoutDashboard className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Панель управления</h1>
        <p className="text-gray-400 text-sm mb-6">iPro Барнаул · Только для сотрудников</p>
        <input type="password" placeholder="Пароль администратора" value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {authError && <p className="text-red-500 text-xs mb-3 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{authError}</p>}
        <button onClick={handleLogin} disabled={authLoading}
          className="w-full py-3 rounded-2xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
          {authLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Войти"}
        </button>
      </motion.div>
    </div>
  )
}
