"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

interface TechSkill {
  name: string;
  level: number; // percentage
  project: string;
  desc: string;
}

const techMatrix: Record<string, { title: string; skills: TechSkill[] }> = {
  languages: {
    title: "Programming Languages",
    skills: [
      { name: "C++", level: 35, project: "CP Practice", desc: "Learning standard syntax, pointers, arrays, vectors, and basic time limit structures." },
      { name: "Python", level: 45, project: "CP Scripting", desc: "Using Python for quick logical prototyping, loops, conditional systems, and math operations." },
    ],
  },
  cp: {
    title: "CP Foundations",
    skills: [
      { name: "Basic Structures", level: 25, project: "STL Vector / List", desc: "Learning about linear data structures, standard stacks, queues, and list operations." },
      { name: "Number Theory", level: 30, project: "Math & Logic", desc: "Practicing modulo operations, GCD checks, prime checks, and factors calculation." },
      { name: "Time Complexity", level: 20, project: "Big O Analysis", desc: "Learning loop nesting limits, simple operation counts, and asymptotic behavior." },
    ],
  },
};

export default function About() {
  const [activeCategory, setActiveCategory] = useState<keyof typeof techMatrix>("languages");
  const containerRef = useRef(null);

  const sectionNum = getSectionNum("about");

  return (
    <section id="about" className="py-32 px-6 md:px-12 border-b border-border relative z-10">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> about
      </div>

      <div ref={containerRef} className="about-grid grid grid-cols-1 lg:grid-cols-2 gap-20 items-start max-w-7xl mx-auto">
        
        {/* Left Column - Intro Copy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* SEO Visually Hidden Profile Image */}
          <img
            src="/profile.jpg"
            alt="Sreejit Pradhan, 16-year-old competitive programmer from India"
            className="seo-image"
          />
          <h2 className="about-heading font-serif text-[2.5rem] md:text-[5vw] lg:text-[4.5rem] italic leading-[1.05] tracking-tight mb-8 text-text">
            Self-taught.<br />
            Problem Solver.<br />
            <em className="not-italic text-accent">Obsessed with logic.</em>
          </h2>
          <p className="about-body text-[0.93rem] text-muted2 leading-relaxed mb-6">
            I'm <strong className="text-text font-normal">Sreejit Pradhan</strong> — a 16-year-old self-taught programmer from India. I got interested in algorithmic logic, taught myself basic coding structures, and decided to dive into competitive programming.
          </p>
          <p className="about-body text-[0.93rem] text-muted2 leading-relaxed mb-6">
            My primary focus is learning <strong className="text-text font-normal">Python and C++</strong> to solve logical puzzles on online judges.
          </p>
          <p className="about-body text-[0.93rem] text-muted2 leading-relaxed">
            I'm currently a beginner, building my foundation in time complexity, standard data structures, and basic math. I believe in consistent logical practice.
          </p>
        </motion.div>

        {/* Right Column - Interactive Tech Matrix */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full border border-border/80 bg-bg2/40 p-6 md:p-8 rounded-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-serif text-[1.4rem] italic text-text leading-none">
              Interactive Tech Matrix
            </h3>
            <span className="font-mono text-[0.58rem] text-accent tracking-widest uppercase">
              skills constellation
            </span>
          </div>

          {/* Navigation Category Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8 text-[0.68rem] font-mono uppercase tracking-wider">
            {Object.entries(techMatrix).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key as keyof typeof techMatrix)}
                className={`py-2 px-3 border rounded text-center transition-all duration-200 cursor-pointer ${
                  activeCategory === key
                    ? "bg-accent/15 border-accent text-accent font-semibold"
                    : "border-border/60 text-muted hover:text-text hover:border-border2"
                }`}
              >
                {category.title}
              </button>
            ))}
          </div>

          {/* Skills Proficiency Display */}
          <div className="flex flex-col gap-6 min-h-[220px]">
            {techMatrix[activeCategory].skills.map((skill, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[0.82rem] font-semibold text-text">
                      {skill.name}
                    </span>
                    <span className="font-mono text-[0.55rem] text-accent bg-accent2/20 border border-accent/15 px-1.5 py-0.5 rounded">
                      applied: {skill.project}
                    </span>
                  </div>
                  <span className="font-mono text-[0.72rem] text-muted">
                    {skill.level}%
                  </span>
                </div>
                {/* Visual Proficiency Bar */}
                <div className="w-full h-1.5 bg-bg border border-border/60 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-accent to-[#00f5a0]"
                  />
                </div>
                <div className="text-[0.74rem] text-muted2 leading-snug">
                  {skill.desc}
                </div>
              </div>
            ))}
          </div>

        </motion.div>

      </div>
    </section>
  );
}
