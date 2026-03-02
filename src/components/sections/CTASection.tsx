"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SITE } from "@/lib/constants";
import { ArrowRight, ChevronRight, Globe, Shield, Landmark, Users } from "lucide-react";
import { SectionTitle } from "@/components/ui/Section";

const audiences = [
  { icon: Users, label: "A Developer", desc: "seeking commercialization excellence", code: "DEV-COM" },
  { icon: Landmark, label: "An Investor", desc: "requiring documentation discipline", code: "INV-GOV" },
  { icon: Shield, label: "A Financier", desc: "demanding transparency and audit trails", code: "FIN-AUD" },
  { icon: Globe, label: "A Buyer", desc: "seeking transaction clarity and protection", code: "BUY-TRX" },
];

export default function CTASection() {
  const MotionSectionTitle = motion(SectionTitle);

  return (
    <section className="relative py-24 md:py-32 bg-[#04080f] overflow-hidden">
      {/* Precision Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(200,163,77,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(200,163,77,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />
      
      {/* Central Flare */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#c8a34d]/5 blur-[120px] pointer-events-none" />

      <div className="container-x relative z-10 text-center">
        {/* Institutional Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#c8a34d]/20 bg-[#c8a34d]/5 mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c8a34d] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c8a34d]"></span>
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#c8a34d]">Protocol Ready: Entry Point</span>
        </motion.div>

        <MotionSectionTitle
          tone="dark"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="md:!text-6xl max-w-4xl mx-auto mb-8"
        >
          Transform Your Project Into a Credible, <br />
          <span className="text-[#c8a34d]">Investable Revenue Engine</span>
        </MotionSectionTitle>

        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-slate-500 font-mono text-[11px] uppercase tracking-[0.3em] mb-12"
        >
          Target Stakeholder Identification:
        </motion.p>

        {/* Audience Grid - Symmetrical & Technical */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 max-w-5xl mx-auto mb-16 shadow-2xl">
          {audiences.map((a, i) => (
            <motion.div
              key={a.label}
              whileHover={{ backgroundColor: "rgba(200,163,77,0.03)" }}
              className="relative bg-[#04080f] p-8 text-left group transition-colors duration-500"
            >
              <div className="absolute top-3 right-4 text-[7px] font-mono text-slate-700 group-hover:text-[#c8a34d]">
                {a.code}
              </div>
              <a.icon size={20} className="text-[#c8a34d] mb-6 opacity-60 group-hover:opacity-100 transition-opacity" />
              <h4 className="text-white font-display text-lg mb-2">{a.label}</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-body italic group-hover:text-slate-400">
                {a.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Primary Action Zone */}
        <div className="flex flex-col items-center gap-8">
          <p className="text-slate-400 font-body text-lg italic max-w-xl">
            "AFTAZA provides the institutional infrastructure that <span className="text-white">makes markets believe</span>."
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link 
              href="/contact" 
              className="group relative px-8 py-4 bg-[#c8a34d] text-[#04080f] font-display font-bold text-sm uppercase tracking-widest flex items-center gap-3 overflow-hidden transition-transform active:scale-95 shadow-[0_0_30px_rgba(200,163,77,0.2)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative">Structure Your System</span>
              <ArrowRight size={18} className="relative group-hover:translate-x-1 transition-transform" />
            </Link>

            <a 
              href={SITE.whatsapp} 
              target="_blank" 
              className="px-8 py-4 border border-white/10 text-white font-display text-sm uppercase tracking-widest hover:bg-white/5 hover:border-[#c8a34d]/30 transition-all flex items-center gap-3"
            >
              Institutional Inquiry
              <ChevronRight size={16} className="text-[#c8a34d]" />
            </a>
          </div>
        </div>

        {/* Bottom Technical String */}
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-slate-700 tracking-[0.5em] uppercase">
          <span>Governance Established 2024</span>
          <span className="hidden md:block text-[#c8a34d]/20">////////////////////////////////////</span>
          <span>Credibility · Documentation · Growth</span>
        </div>
      </div>
    </section>
  );
}
