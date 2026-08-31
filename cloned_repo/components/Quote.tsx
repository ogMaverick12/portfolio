"use client";

import { motion } from "framer-motion";

export default function Quote() {
  return (
    <section id="quote" className="py-40 px-6 md:px-12 text-center relative z-10 border-b border-border">
      <motion.blockquote
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-[2rem] md:text-[3.5vw] lg:text-[3rem] italic text-text max-w-[900px] mx-auto leading-snug tracking-tight"
      >
        "Prompting is a superpower — the quality of an LLM's output is limited less by the model itself and more by the clarity, depth, and intelligence of the prompt behind it."
        <div className="font-mono text-[0.75rem] text-accent not-italic mt-10 tracking-[0.15em] uppercase">
          — Sreejit Pradhan
        </div>
      </motion.blockquote>
    </section>
  );
}
