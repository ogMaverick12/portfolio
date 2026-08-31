import React, { useState, useEffect, useRef } from "react";
import { sound } from "../lib/sound";

interface GlitchNameProps {
  name?: string;
  className?: string;
  startDelay?: number;
  active?: boolean;
}

const CYBER_SYMBOLS = [
  "0", "1", "X", "λ", "Ω", "β", "π", "∑", "∆", "§",
  "¥", "¢", "$", "#", "@", "%", "&", "µ", "◊", "ø",
  "ｦ", "ｱ", "ｳ", "ｴ", "ｵ", "ｶ", "ｷ", "ｹ", "ｺ", "ｻ",
  "ｼ", "ｽ", "ｾ", "ｿ", "ﾀ", "ﾂ", "ﾃ", "ﾅ", "ﾆ", "ﾇ",
  "<", ">", "/", "{", "}", "[", "]", "*", "+", "~"
];

type Phase = "waiting" | "typing" | "auto-glitching" | "ready";

export const GlitchName: React.FC<GlitchNameProps> = ({
  name = "Sreejit Pradhan",
  className = "",
  startDelay = 750,
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [phase, setPhase] = useState<Phase>("waiting");
  const [isHoverGlitching, setIsHoverGlitching] = useState<boolean>(false);

  const hoverIntervalRef = useRef<number | null>(null);

  // Initial Load: Wait for screen animations -> Typewriter -> Auto-Glitch -> Settled
  useEffect(() => {
    let isCancelled = false;
    let typeTimerId: number | null = null;
    let autoGlitchIntervalId: number | null = null;

    setDisplayedText("");
    setPhase("waiting");

    // 1. Initial delay so all hero cards & elements come up on the screen first
    const initialWaitTimer = window.setTimeout(() => {
      if (isCancelled) return;
      setPhase("typing");
      let currentLen = 0;

      // 2. Character-by-character typewriter loop
      const typeNextChar = () => {
        if (isCancelled) return;
        if (currentLen < name.length) {
          currentLen++;
          setDisplayedText(name.slice(0, currentLen));
          sound.playKey();
          typeTimerId = window.setTimeout(typeNextChar, 60);
        } else {
          // 3. Typing complete -> brief pause -> automatic glitch decode
          typeTimerId = window.setTimeout(() => {
            if (isCancelled) return;
            setPhase("auto-glitching");
            sound.playGlitch();

            let iteration = 0;
            const maxIterations = name.length * 3.2;

            autoGlitchIntervalId = window.setInterval(() => {
              if (isCancelled) return;
              iteration++;
              const resolvedCount = Math.floor(iteration / 3.0);

              const scrambled = name
                .split("")
                .map((char, index) => {
                  if (char === " ") return " ";
                  if (index < resolvedCount) {
                    return name[index];
                  }
                  return CYBER_SYMBOLS[Math.floor(Math.random() * CYBER_SYMBOLS.length)];
                })
                .join("");

              setDisplayedText(scrambled);

              if (iteration >= maxIterations || resolvedCount >= name.length) {
                if (autoGlitchIntervalId) clearInterval(autoGlitchIntervalId);
                setDisplayedText(name);
                setPhase("ready");
              }
            }, 38);
          }, 180);
        }
      };

      typeNextChar();
    }, startDelay);

    return () => {
      isCancelled = true;
      clearTimeout(initialWaitTimer);
      if (typeTimerId) clearTimeout(typeTimerId);
      if (autoGlitchIntervalId) clearInterval(autoGlitchIntervalId);
    };
  }, [name, startDelay]);

  // Subsequent hover: Only trigger the cyber glitch effect (no more typing)
  const handleMouseEnter = () => {
    if (phase !== "ready" || isHoverGlitching) return;
    setIsHoverGlitching(true);
    sound.playClick();
    sound.playGlitch();

    if (hoverIntervalRef.current) {
      clearInterval(hoverIntervalRef.current);
    }

    let iter = 0;
    const maxIter = name.length * 2.8;

    hoverIntervalRef.current = window.setInterval(() => {
      iter++;
      const resolved = Math.floor(iter / 2.6);

      const scrambled = name
        .split("")
        .map((char, idx) => {
          if (char === " ") return " ";
          if (idx < resolved) return name[idx];
          return CYBER_SYMBOLS[Math.floor(Math.random() * CYBER_SYMBOLS.length)];
        })
        .join("");

      setDisplayedText(scrambled);

      if (iter >= maxIter || resolved >= name.length) {
        if (hoverIntervalRef.current) {
          clearInterval(hoverIntervalRef.current);
          hoverIntervalRef.current = null;
        }
        setDisplayedText(name);
        setIsHoverGlitching(false);
      }
    }, 36);
  };

  const isGlitchingActive = phase === "auto-glitching" || isHoverGlitching;
  const isTypingActive = phase === "typing" || phase === "waiting";

  return (
    <span
      data-text={displayedText || (phase === "ready" ? name : "")}
      onMouseEnter={handleMouseEnter}
      className={`glitch-text-interactive inline-flex items-baseline relative font-editorial whitespace-nowrap font-normal select-none cursor-pointer transition-colors duration-200 ${
        isGlitchingActive ? "text-[var(--accent-neon)]" : ""
      } ${className}`}
      title="Sreejit Pradhan — Hover to trigger cyber glitch effect"
    >
      <span className="relative z-10 font-editorial tracking-tight inline-block whitespace-nowrap min-h-[1em]">
        {displayedText || (phase === "ready" ? name : "\u00A0")}
      </span>

      {/* Terminal blinking cursor during initial wait, typing, or auto-glitch */}
      {(isTypingActive || isGlitchingActive) && (
        <span className="inline-block w-1.5 sm:w-2.5 h-7 sm:h-12 ml-1.5 bg-[var(--accent-neon)] animate-pulse rounded-xs align-middle" />
      )}
    </span>
  );
};


