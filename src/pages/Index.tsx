import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { ReviewsMapSection } from "@/components/sections/ReviewsMapSection"
import { AppPromoSection } from "@/components/sections/AppPromoSection"
import { VideoSection } from "@/components/sections/VideoSection"
import { MarketingBanners } from "@/components/sections/MarketingBanners"

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="iPro Барнаул — ремонт iPhone, Samsung, MacBook, iPad | Гарантия 365 дней"
        description="Сервисный центр iPro в Барнауле. Профессиональный ремонт iPhone, Samsung, Xiaomi, MacBook, iPad. Бесплатная диагностика, ремонт за 1-2 часа, гарантия 365 дней."
      />
      <MarketingBanners />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <ReviewsMapSection />
        <VideoSection />
        <AppPromoSection />
        <CtaSection />
      </main>
      <FooterSection />
    </div>
  )
}

export default Index