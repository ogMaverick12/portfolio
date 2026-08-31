"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

export default function Manifesto() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll tracking across the container height
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Slide transitions: Opacity and Scale transforms
  // 3 slides mapped across [0, 0.5, 1] scroll progression
  const opacity1 = useTransform(scrollYProgress, [0, 0.35, 0.45], [1, 1, 0]);
  const scale1 = useTransform(scrollYProgress, [0, 0.35, 0.45], [1, 0.95, 0.9]);
  
  const opacity2 = useTransform(scrollYProgress, [0.35, 0.45, 0.7, 0.8], [0, 1, 1, 0]);
  const scale2 = useTransform(scrollYProgress, [0.35, 0.45, 0.7, 0.8], [0.9, 1, 0.95, 0.9]);

  const opacity3 = useTransform(scrollYProgress, [0.7, 0.8, 1], [0, 1, 1]);
  const scale3 = useTransform(scrollYProgress, [0.7, 0.8, 1], [0.9, 1, 1]);

  const sectionNum = getSectionNum("manifesto");

  const rules = [
    {
      num: "RULE 01",
      slogan: "USEFUL > FANTASY",
      title: "Utility beats vanity.",
      body: "A simple tool that solves a real problem for one person beats a complex algorithm that serves nobody. Fantasy is a temporary ego boost. Utility is a permanent contribution.",
      opacity: opacity1,
      scale: scale1
    },
    {
      num: "RULE 02",
      slogan: "FREE > PAYWALLED",
      title: "Open source is a moral imperative.",
      body: "I grew up coding because of free tools and public documentation. Locking knowledge behind paywalls slows progress. Building open-source software is the only moat that compounds morally.",
      opacity: opacity2,
      scale: scale2
    },
    {
      num: "RULE 03",
      slogan: "EXECUTION > PLAN",
      title: "Ship to learn.",
      body: "A broken thing in production teaches you more than a perfect system on your whiteboard. Feedback is the fuel of engineering. Waiting to be 'ready' is just procrastination with better branding.",
      opacity: opacity3,
      scale: scale3
    }
  ];

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full border-b border-border">
      {/* Sticky screen container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between bg-bg py-24 z-10">
        
        {/* Header Label */}
        <div className="px-6 md:px-12 w-full max-w-7xl mx-auto">
          <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase flex items-center gap-4">
            <span className="text-accent">{sectionNum}</span> manifesto
          </div>
        </div>

        {/* Content Slides */}
        <div className="flex-1 w-full max-w-4xl mx-auto px-6 flex items-center justify-center relative">
          {rules.map((rule, idx) => (
            <motion.div
              key={idx}
              style={{
                opacity: rule.opacity,
                scale: rule.scale,
                pointerEvents: idx === 0 ? "auto" : "none" // Prevents clicks blocking on stacked layers
              }}
              className="absolute inset-x-6 text-center flex flex-col items-center justify-center gap-6"
            >
              <span className="font-mono text-[0.68rem] text-accent tracking-[0.25em] uppercase border border-accent/20 px-3 py-1 rounded bg-accent2/10">
                {rule.num}
              </span>
              
              <h3 className="font-serif text-[3.2rem] md:text-[5vw] lg:text-[5rem] italic font-semibold text-text leading-none tracking-tighter">
                {rule.slogan}
              </h3>
              
              <div className="max-w-[550px] mx-auto mt-4">
                <h4 className="font-sans text-[1.05rem] text-text font-semibold mb-2">
                  {rule.title}
                </h4>
                <p className="text-[0.88rem] text-muted2 leading-relaxed font-light">
                  {rule.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll Progress Bar indicator */}
        <div className="px-6 md:px-12 w-full max-w-7xl mx-auto flex justify-between items-center text-[0.62rem] font-mono text-muted">
          <div>SCROLL PROGRESS</div>
          <div className="w-32 h-[1px] bg-border relative overflow-hidden">
            <motion.div
              style={{ scaleX: scrollYProgress, originX: 0 }}
              className="h-full bg-accent w-full"
            />
          </div>
          <div>RULE 01-03</div>
        </div>

      </div>
    </div>
  );
}
