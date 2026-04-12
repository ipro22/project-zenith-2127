import { Navbar } from "@/components/Navbar"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { motion } from "framer-motion"
import Icon from "@/components/ui/icon"
import { useState, useEffect } from "react"
import {
  UserData, Order,
  demoOrders, demoBonuses,
  getUser, setUser,
} from "@/pages/account/account.types"
import { AccountLoginView } from "@/pages/account/AccountLoginView"
import { AccountTabOrders } from "@/pages/account/AccountTabOrders"
import { AccountTabBonuses } from "@/pages/account/AccountTabBonuses"
import { AccountTabProfile } from "@/pages/account/AccountTabProfile"

export default function AccountPage() {
  const [user, setUserState] = useState<UserData | null>(null)
  const [tab, setTab] = useState<"orders" | "bonuses" | "profile">("orders")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [trackNumber, setTrackNumber] = useState("")
  const [trackResult, setTrackResult] = useState<Order | null>(null)
  const [profileName, setProfileName] = useState("")
  const [profileEmail, setProfileEmail] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const u = getUser()
    if (u) {
      setUserState(u)
      setProfileName(u.name)
      setProfileEmail(u.email)
    }
  }, [])

  const handleSendCode = () => {
    if (phone.length >= 10) setCodeSent(true)
  }

  const handleVerifyCode = () => {
    if (code.length === 4) {
      const newUser: UserData = { phone, name: "", email: "", registeredAt: new Date().toISOString() }
      setUser(newUser)
      setUserState(newUser)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("ipro_user")
    setUserState(null)
    setPhone("")
    setCode("")
    setCodeSent(false)
  }

  const handleTrack = () => {
    const found = demoOrders.find((o) => o.id.toLowerCase() === trackNumber.toLowerCase())
    setTrackResult(found || null)
  }

  const handleSaveProfile = () => {
    if (user) {
      const updated = { ...user, name: profileName, email: profileEmail }
      setUser(updated)
      setUserState(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const totalOrders = demoOrders.length
  const totalSpent = "18 200 ₽"
  const bonusBalance = demoBonuses.reduce((sum, b) => sum + b.amount, 0)
  const visits = totalOrders
  const loyaltyLevel = visits >= 5 ? "VIP" : visits >= 3 ? "Постоянный" : "Стандарт"
  const loyaltyDiscount = visits >= 5 ? "10%" : visits >= 3 ? "7%" : "5%"
  const nextLevel = visits >= 5 ? null : visits >= 3 ? { name: "VIP", need: 5, current: visits } : { name: "Постоянный", need: 3, current: visits }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950">
        <SEOHead title="Личный кабинет — iPro Барнаул" description="Войдите в личный кабинет iPro: проверка статуса заказа, бонусы, история ремонтов." />
        <Navbar />
        <main className="pt-24 pb-20 px-6">
          <AccountLoginView
            phone={phone}
            setPhone={setPhone}
            code={code}
            setCode={setCode}
            codeSent={codeSent}
            setCodeSent={setCodeSent}
            trackNumber={trackNumber}
            setTrackNumber={setTrackNumber}
            trackResult={trackResult}
            handleSendCode={handleSendCode}
            handleVerifyCode={handleVerifyCode}
            handleTrack={handleTrack}
          />
        </main>
        <FooterSection />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <SEOHead title="Личный кабинет — iPro Барнаул" description="Личный кабинет iPro: ваши заказы, бонусы, профиль." />
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-zinc-100">
                {user.name || "Личный кабинет"}
              </h1>
              <p className="text-zinc-500 text-sm mt-1">{user.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1.5 rounded-full font-medium ${loyaltyLevel === "VIP" ? "bg-yellow-500/20 text-yellow-400" : loyaltyLevel === "Постоянный" ? "bg-blue-500/20 text-blue-400" : "bg-zinc-500/20 text-zinc-400"}`}>
                {loyaltyLevel} · скидка {loyaltyDiscount}
              </span>
              <button onClick={handleLogout} className="text-zinc-500 hover:text-zinc-300 transition-colors">
                <Icon name="LogOut" size={18} />
              </button>
            </div>
          </motion.div>

          <div className="flex gap-1 mb-8 p-1 rounded-xl bg-zinc-900/60 border border-zinc-800/50 w-fit">
            {([
              { key: "orders", label: "Мои заказы", icon: "Package" },
              { key: "bonuses", label: "Бонусы", icon: "Gift" },
              { key: "profile", label: "Профиль", icon: "User" },
            ] as const).map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${tab === key ? "bg-zinc-800 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Icon name={icon} size={16} />
                {label}
              </button>
            ))}
          </div>

          {tab === "orders" && (
            <AccountTabOrders
              trackNumber={trackNumber}
              setTrackNumber={setTrackNumber}
              trackResult={trackResult}
              handleTrack={handleTrack}
            />
          )}

          {tab === "bonuses" && (
            <AccountTabBonuses
              bonusBalance={bonusBalance}
              loyaltyLevel={loyaltyLevel}
              loyaltyDiscount={loyaltyDiscount}
              nextLevel={nextLevel}
            />
          )}

          {tab === "profile" && (
            <AccountTabProfile
              user={user}
              profileName={profileName}
              setProfileName={setProfileName}
              profileEmail={profileEmail}
              setProfileEmail={setProfileEmail}
              saved={saved}
              handleSaveProfile={handleSaveProfile}
              totalOrders={totalOrders}
              totalSpent={totalSpent}
              bonusBalance={bonusBalance}
              loyaltyLevel={loyaltyLevel}
            />
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  )
}
