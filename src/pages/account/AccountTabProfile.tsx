import { motion } from "framer-motion"
import { UserData } from "./account.types"

interface Props {
  user: UserData
  profileName: string
  setProfileName: (v: string) => void
  profileEmail: string
  setProfileEmail: (v: string) => void
  saved: boolean
  handleSaveProfile: () => void
  totalOrders: number
  totalSpent: string
  bonusBalance: number
  loyaltyLevel: string
}

export function AccountTabProfile({
  user, profileName, setProfileName, profileEmail, setProfileEmail,
  saved, handleSaveProfile, totalOrders, totalSpent, bonusBalance, loyaltyLevel,
}: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Имя</label>
            <input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Телефон</label>
            <input
              type="tel"
              value={user.phone}
              disabled
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/30 border border-zinc-700/30 text-zinc-500 text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-zinc-400 mb-2">Email</label>
            <input
              type="email"
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full px-4 py-3 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-zinc-100 placeholder:text-zinc-600 text-sm outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          className="mt-4 px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium text-sm hover:bg-zinc-200 transition-colors"
        >
          {saved ? "Сохранено!" : "Сохранить"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 text-center">
          <p className="text-2xl font-bold text-zinc-100">{totalOrders}</p>
          <p className="text-xs text-zinc-500 mt-1">Заказов</p>
        </div>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 text-center">
          <p className="text-2xl font-bold text-zinc-100">{totalSpent}</p>
          <p className="text-xs text-zinc-500 mt-1">Потрачено</p>
        </div>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 text-center">
          <p className="text-2xl font-bold text-zinc-100">{bonusBalance}</p>
          <p className="text-xs text-zinc-500 mt-1">Бонусов</p>
        </div>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 text-center">
          <p className={`text-2xl font-bold ${loyaltyLevel === "VIP" ? "text-yellow-400" : "text-zinc-100"}`}>
            {loyaltyLevel}
          </p>
          <p className="text-xs text-zinc-500 mt-1">Уровень</p>
        </div>
      </div>
    </motion.div>
  )
}
