import React, { useRef } from "react";
import { motion } from "motion/react";
import { QUICK_SNAPSHOT_METRICS } from "../data/portfolioData";
import { sound } from "../lib/sound";
import { Eye, Sparkles } from "lucide-react";

export const QuickSnapshot: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      id="snapshot"
      ref={containerRef}
      className="py-16 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40 relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Recruiter Glance Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-neon)] animate-ping" />
            <span>Recruiter Glance · Fast Telemetry</span>
          </div>

          <div className="font-code text-[0.65rem] text-[var(--text-dim)] hidden sm:flex items-center gap-1.5">
            <Eye className="w-3 h-3 text-[var(--text-muted)]" />
            <span>High School Engineer · DPS Siliguri</span>
          </div>
        </div>

        {/* 6-Column Metrics Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-[var(--border-subtle)] bg-[var(--bg-card)] rounded-2xl overflow-hidden divide-x divide-y divide-[var(--border-subtle)] shadow-xl">
          {QUICK_SNAPSHOT_METRICS.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.06, type: "spring", stiffness: 400, damping: 25 }}
              whileHover={{ y: -3, backgroundColor: "var(--bg-tertiary)" }}
              onMouseEnter={() => sound.playHover()}
              className="p-5 flex flex-col justify-between transition-colors duration-200 group cursor-default"
            >
              <div className="font-code text-[0.62rem] text-[var(--text-dim)] uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>{item.label}</span>
                {item.highlight && (
                  <Sparkles className="w-2.5 h-2.5 text-[var(--accent-neon)]" />
                )}
              </div>

              <div>
                <motion.div
                  whileHover={{ scale: 1.05, x: 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className={`font-editorial text-2xl lg:text-3xl italic tracking-tight mb-1 transition-colors ${
                    item.highlight
                      ? "text-[var(--accent-neon)] font-medium"
                      : "text-[var(--text-primary)]"
                  }`}
                >
                  {item.value}
                </motion.div>
                <div className="text-xs text-[var(--text-muted)] leading-tight">
                  {item.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
