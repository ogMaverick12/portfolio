import React from "react";
import { EDUCATION_DATA } from "../data/portfolioData";
import { sound } from "../lib/sound";
import { GraduationCap, MapPin, Calendar, CheckCircle2, BookOpen } from "lucide-react";

export const EducationSection: React.FC = () => {
  return (
    <section
      id="education"
      className="py-20 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/20 relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Section 04 · Academic Foundations</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              Schooling & <span className="italic text-[var(--accent-neon)]">Formal Education.</span>
            </h2>
          </div>

          <p className="text-sm text-[var(--text-muted)] max-w-md font-normal">
            Balancing high school rigor with deep independent research in mathematics, algorithms, and systems engineering.
          </p>
        </div>

        {/* Education Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {EDUCATION_DATA.map((item) => (
            <div
              key={item.id}
              onMouseEnter={() => sound.playHover()}
              className="glass-panel p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-code text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-bold ${
                      item.status === "CURRENT"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {item.status === "CURRENT" ? "● ENROLLED · CURRENT" : "✓ COMPLETED"}
                  </span>
                  <span className="text-[var(--text-dim)] flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.period}</span>
                  </span>
                </div>

                <h3 className="font-editorial text-2xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors mb-1">
                  {item.institution}
                </h3>
                <div className="font-code text-xs font-semibold text-[var(--accent-neon)] mb-2">
                  {item.grade}
                </div>

                <div className="flex items-center gap-1.5 font-code text-[0.72rem] text-[var(--text-dim)] mb-4">
                  <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
                  <span>{item.location}</span>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed mb-6 font-normal">
                  {item.description}
                </p>
              </div>

              {/* Highlights tags */}
              <div className="pt-4 border-t border-[var(--border-subtle)]">
                <div className="text-[0.62rem] font-code text-[var(--text-dim)] uppercase tracking-wider mb-2">
                  Key Academic Highlights
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-[0.68rem] text-[var(--text-muted)] flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3 h-3 text-[var(--accent-neon)]" />
                      <span>{h}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
