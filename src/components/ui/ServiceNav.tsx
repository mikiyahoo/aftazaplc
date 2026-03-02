"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";
import { ChevronRight, Cpu } from "lucide-react";
import Container from "./Container";

export default function ServiceNav() {
  const params = useParams();
  const currentSlug = params.slug as string;

  return (
    <nav className="py-12 bg-[#04080f] border-t border-white/5 relative overflow-hidden">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 blueprint-grid opacity-5 pointer-events-none" />
      
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-3">
            <Cpu size={16} className="text-[#c8a34d] animate-pulse" />
            <span className="terminal-text text-[10px] uppercase tracking-[0.3em] text-slate-500">
              Switch_System_Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full md:w-auto">
            {services.map((service) => {
              const isActive = currentSlug === service.id;
              return (
                <Link
                  key={service.id}
                  href={service.href}
                  className={cn(
                    "px-6 py-4 border transition-all duration-300 flex flex-col gap-1 group",
                    isActive 
                      ? "bg-[#c8a34d]/10 border-[#c8a34d] pointer-events-none" 
                      : "bg-white/5 border-white/5 hover:border-[#c8a34d]/40 hover:bg-white/[0.08]"
                  )}
                >
                  <span className={cn(
                    "terminal-text text-[8px] uppercase tracking-widest",
                    isActive ? "text-[#c8a34d]" : "text-slate-600"
                  )}>
                    {service.nodeId}
                  </span>
                  <div className="flex items-center justify-between gap-4">
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-tight",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                    )}>
                      {service.id.replace('-', ' ')}
                    </span>
                    {!isActive && (
                      <ChevronRight size={12} className="text-[#c8a34d] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Container>
    </nav>
  );
}