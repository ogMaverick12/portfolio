"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCaseStudy from "./ProjectCaseStudy";
import { useGithubRepo } from "@/hooks/useGithubRepo";
import { getSectionNum } from "@/lib/sections";

const projectsData = [
  {
    id: "soilsense",
    name: "SoilSense AI",
    tagline: "Offline AI for Agriculture",
    valueProp: "Analyses soil chemistry and yields offline recommendations via local edge models.",
    metric: "$0/mo",
    metricLabel: "running cost",
    tech: "Gemma 4 · Edge ML",
    repoName: "SoilSense",
    defaultStatus: "Private Repository" as const,
    highlight: true,
  },
  {
    id: "pathforge",
    name: "PathForge AI",
    tagline: "Intelligent Navigation & Decision Support",
    valueProp: "Goal-oriented career navigation compiler optimizing custom curriculums.",
    metric: "~0.6s",
    metricLabel: "average latency",
    tech: "IBM Granite",
    repoName: "PathForge",
    defaultStatus: "Repository Coming Soon" as const,
    highlight: false,
  },
  {
    id: "preppilot",
    name: "PrepPilot",
    tagline: "Adaptive AI Learning System",
    valueProp: "Scenario-based exam grill system adjusting difficulty to user gaps in real-time.",
    metric: "~0.4s",
    metricLabel: "adaptation speed",
    tech: "Gemini API",
    repoName: "PrepPilot",
    defaultStatus: "Repository Coming Soon" as const,
    highlight: false,
  },
] as const;

interface RepoLinkProps {
  repoName: string;
  defaultStatus: "Private Repository" | "Repository Coming Soon";
}

function RepoLink({ repoName, defaultStatus }: RepoLinkProps) {
  const { loading, exists } = useGithubRepo(repoName);

  if (loading) {
    return (
      <span className="font-mono text-[0.6rem] text-muted/60 uppercase tracking-wider py-1.5 px-3 border border-border/40 bg-bg/20 rounded">
        Checking repo...
      </span>
    );
  }

  if (exists) {
    return (
      <a
        href={`https://github.com/ogMaverick12/${repoName}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="font-mono text-[0.62rem] text-accent hover:text-[#00f5a0] transition-colors uppercase tracking-wider py-1.5 px-3 border border-accent/20 hover:border-[#00f5a0]/40 bg-accent2/10 rounded inline-flex items-center gap-1 cursor-pointer"
      >
        <span>code repository</span>
        <span>↗</span>
      </a>
    );
  }

  return (
    <span
      title="This code is currently private or in closed release."
      className="font-mono text-[0.6rem] text-muted2 uppercase tracking-wider py-1.5 px-3 border border-border/40 bg-bg2/40 rounded cursor-not-allowed select-none"
      onClick={(e) => e.stopPropagation()}
    >
      {defaultStatus}
    </span>
  );
}

export default function Projects() {
  const [activeProjectId, setActiveProjectId] = useState<"soilsense" | "pathforge" | "preppilot" | null>(null);

  const toggleCaseStudy = (id: "soilsense" | "pathforge" | "preppilot") => {
    setActiveProjectId((prev) => (prev === id ? null : id));
  };

  const sectionNum = getSectionNum("projects");

  return (
    <section id="projects" className="py-32 px-6 md:px-12 border-b border-border relative z-10">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> flagship products
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="projects-heading font-serif text-[2.5rem] md:text-[5vw] lg:text-[4.5rem] italic leading-[1.05] tracking-tight mb-16 max-w-[800px] text-text"
        >
          Flagship systems.<br />
          Built to solve <em className="not-italic text-accent">real problems.</em>
        </motion.h2>

        {/* 3-Column flagship products grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
          {projectsData.map((proj) => {
            const isActive = activeProjectId === proj.id;
            return (
              <div
                key={proj.id}
                onClick={() => toggleCaseStudy(proj.id)}
                className={`project-card border p-8 bg-bg2 relative overflow-hidden transition-all duration-350 hover:bg-bg3 hover:-translate-y-1 cursor-pointer rounded-xl flex flex-col justify-between min-h-[360px] ${
                  proj.highlight
                    ? "border-accent/40 shadow-[0_0_30px_rgba(212,255,74,0.03)] hover:border-accent"
                    : "border-border hover:border-border2"
                } ${isActive ? "border-accent bg-bg3/40" : ""}`}
              >
                {/* Visual glow indicator for SoilSense highlight */}
                {proj.highlight && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
                )}

                {/* Card Header metadata */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[0.62rem] text-accent tracking-wider uppercase bg-accent2/20 border border-accent/15 px-2 py-0.5 rounded">
                      {proj.tech}
                    </span>
                    {proj.highlight && (
                      <span className="font-mono text-[0.58rem] text-[#00f5a0] tracking-widest uppercase flex items-center gap-1.5 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f5a0]" />
                        featured
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-[1.8rem] italic leading-tight text-text mb-2">
                    {proj.name}
                  </h3>
                  <div className="font-mono text-[0.68rem] text-accent tracking-wide uppercase mb-3">
                    {proj.tagline}
                  </div>
                  <p className="text-[0.82rem] text-muted2 leading-relaxed mb-6">
                    {proj.valueProp}
                  </p>
                </div>

                {/* Card Footer outcome metrics & actions */}
                <div className="mt-auto">
                  <div className="border-t border-border/40 pt-4 mb-5 flex justify-between items-baseline">
                    <div>
                      <div className="font-serif text-[2.2rem] italic text-text leading-none font-semibold">
                        {proj.metric}
                      </div>
                      <div className="font-mono text-[0.55rem] text-muted uppercase tracking-wider mt-1">
                        {proj.metricLabel}
                      </div>
                    </div>
                    <RepoLink repoName={proj.repoName} defaultStatus={proj.defaultStatus} />
                  </div>

                  <div className="w-full text-center">
                    <button
                      className={`w-full font-mono text-[0.68rem] uppercase tracking-wider py-2.5 rounded border transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-accent text-bg border-accent font-semibold"
                          : "bg-transparent text-muted hover:text-text border-border/60 hover:border-accent"
                      }`}
                    >
                      {isActive ? "Close Case Study" : "View Case Study ↓"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Case Study Drawer */}
        <AnimatePresence>
          {activeProjectId && (
            <div className="mt-8">
              <ProjectCaseStudy
                projectId={activeProjectId}
                onClose={() => setActiveProjectId(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
