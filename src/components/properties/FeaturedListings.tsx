import Link from "next/link";
import { ArrowUpRight, Bath, BedDouble, MapPin, Square } from "lucide-react";
import { formatBirr } from "@/lib/properties/config";
import type { PropertyRecord } from "@/types/property";
import PropertyImage from "./PropertyImage";

interface FeaturedListingsProps {
  properties: PropertyRecord[];
}

export default function FeaturedListings({ properties }: FeaturedListingsProps) {
  return (
    <section data-header-surface="dark" className="section-y relative overflow-hidden bg-brand-dark text-white">
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c8a34d]/5 blur-[120px] pointer-events-none" />

      <div className="container-x relative z-10">
        <div className="section-header !max-w-4xl">
          <span className="gold-rule mx-auto" />
          <h2 className="text-center !text-white lg:whitespace-nowrap">
            <span>Discover Our Featured <span className="section-title-accent">Listings</span></span>
          </h2>
          <p className="subtitle !text-slate-300">
            Handpicked properties selected by our experts.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {properties.slice(0, 6).map((property, index) => {
            const isGold = index === 2;

            return (
              <Link
                key={property.id}
                href={`/properties/listings?selected=${property.slug}`}
                className={`group relative flex h-full flex-col overflow-hidden border transition-all duration-500 hover:-translate-y-2 ${
                  isGold
                    ? "border-[#c8a34d] bg-[#c8a34d] text-slate-900"
                    : "border-white/10 bg-white/5 text-white hover:border-[#c8a34d]/50"
                }`}
              >
                {!isGold ? (
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(200,163,77,0.1) 0%, transparent 70%)",
                    }}
                  />
                ) : null}

                <div className="relative z-10">
                  <div className="relative aspect-[5/4] overflow-hidden">
                    <PropertyImage
                      src={property.image}
                      alt={property.title}
                      fallbackLabel={property.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div
                      className={`absolute inset-0 ${
                        isGold
                          ? "bg-gradient-to-t from-[#09111f]/35 to-transparent"
                          : "bg-gradient-to-t from-[#09111f]/65 to-transparent"
                      }`}
                    />
                    <div
                      className={`absolute left-4 top-4 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] ${
                        isGold
                          ? "border border-slate-900/20 bg-white/75 text-slate-900"
                          : "border border-white/10 bg-brand-dark/80 text-[#c8a34d] backdrop-blur-sm"
                      }`}
                    >
                      {formatBirr(property.price)}
                    </div>
                  </div>

                  <div className="px-7 pb-8 pt-7 md:px-8">
                    <div className="mb-6 h-[2px] w-10 bg-[#c8a34d] transition-all duration-500 ease-out group-hover:w-16" />

                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h3
                        className={`text-2xl font-display leading-tight ${
                          isGold ? "text-slate-900" : "text-white"
                        }`}
                      >
                        {property.title}
                      </h3>
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-[0.2em] ${
                          isGold ? "text-slate-800" : "text-[#c8a34d]"
                        }`}
                      >
                        {property.type}
                      </span>
                    </div>

                    <div
                      className={`mb-5 flex items-center gap-2 text-sm ${
                        isGold ? "text-slate-800" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      <MapPin size={16} className={isGold ? "text-slate-900" : "text-[#c8a34d]"} />
                      <span>{property.location}</span>
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${
                        isGold ? "text-slate-800" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    >
                      {property.shortDescription}
                    </p>

                    <div
                      className={`mt-7 grid grid-cols-3 gap-3 border-t pt-6 text-xs ${
                        isGold ? "border-slate-900/10 text-slate-800" : "border-white/10 text-slate-300"
                      }`}
                    >
                      {property.type === "Commercial" ? (
                        <>
                          <div className="flex items-center gap-2">
                            <BedDouble size={14} className={isGold ? "text-slate-900" : "text-[#c8a34d]"} />
                            <span>{property.bedrooms} Rooms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bath size={14} className={isGold ? "text-slate-900" : "text-[#c8a34d]"} />
                            <span>{property.bathrooms} Restrooms</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Square size={14} className={isGold ? "text-slate-900" : "text-[#c8a34d]"} />
                            <span>{property.areaSqft.toLocaleString("en-US")} sqft</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2">
                            <BedDouble size={14} className={isGold ? "text-slate-900" : "text-[#c8a34d]"} />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Bath size={14} className={isGold ? "text-slate-900" : "text-[#c8a34d]"} />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Square size={14} className={isGold ? "text-slate-900" : "text-[#c8a34d]"} />
                            <span>{property.areaSqft.toLocaleString("en-US")} sqft</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div
                      className={`mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                        isGold ? "text-slate-900" : "text-[#c8a34d]"
                      }`}
                    >
                      <span>Explore Listing</span>
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </div>
                </div>

                {!isGold ? (
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#c8a34d] transition-all duration-500 group-hover:w-full" />
                ) : null}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/properties/listings"
            className="btn-primary inline-flex items-center px-6 py-3 text-sm font-semibold"
          >
            Browse All Listings
          </Link>
        </div>
      </div>
    </section>
  );
}
