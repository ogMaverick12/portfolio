"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero() {
  const [typedText, setTypedText] = useState("");
  const [isFinished, setIsFinished] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  const { scrollY } = useScroll();
  // Parallax transform for background text
  const yBg = useTransform(scrollY, [0, 800], [0, 120]);

  useEffect(() => {
    // Blinking cursor interval
    const blinkInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 400);

    return () => clearInterval(blinkInterval);
  }, []);

  useEffect(() => {
    const textToType = "Sreejit";
    let index = 0;
    let typingInterval: NodeJS.Timeout;
    let finishTimeout: NodeJS.Timeout;

    const startTimeout = setTimeout(() => {
      typingInterval = setInterval(() => {
        index++;
        if (index <= textToType.length) {
          setTypedText(textToType.substring(0, index));
        } else {
          clearInterval(typingInterval);
          finishTimeout = setTimeout(() => {
            setIsFinished(true);
          }, 2000);
        }
      }, 150);
    }, 900);

    return () => {
      clearTimeout(startTimeout);
      if (typingInterval) clearInterval(typingInterval);
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, []);

  return (
    <section id="hero" className="min-height-hero min-h-screen flex flex-col justify-end px-6 md:px-12 pb-20 relative overflow-hidden">
      {/* Glitch Line */}
      <div className="hero-glitch-line" />

      {/* Parallax Background Text */}
      <motion.div
        id="hero-bg"
        style={{
          y: yBg,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="hero-bg-text absolute top-[45%] left-1/2 select-none pointer-events-none text-[6rem] md:text-[18vw] lg:text-[17rem] font-serif italic text-white/[0.012] whitespace-nowrap leading-none tracking-tight"
      >
        Sreejit
      </motion.div>

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Section Tag */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="hero-tag font-mono text-[0.68rem] text-accent tracking-[0.18em] uppercase mb-6 flex items-center gap-3"
        >
          01 · introduction
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="hero-name font-serif text-[4.5rem] md:text-[11vw] lg:text-[10rem] font-normal italic leading-[0.88] tracking-tighter mb-8 text-text"
        >
          Hi, I&apos;m
          <br />
          {!isFinished ? (
            <em className="not-italic text-accent relative inline-block">
              {typedText}
              <span
                style={{ opacity: cursorVisible ? 1 : 0 }}
                className="inline-block w-[0.1em] h-[0.9em] bg-accent ml-1 align-middle transition-opacity duration-100"
              />
            </em>
          ) : (
            <em className="not-italic text-accent relative inline-block">
              <span className="glitch-wrap" data-text="Sreejit">
                Sreejit
              </span>
            </em>
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hero-desc max-w-[520px] font-sans text-[1rem] font-light text-muted2 leading-relaxed mb-10"
        >
          <em className="text-text italic not-italic font-normal">Beginner Programmer</em> from India. 16 years old, self-taught.
          Learning Python & C++ for competitive programming.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-ctas flex items-center gap-6"
        >
          <a href="#about" className="btn-primary">
            <span>→ read about me</span>
          </a>
          <a href="#contact" className="btn-ghost">
            get in touch ↗
          </a>
        </motion.div>
      </div>

      {/* Meta Sidebar */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="hero-meta absolute right-6 md:right-12 bottom-20 hidden md:flex flex-col items-end gap-4"
      >
        <div className="hero-meta-item font-mono text-[0.65rem] text-muted tracking-wider uppercase flex items-center gap-2">
          location · <span className="text-muted2">India</span>
        </div>
        <div className="hero-meta-item font-mono text-[0.65rem] text-muted tracking-wider uppercase flex items-center gap-2">
          age · <span className="text-muted2">16</span>
        </div>
        <div className="hero-meta-item font-mono text-[0.65rem] text-muted tracking-wider uppercase flex items-center gap-2">
          status · <span className="text-accent">learning</span>
        </div>
        <div className="hero-meta-item font-mono text-[0.65rem] text-muted tracking-wider uppercase flex items-center gap-2">
          stack · <span className="text-muted2">Python, C++</span>
        </div>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[0.6rem] text-muted tracking-[0.2em] uppercase flex flex-col items-center gap-2"
      >
        <span>scroll</span>
        <div className="scroll-arrow w-[1px] h-10 bg-gradient-to-b from-accent to-transparent" />
      </motion.div>
    </section>
  );
}
