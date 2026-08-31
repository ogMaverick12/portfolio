"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

export default function Contact() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const primaryCTAs = [
    {
      label: "send email",
      value: "sreejit.dev12@gmail.com",
      url: "mailto:sreejit.dev12@gmail.com",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
    },
    {
      label: "connect on linkedin",
      value: "sreejit-pradhan",
      url: "https://www.linkedin.com/in/sreejit-pradhan-b27b19401",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
  ];

  const secondaryLinks = [
    {
      label: "github",
      url: "https://github.com/ogMaverick12",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
        </svg>
      ),
    },
    {
      label: "twitter / x",
      url: "https://x.com/SreejitX",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: "dev.to",
      url: "https://dev.to/sreejit_",
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.3zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
        </svg>
      ),
    },
  ];

  const sectionNum = getSectionNum("contact");

  return (
    <section id="contact" ref={containerRef} className="py-32 px-6 md:px-12 border-b border-border relative z-10">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> contact
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-16 items-start">
        {/* Left Side Message */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="contact-big font-serif text-[4rem] md:text-[8vw] lg:text-[8rem] italic leading-[0.9] tracking-tighter mb-8 text-text"
          >
            Let&apos;s<br />
            <em className="not-italic text-accent">build.</em>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="contact-sub max-w-[500px] text-[0.93rem] text-muted2 leading-relaxed mb-6"
          >
            Looking for a dedicated developer to collaborate on edge AI, offline systems, or hackathon teams? Reach out to arrange a briefing or look over code repositories.
          </motion.p>
        </div>

        {/* Right Side CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-8 w-full"
        >
          {/* Primary Dominant Conversion Block */}
          <div className="flex flex-col gap-4">
            <span className="font-mono text-[0.58rem] text-muted tracking-widest uppercase">
              primary contact channels
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {primaryCTAs.map((cta, idx) => (
                <a
                  key={idx}
                  href={cta.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-card-primary border border-accent/20 hover:border-accent p-6 bg-accent2/5 hover:bg-accent2/10 rounded-xl transition-all duration-300 flex flex-col justify-between min-h-[140px] group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 rounded-full blur-xl pointer-events-none group-hover:scale-110 transition-all duration-300" />
                  <div className="flex justify-between items-center text-accent">
                    <span className="font-mono text-[0.62rem] uppercase tracking-wider">{cta.label}</span>
                    <span className="text-[0.8rem] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
                  </div>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-accent/20 bg-bg flex items-center justify-center text-accent">
                      {cta.icon}
                    </div>
                    <span className="font-mono text-[0.82rem] font-semibold text-text truncate">
                      {cta.value}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Secondary Links Clustered Smaller Below */}
          <div className="flex flex-col gap-3">
            <span className="font-mono text-[0.58rem] text-muted tracking-widest uppercase">
              secondary profiles
            </span>
            <div className="flex flex-wrap gap-3">
              {secondaryLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-link flex items-center gap-2 font-mono text-[0.72rem] text-muted2 border border-border/80 hover:border-accent px-4 py-2 rounded-lg transition-all duration-200 hover:text-accent hover:bg-bg2/40"
                >
                  {link.icon}
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
