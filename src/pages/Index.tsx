import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import { AdvantagesSection } from "@/components/sections/AdvantagesSection"
import { RepairStepsSection } from "@/components/sections/RepairStepsSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { CtaSection } from "@/components/sections/CtaSection"
import { FooterSection } from "@/components/sections/FooterSection"
import { SEOHead } from "@/components/SEOHead"
import { ReviewsMapSection } from "@/components/sections/ReviewsMapSection"
import { AppPromoSection } from "@/components/sections/AppPromoSection"
import { VideoSection } from "@/components/sections/VideoSection"
import { StoriesBar } from "@/components/StoriesBar"

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="iPro Барнаул — ремонт iPhone, Samsung, MacBook, iPad | Гарантия до 365 дней"
        description="Сервисный центр iPro в Барнауле. Профессиональный ремонт iPhone, Samsung, Xiaomi, MacBook, iPad. Бесплатная диагностика, ремонт за 1-2 часа, гарантия до 365 дней."
      />
      <StoriesBar />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <AdvantagesSection />
        <RepairStepsSection />
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