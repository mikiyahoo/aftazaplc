"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bath,
  BedDouble,
  CarFront,
  ChevronDown,
  MapPin,
  ShieldCheck,
  Square,
  X,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { formatBirr } from "@/lib/properties/config";
import type { PropertyRecord } from "@/types/property";
import PropertyImage from "./PropertyImage";

const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface PropertyPreviewPanelProps {
  property: PropertyRecord | null;
  onClose: () => void;
}

function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export default function PropertyPreviewPanel({
  property,
  onClose,
}: PropertyPreviewPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const bookTourUrl = property
    ? `https://wa.me/${getPhoneDigits(SITE.phone)}?text=${encodeURIComponent(
        `Hello Aftaza Team, I want to book a tour for ${property.title} in ${property.location}. Please share the next available viewing slots.`
      )}`
    : "";

  useEffect(() => {
    setExpanded(false);
  }, [property?.slug]);

  useEffect(() => {
    if (!property) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, property]);

  return (
    <AnimatePresence mode="wait">
      {property ? (
        <motion.div
          key={property.slug}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="fixed inset-0 z-[120] flex items-end justify-center bg-slate-950/48 px-3 pb-3 pt-24 backdrop-blur-md sm:px-4 sm:pb-4 lg:px-6 lg:pb-6 lg:pt-28"
          onClick={onClose}
        >
          <motion.section
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 48, opacity: 0 }}
            transition={{ duration: 0.38, ease: easing }}
            className="w-full max-w-[1180px]"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${property.title} preview`}
          >
            <div className="property-floating-card property-listings-panel property-preview-panel property-preview-sheet overflow-y-auto lg:overflow-hidden">
              <div className="grid min-h-0 lg:grid-cols-[minmax(340px,0.43fr)_minmax(0,0.57fr)]">
                <div className="property-preview-media relative min-h-[280px] bg-slate-950">
                  <PropertyImage
                    src={property.heroImage || property.image}
                    alt={property.title}
                    fallbackLabel={property.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/14 to-transparent" />
                  <div className="absolute left-4 top-4 z-[1] flex max-w-[calc(100%-5.5rem)] flex-wrap gap-2">
                    <span className="property-rounded-tag px-4 py-2 text-xs font-semibold">
                      {formatBirr(property.price)}
                    </span>
                    <span className="property-rounded-tag px-4 py-2 text-xs font-semibold">
                      {property.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="property-glass-pill absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center text-slate-900"
                    aria-label="Close property preview"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white lg:p-6">
                    <h3 className="text-2xl font-display font-bold tracking-tight text-white lg:text-[2rem]">
                      {property.title}
                    </h3>
                    <div className="mt-3 flex items-center gap-2 text-sm text-white/85">
                      <MapPin size={16} />
                      <span>📍 {property.location}</span>
                    </div>
                  </div>
                </div>

                <div className="property-preview-scroll property-panel-scroll min-h-0 overflow-y-auto p-6 md:p-7">
                  <div className="property-preview-stats grid grid-cols-2 gap-3 p-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <BedDouble size={16} className="text-[var(--property-action-blue)]" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={16} className="text-[var(--property-action-blue)]" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square size={16} className="text-[var(--property-action-blue)]" />
                      <span>{property.areaSqm} m2</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CarFront size={16} className="text-[var(--property-action-blue)]" />
                      <span>{property.parking} Parking</span>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {property.trustBadges.map((badge) => (
                      <span
                        key={badge}
                        className="property-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]"
                      >
                        <ShieldCheck size={14} className="text-[var(--property-action-blue)]" />
                        {badge}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <a
                      href={bookTourUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="property-preview-cta property-preview-cta-primary inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
                    >
                      Book a Tour
                    </a>
                    <Link
                      href={`/properties/${property.slug}`}
                      className="property-preview-cta property-preview-cta-secondary inline-flex items-center justify-center px-5 py-3 text-sm font-semibold"
                    >
                      View Detail
                    </Link>
                  </div>

                  <section className="mt-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-lg font-display font-bold text-slate-900">Description</h4>
                      <button
                        type="button"
                        onClick={() => setExpanded((current) => !current)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--property-action-blue)]"
                      >
                        {expanded ? "Show Less" : "See Full Description"}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-slate-600">
                      {expanded || property.description.length <= 220
                        ? property.description
                        : `${property.description.slice(0, 220).trimEnd()}...`}
                    </p>
                  </section>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
