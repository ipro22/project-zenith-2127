import func2url from "../../backend/func2url.json"

const URLS = func2url as Record<string, string>

export const API = {
  auth: URLS.api,
  orders: URLS.business,
  admin: URLS.business,
  livesklad: URLS.api,
}

export async function apiPost<T = unknown>(url: string, body: object, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (token) headers["X-Auth-Token"] = token
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) })
  const data = await res.json()
  if (typeof data === "string") return JSON.parse(data) as T
  return data as T
}

export async function apiGet<T = unknown>(url: string, params?: Record<string, string>, token?: string): Promise<T> {
  const headers: Record<string, string> = {}
  if (token) headers["X-Auth-Token"] = token
  const qs = params ? "?" + new URLSearchParams(params).toString() : ""
  const res = await fetch(url + qs, { headers })
  const data = await res.json()
  if (typeof data === "string") return JSON.parse(data) as T
  return data as T
}

export function getAuthToken(): string {
  return localStorage.getItem("ipro_auth_token") || ""
}

export function setAuthToken(token: string) {
  localStorage.setItem("ipro_auth_token", token)
}

export function removeAuthToken() {
  localStorage.removeItem("ipro_auth_token")
  localStorage.removeItem("ipro_client")
}

export function getStoredClient(): ClientData | null {
  const raw = localStorage.getItem("ipro_client")
  return raw ? JSON.parse(raw) : null
}

export function storeClient(client: ClientData) {
  localStorage.setItem("ipro_client", JSON.stringify(client))
}

export interface ClientData {
  id: number
  phone: string
  name: string | null
  email: string | null
  bonus_balance: number
  loyalty_level: "standard" | "regular" | "vip"
  visits_count: number
  total_spent: number
  yandex_id?: string | null
  yandex_login?: string | null
  yandex_avatar_url?: string | null
}