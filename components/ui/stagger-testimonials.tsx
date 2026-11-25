"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/lib/testimonials";

const SQRT_5000 = Math.sqrt(5000);

interface TestimonialCardProps {
  position: number;
  testimonial: Testimonial;
  onSelect: () => void;
  cardWidth: number;
  cardHeight: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  position,
  testimonial,
  onSelect,
  cardWidth,
  cardHeight,
}) => {
  const isCenter = position === 0;
  const hiddenOutOfDeck = Math.abs(position) > 3;
  const compactScore = testimonial.score.replace(/\s*\/\s*/, "/");

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Afișează mărturia ${testimonial.name}, ${testimonial.category}`}
      aria-pressed={isCenter}
      tabIndex={hiddenOutOfDeck ? -1 : 0}
      className={cn(
        "absolute left-1/2 top-1/2 flex flex-col justify-between border-2 p-5 text-left transition-all duration-500 ease-in-out motion-reduce:transition-none sm:p-7",
        isCenter
          ? "z-10 border-asphalt bg-asphalt text-white"
          : "z-0 border-line bg-chalk text-asphalt hover:border-asphalt/50",
        hiddenOutOfDeck && "pointer-events-none opacity-0",
      )}
      style={{
        width: cardWidth,
        height: cardHeight,
        clipPath:
          "polygon(44px 0%, calc(100% - 44px) 0%, 100% 44px, 100% 100%, calc(100% - 44px) 100%, 44px 100%, 0 100%, 0 0)",
        transform: `
          translate(-50%, -50%)
          translateX(${(cardWidth / 1.48) * position}px)
          translateY(${isCenter ? -44 : position % 2 ? 14 : -14}px)
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
        <div className="mb-3.5 flex items-center justify-between gap-2.5 pr-6 sm:mb-4">
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-md font-cond text-base font-bold sm:h-11 sm:w-11 sm:text-lg",
              isCenter ? "bg-signal text-asphalt" : "border border-line bg-white text-asphalt",
            )}
          >
            {testimonial.initials}
          </span>
          <span
            className={cn(
              "whitespace-nowrap rounded px-2.5 py-1 font-mono text-xs font-semibold",
              isCenter ? "bg-white/10 text-signal" : "border border-line bg-white text-asphalt",
            )}
          >
            {testimonial.category} · {compactScore}
          </span>
        </div>

        <blockquote
          className={cn(
            "text-sm font-medium leading-relaxed sm:text-lg sm:leading-snug",
            isCenter ? "text-white" : "text-asphalt",
          )}
        >
          „{testimonial.quote}”
        </blockquote>
      </div>

      <div
        className={cn(
          "border-t pt-3 text-xs sm:text-sm",
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
  const [isDesktop, setIsDesktop] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const updateSize = () => setIsDesktop(mq.matches);
    updateSize();
    mq.addEventListener("change", updateSize);
    return () => mq.removeEventListener("change", updateSize);
  }, []);

  if (items.length === 0) return null;

  const total = items.length;
  const half = Math.floor(total / 2);
  const cardWidth = isDesktop ? 356 : 296;
  const cardHeight = isDesktop ? 356 : 318;
  const containerHeight = isDesktop ? 540 : 500;

  const stepBy = (delta: number) => {
    setActiveIndex((prev) => (prev + delta + total) % total);
  };

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX;
    if (typeof endX !== "number") return;
    const dx = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 40) return;
    stepBy(dx < 0 ? 1 : -1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepBy(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stepBy(1);
    }
  }

  return (
    <div
      className="relative w-full touch-pan-y overflow-hidden bg-white"
      style={{ height: containerHeight }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
    >
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
            cardWidth={cardWidth}
            cardHeight={cardHeight}
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
