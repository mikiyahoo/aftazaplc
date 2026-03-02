"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  BarChart3, 
  TrendingUp, 
  ArrowRight, 
  Briefcase,
  Zap,
  Scale,
  FileText, 
  Search,
  Activity,
  ChevronRight
} from "lucide-react";
import Section, { SectionTitle } from "@/components/ui/Section";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { ComplianceBar } from "@/components/ui/SystemUI";

const services = [
  {
    title: "Buyer Advisory & Safe-Transaction Journey",
    id: "buyer-advisory",
    icon: ShieldCheck,
    nodeId: "SRV-TRX-01",
    status: "Active Protocol",
    desc: "Independent, structured transaction guidance for property buyers in Ethiopia.",
    features: ["Needs & budget mapping", "Document verification", "Risk screening", "Closing coordination"]
  },
  {
    title: "Developer Commercialization Systems",
    id: "developer-commercialization",
    icon: Zap,
    nodeId: "SRV-COM-02",
    status: "Operational",
    desc: "Transforming selling from effort into a repeatable, governed, and scalable machine.",
    features: ["Go-to-market strategy", "Absorption planning", "CRM discipline", "Offer engineering"]
  },
  {
    title: "Investor & Financier Enablement",
    id: "investor-enablement",
    icon: TrendingUp,
    nodeId: "SRV-INV-03",
    status: "High Capacity",
    desc: "Structuring projects for investment-grade positioning and risk-readiness.",
    features: ["Risk screening", "Traceable transaction flow", "Exit pathway clarity", "Financeability alignment"]
  },
  {
    title: "Commercial & Growth Partnerships",
    id: "partnerships",
    icon: Briefcase,
    nodeId: "SRV-PRT-04",
    status: "Strategic",
    desc: "Engaging as structured growth partners for multi-project rollout and channel activation.",
    features: ["Full Commercialization Partner", "Institutional Channel Activation", "KPI-driven governance"]
  }
];

const methodology = [
  { t: "Process Integrity", d: "Each step has an owner, checklist, and timestamped audit trail.", icon: Scale, code: "MTH-01" },
  { t: "Disclosure Discipline", d: "What is promised matches what is signed. No verbal ambiguities.", icon: FileText, code: "MTH-02" },
  { t: "Risk Screening", d: "Red flags detected early to avoid late-stage transaction collapse.", icon: Search, code: "MTH-03" },
  { t: "Performance Gov", d: "Dashboards and accountability structures ensure execution.", icon: BarChart3, code: "MTH-04" }
];

export default function ServicesHub() {
  return (
    <main className="bg-white text-[#09111f] selection:bg-[#c8a34d] selection:text-white">
      
      {/* 1. HERO - DARK (Stays dark for impact) */}
      <section className="relative pt-40 pb-24 bg-[#04080f] text-white border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 blueprint-grid opacity-20" />
        <Container className="relative z-10">
          <div className="max-w-5xl">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
              <ComplianceBar
                label="AFTAZA_PLC // Service_Infrastructure"
                tone="green"
                className="gap-4 [&_.compliance-label]:text-[#c8a34d] [&_.compliance-label]:tracking-[0.4em]"
              />
            </motion.div>
            <SectionTitle as="h1" tone="dark" size="hero" className="mb-8 !text-5xl md:!text-7xl">
              Institutional Systems That Turn <br /> <span className="text-[#c8a34d]">Projects Into Revenue.</span>
            </SectionTitle>
            <p className="text-xl text-slate-400 font-body max-w-3xl mb-12">Compliance-driven transaction advisory designed to increase trust and protect stakeholders in Ethiopia.</p>
            <div className="flex gap-6">
              <Button className="btn-primary">Structure Engagement</Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. PHILOSOPHY - WHITE (Changed to Light) */}
      <Section className="bg-white py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div>
              <div className="stage-tag mb-4">Architecture v2.6</div>
              <SectionTitle className="uppercase tracking-tight mb-8">
                The Integrated <br /> Commercialization Stack
              </SectionTitle>
              <p className="text-slate-600 leading-relaxed mb-10 text-lg">
                Most firms operate in isolation. AFTAZA integrates strategy, operations, and documentation into a single execution objective.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['Strategy Architecture', 'Sales Operations', 'Governance Layer', 'Media Intelligence'].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100">
                    <Activity size={14} className="text-[#c8a34d]" />
                    <span className="terminal-text text-[10px] text-slate-600 uppercase">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative group">
              <div className="relative bg-[#09111f] p-16 text-center shadow-2xl">
                <span className="text-[#c8a34d] font-display text-5xl font-black block mb-4 italic tracking-tighter">Trust → Velocity</span>
                <p className="text-[10px] uppercase tracking-[0.5em] font-mono text-slate-500">The Revenue Multiplier</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. SERVICE SUITE - DARK (Blue section for cards) */}
      <Section className="bg-[#04080f] text-white" dark>
        <Container>
          <div className="flex justify-between items-end mb-16">
            <SectionTitle tone="dark" className="uppercase tracking-tighter">Core Service Suites</SectionTitle>
            <div className="terminal-text text-slate-600 text-[10px]">TOTAL_NODES: 04</div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
            {services.map((service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="group bg-[#04080f] p-12 transition-all hover:bg-[#09111f] block">
                <div className="flex justify-between mb-12">
                   <div className="p-4 bg-[#c8a34d]/10 text-[#c8a34d] group-hover:bg-[#c8a34d] group-hover:text-[#04080f] transition-all">
                     <service.icon size={28} />
                   </div>
                   <div className="terminal-text text-[9px] text-[#c8a34d]">{service.nodeId}</div>
                </div>
                <h3 className="text-2xl font-display font-bold uppercase mb-4 group-hover:text-[#c8a34d]">{service.title}</h3>
                <p className="text-slate-400 text-sm mb-8 h-12">{service.desc}</p>
                <div className="inline-flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#c8a34d]">
                  Initialize Access <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      {/* 4. METHODOLOGY - WHITE (Changed to Light) */}
      <Section className="bg-white border-b border-slate-100">
        <Container>
          <div className="mb-16">
            <SectionTitle className="uppercase">
              Governance-Driven <span className="text-slate-300">Methodology.</span>
            </SectionTitle>
          </div>
          <div className="grid md:grid-cols-4 gap-12">
            {methodology.map((m, i) => (
              <div key={i} className="group">
                <div className="terminal-text text-[9px] text-slate-400 mb-6">{m.code}</div>
                <m.icon size={24} className="text-[#c8a34d] mb-6" />
                <h4 className="text-lg font-display font-bold uppercase text-[#09111f] mb-4">{m.t}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-body">{m.d}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 5. FINAL CTA - DARK */}
      <Section className="bg-[#04080f] text-white text-center py-32">
        <Container>
          <div className="max-w-4xl mx-auto">
            <SectionTitle tone="dark" size="hero" className="uppercase mb-10 leading-[0.85]">
              Engineered <span className="text-[#c8a34d]">Revenue.</span>
            </SectionTitle>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button className="btn-primary">Initialize Engagement</Button>
              <Button className="px-12 py-6 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all">
                Download Brief
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
