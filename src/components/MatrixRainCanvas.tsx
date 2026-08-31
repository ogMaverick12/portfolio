import React, { useEffect, useRef } from "react";
import { useThemeColors } from "../hooks/useThemeColors";

interface MatrixRainCanvasProps {
  enabled?: boolean;
}

// Standard matrix & algorithmic glyphs
const STANDARD_MATRIX_CHARS = [
  "0", "1", "0x", "λ", "∫", "Ω", "β", "π", "∑", "{", "}", "<", ">", "/", "*", "+", "=",
  "ｦ", "ｱ", "ｳ", "ｴ", "ｵ", "ｶ", "ｷ", "ｹ", "ｺ", "ｻ", "ｼ", "ｽ", "ｾ", "ｿ", "ﾀ", "ﾂ", "ﾃ", "ﾅ", "ﾆ", "ﾇ", "ﾈ", "ﾊ", "ﾋ", "ﾎ", "ﾏ", "ﾐ", "ﾑ", "ﾒ", "ﾓ", "ﾔ", "ﾕ", "ﾗ", "ﾘ", "ﾜ"
];

// Developer initials pool (S, R, P) - designed to appear at lower probability (~12%)
const INITIAL_CHARS = ["S", "R", "P"];
const INITIAL_PROBABILITY = 0.12; // Lower frequency than standard matrix characters

const MAX_POOL_SIZE = 160; // Pre-allocated object pool for zero GC pauses
const RESTRICTED_RADIUS = 200; // Exact 200px radius constraint around cursor
const GRID_SIZE = 48; // Synchronized 48px grid intersections
const FONT_SIZE = 13;

interface PooledDrop {
  active: boolean;
  x: number;
  originY: number;
  y: number;
  speed: number;
  length: number;
  chars: string[];
  isInitial: boolean[];
  maxFallDistance: number;
  opacity: number;
}

function getRandomCharacter(): { char: string; isInit: boolean } {
  if (Math.random() < INITIAL_PROBABILITY) {
    const char = INITIAL_CHARS[Math.floor(Math.random() * INITIAL_CHARS.length)];
    return { char, isInit: true };
  }
  const char = STANDARD_MATRIX_CHARS[Math.floor(Math.random() * STANDARD_MATRIX_CHARS.length)];
  return { char, isInit: false };
}

export const MatrixRainCanvas: React.FC<MatrixRainCanvasProps> = ({ enabled = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const themeColors = useThemeColors();
  const themeColorsRef = useRef(themeColors);

  useEffect(() => {
    themeColorsRef.current = themeColors;
  }, [themeColors]);

  useEffect(() => {
    if (!enabled) {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;
    let isHovering = false;
    let lastSpawnTime = 0;

    // 1. OBJECT POOLING ALLOCATION (Zero heap allocations during render loop)
    const pool: PooledDrop[] = Array.from({ length: MAX_POOL_SIZE }, () => ({
      active: false,
      x: 0,
      originY: 0,
      y: 0,
      speed: 2.0,
      length: 7,
      chars: Array.from({ length: 12 }, () => "0"),
      isInitial: Array.from({ length: 12 }, () => false),
      maxFallDistance: 80,
      opacity: 0,
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
      isHovering = true;
    };

    const handleMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
      isHovering = false;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    // Grab available inactive drop from pre-allocated object pool
    const acquireDropFromPool = (): PooledDrop | null => {
      for (let i = 0; i < MAX_POOL_SIZE; i++) {
        if (!pool[i].active) {
          return pool[i];
        }
      }
      return null;
    };

    // Spawn drops strictly on-demand at grid line intersections within 200px radius
    const spawnDropsFromGridIntersections = (now: number) => {
      if (!isHovering || mouseX < 0 || mouseY < 0) return;
      if (now - lastSpawnTime < 32) return; // Throttled spawn frequency
      lastSpawnTime = now;

      const minCol = Math.floor((mouseX - RESTRICTED_RADIUS) / GRID_SIZE);
      const maxCol = Math.ceil((mouseX + RESTRICTED_RADIUS) / GRID_SIZE);
      const minRow = Math.floor((mouseY - RESTRICTED_RADIUS) / GRID_SIZE);
      const maxRow = Math.ceil((mouseY + RESTRICTED_RADIUS) / GRID_SIZE);

      for (let c = minCol; c <= maxCol; c++) {
        for (let r = minRow; r <= maxRow; r++) {
          const gridX = c * GRID_SIZE;
          const gridY = r * GRID_SIZE;
          const distToMouse = Math.hypot(gridX - mouseX, gridY - mouseY);

          // Strictly within 200px radius
          if (
            distToMouse <= RESTRICTED_RADIUS &&
            gridX >= 0 &&
            gridX <= width &&
            gridY >= 0 &&
            gridY <= height &&
            Math.random() > 0.81
          ) {
            // Check if active drop is already close to this intersection
            let alreadyPopulated = false;
            for (let i = 0; i < MAX_POOL_SIZE; i++) {
              if (
                pool[i].active &&
                Math.abs(pool[i].x - gridX) < 4 &&
                Math.abs(pool[i].originY - gridY) < 20
              ) {
                alreadyPopulated = true;
                break;
              }
            }
            if (alreadyPopulated) continue;

            const drop = acquireDropFromPool();
            if (!drop) return;

            const dropLength = Math.floor(Math.random() * 5) + 5; // 5 to 9 characters

            drop.active = true;
            drop.x = gridX;
            drop.originY = gridY;
            drop.y = gridY;
            drop.speed = 1.8 + Math.random() * 1.8;
            drop.length = dropLength;
            drop.maxFallDistance = 70 + Math.random() * 90;
            drop.opacity = 1.0;

            // Populate character sequence using probability-based initial distribution
            for (let j = 0; j < dropLength; j++) {
              const { char, isInit } = getRandomCharacter();
              drop.chars[j] = char;
              drop.isInitial[j] = isInit;
            }
          }
        }
      }
    };

    // RequestAnimationFrame render loop
    const render = (timestamp: number) => {
      // Smooth responsive cursor position interpolation
      mouseX += (targetMouseX - mouseX) * 0.25;
      mouseY += (targetMouseY - mouseY) * 0.25;

      ctx.clearRect(0, 0, width, height);

      // Trigger drops strictly from hovered grid line intersections
      spawnDropsFromGridIntersections(timestamp);

      const colors = themeColorsRef.current;
      ctx.font = `bold ${FONT_SIZE}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      // Render active drops from pool
      for (let i = 0; i < MAX_POOL_SIZE; i++) {
        const drop = pool[i];
        if (!drop.active) continue;

        const fallenDist = drop.y - drop.originY;
        const distFromCursor = Math.hypot(drop.x - mouseX, drop.y - mouseY);

        // Strict 200px radius constraint check
        if (distFromCursor > RESTRICTED_RADIUS * 1.15 || fallenDist >= drop.maxFallDistance || drop.y > height) {
          drop.active = false;
          continue;
        }

        const proximityFactor = Math.max(0, 1 - distFromCursor / RESTRICTED_RADIUS);
        const distanceFade = Math.max(0, 1 - fallenDist / drop.maxFallDistance);
        drop.opacity = proximityFactor * distanceFade;

        if (drop.opacity <= 0.02) {
          drop.active = false;
          continue;
        }

        // Draw character cascade originating from intersection
        for (let j = 0; j < drop.length; j++) {
          const charY = drop.y - j * FONT_SIZE;
          if (charY < drop.originY - 2) continue;

          // Check individual character distance to mouse cursor for strict 200px boundary
          const charDistToMouse = Math.hypot(drop.x - mouseX, charY - mouseY);
          if (charDistToMouse > RESTRICTED_RADIUS) continue;

          // Occasional random morphing adhering to probability distribution
          if (Math.random() > 0.95 && !drop.isInitial[j]) {
            const { char, isInit } = getRandomCharacter();
            drop.chars[j] = char;
            drop.isInitial[j] = isInit;
          }

          const char = drop.chars[j] || "0";
          const isLeadingHead = j === 0;
          const isInitialChar = drop.isInitial[j];
          const charFade = Math.pow((drop.length - j) / drop.length, 1.15) * drop.opacity;

          if (isLeadingHead) {
            // Bright stream head
            ctx.fillStyle = colors.head || "#FFFFFF";
            ctx.shadowColor = colors.glow;
            ctx.shadowBlur = 10;
          } else if (isInitialChar) {
            // Developer Initials (S, R, P) illuminated with glowing theme accent
            ctx.fillStyle = colors.accent;
            ctx.shadowColor = colors.glow;
            ctx.shadowBlur = 8;
          } else {
            // Standard theme accent matrix glyph
            ctx.fillStyle = colors.accent;
            ctx.shadowColor = colors.glow;
            ctx.shadowBlur = 3;
          }

          ctx.globalAlpha = Math.min(1, Math.max(0, charFade));
          // Align directly at grid line
          ctx.fillText(char, drop.x - FONT_SIZE * 0.35, charY);
        }

        // Advance drop position along grid line
        drop.y += drop.speed;
      }

      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [enabled]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1] select-none"
      style={{
        background: "transparent",
        willChange: "transform",
      }}
    />
  );
};
