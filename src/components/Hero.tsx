import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { animate, createScope, stagger } from "animejs";
import { sound } from "../lib/sound";
import { attachMagneticEffect, attach3DTilt } from "../lib/animeEffects";
import { GlitchName } from "./GlitchName";
import {
  Cpu,
  Terminal as TerminalIcon,
  ArrowDown,
  Sparkles,
  Zap,
  Github,
  Linkedin,
  Radio,
  Activity,
  Shuffle,
  RotateCcw,
  Sliders,
  Code2,
} from "lucide-react";

interface FocusDomain {
  id: string;
  title: string;
  tagline: string;
  badge: string;
  tech: string;
  accent: string;
}

export const Hero: React.FC = () => {
  const heroRootRef = useRef<HTMLDivElement>(null);
  const chipsContainerRef = useRef<HTMLDivElement>(null);
  const animeScopeRef = useRef<any>(null);
  const telemetryCardRef = useRef<HTMLDivElement>(null);
  const btnExploreRef = useRef<HTMLAnchorElement>(null);
  const btnTerminalRef = useRef<HTMLAnchorElement>(null);
  const titleCharContainerRef = useRef<HTMLHeadingElement>(null);
  const taglineScrambleRef = useRef<HTMLParagraphElement>(null);

  const [activeChip, setActiveChip] = useState<string | null>(null);
  const [isTelemetryHovered, setIsTelemetryHovered] = useState(false);
  const [isTelemetryPinned, setIsTelemetryPinned] = useState(false);
  const [isDiagnosticRunning, setIsDiagnosticRunning] = useState(false);
  const [diagnosticStats, setDiagnosticStats] = useState({
    latency: "0.42ms",
    throughput: "48.6 tok/s",
    vram: "3.8 GB",
    status: "OPTIMAL",
  });

  const domains: FocusDomain[] = [
    {
      id: "edge-ai",
      title: "Offline Edge AI",
      tagline: "Deploying quantized 4-bit LLMs directly to edge ARM silicon without internet dependence.",
      badge: "Zero-Cloud Inference",
      tech: "Gemma 4-bit · llama.cpp · Raspberry Pi",
      accent: "text-orange-400 border-orange-500/30 bg-orange-500/10",
    },
    {
      id: "cp-dsa",
      title: "Competitive C++",
      tagline: "High-performance algorithmic solutions, asymptotic proofs, and advanced STL data structures.",
      badge: "Algorithmic Precision",
      tech: "C++20 · Segment Trees · Graph Theory",
      accent: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    },
    {
      id: "hardware",
      title: "Hardware Bridges",
      tagline: "Bridging physical analog sensors to local machine learning models via high-speed SPI/I2C buses.",
      badge: "Embedded Telemetry",
      tech: "ADC Sensors · Python 3.11 · I2C Telemetry",
      accent: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    },
    {
      id: "cloud-arch",
      title: "GCP Architecture",
      tagline: "Certified cloud fundamentals with 21 Google Cloud badges across infrastructure and data.",
      badge: "21 Cloud Badges",
      tech: "Google Cloud · IAM · Microservices",
      accent: "text-[var(--accent-neon)] border-[var(--accent-neon)]/30 bg-[var(--accent-neon)]/10",
    },
  ];

  const [activeDomainIndex, setActiveDomainIndex] = useState(0);
  const currentDomain = domains[activeDomainIndex];

  const interactiveChips = [
    { id: "gemma", label: "Gemma 4 (4-bit)", tag: "Edge AI", color: "border-orange-500/40 text-orange-400 bg-orange-500/10" },
    { id: "cpp", label: "C++20 & STL", tag: "Competitive DSA", color: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10" },
    { id: "python", label: "Python 3.11", tag: "Hardware & Automation", color: "border-amber-500/40 text-amber-400 bg-amber-500/10" },
    { id: "pi", label: "Raspberry Pi & ADC", tag: "Offline Hardware", color: "border-purple-500/40 text-purple-400 bg-purple-500/10" },
    { id: "cloud", label: "21 GCP Badges", tag: "Cloud Architecture", color: "border-[var(--accent-neon)]/40 text-[var(--accent-neon)] bg-[var(--accent-neon)]/10" },
  ];

  // Initialize Anime.js animations & interactions
  useEffect(() => {
    if (!heroRootRef.current) return;

    // 1. Setup Anime Scope
    animeScopeRef.current = createScope({ root: heroRootRef }).add(() => {
      // Cascading headline entrance
      animate(".hero-stagger", {
        opacity: [0, 1],
        translateY: [32, 0],
        duration: 900,
        delay: stagger(75),
        ease: "outExpo",
      });

      // Animated title words
      animate(".hero-title-word", {
        opacity: [0, 1],
        translateY: [24, 0],
        rotateZ: [2, 0],
        duration: 850,
        delay: stagger(60, { start: 150 }),
        ease: "outBack",
      });

      // Pulsing status dot
      animate(".hero-status-pulse", {
        scale: [1, 1.35, 1],
        opacity: [0.5, 1, 0.5],
        duration: 2000,
        loop: true,
        ease: "inOutSine",
      });

      // Continuous ambient equalizer bars animation
      animate(".telemetry-eq-bar", {
        scaleY: () => [0.2 + Math.random() * 0.3, 0.6 + Math.random() * 0.4, 0.3],
        duration: () => 600 + Math.random() * 800,
        delay: stagger(70),
        loop: true,
        alternate: true,
        ease: "inOutQuad",
      });
    });

    // 2. Attach 3D interactive tilt to telemetry card
    let cleanupTilt: (() => void) | undefined;
    if (telemetryCardRef.current) {
      cleanupTilt = attach3DTilt(telemetryCardRef.current, 7);
    }

    // 3. Attach magnetic pull to primary call-to-action buttons
    let cleanupMag1: (() => void) | undefined;
    let cleanupMag2: (() => void) | undefined;
    if (btnExploreRef.current) {
      cleanupMag1 = attachMagneticEffect(btnExploreRef.current, 14);
    }
    if (btnTerminalRef.current) {
      cleanupMag2 = attachMagneticEffect(btnTerminalRef.current, 14);
    }

    return () => {
      if (animeScopeRef.current && typeof animeScopeRef.current.revert === "function") {
        animeScopeRef.current.revert();
      }
      if (cleanupTilt) cleanupTilt();
      if (cleanupMag1) cleanupMag1();
      if (cleanupMag2) cleanupMag2();
    };
  }, []);

  // Trigger Anime.js transition when domain tab is switched
  const handleDomainChange = (index: number) => {
    if (index === activeDomainIndex) return;
    sound.playClick();
    setActiveDomainIndex(index);

    animate(".domain-detail-box", {
      opacity: [0, 1],
      translateX: [-16, 0],
      duration: 350,
      ease: "outQuad",
    });
  };

  // Run real-time edge diagnostic simulation with Anime.js countup
  const handleRunDiagnostic = () => {
    if (isDiagnosticRunning) return;
    sound.playBeep();
    setIsDiagnosticRunning(true);

    animate(".telemetry-radar-circle", {
      scale: [1, 2.2],
      opacity: [1, 0],
      duration: 1200,
      loop: 2,
      ease: "outExpo",
    });

    animate(".diagnostic-progress-bar", {
      width: ["0%", "100%"],
      duration: 1400,
      ease: "inOutQuad",
      onComplete: () => {
        sound.playSuccess();
        setIsDiagnosticRunning(false);
        setDiagnosticStats({
          latency: `${(0.3 + Math.random() * 0.2).toFixed(2)}ms`,
          throughput: `${(45 + Math.random() * 8).toFixed(1)} tok/s`,
          vram: "3.78 GB",
          status: "CALIBRATED",
        });
      },
    });
  };

  // Scatter & Gather Badges with Anime.js elastic springs
  const handleScatterBadges = () => {
    sound.playClick();
    const chips = document.querySelectorAll(".hero-draggable-chip");
    animate(chips, {
      translateX: () => (Math.random() - 0.5) * 220,
      translateY: () => (Math.random() - 0.5) * 120,
      rotateZ: () => (Math.random() - 0.5) * 24,
      duration: 700,
      ease: "outElastic(1, 0.4)",
    });
  };

  const handleResetBadges = () => {
    sound.playClick();
    const chips = document.querySelectorAll(".hero-draggable-chip");
    animate(chips, {
      translateX: 0,
      translateY: 0,
      rotateZ: 0,
      scale: 1,
      duration: 650,
      ease: "outElastic(1, 0.5)",
    });
  };

  return (
    <section
      id="hero"
      ref={heroRootRef}
      className="relative min-h-[94vh] pt-28 pb-16 px-4 sm:px-8 flex flex-col justify-center items-center overflow-hidden border-b border-[var(--border-subtle)]"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[var(--accent-neon)]/6 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-[350px] h-[350px] bg-orange-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* VISUAL HERO CONTAINER */}
      <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col items-start">
        {/* FIRST CHUNK: Typography, Domains & Primary Navigation */}
        <div className="w-full flex flex-col items-start mb-12">
          {/* Status Capsule */}
          <div className="hero-stagger mb-5 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-[0.68rem] text-[var(--text-muted)] tracking-wider">
              <span className="hero-status-pulse w-2 h-2 rounded-full bg-[var(--accent-neon)]" />
              <span className="text-[var(--text-primary)] font-medium">Systems Engineer & Researcher</span>
              <span className="text-[var(--text-dim)]">·</span>
              <span className="text-[var(--accent-neon)] font-medium">DPS Siliguri Grade 11</span>
              <span className="text-[var(--text-dim)]">·</span>
              <span className="uppercase text-[0.62rem] tracking-widest text-[var(--text-dim)]">Age 16</span>
            </div>
          </div>

          {/* Main Kinetic Headline: Prominently Typed Out Name */}
          <div className="mb-4">
            <h1
              ref={titleCharContainerRef}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal leading-[1.05] tracking-tight text-[var(--text-primary)] select-none"
            >
              <GlitchName
                name="Sreejit Pradhan"
                active={true}
                className="hover:text-[var(--accent-neon)] transition-colors duration-200"
              />
            </h1>
          </div>

          {/* Editorial Purpose / Discipline Subtitle */}
          <p className="hero-stagger text-lg sm:text-xl md:text-2xl text-[var(--text-muted)] font-serif italic mb-6 leading-snug max-w-2xl">
            Building{" "}
            <span className="text-[var(--accent-neon)] font-medium not-italic font-sans">
              offline edge AI
            </span>{" "}
            and high-performance{" "}
            <span className="text-[var(--text-primary)] font-medium not-italic font-sans">
              algorithmic systems
            </span>
            .
          </p>

          {/* Dynamic Interactive Domain Switcher */}
          <div className="hero-stagger w-full max-w-2xl mb-6">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] mb-3 overflow-x-auto relative">
              {domains.map((dom, idx) => {
                const isActive = activeDomainIndex === idx;
                return (
                  <button
                    key={dom.id}
                    onClick={() => handleDomainChange(idx)}
                    className={`relative px-3.5 py-1.5 rounded-lg font-code text-[0.7rem] uppercase tracking-wider transition-colors shrink-0 flex items-center gap-1.5 select-none ${
                      isActive
                        ? "text-[#0F0F0F] font-bold"
                        : "text-[var(--text-muted)] hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="heroDomainIndicator"
                        className="absolute inset-0 bg-[#E8E4D9] rounded-lg shadow-md -z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Code2 className="w-3 h-3" />
                      <span>{dom.title}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active Domain Detail Card with AnimatePresence */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDomain.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="domain-detail-box p-4 rounded-xl bg-[var(--bg-secondary)]/70 border border-[var(--border-subtle)] backdrop-blur-sm"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className={`px-2 py-0.5 rounded font-code text-[0.65rem] font-semibold border ${currentDomain.accent}`}>
                    {currentDomain.badge}
                  </span>
                  <span className="font-code text-[0.65rem] text-[var(--text-dim)]">
                    {currentDomain.tech}
                  </span>
                </div>
                <p
                  ref={taglineScrambleRef}
                  className="text-sm text-[var(--text-muted)] font-mono min-h-[44px] leading-relaxed"
                >
                  {currentDomain.tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Callouts with Motion Spring Feedback */}
          <div className="hero-stagger flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <motion.a
              ref={btnExploreRef}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              href="#projects"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="px-6 py-3.5 rounded-full bg-[#E8E4D9] text-[#0F0F0F] font-code text-xs font-bold uppercase tracking-wider hover:bg-[var(--accent-neon)] hover:text-white transition-colors shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex items-center gap-2 interactive-hover select-none"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Explore Flagship Systems</span>
            </motion.a>

            <motion.a
              ref={btnTerminalRef}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              href="#terminal"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="px-6 py-3.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] text-[var(--text-primary)] font-code text-xs uppercase tracking-wider hover:text-[var(--accent-neon)] transition-colors flex items-center gap-2 interactive-hover select-none"
            >
              <TerminalIcon className="w-3.5 h-3.5 text-[var(--accent-neon)]" />
              <span>Launch Edge Terminal</span>
            </motion.a>

            <div className="flex items-center gap-2">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                href="https://github.com/ogMaverick12"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="p-3.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-white/40 text-[var(--text-muted)] hover:text-white transition-colors"
                title="GitHub Profile"
              >
                <Github className="w-4 h-4" />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.92 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                href="https://www.linkedin.com/in/sreejit-pradhan-b27b19401"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => sound.playHover()}
                onClick={() => sound.playClick()}
                className="p-3.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-white/40 text-[var(--text-muted)] hover:text-white transition-colors"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* SECOND CHUNK: Full Telemetry & Draggable Badges Module Below CTA Buttons */}
        <div className="w-full flex flex-col gap-5 pt-8 border-t border-[var(--border-subtle)]">
          {/* Interactive Physics Badges Header & Controls */}
          <div className="hero-stagger flex flex-wrap items-center justify-between gap-3 font-code text-[0.68rem] text-[var(--text-dim)] uppercase tracking-wider select-none">
            <div className="flex items-center gap-2 text-[var(--text-muted)]">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-neon)]" />
              <span className="font-semibold">Core Stack & Draggable Physics Badges</span>
              <span className="text-[0.62rem] text-[var(--text-dim)] hidden sm:inline">· Drag & toss within container</span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleScatterBadges}
                className="px-2.5 py-1 rounded bg-[var(--bg-secondary)] hover:text-[var(--accent-neon)] border border-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
                title="Scatter Chips with Spring Physics"
              >
                <Shuffle className="w-3 h-3" />
                <span>Scatter</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleResetBadges}
                className="px-2.5 py-1 rounded bg-[var(--bg-secondary)] hover:text-[var(--accent-neon)] border border-[var(--border-subtle)] transition-colors flex items-center gap-1.5"
                title="Assemble Matrix"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </motion.button>
            </div>
          </div>

          {/* Interactive Draggable Tech Stack Pills with Defined Container Constraints */}
          <div
            ref={chipsContainerRef}
            className="hero-stagger relative flex flex-wrap gap-2.5 p-3 rounded-2xl bg-[var(--bg-secondary)]/30 border border-dashed border-[var(--border-subtle)] min-h-[56px] items-center"
          >
            {interactiveChips.map((chip) => (
              <motion.div
                key={chip.id}
                drag
                dragConstraints={chipsContainerRef}
                dragElastic={0.2}
                dragTransition={{ bounceStiffness: 450, bounceDamping: 24 }}
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                whileDrag={{ scale: 1.15, rotate: 4, zIndex: 40, cursor: "grabbing" }}
                onDragStart={() => sound.playClick()}
                onDragEnd={() => sound.playKey()}
                onMouseEnter={() => {
                  sound.playHover();
                  setActiveChip(chip.id);
                }}
                onMouseLeave={() => setActiveChip(null)}
                className={`hero-draggable-chip anime-draggable-badge px-3.5 py-2 rounded-lg border font-code text-[0.72rem] transition-colors cursor-grab select-none flex items-center gap-2 shadow-sm ${chip.color} ${
                  activeChip === chip.id ? "ring-1 ring-[var(--accent-neon)]/50" : ""
                }`}
                style={{ touchAction: "none" }}
              >
                <Cpu className="w-3.5 h-3.5 opacity-70" />
                <span className="font-semibold">{chip.label}</span>
                <span className="text-[0.65rem] opacity-60">· {chip.tag}</span>
              </motion.div>
            ))}
          </div>

          {/* Main 3D Telemetry Glass Dashboard with Hover-Triggered Reveal */}
          <div className="hero-stagger w-full">
            <div
              ref={telemetryCardRef}
              onMouseEnter={() => {
                setIsTelemetryHovered(true);
                sound.playHover();
              }}
              onMouseLeave={() => setIsTelemetryHovered(false)}
              className="glass-panel p-6 sm:p-7 rounded-2xl relative overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--accent-neon)]/40 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 group"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Top Bar / Hardware Status with Interactive Deep Telemetry Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-[var(--border-subtle)] font-code text-[0.68rem]">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Radio className="w-3.5 h-3.5 text-[var(--accent-neon)] animate-pulse" />
                  <span className="font-bold tracking-wider">TELEMETRY · SILIGURI EDGE NODE</span>
                  <span className="text-[0.62rem] text-[var(--text-dim)] hidden md:inline">
                    (Hover to stream deep kernel parameters)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      sound.playClick();
                      setIsTelemetryPinned(!isTelemetryPinned);
                    }}
                    className={`px-2.5 py-1 rounded border font-semibold flex items-center gap-1.5 transition-colors ${
                      isTelemetryPinned || isTelemetryHovered
                        ? "bg-[var(--accent-neon)]/15 text-[var(--accent-neon)] border-[var(--accent-neon)]/40"
                        : "bg-white/5 text-[var(--text-muted)] border-white/10"
                    }`}
                  >
                    <Sliders className="w-3 h-3 text-[var(--accent-neon)]" />
                    <span>{isTelemetryPinned ? "PINNED TELEMETRY" : "DEEP STREAM"}</span>
                  </motion.button>

                  <span className="px-2.5 py-1 rounded bg-[var(--accent-neon)]/10 text-[var(--accent-neon)] border border-[var(--accent-neon)]/30 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-neon)] animate-ping" />
                    ONLINE & SYNCHRONIZED
                  </span>
                </div>
              </div>

              {/* Grid: Profile Info & Equalizer Telemetry */}
              <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.1fr] gap-6 items-start">
                {/* Left Sub-Column: Profile Card + System Attributes */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-[#16161e] shadow-inner">
                      <img
                        src="/profile.jpg"
                        alt="Sreejit Pradhan"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    </div>

                    <div>
                      <div className="font-code text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                        <span>Sreejit Pradhan</span>
                        <span className="text-[0.68rem] font-normal text-[var(--accent-neon)] font-mono">@ogMaverick12</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                        High School Developer · DPS Siliguri Class 11
                      </div>
                      <div className="font-code text-[0.68rem] text-[var(--text-dim)] mt-1 flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-orange-400" />
                        <span>21 GCP Badges · 15 Technical Articles</span>
                      </div>
                    </div>
                  </div>

                  {/* Key System Attributes Grid */}
                  <div className="grid grid-cols-2 gap-2.5 font-code text-xs pt-1">
                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <div className="text-[0.62rem] text-[var(--text-dim)] uppercase">Core Focus</div>
                      <div className="font-medium text-[var(--text-primary)] mt-0.5 truncate">DSA (C++) & Gemma 4</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                      <div className="text-[0.62rem] text-[var(--text-dim)] uppercase">Flagship System</div>
                      <div className="font-medium text-[var(--accent-neon)] mt-0.5 truncate">SoilSense AI (Offline)</div>
                    </div>
                  </div>
                </div>

                {/* Right Sub-Column: Animated Equalizer Waveform & Real-Time Stats */}
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[0.68rem] font-code text-[var(--text-dim)] uppercase tracking-wider mb-2">
                      <span className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 text-[var(--accent-neon)]" />
                        Local Model Telemetry
                      </span>
                      <span className="text-[var(--accent-neon)] font-bold">{diagnosticStats.status}</span>
                    </div>

                    {/* Equalizer Waveform */}
                    <div className="h-8 flex items-end justify-between gap-1.5 px-1 mb-3">
                      {[40, 65, 85, 30, 95, 70, 50, 80, 45, 90, 60, 75, 35, 88, 55, 68, 42, 78, 92, 64].map((h, i) => (
                        <div
                          key={i}
                          className="telemetry-eq-bar flex-1 rounded-t bg-[var(--accent-neon)] opacity-80"
                          style={{ height: `${h}%`, transformOrigin: "bottom" }}
                        />
                      ))}
                    </div>

                    {/* Metric grid */}
                    <div className="grid grid-cols-3 gap-2 pt-2.5 border-t border-white/5 font-code text-[0.68rem]">
                      <div>
                        <span className="text-[var(--text-dim)] block">Inference</span>
                        <span className="text-[var(--text-primary)] font-bold">{diagnosticStats.latency}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-dim)] block">Throughput</span>
                        <span className="text-[var(--text-primary)] font-bold">{diagnosticStats.throughput}</span>
                      </div>
                      <div>
                        <span className="text-[var(--text-dim)] block">Memory</span>
                        <span className="text-[var(--text-primary)] font-bold">{diagnosticStats.vram}</span>
                      </div>
                    </div>
                  </div>

                  {/* Diagnostic Trigger Button */}
                  <div className="mt-3.5">
                    <button
                      onClick={handleRunDiagnostic}
                      disabled={isDiagnosticRunning}
                      className="w-full py-2 px-3 rounded-lg bg-white/5 hover:bg-[var(--accent-neon)]/15 border border-white/10 hover:border-[var(--accent-neon)]/30 text-[var(--text-muted)] hover:text-[var(--accent-neon)] font-code text-[0.68rem] tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[var(--accent-neon)]" />
                      <span>{isDiagnosticRunning ? "Benchmarking Quantized Weights..." : "Run Edge Benchmark"}</span>
                    </button>

                    {isDiagnosticRunning && (
                      <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                        <div className="diagnostic-progress-bar h-full bg-[var(--accent-neon)]" style={{ width: "0%" }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* HOVER REVEAL: Secondary System Telemetry Details smoothly animated with Framer Motion */}
              <AnimatePresence>
                {(isTelemetryHovered || isTelemetryPinned) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: 20 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                    className="overflow-hidden border-t border-[var(--border-subtle)] pt-4"
                  >
                    <div className="flex items-center justify-between text-[0.68rem] font-code text-[var(--accent-neon)] uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        Secondary Edge Subsystems & Kernel Diagnostics
                      </span>
                      <span className="text-[0.62rem] text-[var(--text-dim)]">Real-time ISA & Bus Telemetry</span>
                    </div>

                    {/* Secondary Metrics Bento Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-code text-[0.68rem] mb-3">
                      <div className="p-3 rounded-xl bg-[var(--bg-primary)]/80 border border-white/5 flex flex-col justify-between">
                        <span className="text-[var(--text-dim)] text-[0.62rem]">QUANTIZATION KERNEL</span>
                        <span className="text-[var(--text-primary)] font-bold mt-1">INT4 Q4_K_M (3.8 bpw)</span>
                        <span className="text-emerald-400 text-[0.6rem] mt-0.5">AVX-512 / NEON VSS</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-primary)]/80 border border-white/5 flex flex-col justify-between">
                        <span className="text-[var(--text-dim)] text-[0.62rem]">HOST THERMAL LOAD</span>
                        <span className="text-emerald-400 font-bold mt-1">38.4°C Nominal</span>
                        <span className="text-[var(--text-dim)] text-[0.6rem] mt-0.5">12.1W / 15W Budget</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-primary)]/80 border border-white/5 flex flex-col justify-between">
                        <span className="text-[var(--text-dim)] text-[0.62rem]">KV-CACHE ALLOCATION</span>
                        <span className="text-[var(--text-primary)] font-bold mt-1">1.84 GB / 8.00 GB</span>
                        <span className="text-[var(--accent-neon)] text-[0.6rem] mt-0.5">98.6% L1 Hit Rate</span>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-primary)]/80 border border-white/5 flex flex-col justify-between">
                        <span className="text-[var(--text-dim)] text-[0.62rem]">ANALOG HARDWARE BUS</span>
                        <span className="text-amber-400 font-bold mt-1">ADS1115 SPI / I2C</span>
                        <span className="text-[var(--text-dim)] text-[0.6rem] mt-0.5">860 samples/sec DMA</span>
                      </div>
                    </div>

                    {/* Secondary Draggable Telemetry Badges with Container Bounds */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <span className="text-[0.62rem] font-code text-[var(--text-dim)] mr-1">Draggable status tags:</span>
                      {[
                        { label: "100% Offline Resilience", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
                        { label: "Zero Cloud Dependencies", color: "bg-orange-500/10 text-orange-400 border-orange-500/30" },
                        { label: "0.00% Packet Loss", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
                        { label: "ARM64 Sub-Millisecond", color: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
                      ].map((tag, idx) => (
                        <motion.span
                          key={idx}
                          drag
                          dragConstraints={{ top: -15, bottom: 15, left: -25, right: 25 }}
                          dragElastic={0.2}
                          dragTransition={{ bounceStiffness: 500, bounceDamping: 25 }}
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.92 }}
                          whileDrag={{ scale: 1.15, cursor: "grabbing" }}
                          onDragStart={() => sound.playClick()}
                          onDragEnd={() => sound.playKey()}
                          className={`px-2.5 py-1 rounded-md border font-code text-[0.65rem] font-medium cursor-grab select-none shadow-sm ${tag.color}`}
                        >
                          {tag.label}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator with Subtle Bounce */}
      <a
        href="#snapshot"
        onClick={() => sound.playClick()}
        className="mt-12 inline-flex flex-col items-center gap-1.5 text-[var(--text-dim)] hover:text-[var(--accent-neon)] transition-colors font-code text-[0.65rem] tracking-widest uppercase select-none"
      >
        <span>SCROLL TO EXPLORE ARCHITECTURES</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[var(--accent-neon)]" />
      </a>
    </section>
  );
};
