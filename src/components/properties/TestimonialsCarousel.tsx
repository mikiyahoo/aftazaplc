"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import PropertyImage from "@/components/properties/PropertyImage";

interface Testimonial {
  id: string;
  name: string;
  title: string | null;
  quote: string;
  image: string | null;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export default function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative">
      {/* Main Testimonial Card */}
      <div className="group relative mx-auto max-w-6xl overflow-hidden border border-white/10 bg-brand-navy text-white shadow-2xl transition-all duration-500">
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100"
          style={{
            background: "radial-gradient(circle at top right, rgba(200,163,77,0.1) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 grid gap-0 lg:grid-cols-[280px_1fr]">
          {/* Left Side - Image & Name */}
          <div className="flex flex-col items-center justify-center gap-6 border-b border-white/10 px-8 py-10 text-center lg:border-b-0 lg:border-r lg:px-10 lg:py-12">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border border-white/10 shadow-2xl">
              <PropertyImage
                src={currentTestimonial.image || "/property/luxury-house-image.jpg"}
                alt={currentTestimonial.name}
                fallbackLabel={currentTestimonial.name}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#c8a34d]">
                Client Profile
              </p>
              <h3 className="mt-4 text-3xl font-display font-bold text-white">
                {currentTestimonial.name}
              </h3>
              {currentTestimonial.title && (
                <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
                  {currentTestimonial.title}
                </p>
              )}
            </div>
          </div>

          {/* Right Side - Quote */}
          <div className="px-8 py-10 md:px-10 md:py-12">
            <div className="flex items-start gap-2 text-[#c8a34d]">
              <Quote size={32} className="flex-shrink-0 opacity-50" />
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.24em] text-[#c8a34d]">
                Testimonial Detail
              </p>
            </div>
            <p className="mt-6 max-w-3xl text-2xl font-display font-bold leading-tight text-white md:text-3xl">
              &ldquo;{currentTestimonial.quote}&rdquo;
            </p>
          </div>
        </div>

        {/* Decorative Lines */}
        <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-[#c8a34d] transition-transform duration-500 group-hover:scale-x-100" />
        <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#c8a34d] transition-all duration-500 group-hover:w-full" />
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Dots Navigation */}
      {testimonials.length > 1 && (
        <div className="mt-8 flex justify-center gap-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-[#c8a34d]"
                  : "w-2 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
