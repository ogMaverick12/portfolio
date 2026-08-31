import React, { useEffect, useRef, useState } from "react";
import { animate } from "animejs";

export const CustomCursor: React.FC = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only run on desktop/devices with mouse pointer
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (ringRef.current) {
        animate(ringRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 180,
          ease: "outQuad",
        });
      }
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest(".interactive-hover") ||
          target.closest(".anime-draggable-badge"))
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block">
      {/* Inner Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full transition-transform duration-75 ${
          isHovered
            ? "bg-[var(--accent-neon)] scale-150 shadow-[0_0_12px_var(--accent-neon)]"
            : "bg-[var(--accent-neon)]"
        }`}
        style={{ willChange: "transform" }}
      />

      {/* Trailing Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 rounded-full border transition-all duration-200 pointer-events-none ${
          isHovered
            ? "w-12 h-12 -ml-6 -mt-6 border-[var(--accent-neon)] bg-[var(--glow-color)]"
            : isClicking
            ? "w-6 h-6 -ml-3 -mt-3 border-[var(--accent-neon)] bg-transparent scale-90"
            : "w-8 h-8 -ml-4 -mt-4 border-white/25 bg-transparent"
        }`}
        style={{ willChange: "transform, opacity" }}
      />
    </div>
  );
};
