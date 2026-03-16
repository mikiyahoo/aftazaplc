"use client";

import { useEffect, useMemo, useState } from "react";
import Image, { type ImageProps } from "next/image";

interface PropertyImageProps extends Omit<ImageProps, "src"> {
  src?: string;
  fallbackLabel?: string;
}

function createPlaceholder(label: string) {
  const trimmedLabel = label.length > 36 ? `${label.slice(0, 33)}...` : label;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e0ecff" />
          <stop offset="100%" stop-color="#eff6ff" />
        </linearGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#g)" />
      <circle cx="920" cy="180" r="140" fill="#bfdbfe" opacity="0.65" />
      <circle cx="250" cy="720" r="170" fill="#dbeafe" opacity="0.8" />
      <rect x="170" y="240" width="860" height="420" rx="48" fill="#ffffff" opacity="0.75" />
      <text x="600" y="420" text-anchor="middle" fill="#1e3a8a" font-family="Arial, sans-serif" font-size="42" font-weight="700">
        Aftaza Property Preview
      </text>
      <text x="600" y="490" text-anchor="middle" fill="#334155" font-family="Arial, sans-serif" font-size="30">
        ${trimmedLabel}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export default function PropertyImage({
  src,
  fallbackLabel,
  alt,
  onError,
  ...props
}: PropertyImageProps) {
  const fallbackSrc = useMemo(() => createPlaceholder(fallbackLabel ?? alt), [alt, fallbackLabel]);
  const safeSrc = useMemo(() => {
    if (!src || src.trim().length === 0) return fallbackSrc;
    // Ensure path starts with / for local images
    if (!src.startsWith('/') && !src.startsWith('http') && !src.startsWith('data:')) {
      return '/' + src;
    }
    return src;
  }, [src, fallbackSrc]);
  const [currentSrc, setCurrentSrc] = useState(safeSrc);

  useEffect(() => {
    setCurrentSrc(safeSrc);
  }, [safeSrc]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }

        onError?.(event);
      }}
    />
  );
}
