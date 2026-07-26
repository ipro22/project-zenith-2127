import {
  Users, Package, LogOut, LayoutDashboard, ShoppingBag,
  FileText, Layers, DollarSign,
} from "lucide-react"
import type { AdminTab, Stats } from "./adminShared"

const tabs = [
  { key: "dashboard", label: "Дашборд", icon: LayoutDashboard },
  { key: "orders", label: "Заказы", icon: Package },
  { key: "clients", label: "Клиенты", icon: Users },
  { key: "shop", label: "Магазин", icon: ShoppingBag },
  { key: "stories", label: "Истории", icon: Layers },
  { key: "prices", label: "Прайс-лист", icon: DollarSign },
  { key: "editor", label: "Редактор", icon: FileText },
] as const

interface AdminSidebarProps {
  tab: AdminTab
  setTab: (t: AdminTab) => void
  stats: Stats | null
  handleLogout: () => void
}

export default function AdminSidebar({ tab, setTab, stats, handleLogout }: AdminSidebarProps) {
  return (
    <>
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-100 shrink-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">iPro Admin</p>
              <p className="text-xs text-gray-400">Барнаул</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {tabs.map(({ key, label, icon: Ico }) => (
            <button key={key} onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${tab === key ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
              <Ico className="w-4 h-4 shrink-0" />{label}
              {key === "orders" && stats?.new_orders ? (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{stats.new_orders}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" /> Выйти
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 px-3 py-2 flex gap-1 overflow-x-auto">
        {tabs.map(({ key, label, icon: Ico }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${tab === key ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
            <Ico className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>
    </>
  )
}