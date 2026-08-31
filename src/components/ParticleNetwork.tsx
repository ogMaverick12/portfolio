import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  baseAlpha: number;
  alpha: number;
}

interface ParticleNetworkProps {
  activeSection?: string;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const SECTION_COLOR_MAP: Record<string, { particle: RGBColor; line: RGBColor }> = {
  hero: {
    particle: { r: 255, g: 77, b: 38 }, // Cyber Red-Orange
    line: { r: 255, g: 110, b: 60 },
  },
  snapshot: {
    particle: { r: 255, g: 56, b: 35 }, // Vermillion Red
    line: { r: 255, g: 90, b: 60 },
  },
  projects: {
    particle: { r: 255, g: 107, b: 43 }, // Cyber Orange
    line: { r: 255, g: 140, b: 70 },
  },
  "cp-lab": {
    particle: { r: 230, g: 57, b: 70 }, // Crimson
    line: { r: 255, g: 85, b: 95 },
  },
  journey: {
    particle: { r: 245, g: 140, b: 30 }, // Warm Amber Orange
    line: { r: 245, g: 175, b: 65 },
  },
  education: {
    particle: { r: 251, g: 146, b: 60 }, // Solar Flame
    line: { r: 251, g: 170, b: 90 },
  },
  credentials: {
    particle: { r: 249, g: 115, b: 22 }, // Golden Ember
    line: { r: 249, g: 140, b: 50 },
  },
  manifesto: {
    particle: { r: 239, g: 68, b: 68 }, // Stark Crimson
    line: { r: 255, g: 95, b: 95 },
  },
  articles: {
    particle: { r: 244, g: 63, b: 94 }, // Coral Crimson
    line: { r: 244, g: 95, b: 120 },
  },
  terminal: {
    particle: { r: 255, g: 85, b: 0 }, // Phosphor Orange-Red
    line: { r: 255, g: 120, b: 40 },
  },
  contact: {
    particle: { r: 235, g: 65, b: 40 }, // Radiant Ember
    line: { r: 255, g: 95, b: 70 },
  },
};

export const ParticleNetwork: React.FC<ParticleNetworkProps> = ({
  activeSection = "hero",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeSectionRef = useRef<string>(activeSection);

  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;

    // Scroll Velocity Tracking
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    let scrollVelocity = 0; // px/ms
    let velocityMultiplier = 1;

    // Dynamic Color Interpolation State
    const defaultColor = SECTION_COLOR_MAP.hero;
    const currentParticleRGB = { ...defaultColor.particle };
    const currentLineRGB = { ...defaultColor.line };

    const particles: Particle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 20000), 60);

    for (let i = 0; i < particleCount; i++) {
      const bVx = (Math.random() - 0.5) * 0.45;
      const bVy = (Math.random() - 0.5) * 0.45;
      const bAlpha = Math.random() * 0.35 + 0.15;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: bVx,
        vy: bVy,
        baseVx: bVx,
        baseVy: bVy,
        size: Math.random() * 1.6 + 0.8,
        baseAlpha: bAlpha,
        alpha: bAlpha,
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    const handleScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastScrollTime, 8);
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;

      // Compute instant velocity (clamped)
      const instantVelocity = deltaY / dt; // px per millisecond
      scrollVelocity = Math.max(-12, Math.min(12, instantVelocity));

      lastScrollY = currentScrollY;
      lastScrollTime = now;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth interpolation towards target active section palette
      const targetColors = SECTION_COLOR_MAP[activeSectionRef.current] || SECTION_COLOR_MAP.hero;
      currentParticleRGB.r += (targetColors.particle.r - currentParticleRGB.r) * 0.04;
      currentParticleRGB.g += (targetColors.particle.g - currentParticleRGB.g) * 0.04;
      currentParticleRGB.b += (targetColors.particle.b - currentParticleRGB.b) * 0.04;

      currentLineRGB.r += (targetColors.line.r - currentLineRGB.r) * 0.04;
      currentLineRGB.g += (targetColors.line.g - currentLineRGB.g) * 0.04;
      currentLineRGB.b += (targetColors.line.b - currentLineRGB.b) * 0.04;

      const pR = Math.round(currentParticleRGB.r);
      const pG = Math.round(currentParticleRGB.g);
      const pB = Math.round(currentParticleRGB.b);

      const lR = Math.round(currentLineRGB.r);
      const lG = Math.round(currentLineRGB.g);
      const lB = Math.round(currentLineRGB.b);

      // Smooth decay of scroll velocity towards 0
      scrollVelocity *= 0.94;
      if (Math.abs(scrollVelocity) < 0.01) scrollVelocity = 0;

      // Target velocity multiplier based on absolute speed
      const targetMultiplier = 1 + Math.min(Math.abs(scrollVelocity) * 3.5, 6);
      velocityMultiplier += (targetMultiplier - velocityMultiplier) * 0.12;

      // Vertical bias from scrolling direction
      const scrollBiasY = scrollVelocity * -0.75;
      const connectionDistance = 120 + (velocityMultiplier - 1) * 8;

      // Draw particle connections and motion
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];

        // Accelerate particles based on scroll velocity and direction
        const activeVx = p1.baseVx * velocityMultiplier;
        const activeVy = p1.baseVy * velocityMultiplier + scrollBiasY;

        p1.x += activeVx;
        p1.y += activeVy;

        // Wrap or bounce edges
        if (p1.x < -20) p1.x = width + 20;
        if (p1.x > width + 20) p1.x = -20;
        if (p1.y < -20) p1.y = height + 20;
        if (p1.y > height + 20) p1.y = -20;

        // Mouse proximity repulsion
        const dxMouse = p1.x - mouseX;
        const dyMouse = p1.y - mouseY;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        if (distMouse < 120) {
          const force = (120 - distMouse) / 120;
          p1.x += (dxMouse / distMouse) * force * 1.6;
          p1.y += (dyMouse / distMouse) * force * 1.6;
        }

        // Density & Alpha shift with scroll speed
        const speedAlphaBonus = Math.min((velocityMultiplier - 1) * 0.08, 0.35);
        p1.alpha = Math.min(p1.baseAlpha + speedAlphaBonus, 0.85);

        // Draw particle node with dynamic section-based color
        ctx.beginPath();
        const drawSize = p1.size + (velocityMultiplier > 2 ? 0.4 : 0);
        ctx.arc(p1.x, p1.y, drawSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pR}, ${pG}, ${pB}, ${p1.alpha})`;
        ctx.fill();

        // Connect to neighbors
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            const lineAlpha = (1 - dist / connectionDistance) * (0.14 + speedAlphaBonus * 0.4);
            ctx.strokeStyle = `rgba(${lR}, ${lG}, ${lB}, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
      style={{ willChange: "transform" }}
    />
  );
};
