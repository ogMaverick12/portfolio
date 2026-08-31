"use client";

import { motion } from "framer-motion";

export default function QuickSnapshot() {
  const items = [
    { label: "age", value: "16 y/o", detail: "Self-taught programmer" },
    { label: "experience", value: "Since 2020", detail: "4+ years learning" },
    { label: "specialty", value: "Python & C++", detail: "CP Learner" },
    { label: "focus", value: "Basic STL & DS", detail: "Learning fundamentals" },
    { label: "cloud expertise", value: "21 Badges", detail: "Google Cloud certified" },
    { label: "philosophy", value: "Logic First", detail: "Clean logic by default" },
  ];

  return (
    <section id="snapshot" className="py-16 px-6 md:px-12 border-b border-border bg-bg/50 relative z-10">
      <div className="w-full max-w-7xl mx-auto">
        {/* Recruiter Scan Tag */}
        <div className="font-mono text-[0.62rem] text-accent tracking-[0.2em] uppercase mb-8 flex items-center gap-2 select-none">
          <span className="w-1 h-1 rounded-full bg-accent animate-ping" />
          quick snapshot · recruiter glance
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border border-border bg-bg3/50 divide-x divide-y divide-border/40 overflow-hidden rounded-xl">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: idx * 0.08 }}
              className="p-6 flex flex-col justify-between hover:bg-bg2/40 transition-colors duration-200 min-h-[120px]"
            >
              <div className="font-mono text-[0.58rem] text-muted tracking-wider uppercase mb-3">
                {item.label}
              </div>
              <div>
                <div className="font-serif text-[1.45rem] md:text-[1.65rem] italic text-text leading-none mb-1.5">
                  {item.value}
                </div>
                <div className="text-[0.72rem] text-muted2 leading-tight">
                  {item.detail}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
