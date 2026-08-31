"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

export default function Achievements() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const sectionNum = getSectionNum("achievements");

  const arcadeBadges = [
    "Arcade Voyage: Data Governance and Firebase Foundations",
    "Arcade Adventure: Modern App Deployment",
    "Arcade Trail: Cloud Security and DevOps Foundations",
    "Arcade Adventure: GKE Operations and Networking",
    "Arcade Base Camp May 2026",
    "Arcade Base Camp April 2026"
  ];

  const cloudInfrastructureBadges = [
    "Develop Your Google Cloud Network",
    "Deploy Kubernetes Applications on Google Cloud",
    "Set Up a Google Cloud Network",
    "Implement Cloud Security Fundamentals on Google Cloud",
    "Implement DevOps Workflows in Google Cloud",
    "Deploy and Manage Applications on Google App Engine",
    "The Basics of Google Cloud Compute"
  ];

  const aiMlDataBadges = [
    "Introduction to Large Language Models",
    "Develop AI-Powered Prototypes in Google AI Studio",
    "Engineer AI Agents with Agent Development Kit (ADK)",
    "Use Machine Learning APIs on Google Cloud",
    "Build a Data Mesh with Knowledge Catalog"
  ];

  const otherGoogleBadges = [
    "Develop Serverless Apps with Firebase",
    "Build a Website on Google Cloud",
    "Work Meets Play: Expressive Efficiency & Skill Up Summer"
  ];

  return (
    <section id="achievements" className="py-32 px-6 md:px-12 border-b border-border relative z-10">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> achievements
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="projects-heading font-serif text-[2.5rem] md:text-[5vw] lg:text-[4.5rem] italic leading-[1.05] tracking-tight mb-16 text-text"
      >
        Milestones &<br />
        <em className="not-italic text-accent">Credentials.</em>
      </motion.h2>

      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[800px]"
      >
        {/* Certifications Subtitle */}
        <h3 className="ach-section-title font-serif text-[2.2rem] italic mt-12 mb-6 text-text">
          Certifications
        </h3>
        <div className="ach-grid grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <a
            href="https://coursera.org/share/1ea7c0162e5dd7bd3f2f8e10aa05990e"
            target="_blank"
            rel="noopener noreferrer"
            className="ach-card border border-border p-8 bg-bg2 transition-all duration-350 hover:border-accent hover:bg-bg3 hover:-translate-y-1 hover:shadow-[0_0_25px_2px_var(--accent-glow),_inset_0_0_12px_rgba(212,255,74,0.05)] block text-inherit"
          >
            <h4 className="ach-card-title font-sans text-[1.1rem] font-normal mb-2 text-text">
              Google AI Professional Certificate
            </h4>
            <div className="ach-card-issuer font-mono text-[0.65rem] text-accent tracking-wider uppercase">
              Coursera
            </div>
          </a>

          <a
            href="https://www.freecodecamp.org/certification/__sreejit__/python-v9"
            target="_blank"
            rel="noopener noreferrer"
            className="ach-card border border-border p-8 bg-bg2 transition-all duration-350 hover:border-accent hover:bg-bg3 hover:-translate-y-1 hover:shadow-[0_0_25px_2px_var(--accent-glow),_inset_0_0_12px_rgba(212,255,74,0.05)] block text-inherit"
          >
            <h4 className="ach-card-title font-sans text-[1.1rem] font-normal mb-2 text-text">
              Python Certification
            </h4>
            <div className="ach-card-issuer font-mono text-[0.65rem] text-accent tracking-wider uppercase">
              freeCodeCamp
            </div>
          </a>
        </div>

        {/* Google Cloud Skills Subtitle */}
        <h3 className="ach-section-title font-serif text-[2.2rem] italic mt-12 mb-6 text-text">
          Google Cloud Skills
        </h3>
        <div className="mb-12 flex flex-col gap-4">
          {/* Accordion 1 */}
          <details className="ach-group border border-border bg-bg2 transition-all duration-300 hover:border-border2">
            <summary className="ach-summary p-6 font-mono text-[0.8rem] text-accent cursor-pointer tracking-wider flex justify-between items-center select-none list-none">
              Arcade Badges ({arcadeBadges.length})
            </summary>
            <div className="ach-list px-6 pb-6 flex flex-col gap-3">
              {arcadeBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="ach-item text-[0.85rem] text-muted2 p-4 border-l-2 border-border2 bg-bg transition-all duration-300 hover:text-text hover:border-accent"
                >
                  {badge}
                </div>
              ))}
            </div>
          </details>

          {/* Accordion 2 */}
          <details className="ach-group border border-border bg-bg2 transition-all duration-300 hover:border-border2">
            <summary className="ach-summary p-6 font-mono text-[0.8rem] text-accent cursor-pointer tracking-wider flex justify-between items-center select-none list-none">
              Cloud Infrastructure & Security ({cloudInfrastructureBadges.length})
            </summary>
            <div className="ach-list px-6 pb-6 flex flex-col gap-3">
              {cloudInfrastructureBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="ach-item text-[0.85rem] text-muted2 p-4 border-l-2 border-border2 bg-bg transition-all duration-300 hover:text-text hover:border-accent"
                >
                  {badge}
                </div>
              ))}
            </div>
          </details>

          {/* Accordion 3 */}
          <details className="ach-group border border-border bg-bg2 transition-all duration-300 hover:border-border2">
            <summary className="ach-summary p-6 font-mono text-[0.8rem] text-accent cursor-pointer tracking-wider flex justify-between items-center select-none list-none">
              AI, ML & Data ({aiMlDataBadges.length})
            </summary>
            <div className="ach-list px-6 pb-6 flex flex-col gap-3">
              {aiMlDataBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="ach-item text-[0.85rem] text-muted2 p-4 border-l-2 border-border2 bg-bg transition-all duration-300 hover:text-text hover:border-accent"
                >
                  {badge}
                </div>
              ))}
            </div>
          </details>

          {/* Accordion 4 */}
          <details className="ach-group border border-border bg-bg2 transition-all duration-300 hover:border-border2">
            <summary className="ach-summary p-6 font-mono text-[0.8rem] text-accent cursor-pointer tracking-wider flex justify-between items-center select-none list-none">
              Other Google Skills ({otherGoogleBadges.length})
            </summary>
            <div className="ach-list px-6 pb-6 flex flex-col gap-3">
              {otherGoogleBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="ach-item text-[0.85rem] text-muted2 p-4 border-l-2 border-border2 bg-bg transition-all duration-300 hover:text-text hover:border-accent"
                >
                  {badge}
                </div>
              ))}
            </div>
          </details>
        </div>

        {/* Dev.to Competition Badges Subtitle */}
        <h3 className="ach-section-title font-serif text-[2.2rem] italic mt-12 mb-6 text-text">
          Dev.to Competition Badges
        </h3>
        <div className="ach-grid grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href="https://dev.to/sreejit_"
            target="_blank"
            rel="noopener noreferrer"
            className="ach-card border border-border p-8 bg-bg2 transition-all duration-350 hover:border-accent hover:bg-bg3 hover:-translate-y-1 hover:shadow-[0_0_25px_2px_var(--accent-glow),_inset_0_0_12px_rgba(212,255,74,0.05)] block text-inherit"
          >
            <h4 className="ach-card-title font-sans text-[1.1rem] font-normal mb-2 text-text">
              Google Cloud NEXT '26 Challenge
            </h4>
            <div className="ach-card-issuer font-mono text-[0.65rem] text-accent tracking-wider uppercase">
              Winner / Participant
            </div>
          </a>

          <a
            href="https://dev.to/sreejit_"
            target="_blank"
            rel="noopener noreferrer"
            className="ach-card border border-border p-8 bg-bg2 transition-all duration-350 hover:border-accent hover:bg-bg3 hover:-translate-y-1 hover:shadow-[0_0_25px_2px_var(--accent-glow),_inset_0_0_12px_rgba(212,255,74,0.05)] block text-inherit"
          >
            <h4 className="ach-card-title font-sans text-[1.1rem] font-normal mb-2 text-text">
              Gemma Challenge
            </h4>
            <div className="ach-card-issuer font-mono text-[0.65rem] text-accent tracking-wider uppercase">
              Participant
            </div>
          </a>

          <a
            href="https://dev.to/sreejit_"
            target="_blank"
            rel="noopener noreferrer"
            className="ach-card border border-border p-8 bg-bg2 transition-all duration-350 hover:border-accent hover:bg-bg3 hover:-translate-y-1 hover:shadow-[0_0_25px_2px_var(--accent-glow),_inset_0_0_12px_rgba(212,255,74,0.05)] block text-inherit"
          >
            <h4 className="ach-card-title font-sans text-[1.1rem] font-normal mb-2 text-text">
              Hermes Agent Challenge
            </h4>
            <div className="ach-card-issuer font-mono text-[0.65rem] text-accent tracking-wider uppercase">
              Participant
            </div>
          </a>

          <a
            href="https://dev.to/sreejit_"
            target="_blank"
            rel="noopener noreferrer"
            className="ach-card border border-border p-8 bg-bg2 transition-all duration-350 hover:border-accent hover:bg-bg3 hover:-translate-y-1 hover:shadow-[0_0_25px_2px_var(--accent-glow),_inset_0_0_12px_rgba(212,255,74,0.05)] block text-inherit"
          >
            <h4 className="ach-card-title font-sans text-[1.1rem] font-normal mb-2 text-text">
              Google AI Studio Challenge
            </h4>
            <div className="ach-card-issuer font-mono text-[0.65rem] text-accent tracking-wider uppercase">
              Winner / Participant
            </div>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
