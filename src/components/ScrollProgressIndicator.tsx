import React, { useState, useEffect, useRef } from "react";
import { animate } from "animejs";
import { sound } from "../lib/sound";

interface SectionMilestone {
  id: string;
  label: string;
  number: string;
}

const MILESTONES: SectionMilestone[] = [
  { id: "hero", label: "Kernel Intro", number: "01" },
  { id: "snapshot", label: "Quick Snapshot", number: "02" },
  { id: "projects", label: "Flagship Systems", number: "03" },
  { id: "cp-lab", label: "C++ Algorithms Lab", number: "04" },
  { id: "journey", label: "Chronological Journey", number: "05" },
  { id: "education", label: "Academics", number: "06" },
  { id: "credentials", label: "Cloud & AI Badges", number: "07" },
  { id: "manifesto", label: "Engineering Manifesto", number: "08" },
  { id: "articles", label: "Technical Articles", number: "09" },
  { id: "terminal", label: "Interactive Terminal", number: "10" },
  { id: "contact", label: "Direct Inquiries", number: "11" },
];

export const ScrollProgressIndicator: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState("hero");
  const [hoveredMilestone, setHoveredMilestone] = useState<SectionMilestone | null>(null);

  const pathRef = useRef<SVGPathElement>(null);
  const totalPathLength = 260; // Height of the SVG vertical spine

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
      setScrollProgress(progress);

      // Animate SVG path dashoffset using Anime.js
      if (pathRef.current) {
        const offset = totalPathLength * (1 - progress);
        animate(pathRef.current, {
          strokeDashoffset: offset,
          duration: 100,
          ease: "linear",
        });
      }

      // Determine active section
      for (let i = MILESTONES.length - 1; i >= 0; i--) {
        const el = document.getElementById(MILESTONES[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveSectionId(MILESTONES[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    sound.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const percentage = Math.round(scrollProgress * 100);

  return (
    <aside
      aria-label="Reading Scroll Progress Indicator"
      className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center pointer-events-auto select-none"
    >
      {/* Percentage Indicator Badge */}
      <div className="mb-3 px-2 py-0.5 rounded-md bg-[var(--bg-secondary)]/90 border border-[var(--border-subtle)] backdrop-blur-md font-code text-[0.62rem] text-[var(--accent-neon)] tracking-wider">
        {percentage}%
      </div>

      {/* SVG Reading Spine Track */}
      <div className="relative flex items-center justify-center h-[260px] w-6">
        <svg
          width="24"
          height="260"
          viewBox="0 0 24 260"
          fill="none"
          className="overflow-visible"
        >
          {/* Background Path Track */}
          <path
            d="M 12 0 L 12 260"
            stroke="var(--border-subtle)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Foreground Anime.js Drawn Progress Path */}
          <path
            ref={pathRef}
            d="M 12 0 L 12 260"
            stroke="var(--accent-neon)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={totalPathLength}
            strokeDashoffset={totalPathLength}
            style={{
              filter: "drop-shadow(0 0 6px var(--glow-color))",
            }}
          />

          {/* Traveling Head Glow Dot */}
          <circle
            cx="12"
            cy={Math.min(Math.max(scrollProgress * 260, 4), 256)}
            r="3.5"
            fill="var(--accent-neon)"
            className="animate-pulse"
            style={{
              filter: "drop-shadow(0 0 8px var(--accent-neon))",
            }}
          />
        </svg>

        {/* Milestone Node Buttons */}
        <div className="absolute inset-0 flex flex-col justify-between items-center pointer-events-none py-1">
          {MILESTONES.map((m, idx) => {
            const isActive = activeSectionId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => scrollToSection(m.id)}
                onMouseEnter={() => {
                  sound.playHover();
                  setHoveredMilestone(m);
                }}
                onMouseLeave={() => setHoveredMilestone(null)}
                className={`pointer-events-auto relative flex items-center justify-center transition-all duration-200 group ${
                  isActive ? "scale-125" : "hover:scale-110"
                }`}
                title={`${m.number} · ${m.label}`}
              >
                <span
                  className={`w-2 h-2 rounded-full border transition-all ${
                    isActive
                      ? "bg-[var(--accent-neon)] border-[var(--accent-neon)] shadow-[0_0_8px_var(--glow-color)]"
                      : "bg-[var(--bg-primary)] border-[var(--border-subtle)] group-hover:border-[var(--accent-neon)]"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Editorial Chapter Label Tooltip */}
      {hoveredMilestone && (
        <div className="absolute right-9 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-xl font-code text-xs text-[var(--text-primary)] whitespace-nowrap pointer-events-none animate-fadeIn flex items-center gap-2">
          <span className="text-[var(--accent-neon)] font-bold">{hoveredMilestone.number}</span>
          <span className="text-[var(--text-muted)]">·</span>
          <span>{hoveredMilestone.label}</span>
        </div>
      )}

      {/* Editorial Bottom Label */}
      <span className="mt-3 font-code text-[0.55rem] text-[var(--text-dim)] uppercase tracking-widest writing-mode-vertical rotate-180">
        READING LOG
      </span>
    </aside>
  );
};
