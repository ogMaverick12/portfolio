import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { sound } from "../lib/sound";
import {
  triggerThemeTransition,
  attachMagneticEffect,
  attachMagneticNavLinkEffect,
} from "../lib/animeEffects";
import {
  Terminal as TerminalIcon,
  Volume2,
  VolumeX,
  Palette,
  Menu,
  X,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface NavigationProps {
  onOpenTerminalModal?: () => void;
  activeSection: string;
}

const MagneticNavLink: React.FC<{
  link: { id: string; label: string };
  isActive: boolean;
}> = ({ link, isActive }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!linkRef.current) return;
    const cleanup = attachMagneticNavLinkEffect(linkRef.current, textRef.current, 12);
    return cleanup;
  }, []);

  return (
    <a
      ref={linkRef}
      href={`#${link.id}`}
      onMouseEnter={() => sound.playHover()}
      onClick={() => sound.playClick()}
      className={`px-3.5 py-1.5 rounded-lg transition-colors duration-200 relative inline-block group/navlink select-none ${
        isActive
          ? "text-[var(--accent-neon)] font-semibold"
          : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-white/5"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeNavIndicator"
          className="absolute inset-0 bg-[var(--accent-neon)]/10 border border-[var(--accent-neon)]/30 rounded-lg -z-0"
          transition={{ type: "spring", stiffness: 450, damping: 32 }}
        />
      )}
      <span ref={textRef} className="relative z-10 inline-block pointer-events-none transition-colors">
        {link.label}
      </span>
      {isActive && (
        <motion.span
          layoutId="activeNavDot"
          className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[2px] bg-[var(--accent-neon)] rounded-full shadow-[0_0_8px_var(--glow-color)]"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </a>
  );
};

export const Navigation: React.FC<NavigationProps> = ({
  onOpenTerminalModal,
  activeSection,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.getSoundEnabled());
  const [currentTheme, setCurrentTheme] = useState("default");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [istTime, setIstTime] = useState("");

  const brandRef = useRef<HTMLAnchorElement>(null);
  const terminalBtnRef = useRef<HTMLButtonElement>(null);
  const themeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (brandRef.current) attachMagneticEffect(brandRef.current, 8);
    if (terminalBtnRef.current) attachMagneticEffect(terminalBtnRef.current, 8);
    if (themeBtnRef.current) attachMagneticEffect(themeBtnRef.current, 8);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        };
        setIstTime(now.toLocaleTimeString("en-GB", options) + " IST");
      } catch {
        setIstTime("18:42 IST");
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(timer);
    };
  }, []);

  const handleSoundToggle = () => {
    const enabled = sound.toggleMute();
    setSoundEnabled(enabled);
  };

  const cycleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playClick();
    const themes = ["default", "cyber-crimson", "cyber-amber", "cyber-emerald"];
    const themeColors: Record<string, string> = {
      default: "#FF4D26",
      "cyber-crimson": "#E63946",
      "cyber-amber": "#F59E0B",
      "cyber-emerald": "#10B981",
    };

    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    setCurrentTheme(nextTheme);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    // Trigger Anime.js radial wipe transition
    triggerThemeTransition(clickX, clickY, themeColors[nextTheme] || "#F27D26");

    if (nextTheme === "default") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", nextTheme);
    }
  };

  const navLinks = [
    { id: "projects", label: "Flagship Systems" },
    { id: "cp-lab", label: "DSA & CP Lab" },
    { id: "journey", label: "Evolution" },
    { id: "credentials", label: "Badges & Certs" },
    { id: "manifesto", label: "Manifesto" },
    { id: "articles", label: "Writing" },
    { id: "contact", label: "Connect" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-3 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-2xl transition-all duration-300 ${
          isScrolled
            ? "glass-panel bg-[#09090bcc]/90 shadow-2xl border-white/10"
            : "bg-transparent border border-transparent"
        }`}
      >
        {/* Brand / Name */}
        <a
          ref={brandRef}
          href="#hero"
          onClick={() => sound.playClick()}
          className="flex items-center gap-3 group interactive-hover"
        >
          <div className="relative w-8 h-8 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] group-hover:border-[var(--accent-neon)] transition-colors flex items-center justify-center font-code text-xs font-bold text-[var(--accent-neon)]">
            <span>SP</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--accent-neon)] animate-ping opacity-75" />
          </div>
          <div className="flex flex-col">
            <span className="font-editorial text-sm font-semibold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors">
              Sreejit Pradhan
            </span>
            <span className="font-code text-[0.6rem] text-[var(--text-dim)] uppercase tracking-widest hidden sm:inline">
              16 Y/O · {istTime}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links with Anime.js Magnetic Pull */}
        <nav className="hidden lg:flex items-center gap-1 font-code text-[0.72rem] tracking-wider uppercase">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <MagneticNavLink
                key={link.id}
                link={link}
                isActive={isActive}
              />
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Terminal Trigger */}
          <motion.button
            ref={terminalBtnRef}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => {
              sound.playClick();
              if (onOpenTerminalModal) onOpenTerminalModal();
              else {
                document.getElementById("terminal")?.scrollIntoView({ behavior: "smooth" });
              }
            }}
            onMouseEnter={() => sound.playHover()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] font-code text-[0.72rem] text-[var(--text-primary)] hover:text-[var(--accent-neon)] transition-colors group"
            title="Open Interactive Edge Terminal (Ctrl+K)"
          >
            <TerminalIcon className="w-3.5 h-3.5 text-[var(--accent-neon)] group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">Terminal</span>
          </motion.button>

          {/* Theme Palette Switcher */}
          <motion.button
            ref={themeBtnRef}
            whileHover={{ scale: 1.08, rotate: 15 }}
            whileTap={{ scale: 0.92, rotate: -15 }}
            onClick={cycleTheme}
            onMouseEnter={() => sound.playHover()}
            className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] text-[var(--text-muted)] hover:text-[var(--accent-neon)] transition-colors"
            title={`Cycle Cyber Theme (Current: ${currentTheme})`}
          >
            <Palette className="w-3.5 h-3.5" />
          </motion.button>

          {/* Audio Synthesizer Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSoundToggle}
            onMouseEnter={() => sound.playHover()}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? "bg-[var(--accent-neon)]/10 border-[var(--accent-neon)]/40 text-[var(--accent-neon)]"
                : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-dim)] hover:text-[var(--text-muted)]"
            }`}
            title={soundEnabled ? "Mute Web Audio SFX" : "Enable Cyber SFX"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </motion.button>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => {
              sound.playClick();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="lg:hidden p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)]"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="lg:hidden mt-2 p-4 rounded-2xl glass-panel bg-[#0d0d11]/95 border-white/10 shadow-2xl flex flex-col gap-2 font-code text-sm"
          >
            {navLinks.map((link, idx) => (
              <motion.a
                key={link.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                href={`#${link.id}`}
                onClick={() => {
                  sound.playClick();
                  setIsMobileMenuOpen(false);
                }}
                className="px-4 py-2.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-neon)] hover:bg-white/5 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-[var(--accent-neon)] opacity-60">→</span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
