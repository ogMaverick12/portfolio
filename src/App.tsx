import React, { useState, useEffect, useRef } from "react";
import { CustomCursor } from "./components/CustomCursor";
import { CyberGridCanvas } from "./components/CyberGridCanvas";
import { ParticleNetwork } from "./components/ParticleNetwork";
import { ScrollProgressIndicator } from "./components/ScrollProgressIndicator";
import { MatrixRainCanvas } from "./components/MatrixRainCanvas";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { QuickSnapshot } from "./components/QuickSnapshot";
import { FlagshipProjects } from "./components/FlagshipProjects";
import { CPAlgorithmsLab } from "./components/CPAlgorithmsLab";
import { JourneyTimeline } from "./components/JourneyTimeline";
import { EducationSection } from "./components/EducationSection";
import { AchievementsBento } from "./components/AchievementsBento";
import { ManifestoSection } from "./components/ManifestoSection";
import { BlogSection } from "./components/BlogSection";
import { TerminalSection } from "./components/TerminalSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";
import {
  initSectionFadeUpObserver,
  triggerDocumentTitleGlitch,
} from "./lib/animeEffects";

export default function App() {
  const [activeSection, setActiveSection] = useState("hero");
  const [matrixRainEnabled, setMatrixRainEnabled] = useState(true);
  const prevSectionRef = useRef("hero");

  useEffect(() => {
    // 0. Ensure page always starts at the top (Hero) upon load or refresh
    if (typeof window !== "undefined") {
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
    }

    // 1. Initialize global Anime.js fade-up reveal on all editorial sections
    const cleanupFadeUp = initSectionFadeUpObserver();

    // Initialize document title
    triggerDocumentTitleGlitch("hero", 500);

    // Toggle Matrix Rain custom event listener
    const handleToggleMatrix = () => {
      setMatrixRainEnabled((prev) => !prev);
    };
    window.addEventListener("toggle-matrix-rain", handleToggleMatrix);

    // 2. Active section intersection tracking for navbar indicators & title scramble
    const sections = [
      "hero",
      "snapshot",
      "projects",
      "cp-lab",
      "journey",
      "education",
      "credentials",
      "manifesto",
      "articles",
      "terminal",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const nextId = entry.target.id;
            setActiveSection((prev) => {
              if (prev !== nextId) {
                triggerDocumentTitleGlitch(nextId);
                prevSectionRef.current = nextId;
              }
              return nextId;
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      cleanupFadeUp();
      observer.disconnect();
      window.removeEventListener("toggle-matrix-rain", handleToggleMatrix);
    };
  }, []);

  const handleOpenTerminal = () => {
    const termEl = document.getElementById("terminal");
    if (termEl) {
      termEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans cyber-grid selection:bg-[var(--accent-neon)]/30 selection:text-[var(--accent-neon)]">
      {/* Interactive Custom Anime.js Cursor */}
      <CustomCursor />

      {/* Real-time Reactive Cyber Grid Canvas with Mouse Illumination */}
      <CyberGridCanvas />

      {/* Full-screen Background Matrix-style Code Rain with Hover Cursor Shower */}
      <MatrixRainCanvas enabled={matrixRainEnabled} />

      {/* Interactive Particle Network Background responding to Scroll Velocity & Section Colors */}
      <ParticleNetwork activeSection={activeSection} />

      {/* SVG Path Drawn Reading Scroll Progress Indicator */}
      <ScrollProgressIndicator />

      {/* Floating Navigation Header */}
      <Navigation
        activeSection={activeSection}
        onOpenTerminalModal={handleOpenTerminal}
      />

      {/* Main Content Layout */}
      <main className="relative z-10">
        <Hero />
        <QuickSnapshot />
        <FlagshipProjects />
        <CPAlgorithmsLab />
        <JourneyTimeline />
        <EducationSection />
        <AchievementsBento />
        <ManifestoSection />
        <BlogSection />
        <TerminalSection
          matrixRainEnabled={matrixRainEnabled}
          onToggleMatrixRain={() => setMatrixRainEnabled((prev) => !prev)}
        />
        <ContactSection />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
