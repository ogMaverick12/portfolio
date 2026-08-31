import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ACHIEVEMENTS } from "../data/portfolioData";
import { AchievementBadge } from "../types";
import { sound } from "../lib/sound";
import {
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Cloud,
  Cpu,
  Trophy,
  Filter,
  Sparkles,
} from "lucide-react";

export const AchievementsBento: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [inspectedBadge, setInspectedBadge] = useState<AchievementBadge | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFilterChange = (catId: string) => {
    sound.playClick();
    setSelectedFilter(catId);
  };

  const categories = [
    { id: "all", label: "All Credentials", count: ACHIEVEMENTS.length },
    { id: "certifications", label: "Certifications", count: ACHIEVEMENTS.filter((a) => a.category === "certifications").length },
    { id: "competitions", label: "Dev.to & Hackathons", count: ACHIEVEMENTS.filter((a) => a.category === "competitions").length },
    { id: "arcade", label: "GCP Arcade", count: ACHIEVEMENTS.filter((a) => a.category === "arcade").length },
    { id: "infra", label: "Cloud & DevOps", count: ACHIEVEMENTS.filter((a) => a.category === "infra").length },
    { id: "ai_ml", label: "AI/ML & Agent ADK", count: ACHIEVEMENTS.filter((a) => a.category === "ai_ml").length },
  ];

  const filteredBadges =
    selectedFilter === "all"
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter((a) => a.category === selectedFilter);

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case "certifications":
        return "border-emerald-500/40 text-emerald-400 bg-emerald-500/10";
      case "competitions":
        return "border-amber-500/40 text-amber-400 bg-amber-500/10";
      case "arcade":
        return "border-[var(--accent-neon)]/40 text-[var(--accent-neon)] bg-[var(--accent-neon)]/10";
      case "infra":
        return "border-blue-500/40 text-blue-400 bg-blue-500/10";
      case "ai_ml":
        return "border-purple-500/40 text-purple-400 bg-purple-500/10";
      default:
        return "border-white/20 text-white/80 bg-white/5";
    }
  };

  return (
    <section
      id="credentials"
      ref={containerRef}
      className="py-24 px-4 sm:px-8 border-b border-[var(--border-subtle)] relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Section 05 · Credentials & Certifications</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              Proof of Work & <span className="italic text-[var(--accent-neon)]">Badges.</span>
            </h2>
          </div>

          <p className="text-sm text-[var(--text-muted)] max-w-md font-normal">
            Verified completions across Google Cloud, Professional AI Engineering, Coursera, freeCodeCamp, and Hackathons.
          </p>
        </div>

        {/* Category Filters with Framer Motion LayoutId Slider */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-dim)] mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-code text-[0.65rem] uppercase">Filter:</span>
          </div>
          {categories.map((cat) => {
            const isSelected = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleFilterChange(cat.id)}
                onMouseEnter={() => sound.playHover()}
                className={`relative px-3.5 py-1.5 rounded-xl font-code text-xs transition-colors flex items-center gap-2 border shrink-0 select-none ${
                  isSelected
                    ? "border-[var(--accent-neon)] text-black font-semibold"
                    : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:border-white/30"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeBadgeFilterPill"
                    className="absolute inset-0 bg-[var(--accent-neon)] rounded-xl shadow-[0_0_12px_var(--glow-color)] -z-0"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
                <span
                  className={`relative z-10 text-[0.65rem] px-1.5 py-0.5 rounded-full ${
                    isSelected ? "bg-black/20 text-black font-bold" : "bg-white/10 text-[var(--text-dim)]"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Achievements Grid with Spring-based Layout Reorder */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredBadges.map((badge) => {
              return (
                <motion.div
                  layout
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.9, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: -10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  whileHover={{ scale: 1.03, y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    sound.playClick();
                    setInspectedBadge(badge);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`credential-badge-item p-5 rounded-2xl border transition-colors duration-200 cursor-pointer flex flex-col justify-between group select-none ${
                    badge.highlight
                      ? "glass-panel bg-[var(--bg-tertiary)] border-[var(--accent-neon)]/60 shadow-[0_0_15px_var(--glow-color)] hover:border-[var(--accent-neon)]"
                      : "bg-[var(--bg-secondary)]/80 border-[var(--border-subtle)] hover:border-white/20 hover:bg-[var(--bg-secondary)]"
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span
                        className={`font-code text-[0.62rem] uppercase px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                          badge.category
                        )}`}
                      >
                        {badge.category}
                      </span>
                      <span className="font-code text-[0.65rem] text-[var(--text-dim)]">
                        {badge.date || "2025/2026"}
                      </span>
                    </div>

                    <h3 className="text-base font-medium text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-neon)] transition-colors">
                      {badge.title}
                    </h3>

                    <p className="text-xs text-[var(--text-muted)] mb-3">
                      {badge.issuer}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-dim)]">
                    <span className="font-code text-[0.68rem] truncate max-w-[180px]">
                      ID: {badge.id}
                    </span>
                    <span className="text-[var(--accent-neon)] group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-code text-[0.68rem]">
                      Inspect <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Modal Inspector for Badge Details with AnimatePresence */}
        <AnimatePresence>
          {inspectedBadge && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectedBadge(null)}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
              >
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setInspectedBadge(null)}
                  className="absolute top-4 right-4 text-[var(--text-dim)] hover:text-white font-code text-sm p-1"
                >
                  ✕
                </motion.button>

                <div className="flex items-center gap-2 text-xs font-code text-[var(--accent-neon)] uppercase mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Verified Credential</span>
                </div>

                <h3 className="font-editorial text-2xl text-[var(--text-primary)] mb-2">
                  {inspectedBadge.title}
                </h3>

                <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                  <span>Issuer: {inspectedBadge.issuer}</span>
                  <span>•</span>
                  <span>Issued: {inspectedBadge.date || "Verified"}</span>
                </div>

                <div className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] mb-6 font-code text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-dim)]">Verification ID:</span>
                    <span className="text-[var(--text-primary)]">{inspectedBadge.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-dim)]">Domain:</span>
                    <span className="text-[var(--accent-neon)]">{inspectedBadge.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-dim)]">Status:</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Cryptographically Valid
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setInspectedBadge(null)}
                    className="px-4 py-2 rounded-xl text-xs font-code text-[var(--text-muted)] hover:text-white bg-white/5 border border-white/10"
                  >
                    Close
                  </motion.button>
                  <motion.a
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    href={inspectedBadge.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-code bg-[var(--accent-neon)] text-black font-semibold hover:brightness-110 flex items-center gap-1.5"
                  >
                    <span>Open Verification Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
