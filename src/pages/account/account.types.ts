export interface UserData {
  phone: string
  name: string
  email: string
  registeredAt: string
}

export interface Order {
  id: string
  device: string
  service: string
  status: "accepted" | "diagnostics" | "repair" | "ready" | "completed"
  date: string
  price: string
  bonusEarned: number
}

export interface BonusEntry {
  id: string
  date: string
  description: string
  amount: number
  type: "earn" | "spend"
}

export const statusLabels: Record<string, string> = {
  accepted: "Принят",
  diagnostics: "Диагностика",
  repair: "В ремонте",
  ready: "Готов к выдаче",
  completed: "Выдан",
}

export const statusColors: Record<string, string> = {
  accepted: "bg-blue-500/20 text-blue-400",
  diagnostics: "bg-yellow-500/20 text-yellow-400",
  repair: "bg-orange-500/20 text-orange-400",
  ready: "bg-green-500/20 text-green-400",
  completed: "bg-zinc-500/20 text-zinc-400",
}

export const statusSteps = ["accepted", "diagnostics", "repair", "ready", "completed"]

export const demoOrders: Order[] = [
  { id: "IPR-2025-0412", device: "iPhone 17 Pro Max", service: "Замена экрана (OLED)", status: "repair", date: "2025-04-10", price: "12 500 ₽", bonusEarned: 625 },
  { id: "IPR-2025-0398", device: "MacBook Air 13\" M3", service: "Чистка + замена термопасты", status: "ready", date: "2025-04-08", price: "2 500 ₽", bonusEarned: 125 },
  { id: "IPR-2025-0356", device: "Samsung Galaxy S24 Ultra", service: "Замена аккумулятора", status: "completed", date: "2025-03-25", price: "3 200 ₽", bonusEarned: 160 },
]

export const demoBonuses: BonusEntry[] = [
  { id: "b1", date: "2025-04-10", description: "Начислено за заказ IPR-2025-0412", amount: 625, type: "earn" },
  { id: "b2", date: "2025-04-08", description: "Начислено за заказ IPR-2025-0398", amount: 125, type: "earn" },
  { id: "b3", date: "2025-03-25", description: "Начислено за заказ IPR-2025-0356", amount: 160, type: "earn" },
  { id: "b4", date: "2025-03-20", description: "Списано при оплате заказа", amount: -500, type: "spend" },
  { id: "b5", date: "2025-02-14", description: "Бонус за регистрацию", amount: 300, type: "earn" },
]

export function getUser(): UserData | null {
  const data = localStorage.getItem("ipro_user")
  return data ? JSON.parse(data) : null
}

export function setUser(user: UserData) {
  localStorage.setItem("ipro_user", JSON.stringify(user))
}
