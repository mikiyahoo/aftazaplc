"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { DropdownMenuButton } from "@/components/ui/Button";
import { NAV_LINKS, SITE } from "@/lib/constants";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const filteredNavLinks = NAV_LINKS.filter(
    (item) => item.label !== "Contact" && item.label !== "Case Studies"
  );

  const handleChildClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    onClose();

    if (pathname === "/ecosystem" && href.startsWith("/ecosystem#")) {
      const id = href.split("#")[1];
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(href);
    }
  };

  const easing: [number, number, number, number] = [0.76, 0, 0.24, 1];

  const containerVariants: Variants = {
    closed: { x: "100%", transition: { duration: 0.4, ease: easing } },
    open: { x: 0, transition: { duration: 0.4, ease: easing } },
  };

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.1, duration: 0.5 },
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex justify-end"
          initial="closed"
          animate="open"
          exit="closed"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-navy/55 backdrop-blur-[6px]"
          />

          <motion.div
            variants={containerVariants}
            className="relative my-6 mr-4 flex h-[calc(100dvh-3rem)] w-[min(92vw,520px)] flex-col overflow-hidden border border-white/10 bg-brand-navy/72 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:mr-6 md:p-10"
            style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 28px) 100%, 0 100%)" }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_24%)]" />
            <div
              className="pointer-events-none absolute inset-[1px] border border-white/5"
              style={{ clipPath: "polygon(0 0, 100% 0, calc(100% - 28px) 100%, 0 100%)" }}
            />

            <DropdownMenuButton
              onClick={onClose}
              className="relative z-10 mb-10 self-end flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/55 transition-colors hover:text-white"
            >
              Close <span className="text-xl leading-none">X</span>
            </DropdownMenuButton>

            <nav className="relative z-10 mt-2 flex flex-1 flex-col gap-8 overflow-y-auto pr-2">
              {filteredNavLinks.map((item, i) => {
                const hasSubmenu = item.children && item.label !== "Services";

                return (
                  <motion.div key={item.label} custom={i} variants={linkVariants}>
                    {hasSubmenu ? (
                      <div className="flex flex-col">
                        <DropdownMenuButton
                          onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                          className="flex items-center justify-between text-2xl font-bold uppercase tracking-tighter text-white"
                        >
                          {item.label}
                          <span
                            className={`transition-transform duration-300 ${
                              expanded === item.label ? "rotate-180 text-[#c8a34d]" : ""
                            }`}
                          >
                            v
                          </span>
                        </DropdownMenuButton>

                        <AnimatePresence>
                          {expanded === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-2 mt-6 flex flex-col gap-4 overflow-hidden border-l border-[#c8a34d]/30 pl-6"
                            >
                              {item.children.map((child) => (
                                <a
                                  key={child.label}
                                  href={child.href}
                                  onClick={(e) => handleChildClick(e, child.href)}
                                  className="cursor-pointer text-slate-400 transition-colors hover:text-white"
                                >
                                  <span className="block text-sm font-bold uppercase tracking-widest">
                                    {child.label}
                                  </span>
                                  <span className="mt-1 block text-[10px] text-slate-600">
                                    {child.desc}
                                  </span>
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="text-2xl font-bold uppercase tracking-tighter text-white transition-colors hover:text-[#c8a34d]"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            <div className="relative z-10 flex flex-col gap-4 border-t border-white/8 pt-8">
              <Link href="/contact" onClick={onClose} className="btn-primary w-full text-center">
                Initialize Consultation
              </Link>
              <div className="mt-4 flex flex-col gap-2 opacity-40">
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                  {SITE.email}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                  {SITE.phone}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
