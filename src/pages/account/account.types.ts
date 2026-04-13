import type { ClientData } from "@/hooks/useApi"
export type { ClientData }

export interface Order {
  id?: number
  order_number: string
  device_brand: string
  device_model: string
  service_name: string
  service_price: number
  status: "received" | "diagnostics" | "repair" | "ready" | "completed"
  bonus_earned: number
  bonus_used: number
  created_at: string
}

export interface BonusEntry {
  id?: string
  date: string
  description: string
  amount: number
  type: "earn" | "spend"
}

export const statusLabels: Record<string, string> = {
  received: "Принят",
  diagnostics: "Диагностика",
  repair: "В ремонте",
  ready: "Готов к выдаче",
  completed: "Выдан",
}

export const statusColors: Record<string, string> = {
  received: "bg-blue-100 text-blue-700",
  diagnostics: "bg-yellow-100 text-yellow-700",
  repair: "bg-orange-100 text-orange-700",
  ready: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-500",
}

export const statusSteps = ["received", "diagnostics", "repair", "ready", "completed"]

export const loyaltyLabels: Record<string, string> = {
  standard: "Стандарт",
  regular: "Постоянный",
  vip: "VIP",
}

export const loyaltyColors: Record<string, string> = {
  standard: "bg-gray-100 text-gray-600",
  regular: "bg-blue-100 text-blue-700",
  vip: "bg-yellow-100 text-yellow-700",
}

export const loyaltyDiscounts: Record<string, string> = {
  standard: "5%",
  regular: "7%",
  vip: "10%",
}
