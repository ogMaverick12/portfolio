import React, { useState } from "react";
import { JOURNEY_TIMELINE } from "../data/portfolioData";
import { sound } from "../lib/sound";
import { GitCommit, History, Plus, Minus, Check, ArrowRight } from "lucide-react";

export const JourneyTimeline: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(JOURNEY_TIMELINE[JOURNEY_TIMELINE.length - 1]);

  return (
    <section
      id="journey"
      className="py-24 px-4 sm:px-8 border-b border-[var(--border-subtle)] relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <History className="w-3.5 h-3.5" />
              <span>Section 03 · Developer Evolution</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              From gamer curiosity to <span className="italic text-[var(--accent-neon)]">Edge AI systems.</span>
            </h2>
          </div>

          <p className="text-sm text-[var(--text-muted)] max-w-md font-normal">
            A chronological git-diff trace of self-taught growth, language pivots, and engineering takeaways.
          </p>
        </div>

        {/* Interactive Scrubbable Milestone Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {JOURNEY_TIMELINE.map((item) => {
            const isSelected = selectedMilestone.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedMilestone(item);
                }}
                onMouseEnter={() => sound.playHover()}
                className={`p-5 rounded-2xl text-left border transition-all duration-200 relative ${
                  isSelected
                    ? "glass-panel bg-[var(--bg-tertiary)] border-[var(--accent-neon)] shadow-[0_0_20px_var(--glow-color)]"
                    : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-white/20 text-[var(--text-muted)]"
                }`}
              >
                <div className="flex items-center justify-between font-code text-[0.68rem] mb-2">
                  <span className="text-[var(--text-dim)]">{item.period}</span>
                  <span className="text-[var(--accent-neon)] font-bold">{item.age}</span>
                </div>
                <div className="font-code text-sm font-bold text-[var(--text-primary)] mb-2">
                  {item.title}
                </div>
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>

                {isSelected && (
                  <span className="absolute bottom-0 left-6 right-6 h-[2px] bg-[var(--accent-neon)] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Milestone Git-Diff Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[var(--border-subtle)] gap-4 font-code text-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-neon)]/10 text-[var(--accent-neon)] flex items-center justify-center font-bold">
                <GitCommit className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[var(--text-dim)]">COMMIT / DIFF: </span>
                <span className="text-[var(--text-primary)] font-bold">{selectedMilestone.title}</span>
              </div>
            </div>
            <div className="text-[var(--accent-neon)] font-semibold">
              {selectedMilestone.period} · {selectedMilestone.age}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Story narrative */}
            <div>
              <div className="font-code text-xs text-[var(--text-dim)] uppercase tracking-wider mb-2">
                Engineering Context
              </div>
              <p className="text-sm sm:text-base text-[var(--text-primary)] leading-relaxed mb-6 font-normal">
                {selectedMilestone.summary}
              </p>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                <div className="font-code text-xs text-[var(--accent-neon)] font-bold uppercase mb-1">
                  Core Invariant / Key Takeaway:
                </div>
                <p className="text-xs text-[var(--text-muted)] italic leading-relaxed">
                  "{selectedMilestone.keyTakeaway}"
                </p>
              </div>
            </div>

            {/* Git Diff Additions / Deletions */}
            <div className="p-5 rounded-xl bg-[#09090d] border border-[var(--border-subtle)] font-code text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-4 border-b border-white/10 text-[var(--text-dim)] text-[0.68rem]">
                  <span>DIFF SUMMARY</span>
                  <span className="text-emerald-400">+{selectedMilestone.diffs.added.length} concepts</span>
                </div>

                {/* Additions */}
                <div className="space-y-2 mb-4">
                  {selectedMilestone.diffs.added.map((add, i) => (
                    <div key={i} className="flex items-center gap-2 text-emerald-300 text-xs">
                      <Plus className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{add}</span>
                    </div>
                  ))}
                </div>

                {/* Removals */}
                {selectedMilestone.diffs.removed && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {selectedMilestone.diffs.removed.map((rem, i) => (
                      <div key={i} className="flex items-center gap-2 text-rose-400/80 text-xs line-through opacity-75">
                        <Minus className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{rem}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="pt-4 mt-4 border-t border-white/10 flex flex-wrap gap-2">
                {selectedMilestone.focusTags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded bg-[var(--bg-secondary)] border border-white/10 text-[0.65rem] text-[var(--text-muted)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
