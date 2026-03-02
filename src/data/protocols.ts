// src/data/protocols.ts

export interface InsightProtocol {
  slug: string;
  title: string;
  silo: "transaction-governance" | "absorption-strategy" | "capital-structuring" | "market-intelligence" | "developer-systems";
  metadata: {
    problemStatement: string;
    systemicCause: string;
    structuralSolution: string;
  };
  ctaLink: string;
  publishedDate: string;
}

// Ensure you are using "export const" and that the array contains valid objects
export const insights: InsightProtocol[] = [
  {
    slug: "absorption-control-ethiopia",
    title: "Structured Absorption Control: Why Unregulated Unit Release Destroys Project Equity",
    silo: "absorption-strategy",
    metadata: {
      problemStatement: "Ethiopian developers often collapse their own price floors by releasing too much inventory during the 'hype' phase.",
      systemicCause: "Lack of tiered release schedules and CRM-governed lead prioritization.",
      structuralSolution: "The AFTAZA Tiered Absorption Framework (TAF)."
    },
    ctaLink: "/developer-commercialization",
    publishedDate: "Feb 28, 2026"
  }
  // Add more protocol objects here, separated by commas
];