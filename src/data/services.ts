import { 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Briefcase, 
  Scale, 
  FileText, 
  Search, 
  BarChart3 
} from "lucide-react";
import { Service, MethodologyStep } from "@/types/service";

export const services: Service[] = [
  {
    id: "buyer-advisory",
    nodeId: "SRV-TRX-01",
    status: "Active Protocol",
    title: "Buyer Advisory & Safe-Transaction Journey",
    icon: ShieldCheck,
    summary: "Independent, structured transaction guidance for property buyers in Ethiopia.",
    description: "Reducing documentation risk through governed due diligence and verified transaction paths.",
    fullDescription: "AFTAZA serves as an independent transaction advisor, guiding buyers through a safe, structured, and verified property acquisition journey. We bridge the gap between developer promises and documented reality.",
    features: [
      "Needs & budget mapping",
      "Document verification",
      "Risk screening",
      "Closing coordination"
    ],
    ctaText: "Initialize Access",
    href: "/services/buyer-advisory"
  },
  {
    id: "developer-commercialization",
    nodeId: "SRV-COM-02",
    status: "Operational",
    title: "Developer Commercialization Systems",
    icon: Zap,
    summary: "Transforming selling from effort into a repeatable, governed, and scalable machine.",
    description: "Architecting the commercial engine that drives absorption velocity and revenue stability.",
    fullDescription: "We design and operate full-stack commercialization systems—from go-to-market strategy to sales governance and reporting discipline—ensuring developers can focus on delivery while we focus on the engine.",
    features: [
      "Go-to-market strategy",
      "Absorption planning",
      "CRM discipline",
      "Offer engineering"
    ],
    ctaText: "Deploy System",
    href: "/services/developer-commercialization"
  },
  {
    id: "investor-enablement",
    nodeId: "SRV-INV-03",
    status: "High Capacity",
    title: "Investor & Financier Enablement",
    icon: TrendingUp,
    summary: "Structuring projects for investment-grade positioning and risk-readiness.",
    description: "Aligning project documentation with institutional capital requirements.",
    fullDescription: "AFTAZA provides the transparency and documentation layers required by institutional investors and financiers to deploy capital with confidence into the Ethiopian real estate market.",
    features: [
      "Risk screening",
      "Traceable transaction flow",
      "Exit pathway clarity",
      "Financeability alignment"
    ],
    ctaText: "Review Framework",
    href: "/services/investor-enablement"
  },
  {
    id: "partnerships",
    nodeId: "SRV-PRT-04",
    status: "Strategic",
    title: "Commercial & Growth Partnerships",
    icon: Briefcase,
    summary: "Engaging as structured growth partners for multi-project rollout.",
    description: "Long-term institutional alignment for portfolio-scale commercialization.",
    fullDescription: "We engage as embedded growth partners, activating institutional channels and applying KPI-driven governance to ensure sustained growth across diverse project portfolios.",
    features: [
      "Full Commercialization Partner",
      "Institutional Channel Activation",
      "KPI-driven governance"
    ],
    ctaText: "Partner Inquiry",
    href: "/services/partnerships"
  }
];

export const methodologySteps: MethodologyStep[] = [
  { 
    code: "MTH-01", 
    title: "Process Integrity", 
    description: "Each step has an owner, checklist, and timestamped audit trail.", 
    icon: Scale 
  },
  { 
    code: "MTH-02", 
    title: "Disclosure Discipline", 
    description: "What is promised matches what is signed. No verbal ambiguities allowed.", 
    icon: FileText 
  },
  { 
    code: "MTH-03", 
    title: "Risk Screening", 
    description: "Red flags detected early to avoid late-stage transaction collapse.", 
    icon: Search 
  },
  { 
    code: "MTH-04", 
    title: "Performance Gov", 
    description: "Dashboards and accountability structures ensure consistent execution.", 
    icon: BarChart3 
  }
];