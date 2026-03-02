// src/types/insight.ts
export type RevenueSilo = 
  | "transaction-governance" 
  | "absorption-strategy" 
  | "capital-structuring" 
  | "market-intelligence" 
  | "developer-systems";

export interface InsightProtocol {
  slug: string;
  title: string;
  silo: RevenueSilo;
  metadata: {
    problemStatement: string;
    systemicCause: string;
    structuralSolution: string;
  };
  ctaLink: string; // Links back to /developer-commercialization, etc.
  publishedDate: string;
}