import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"
import { demoBonuses } from "./account.types"

interface NextLevel {
  name: string
  need: number
  current: number
}

interface Props {
  bonusBalance: number
  loyaltyLevel: string
  loyaltyDiscount: string
  nextLevel: NextLevel | null
}

export function AccountTabBonuses({ bonusBalance, loyaltyLevel, loyaltyDiscount, nextLevel }: Props) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
          <p className="text-xs text-zinc-500 mb-2">Баланс бонусов</p>
          <p className="font-display text-3xl font-bold text-zinc-100">{bonusBalance}</p>
          <p className="text-xs text-zinc-500 mt-1">1 бонус = 1 рубль</p>
        </div>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
          <p className="text-xs text-zinc-500 mb-2">Уровень лояльности</p>
          <p className="font-display text-xl font-bold text-zinc-100">{loyaltyLevel}</p>
          <p className="text-xs text-zinc-500 mt-1">Скидка {loyaltyDiscount} на все услуги</p>
        </div>
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
          <p className="text-xs text-zinc-500 mb-2">Начислений за всё время</p>
          <p className="font-display text-xl font-bold text-zinc-100">
            {demoBonuses.filter((b) => b.type === "earn").reduce((s, b) => s + b.amount, 0)} ₽
          </p>
          <p className="text-xs text-zinc-500 mt-1">5% от суммы каждого заказа</p>
        </div>
      </div>

      {nextLevel && (
        <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-zinc-300">Прогресс до уровня «{nextLevel.name}»</p>
            <span className="text-xs text-zinc-500">{nextLevel.current}/{nextLevel.need} обращений</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-full transition-all duration-500"
              style={{ width: `${(nextLevel.current / nextLevel.need) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800/50">
          <h3 className="font-heading font-semibold text-zinc-200 text-sm">История бонусов</h3>
        </div>
        <div className="divide-y divide-zinc-800/40">
          {demoBonuses.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm text-zinc-300">{entry.description}</p>
                <p className="text-xs text-zinc-600">{entry.date}</p>
              </div>
              <span className={`text-sm font-semibold ${entry.type === "earn" ? "text-green-400" : "text-red-400"}`}>
                {entry.amount > 0 ? "+" : ""}{entry.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-5">
        <h3 className="font-heading font-semibold text-zinc-200 text-sm mb-3">Как работают бонусы</h3>
        <div className="space-y-2 text-sm text-zinc-400">
          <div className="flex items-start gap-2">
            <Icon name="Plus" size={16} className="text-green-400 shrink-0 mt-0.5" />
            <span>5% от суммы каждого заказа начисляется в бонусы</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Coins" size={16} className="text-zinc-500 shrink-0 mt-0.5" />
            <span>1 бонус = 1 рубль. Оплачивайте бонусами до 30% стоимости заказа</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="TrendingUp" size={16} className="text-zinc-500 shrink-0 mt-0.5" />
            <span>Чем больше заказов — тем выше уровень и скидка</span>
          </div>
          <div className="flex items-start gap-2">
            <Icon name="Gift" size={16} className="text-zinc-500 shrink-0 mt-0.5" />
            <span>VIP-клиенты получают 2x бонусов и персонального мастера</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
