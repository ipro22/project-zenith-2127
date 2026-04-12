
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import IPhonePage from "./pages/IPhonePage";
import MacBookPage from "./pages/MacBookPage";
import OtherPage from "./pages/OtherPage";
import AboutPage from "./pages/AboutPage";
import ContactsPage from "./pages/ContactsPage";
import PrivilegesPage from "./pages/PrivilegesPage";
import WarrantyPage from "./pages/WarrantyPage";
import PartnershipPage from "./pages/PartnershipPage";
import AccountPage from "./pages/AccountPage";
import DevicePage from "./pages/DevicePage";
import DeviceModelPage from "./pages/DeviceModelPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/iphone" element={<IPhonePage />} />
          <Route path="/macbook" element={<MacBookPage />} />
          <Route path="/other" element={<OtherPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/privileges" element={<PrivilegesPage />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="/partnership" element={<PartnershipPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/device/:brandSlug" element={<DevicePage />} />
          <Route path="/device/:brandSlug/:modelSlug" element={<DeviceModelPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
