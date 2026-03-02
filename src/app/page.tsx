import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import PositioningSection from "@/components/sections/PositioningSection";
import WhoWeServe from "@/components/sections/WhoWeServe";
import EcosystemSection from "@/components/sections/EcosystemSection";
import DifferentiatorSection from "@/components/sections/DifferentiatorSection";
import MetricsSection from "@/components/sections/MetricsSection";
import EngagementSection from "@/components/sections/EngagementSection";
import CTASection from "@/components/sections/CTASection";
import ScrollRevealInit from "@/components/ui/ScrollRevealInit";

export const metadata: Metadata = {
  title: "Real Estate Transaction Advisory & Commercialization Firm in Ethiopia | AFTAZA PLC",
  description:
    "AFTAZA PLC is Ethiopia's structured Real Estate Transaction Advisory & Commercialization firm. We design risk-reduced buying journeys, developer sales systems, and investor-ready documentation that turns projects into scalable revenue engines.",
  keywords: [
    "Real Estate Transaction Advisory Ethiopia",
    "Real Estate Commercialization Firm",
    "Property Advisory Addis Ababa",
    "Real Estate Sales Systems",
    "Safe Property Buying Ethiopia",
    "Real Estate Compliance Advisory",
    "Commercial Property Marketing Ethiopia",
    "Property Investment Advisory Ethiopia",
  ],
  openGraph: {
    title: "Real Estate Transaction Advisory & Commercialization Firm in Ethiopia | AFTAZA PLC",
    description:
      "Governance-driven real estate advisory. Developer sales systems. Buyer protection. Investor structuring. Addis Ababa, Ethiopia.",
    url: "https://aftazaplc.com",
    siteName: "AFTAZA PLC",
    images: [{ url: "/og/home.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AFTAZA PLC | Real Estate Transaction Advisory Ethiopia",
    description:
      "Structured commercialization & transaction advisory for developers, buyers, and investors in Ethiopia.",
    images: ["/og/home.jpg"],
  },
};

export default function HomePage() {
  return (
    <>
      <ScrollRevealInit />
      <Hero />
      <PositioningSection />
      <WhoWeServe />
      <EcosystemSection />
      <DifferentiatorSection />
      <MetricsSection />
      <EngagementSection />
      <CTASection />
    </>
  );
}
