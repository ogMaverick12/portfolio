"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

export default function Journey() {
  const headingRef = useRef(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });
  
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const trackHeight = rect.height;
      
      // Calculate scroll progress based on the middle of the viewport relative to the track
      const relativeY = window.innerHeight / 2 - rect.top;
      
      // Clamp progress between 0 and trackHeight
      const progressPx = Math.max(0, Math.min(trackHeight, relativeY));
      setScrollProgress(progressPx);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const sectionNum = getSectionNum("journey");

  return (
    <section id="timeline" className="py-32 px-6 md:px-12 border-b border-border relative z-10 min-h-screen">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> journey
      </div>

      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <h2 className="timeline-intro font-serif text-[2rem] md:text-[4.5vw] lg:text-[4rem] italic leading-tight tracking-tight mb-20 max-w-[700px] text-text">
          Self-taught for <em className="not-italic text-accent">years</em>.<br />
          Walk through them.
        </h2>
      </motion.div>

      {/* Timeline track wrapper */}
      <div
        ref={trackRef}
        className="timeline-track mt-12 flex relative gap-0"
      >
        {/* Glow Laser Dot */}
        <div
          className="timeline-track-glow-dot"
          style={{
            top: `${scrollProgress}px`,
          }}
        />

        <div className="w-full pl-6 md:pl-12">
          {/* Item 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="timeline-item grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12 py-12 border-b border-border relative group hover:bg-bg2/10"
          >
            <div className="timeline-year font-mono text-[0.72rem] text-muted tracking-wider pt-1 md:pl-6">
              The Beginning
              <span className="timeline-age block text-accent text-[0.65rem] mt-1">
                age 12-13
              </span>
            </div>
            <div className="timeline-content">
              <h3 className="font-serif text-[1.6rem] italic tracking-tight mb-3 text-text group-hover:text-accent transition-colors duration-200">
                First line of code.
              </h3>
              <p className="text-[0.88rem] text-muted2 leading-relaxed max-w-[540px]">
                Started early. While others were just playing games, I wanted to know how they were built. Typed my first lines of code in C++. It was raw, complex, and completely fascinating.
              </p>
              <div className="timeline-diff mt-4 font-mono text-[0.72rem] bg-bg3 border border-border px-4 py-3 inline-block">
                <span className="diff-add text-[#7ec891] block">
                  C++ fundamentals
                </span>
                <span className="diff-add text-[#7ec891] block">
                  curiosity
                </span>
              </div>
            </div>
          </motion.div>

          {/* Item 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="timeline-item grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12 py-12 border-b border-border relative group hover:bg-bg2/10"
          >
            <div className="timeline-year font-mono text-[0.72rem] text-muted tracking-wider pt-1 md:pl-6">
              The Shift
              <span className="timeline-age block text-accent text-[0.65rem] mt-1">
                age 14-16
              </span>
            </div>
            <div className="timeline-content">
              <h3 className="font-serif text-[1.6rem] italic tracking-tight mb-3 text-text group-hover:text-accent transition-colors duration-200">
                The Java Era.
              </h3>
              <p className="text-[0.88rem] text-muted2 leading-relaxed max-w-[540px]">
                Pivoted to Java. Spent these years understanding object-oriented programming, building solid logic, and diving deeper into how software architecture actually works.
              </p>
              <div className="timeline-diff mt-4 font-mono text-[0.72rem] bg-bg3 border border-border px-4 py-3 inline-block">
                <span className="diff-add text-[#7ec891] block">
                  Java
                </span>
                <span className="diff-add text-[#7ec891] block">
                  Object-Oriented Design
                </span>
                <span className="diff-add text-[#7ec891] block">
                  logic building
                </span>
                <span className="diff-rem text-[#e06c75] block">
                  syntax confusion
                </span>
              </div>
            </div>
          </motion.div>

          {/* Item 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="timeline-item grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-12 py-12 border-none relative group hover:bg-bg2/10"
          >
            <div className="timeline-year font-mono text-[0.72rem] text-muted tracking-wider pt-1 md:pl-6">
              Present
              <span className="timeline-age block text-accent text-[0.65rem] mt-1">
                age 16+
              </span>
            </div>
            <div className="timeline-content">
              <h3 className="font-serif text-[1.6rem] italic tracking-tight mb-3 text-text group-hover:text-accent transition-colors duration-200">
                Python & C++: The AI Era.
              </h3>
              <p className="text-[0.88rem] text-muted2 leading-relaxed max-w-[540px]">
                Back to C++ for performance, combined with Python for AI/ML. Building things like SoilSense AI on edge devices. Training models, competing in hackathons, and shipping real products.
              </p>
              <div className="timeline-diff mt-4 font-mono text-[0.72rem] bg-bg3 border border-border px-4 py-3 inline-block">
                <span className="diff-add text-[#7ec891] block">
                  Python, AI/ML, Edge Inference
                </span>
                <span className="diff-add text-[#7ec891] block">
                  C++ (Performance)
                </span>
                <span className="diff-add text-[#7ec891] block">
                  SoilSense AI & Hackathons
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
