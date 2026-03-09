"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { MessageCircle, Send, X } from "lucide-react";
import { SITE } from "@/lib/constants";

const APPEAR_DELAY_MS = 5000;
const easing: [number, number, number, number] = [0.16, 1, 0.3, 1];

function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

function isValidPhone(phone: string) {
  const digits = getPhoneDigits(phone);
  return digits.length >= 9 && digits.length <= 15;
}

function buildWhatsappMessage(phone: string) {
  return `Hello Aftaza Team, I want to list my real estate on your website.\nMy phone number is: ${phone.trim()}\nThank you!`;
}

export default function FloatingListingCTA() {
  const [phone, setPhone] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [visible, setVisible] = useState(false);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(true);
    }, APPEAR_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const businessWhatsappNumber = useMemo(() => getPhoneDigits(SITE.phone), []);
  const whatsappUrl = useMemo(() => {
    if (!isValidPhone(phone)) {
      return "";
    }

    const message = buildWhatsappMessage(phone);
    return `https://wa.me/${businessWhatsappNumber}?text=${encodeURIComponent(message)}`;
  }, [businessWhatsappNumber, phone]);

  const handleDismiss = () => {
    setVisible(false);
  };

  const handleWhatsappSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setHasAttemptedSubmit(true);

    if (!isValidPhone(phone)) {
      phoneInputRef.current?.focus();
      return;
    }

    if (!whatsappUrl || typeof window === "undefined") {
      return;
    }

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ duration: 0.38, ease: easing }}
          className="fixed inset-x-0 bottom-0 z-[110] px-3 pb-3 sm:px-4 sm:pb-4 lg:px-6 lg:pb-6"
        >
          <aside className="property-listing-cta-bar mx-auto w-full max-w-[1320px] px-5 py-5 sm:px-6 lg:px-7 lg:py-6">
            <button
              type="button"
              onClick={handleDismiss}
              className="property-listing-cta-close"
              aria-label="Dismiss listing request"
            >
              <X size={16} />
            </button>

            <div className="flex flex-col gap-5 pr-10 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="max-w-2xl">
                <p className="text-sm font-semibold tracking-tight text-[var(--property-action-blue)] md:text-base">
                  Are You a Real Estate Company?
                </p>
                <p className="mt-2 font-display text-[1.7rem] font-bold leading-[1.1] tracking-tight text-slate-800 md:text-[1.85rem]">
                  List Your Properties with Us.
                </p>
              </div>

              <form
                onSubmit={handleWhatsappSubmit}
                className="property-listing-cta-form grid w-full gap-3 md:grid-cols-[minmax(0,1fr)_repeat(2,auto)] md:items-center lg:max-w-[760px] lg:grid-cols-[minmax(260px,340px)_auto_auto] lg:justify-end"
              >
                <label className="property-listing-cta-input-wrap">
                  <span className="sr-only">Phone number</span>
                  <input
                    ref={phoneInputRef}
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="Enter your phone number"
                    className="property-input"
                    aria-invalid={hasAttemptedSubmit && !isValidPhone(phone)}
                  />
                </label>

                <button
                  type="submit"
                  className="property-listing-cta-whatsapp inline-flex items-center justify-center gap-2 px-5 text-sm font-semibold"
                  aria-disabled={!isValidPhone(phone)}
                >
                  <MessageCircle size={17} />
                  WhatsApp
                </button>

                <Link
                  href={SITE.telegram}
                  target="_blank"
                  rel="noreferrer"
                  className="property-listing-cta-telegram inline-flex items-center justify-center gap-2 px-5 text-sm font-semibold"
                  aria-label="Contact Aftaza on Telegram"
                >
                  <Send size={18} />
                  Telegram
                </Link>
              </form>
            </div>
          </aside>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
