import React from "react";
import { sound } from "../lib/sound";
import { ArrowUp, Heart, Terminal, Shield } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 px-4 sm:px-8 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] font-code text-xs relative z-10">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:items-start items-center gap-1">
          <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold">
            <span className="w-2 h-2 rounded-full bg-[var(--accent-neon)] animate-pulse" />
            <span>Sreejit Pradhan · Systems Portfolio</span>
          </div>
          <p className="text-[var(--text-dim)] text-[0.68rem]">
            Built with React, Vite, Tailwind, Anime.js v4 & Google GenAI · Siliguri Node
          </p>
        </div>

        <div className="flex items-center gap-4 text-[var(--text-muted)] text-[0.72rem]">
          <a
            href="https://github.com/ogMaverick12"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-neon)] transition-colors"
          >
            GitHub
          </a>
          <a
            href="https://dev.to/sreejit_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-neon)] transition-colors"
          >
            Dev.to
          </a>
          <a
            href="https://www.linkedin.com/in/sreejit-pradhan-b27b19401"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[var(--accent-neon)] transition-colors"
          >
            LinkedIn
          </a>

          <button
            onClick={scrollToTop}
            className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] text-[var(--text-primary)] hover:text-[var(--accent-neon)] transition-all flex items-center gap-1 ml-2"
            title="Scroll to Top"
          >
            <span>Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
