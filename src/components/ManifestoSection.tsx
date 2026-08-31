import React from "react";
import { MANIFESTO_RULES } from "../data/portfolioData";
import { sound } from "../lib/sound";
import { Compass, Flame, Shield, ArrowUpRight } from "lucide-react";

export const ManifestoSection: React.FC = () => {
  return (
    <section
      id="manifesto"
      className="py-24 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>Section 06 · Engineering Philosophy</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              The Developer <span className="italic text-[var(--accent-neon)]">Manifesto.</span>
            </h2>
          </div>

          <p className="text-sm text-[var(--text-muted)] max-w-md font-normal">
            Three non-negotiable principles guiding every line of code, architecture choice, and open-source project.
          </p>
        </div>

        {/* 3 Core Principle Bento Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MANIFESTO_RULES.map((rule) => (
            <div
              key={rule.num}
              onMouseEnter={() => sound.playHover()}
              className="glass-panel p-8 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 font-code text-4xl font-bold text-white/5 group-hover:text-[var(--accent-neon)]/10 transition-colors pointer-events-none">
                {rule.num}
              </div>

              <div>
                <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-wider mb-4 px-2.5 py-1 rounded bg-[var(--accent-neon)]/10 border border-[var(--accent-neon)]/20">
                  <span>{rule.badge}</span>
                </div>

                <div className="font-code text-xl font-bold text-[var(--text-primary)] tracking-tight mb-2 group-hover:text-[var(--accent-neon)] transition-colors">
                  {rule.slogan}
                </div>

                <div className="font-editorial text-lg italic text-[var(--text-muted)] mb-4">
                  "{rule.title}"
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">
                  {rule.body}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] font-code text-[0.68rem] text-[var(--text-dim)] flex items-center justify-between">
                <span>Rule #{rule.num}</span>
                <span className="text-[var(--accent-neon)] opacity-60 group-hover:opacity-100 transition-opacity">
                  Immutable Invariant
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
