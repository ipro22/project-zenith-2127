import { useState, useEffect, useCallback } from "react"
import { AnimatePresence } from "framer-motion"
import { SEOHead } from "@/components/SEOHead"
import {
  adminFetch, EMPTY_PRODUCT, EMPTY_STORY, EMPTY_PRICE,
  type Client, type Order, type Stats, type ContentMap,
  type Product, type BonusTx, type Story, type Price, type AdminTab,
} from "./admin/adminShared"
import AdminLogin from "./admin/AdminLogin"
import AdminSidebar from "./admin/AdminSidebar"
import AdminDashboardOrders from "./admin/AdminDashboardOrders"
import AdminClients from "./admin/AdminClients"
import AdminCatalog from "./admin/AdminCatalog"
import AdminContent from "./admin/AdminContent"

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("ipro_admin_token") || "")
  const [tokenInput, setTokenInput] = useState("")
  const [authed, setAuthed] = useState(false)
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState("")
  const [tab, setTab] = useState<AdminTab>("dashboard")

  // Dashboard
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  // Orders
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [orderSearch, setOrderSearch] = useState("")
  const [orderStatusFilter, setOrderStatusFilter] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Clients
  const [clients, setClients] = useState<Client[]>([])
  const [clientsLoading, setClientsLoading] = useState(false)
  const [clientSearch, setClientSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [clientTx, setClientTx] = useState<BonusTx[]>([])
  const [clientOrders, setClientOrders] = useState<Order[]>([])
  const [clientDetailLoading, setClientDetailLoading] = useState(false)
  // Bonus adjust
  const [bonusAmount, setBonusAmount] = useState("")
  const [bonusDesc, setBonusDesc] = useState("")
  const [bonusLoading, setBonusLoading] = useState(false)
  const [bonusDone, setBonusDone] = useState(false)
  // Add/edit client
  const [showAddClient, setShowAddClient] = useState(false)
  const [editClientData, setEditClientData] = useState<Partial<Client>>({})
  const [clientSaving, setClientSaving] = useState(false)

  // Shop
  const [products, setProducts] = useState<Product[]>([])
  const [shopLoading, setShopLoading] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [productSaving, setProductSaving] = useState(false)

  // Stories
  const [stories, setStories] = useState<Story[]>([])
  const [storiesLoading, setStoriesLoading] = useState(false)
  const [editStory, setEditStory] = useState<Story | null>(null)
  const [storySaving, setStorySaving] = useState(false)

  // Prices
  const [prices, setPrices] = useState<Price[]>([])
  const [pricesLoading, setPricesLoading] = useState(false)
  const [editPrice, setEditPrice] = useState<Price | null>(null)
  const [priceSaving, setPriceSaving] = useState(false)
  const [pricesBrand, setPricesBrand] = useState("")
  const [pricesSearch, setPricesSearch] = useState("")

  // Editor
  const [content, setContent] = useState<ContentMap>({})
  const [contentLoading, setContentLoading] = useState(false)
  const [contentDirty, setContentDirty] = useState<Record<string, boolean>>({})
  const [contentSaving, setContentSaving] = useState(false)
  const [contentSaved, setContentSaved] = useState(false)
  const [editorSection, setEditorSection] = useState("hero")

  // Telegram test
  const [tgTestMsg, setTgTestMsg] = useState("")
  const [tgSending, setTgSending] = useState(false)
  const [tgResult, setTgResult] = useState("")

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = async () => {
    setAuthLoading(true); setAuthError("")
    try {
      const data = await adminFetch("stats", {}, tokenInput)
      if (data.total_clients !== undefined) {
        localStorage.setItem("ipro_admin_token", tokenInput)
        setToken(tokenInput); setAuthed(true); setStats(data)
      } else { setAuthError("Неверный пароль") }
    } catch { setAuthError("Ошибка подключения") }
    setAuthLoading(false)
  }

  useEffect(() => {
    if (!authed && token) {
      adminFetch("stats", {}, token).then((d) => { if (d.total_clients !== undefined) { setAuthed(true); setStats(d) } }).catch(() => {})
    }
  }, [])

  // ── Data loaders ─────────────────────────────────────────────────────────
  const loadDashboard = useCallback(async () => {
    const [s, o] = await Promise.all([
      adminFetch("stats", {}, token),
      adminFetch("search_orders", { limit: 5 }, token),
    ])
    setStats(s)
    setRecentOrders(o.orders || [])
  }, [token])

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true)
    const data = await adminFetch("search_orders", { query: orderSearch, status: orderStatusFilter, limit: 100 }, token)
    setOrders(data.orders || [])
    setOrdersLoading(false)
  }, [token, orderSearch, orderStatusFilter])

  const loadClients = useCallback(async () => {
    setClientsLoading(true)
    const data = await adminFetch("list_clients", { search: clientSearch }, token)
    setClients(data.clients || [])
    setClientsLoading(false)
  }, [token, clientSearch])

  const loadProducts = useCallback(async () => {
    setShopLoading(true)
    const data = await adminFetch("list_products", {}, token)
    setProducts(data.products || [])
    setShopLoading(false)
  }, [token])

  const loadContent = useCallback(async () => {
    setContentLoading(true)
    const data = await adminFetch("get_content", {}, token)
    setContent(data.content || {})
    setContentLoading(false)
  }, [token])

  const loadStories = useCallback(async () => {
    setStoriesLoading(true)
    const data = await adminFetch("list_stories", {}, token)
    setStories(data.stories || [])
    setStoriesLoading(false)
  }, [token])

  const loadPrices = useCallback(async () => {
    setPricesLoading(true)
    const data = await adminFetch("list_prices", { brand_slug: pricesBrand }, token)
    setPrices(data.prices || [])
    setPricesLoading(false)
  }, [token, pricesBrand])

  const loadClientDetail = async (c: Client) => {
    setSelectedClient(c); setEditClientData({ ...c })
    setClientDetailLoading(true)
    const data = await adminFetch("client_bonus_history", { client_id: c.id }, token)
    setClientTx(data.transactions || [])
    setClientOrders(data.orders || [])
    setClientDetailLoading(false)
  }

  useEffect(() => {
    if (!authed) return
    if (tab === "dashboard") loadDashboard()
    if (tab === "orders") loadOrders()
    if (tab === "clients") loadClients()
    if (tab === "shop") loadProducts()
    if (tab === "stories") loadStories()
    if (tab === "prices") loadPrices()
    if (tab === "editor") loadContent()
  }, [tab, authed])

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleUpdateOrderStatus = async (orderNumber: string, status: string) => {
    await adminFetch("update_order_status", { order_number: orderNumber, status }, token)
    loadOrders()
  }

  const handleConfirmOrder = async (orderNumber: string) => {
    await adminFetch("confirm_order_bonus", { order_number: orderNumber }, token)
    loadOrders()
  }

  const handleDeleteOrder = async (orderNumber: string) => {
    if (!confirm(`Удалить заказ ${orderNumber}?`)) return
    await adminFetch("delete_order", { order_number: orderNumber }, token)
    setSelectedOrder(null); loadOrders()
  }

  const handleAdjustBonus = async () => {
    if (!selectedClient || !bonusAmount) return
    setBonusLoading(true)
    await adminFetch("adjust_bonus", { client_id: selectedClient.id, amount: parseInt(bonusAmount), description: bonusDesc || "Ручное начисление" }, token)
    setBonusDone(true)
    setTimeout(() => { setBonusDone(false); setBonusAmount(""); setBonusDesc(""); loadClientDetail(selectedClient) }, 1500)
    setBonusLoading(false)
  }

  const handleSaveClient = async () => {
    setClientSaving(true)
    if (editClientData.id) {
      await adminFetch("update_client", { client_id: editClientData.id, ...editClientData }, token)
    } else {
      await adminFetch("add_client", { ...editClientData }, token)
    }
    setClientSaving(false); setShowAddClient(false); setSelectedClient(null); loadClients()
  }

  const handleDeleteClient = async (cid: number) => {
    if (!confirm("Удалить клиента и все его данные?")) return
    await adminFetch("delete_client", { client_id: cid }, token)
    setSelectedClient(null); loadClients()
  }

  const handleSaveProduct = async () => {
    if (!editProduct) return
    setProductSaving(true)
    await adminFetch("save_product", editProduct, token)
    setProductSaving(false); setEditProduct(null); loadProducts()
  }

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Удалить товар?")) return
    await adminFetch("delete_product", { id }, token)
    loadProducts()
  }

  const handleSaveContent = async () => {
    setContentSaving(true)
    const updates: { section: string; key: string; value: string }[] = []
    Object.entries(content).forEach(([sec, items]) => {
      items.forEach((item) => {
        if (contentDirty[`${sec}:${item.key}`]) {
          updates.push({ section: sec, key: item.key, value: item.value })
        }
      })
    })
    await adminFetch("update_content", { updates }, token)
    setContentDirty({}); setContentSaved(true)
    setTimeout(() => setContentSaved(false), 2000)
    setContentSaving(false)
  }

  const updateContent = (section: string, key: string, value: string) => {
    setContent((prev) => ({
      ...prev,
      [section]: prev[section].map((i) => i.key === key ? { ...i, value } : i),
    }))
    setContentDirty((prev) => ({ ...prev, [`${section}:${key}`]: true }))
  }

  // Stories actions
  const handleSaveStory = async () => {
    if (!editStory) return
    setStorySaving(true)
    await adminFetch("save_story", editStory, token)
    setStorySaving(false); setEditStory(null); loadStories()
  }
  const handleDeleteStory = async (id: number) => {
    if (!confirm("Удалить историю?")) return
    await adminFetch("delete_story", { id }, token)
    loadStories()
  }

  // Prices actions
  const handleSavePrice = async () => {
    if (!editPrice) return
    setPriceSaving(true)
    if (!editPrice.price_text) {
      editPrice.price_text = `от ${editPrice.price_num.toLocaleString("ru")} ₽`
    }
    await adminFetch("save_price", editPrice, token)
    setPriceSaving(false); setEditPrice(null); loadPrices()
  }
  const handleDeletePrice = async (id: number) => {
    if (!confirm("Удалить цену?")) return
    await adminFetch("delete_price", { id }, token)
    loadPrices()
  }

  // Telegram test send
  const handleTelegramTest = async () => {
    setTgSending(true); setTgResult("")
    try {
      await adminFetch("create_order", {
        client_name: "Тест Telegram",
        client_phone: "+70000000000",
        device_brand: "TEST",
        device_model: "Test",
        service_name: tgTestMsg || "Тестовое уведомление из админки",
        service_price: 0,
        source: "admin_test",
      }, token)
      setTgResult("✓ Уведомление отправлено")
    } catch { setTgResult("✗ Ошибка отправки") }
    setTgSending(false)
  }

  const filteredPrices = prices.filter((p) =>
    !pricesSearch || p.model_name.toLowerCase().includes(pricesSearch.toLowerCase()) ||
    p.service_name.toLowerCase().includes(pricesSearch.toLowerCase()) ||
    p.brand_name.toLowerCase().includes(pricesSearch.toLowerCase())
  )

  const handleLogout = () => { localStorage.removeItem("ipro_admin_token"); setToken(""); setAuthed(false) }

  const sectionLabels: Record<string, string> = {
    hero: "Главный экран", contacts: "Контакты", loyalty: "Лояльность", seo: "SEO", about: "О компании", telegram: "Telegram уведомления",
  }

  // ── Login Screen ─────────────────────────────────────────────────────────
  if (!authed) return (
    <AdminLogin
      tokenInput={tokenInput}
      setTokenInput={setTokenInput}
      authError={authError}
      authLoading={authLoading}
      handleLogin={handleLogin}
    />
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SEOHead title="Администратор — iPro" description="" />

      <AdminSidebar tab={tab} setTab={setTab} stats={stats} handleLogout={handleLogout} />

      {/* Main */}
      <main className="flex-1 p-4 md:p-6 mt-14 md:mt-0 overflow-y-auto">
        <AnimatePresence mode="wait">

          <AdminDashboardOrders
            tab={tab}
            setTab={setTab}
            stats={stats}
            recentOrders={recentOrders}
            loadDashboard={loadDashboard}
            orders={orders}
            ordersLoading={ordersLoading}
            orderSearch={orderSearch}
            setOrderSearch={setOrderSearch}
            orderStatusFilter={orderStatusFilter}
            setOrderStatusFilter={setOrderStatusFilter}
            loadOrders={loadOrders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            handleConfirmOrder={handleConfirmOrder}
            handleDeleteOrder={handleDeleteOrder}
          />

          <AdminClients
            tab={tab}
            clients={clients}
            clientsLoading={clientsLoading}
            clientSearch={clientSearch}
            setClientSearch={setClientSearch}
            loadClients={loadClients}
            selectedClient={selectedClient}
            setSelectedClient={setSelectedClient}
            clientTx={clientTx}
            clientOrders={clientOrders}
            clientDetailLoading={clientDetailLoading}
            loadClientDetail={loadClientDetail}
            bonusAmount={bonusAmount}
            setBonusAmount={setBonusAmount}
            bonusDesc={bonusDesc}
            setBonusDesc={setBonusDesc}
            bonusLoading={bonusLoading}
            bonusDone={bonusDone}
            handleAdjustBonus={handleAdjustBonus}
            showAddClient={showAddClient}
            setShowAddClient={setShowAddClient}
            editClientData={editClientData}
            setEditClientData={setEditClientData}
            clientSaving={clientSaving}
            handleSaveClient={handleSaveClient}
            handleDeleteClient={handleDeleteClient}
          />

          <AdminCatalog
            tab={tab}
            products={products}
            shopLoading={shopLoading}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            productSaving={productSaving}
            handleSaveProduct={handleSaveProduct}
            handleDeleteProduct={handleDeleteProduct}
            EMPTY_PRODUCT={EMPTY_PRODUCT}
            stories={stories}
            storiesLoading={storiesLoading}
            editStory={editStory}
            setEditStory={setEditStory}
            storySaving={storySaving}
            handleSaveStory={handleSaveStory}
            handleDeleteStory={handleDeleteStory}
            EMPTY_STORY={EMPTY_STORY}
          />

          <AdminContent
            tab={tab}
            filteredPrices={filteredPrices}
            pricesLoading={pricesLoading}
            editPrice={editPrice}
            setEditPrice={setEditPrice}
            priceSaving={priceSaving}
            pricesBrand={pricesBrand}
            setPricesBrand={setPricesBrand}
            pricesSearch={pricesSearch}
            setPricesSearch={setPricesSearch}
            loadPrices={loadPrices}
            handleSavePrice={handleSavePrice}
            handleDeletePrice={handleDeletePrice}
            EMPTY_PRICE={EMPTY_PRICE}
            content={content}
            contentLoading={contentLoading}
            contentDirty={contentDirty}
            contentSaving={contentSaving}
            contentSaved={contentSaved}
            editorSection={editorSection}
            setEditorSection={setEditorSection}
            updateContent={updateContent}
            handleSaveContent={handleSaveContent}
            sectionLabels={sectionLabels}
            tgTestMsg={tgTestMsg}
            setTgTestMsg={setTgTestMsg}
            tgSending={tgSending}
            tgResult={tgResult}
            handleTelegramTest={handleTelegramTest}
          />

        </AnimatePresence>
      </main>
    </div>
  )
}