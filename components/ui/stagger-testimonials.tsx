"use client";

import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/testimonials";

const SQRT_5000 = Math.sqrt(5000);

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial;
  onSelect: () => void;
  cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  onSelect,
  cardSize,
}) => {
  const isCenter = position === 0;
  const hiddenOutOfDeck = Math.abs(position) > 3;

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Afișează mărturia ${testimonial.name}, ${testimonial.category}`}
      aria-pressed={isCenter}
      tabIndex={hiddenOutOfDeck ? -1 : 0}
      className={cn(
        "absolute left-1/2 top-1/2 flex flex-col justify-between border-2 p-7 text-left transition-all duration-500 ease-in-out motion-reduce:transition-none",
        isCenter
          ? "z-10 border-asphalt bg-asphalt text-white"
          : "z-0 border-line bg-chalk text-asphalt hover:border-asphalt/50",
        hiddenOutOfDeck && "pointer-events-none opacity-0",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath:
          "polygon(44px 0%, calc(100% - 44px) 0%, 100% 44px, 100% 100%, calc(100% - 44px) 100%, 44px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.48) * position}px)
          translateY(${isCenter ? -48 : position % 2 ? 14 : -14}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0 14px 36px -12px rgba(24, 32, 43, 0.35)" : "0 2px 10px -4px rgba(24, 32, 43, 0.08)",
      }}
    >
      <span
        aria-hidden="true"
        className={cn("absolute block origin-top-right rotate-45", isCenter ? "bg-signal" : "bg-line")}
        style={{
          right: -2,
          top: 42,
          width: SQRT_5000,
          height: 2,
        }}
      />

      <div>
        <div className="mb-4 flex items-center justify-between gap-3 pr-6">
          <span
            className={cn(
              "grid h-11 w-11 shrink-0 place-items-center rounded-md font-cond text-lg font-bold",
              isCenter ? "bg-signal text-asphalt" : "bg-white text-asphalt border border-line",
            )}
          >
            {testimonial.initials}
          </span>
          <span
            className={cn(
              "rounded px-2.5 py-1 font-mono text-xs font-semibold",
              isCenter ? "bg-white/10 text-signal" : "bg-white text-asphalt border border-line",
            )}
          >
            {testimonial.category} · {testimonial.score}
          </span>
        </div>

        <blockquote
          className={cn(
            "text-base font-medium leading-snug sm:text-lg",
            isCenter ? "text-white" : "text-asphalt",
          )}
        >
          „{testimonial.quote}”
        </blockquote>
      </div>

      <div
        className={cn(
          "border-t pt-3 text-sm",
          isCenter ? "border-white/15 text-white/80" : "border-line text-mute",
        )}
      >
        <span className={cn("font-semibold", isCenter ? "text-white" : "text-asphalt")}>
          {testimonial.name}
        </span>
        {" · "}
        <span className="font-mono text-xs">{testimonial.location}</span>
      </div>
    </button>
  );
};

export function StaggerTestimonials({ items }: { items: Testimonial[] }) {
  const [cardSize, setCardSize] = useState(356);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)");
      setCardSize(matches ? 356 : 292);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  if (items.length === 0) return null;

  const total = items.length;
  const half = Math.floor(total / 2);

  const stepBy = (delta: number) => {
    setActiveIndex((prev) => (prev + delta + total) % total);
  };

  return (
    <div className="relative w-full overflow-hidden bg-white" style={{ height: 540 }}>
      {items.map((item, idx) => {
        // Compute circular shortest signed offset from activeIndex so cards stay mounted cleanly
        let position = idx - activeIndex;
        if (position > half) position -= total;
        if (position < -half) position += total;

        return (
          <TestimonialCard
            key={item.id}
            testimonial={item}
            position={position}
            cardSize={cardSize}
            onSelect={() => setActiveIndex(idx)}
          />
        );
      })}

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
        <button
          type="button"
          onClick={() => stepBy(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg border-2 border-line bg-white text-asphalt transition-colors",
            "hover:border-asphalt hover:bg-signal hover:text-asphalt",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sign focus-visible:ring-offset-2",
          )}
          aria-label="Mărturia anterioară"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <span className="px-2 font-mono text-xs font-medium text-mute tabular-nums">
          {activeIndex + 1} / {total}
        </span>
        <button
          type="button"
          onClick={() => stepBy(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-lg border-2 border-line bg-white text-asphalt transition-colors",
            "hover:border-asphalt hover:bg-signal hover:text-asphalt",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sign focus-visible:ring-offset-2",
          )}
          aria-label="Mărturia următoare"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
