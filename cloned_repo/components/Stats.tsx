"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

function StatCountNumber({ value }: { value: number }) {
  const [count, setCount] = useState(value);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isInView && !isAnimating) {
      setIsAnimating(true);
      const duration = 1500; // ms
      const startTime = performance.now();

      const tick = (now: number) => {
        const p = Math.min((now - startTime) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3); // Ease out cubic
        setCount(Math.floor(ease * value));
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          setCount(value);
        }
      };

      requestAnimationFrame(tick);
    }
  }, [isInView, value, isAnimating]);

  return <span ref={ref}>{count}</span>;
}

export default function Stats() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const sectionNum = getSectionNum("stats");

  const statsList = [
    {
      value: 3,
      suffix: " Flagships",
      label: "production products",
      detail: "SoilSense, PathForge, and PrepPilot. Fully operational."
    },
    {
      value: 15,
      suffix: " tok/s",
      label: "local inference speed",
      detail: "Quantized Gemma 4 running locally on edge hardware."
    },
    {
      value: 21,
      suffix: "+ Badges",
      label: "google cloud credentials",
      detail: "Verified knowledge in GKE, DevOps, AI, and security."
    },
    {
      value: 500,
      suffix: "+ Commits",
      label: "github contributions",
      detail: "Active, continuous open-source build logs and updates."
    }
  ];

  return (
    <section id="stats" className="py-32 px-6 md:px-12 border-b border-border relative z-10">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> by the numbers
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="stats-heading font-serif text-[2rem] md:text-[4.5vw] lg:text-[4rem] italic leading-tight tracking-tight mb-16 text-text"
        >
          Telemetry metrics.<br />
          <em className="not-italic text-accent">Performance indicators of my execution.</em>
        </motion.h2>

        <div
          ref={containerRef}
          className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-border w-full divide-y sm:divide-y-0 sm:divide-x divide-border"
        >
          {statsList.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="stat-item p-8 hover:bg-bg2/40 transition-colors duration-300 flex flex-col justify-between min-h-[180px]"
            >
              <div>
                <div className="stat-num-big font-serif text-[3rem] italic text-text leading-none mb-2">
                  <StatCountNumber value={stat.value} />
                  <span className="stat-suffix text-accent font-medium">{stat.suffix}</span>
                </div>
                <div className="stat-desc font-mono text-[0.62rem] text-muted tracking-wider uppercase mb-3">
                  {stat.label}
                </div>
              </div>
              <div className="stat-detail text-[0.76rem] text-muted2 leading-relaxed">
                {stat.detail}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
