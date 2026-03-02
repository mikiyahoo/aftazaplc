import { LucideIcon } from "lucide-react";

export type ServiceStatus = "Active Protocol" | "Operational" | "High Capacity" | "Strategic" | "Testing";

export interface ServiceFeature {
  label: string;
  detail?: string;
}

export interface Service {
  id: string;               // slug (e.g., 'buyer-advisory')
  nodeId: string;           // Technical ID (e.g., 'SRV-TRX-01')
  title: string;
  status: ServiceStatus;
  icon: LucideIcon;
  summary: string;
  description: string;      // For the Hub/Preview
  fullDescription: string;  // For the individual service page
  features: string[];       // Simple list for cards
  detailedFeatures?: ServiceFeature[]; // For deep-dive pages
  ctaText: string;
  href: string;
}

export interface MethodologyStep {
  code: string;             // (e.g., 'MTH-01')
  title: string;
  description: string;
  icon: LucideIcon;
}