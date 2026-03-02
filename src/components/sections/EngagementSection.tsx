"use client";

import { motion } from "framer-motion";
import { Search, PenTool, Rocket, BarChart2, ArrowRight } from "lucide-react";
import { SectionTitle } from "@/components/ui/Section";

const phases = [
  {
    num: "01",
    icon: Search,
    title: "Discovery & Scoping",
    desc: "Define project parameters, stakeholder landscape, and commercialization constraints. Establish the documentation baseline.",
    duration: "Week 1–2",
  },
  {
    num: "02",
    icon: PenTool,
    title: "System Design",
    desc: "Architect the transaction framework: documentation structure, sales operations model, and governance layers.",
    duration: "Week 2–4",
  },
  {
    num: "03",
    icon: Rocket,
    title: "Implementation",
    desc: "Deploy commercialization infrastructure with defined KPIs, accountability frameworks, and execution calendars.",
    duration: "Week 4+",
  },
  {
    num: "04",
    icon: BarChart2,
    title: "Optimization",
    desc: "Monitor, report, refine. Continuous accountability against structured outcomes with documented performance reviews.",
    duration: "Ongoing",
  },
];

export default function EngagementSection() {
  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden font-body border-t border-slate-100">
      {/* Structural Background Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container-x relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 mb-20">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              className="h-1 bg-[#c8a34d] mb-8"
            />
            <SectionTitle className="mb-6">
              Structured <br />
              <span className="font-bold text-[#c8a34d]">Commercialization Flow</span>
            </SectionTitle>
            <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
              We operate with defined KPIs, accountability frameworks, and execution calendars. 
              <span className="font-bold text-slate-900 block mt-2">No ambiguity. Structured delivery.</span>
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="p-8 border-l-4 border-[#c8a34d] bg-slate-50 shadow-sm max-w-xs relative group"
          >
            <p className="text-sm leading-relaxed text-slate-700 italic">
              "Every engagement begins with a <span className="text-[#c8a34d] font-bold">formal scoping call</span> before any advisory work commences."
            </p>
          </motion.div>
        </div>

        {/* Phase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200 overflow-hidden shadow-sm">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white p-10 transition-all duration-500 hover:bg-slate-50"
            >
              {/* Top Meta Info */}
              <div className="flex justify-between items-center mb-10">
                <span className="text-[11px] font-mono tracking-[0.2em] text-[#c8a34d] font-bold uppercase">
                  Phase {phase.num}
                </span>
                <span className="text-[10px] font-mono text-slate-900 font-bold bg-slate-100 px-3 py-1 border border-slate-200 uppercase tracking-tight">
                  {phase.duration}
                </span>
              </div>

              {/* Icon & Title */}
              <div className="relative z-10">
                <div className="mb-8 inline-flex p-4 rounded-sm bg-slate-900 text-[#c8a34d] group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <phase.icon size={22} strokeWidth={2.5} />
                </div>

                {/* THE 4 STEP TEXT - BOLDED */}
                <h3 className="text-xl md:text-2xl font-display text-slate-900 mb-5 font-bold leading-tight group-hover:text-[#c8a34d] transition-colors">
                  {phase.title}
                </h3>
                
                <p className="text-[13px] text-slate-500 leading-relaxed font-medium h-24 overflow-hidden group-hover:text-slate-700 transition-colors">
                  {phase.desc}
                </p>
              </div>

              {/* Aesthetic Footer Detail */}
              <div className="mt-8 flex items-center justify-between opacity-100 border-t border-slate-100 pt-6">
                <span className="text-[10px] font-mono text-slate-900 font-bold uppercase tracking-widest">Procedural Step</span>
                <ArrowRight size={16} className="text-[#c8a34d]" />
              </div>

              {/* Hover highlight bar */}
              <div className="absolute inset-x-0 top-0 h-1 bg-[#c8a34d] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>

        {/* Section Bottom Detail */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-slate-100" />
          <p className="text-[11px] font-mono text-slate-900 font-bold uppercase tracking-[0.5em]">
            Institutional Framework v4.0
          </p>
          <div className="h-px flex-1 bg-slate-100" />
        </div>
      </div>
    </section>
  );
}
