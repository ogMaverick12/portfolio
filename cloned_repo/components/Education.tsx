"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

export default function Education() {
  const headingRef = useRef(null);
  const cardsRef = useRef(null);
  
  const headingInView = useInView(headingRef, { once: true, margin: "-100px" });
  const cardsInView = useInView(cardsRef, { once: true, margin: "-100px" });

  const sectionNum = getSectionNum("education");

  return (
    <section id="education" className="py-32 px-6 md:px-12 border-b border-border relative z-10">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> education
      </div>

      <motion.h2
        ref={headingRef}
        initial={{ opacity: 0, y: 30 }}
        animate={headingInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="projects-heading font-serif text-[2.5rem] md:text-[5vw] lg:text-[4.5rem] italic leading-[1.05] tracking-tight mb-16 text-text"
      >
        The foundation of<br />
        <em className="not-italic text-accent">my work.</em>
      </motion.h2>

      <div
        ref={cardsRef}
        className="edu-grid grid grid-cols-1 gap-10 max-w-[800px]"
      >
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={cardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="edu-card border border-border p-12 bg-bg2 relative transition-all duration-300 hover:border-border2 hover:bg-bg3"
        >
          <span className="edu-date font-mono text-[0.72rem] text-accent tracking-wider mb-4 block">
            CURRENT
          </span>
          <h3 className="edu-school font-serif text-[2.2rem] italic leading-tight mb-2 text-text">
            DPS Siliguri
          </h3>
          <div className="edu-grade text-[1.1rem] text-text mb-6">
            11th Grade
          </div>
          <p className="edu-desc text-[0.9rem] text-muted2 leading-relaxed">
            Currently pursuing my high school education while actively competing in Olympiads. Deeply focused on mastering <strong className="text-text font-normal">Python</strong> and <strong className="text-text font-normal">C++</strong>, alongside exploring advanced concepts in <strong className="text-text font-normal">AI/ML</strong>.
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={cardsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="edu-card border border-border p-12 bg-bg2 relative transition-all duration-300 hover:border-border2 hover:bg-bg3"
        >
          <span className="edu-date font-mono text-[0.72rem] text-accent tracking-wider mb-4 block">
            COMPLETED
          </span>
          <h3 className="edu-school font-serif text-[2.2rem] italic leading-tight mb-2 text-text">
            Good Shepherd School Bagdogra
          </h3>
          <div className="edu-grade text-[1.1rem] text-text mb-6">
            Class 10 ICSE
          </div>
          <p className="edu-desc text-[0.9rem] text-muted2 leading-relaxed">
            Built a strong academic foundation and developed an early interest in computer science and logical problem-solving.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
