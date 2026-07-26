import { API } from "@/hooks/useApi"

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Client { id: number; phone: string; name: string | null; email: string | null; bonus_balance: number; loyalty_level: string; visits_count: number; total_spent: number; created_at: string }
export interface Order { order_number: string; client_name: string; client_phone: string; device_brand: string; device_model: string; service_name: string; service_price: number; status: string; bonus_earned: number; created_at: string; comment?: string }
export interface Stats { total_clients: number; total_orders: number; new_orders: number; total_revenue: number; total_bonuses: number }
export interface ContentItem { key: string; value: string; type: string; label: string }
export interface ContentMap { [section: string]: ContentItem[] }
export interface Product { id?: number; name: string; brand: string; category: string; description: string; price: number; old_price?: number; image_url: string; badge: string; in_stock: boolean; sort_order: number; created_at?: string }
export interface BonusTx { type: string; amount: number; description: string; created_at: string }
export interface Story { id?: number; title: string; subtitle: string; image_url: string; link_url: string; link_label: string; gradient_from: string; gradient_to: string; is_active: boolean; sort_order: number }
export interface Price { id?: number; brand_slug: string; brand_name: string; model_slug: string; model_name: string; service_name: string; price_text: string; price_num: number; sort_order: number; is_active: boolean }

export type AdminTab = "dashboard" | "orders" | "clients" | "shop" | "stories" | "prices" | "editor"

// ─── Constants ────────────────────────────────────────────────────────────────
export const loyaltyOptions = ["standard", "regular", "vip"]
export const loyaltyLabels: Record<string, string> = { standard: "Стандарт", regular: "Постоянный", vip: "VIP" }
export const loyaltyColors: Record<string, string> = { standard: "bg-gray-100 text-gray-600", regular: "bg-blue-100 text-blue-700", vip: "bg-amber-100 text-amber-700" }
export const statusLabels: Record<string, string> = { received: "Принят", diagnostics: "Диагностика", repair: "В ремонте", ready: "Готов", completed: "Выдан" }
export const statusColors: Record<string, string> = { received: "bg-blue-100 text-blue-700", diagnostics: "bg-yellow-100 text-yellow-700", repair: "bg-orange-100 text-orange-700", ready: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-500" }

export const EMPTY_PRODUCT: Product = { name: "", brand: "", category: "", description: "", price: 0, image_url: "", badge: "", in_stock: true, sort_order: 0 }
export const EMPTY_STORY: Story = { title: "", subtitle: "", image_url: "", link_url: "", link_label: "Подробнее", gradient_from: "#1d4ed8", gradient_to: "#7c3aed", is_active: true, sort_order: 0 }
export const EMPTY_PRICE: Price = { brand_slug: "", brand_name: "", model_slug: "", model_name: "", service_name: "", price_text: "", price_num: 0, sort_order: 0, is_active: true }

// ─── API helper ───────────────────────────────────────────────────────────────
export async function adminFetch(action: string, body: object = {}, token: string) {
  const res = await fetch(API.admin, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Token": token },
    body: JSON.stringify({ action: `admin_${action}`, ...body }),
  })
  const raw = await res.json()
  return typeof raw === "string" ? JSON.parse(raw) : raw
}

// ─── Sub-components ──────────────────────────────────────────────────────────
export function Badge({ label, color }: { label: string; color: string }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${color}`}>{label}</span>
}

export function Pill({ children, onClick, variant = "default" }: { children: React.ReactNode; onClick?: () => void; variant?: "default" | "danger" | "success" | "ghost" }) {
  const cls = { default: "bg-blue-600 text-white hover:bg-blue-700", danger: "bg-red-50 text-red-600 hover:bg-red-100", success: "bg-green-50 text-green-700 hover:bg-green-100", ghost: "bg-gray-100 text-gray-600 hover:bg-gray-200" }
  return <button onClick={onClick} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${cls[variant]}`}>{children}</button>
}
