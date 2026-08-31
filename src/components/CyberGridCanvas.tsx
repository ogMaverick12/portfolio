import React, { useEffect, useRef } from "react";
import { useThemeColors } from "../hooks/useThemeColors";

export const CyberGridCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeColors = useThemeColors();
  const themeColorsRef = useRef(themeColors);

  useEffect(() => {
    themeColorsRef.current = themeColors;
  }, [themeColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = -1000;
    let mouseY = -1000;
    let targetMouseX = -1000;
    let targetMouseY = -1000;

    const gridSize = 48; // Matches editorial 48px grid

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = e.clientX;
      targetMouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      targetMouseX = -1000;
      targetMouseY = -1000;
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.15;
      mouseY += (targetMouseY - mouseY) * 0.15;

      ctx.clearRect(0, 0, width, height);

      const theme = themeColorsRef.current;

      // 1. Subtle Ambient Background Grid Lines
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = `rgba(${theme.rgb}, 0.035)`;

      // Ambient Vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Ambient Horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Mouse Reactive Grid Illumination matching theme
      if (mouseX > -500 && mouseY > -500) {
        const radius = 220; // illumination radius

        const startX = Math.max(0, Math.floor((mouseX - radius) / gridSize) * gridSize);
        const endX = Math.min(width, Math.ceil((mouseX + radius) / gridSize) * gridSize);
        const startY = Math.max(0, Math.floor((mouseY - radius) / gridSize) * gridSize);
        const endY = Math.min(height, Math.ceil((mouseY + radius) / gridSize) * gridSize);

        // Vertical lines near cursor
        for (let x = startX; x <= endX; x += gridSize) {
          const distX = Math.abs(x - mouseX);
          if (distX < radius) {
            const yTop = Math.max(0, mouseY - Math.sqrt(radius * radius - distX * distX));
            const yBottom = Math.min(height, mouseY + Math.sqrt(radius * radius - distX * distX));

            const grad = ctx.createLinearGradient(x, yTop, x, yBottom);
            grad.addColorStop(0, `rgba(${theme.rgb}, 0)`);
            grad.addColorStop(0.5, `rgba(${theme.rgb}, ${(1 - distX / radius) * 0.45})`);
            grad.addColorStop(1, `rgba(${theme.rgb}, 0)`);

            ctx.beginPath();
            ctx.moveTo(x, yTop);
            ctx.lineTo(x, yBottom);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Horizontal lines near cursor
        for (let y = startY; y <= endY; y += gridSize) {
          const distY = Math.abs(y - mouseY);
          if (distY < radius) {
            const xLeft = Math.max(0, mouseX - Math.sqrt(radius * radius - distY * distY));
            const xRight = Math.min(width, mouseX + Math.sqrt(radius * radius - distY * distY));

            const grad = ctx.createLinearGradient(xLeft, y, xRight, y);
            grad.addColorStop(0, `rgba(${theme.rgb}, 0)`);
            grad.addColorStop(0.5, `rgba(${theme.rgb}, ${(1 - distY / radius) * 0.45})`);
            grad.addColorStop(1, `rgba(${theme.rgb}, 0)`);

            ctx.beginPath();
            ctx.moveTo(xLeft, y);
            ctx.lineTo(xRight, y);
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }

        // Intersecting nodes glow
        for (let x = startX; x <= endX; x += gridSize) {
          for (let y = startY; y <= endY; y += gridSize) {
            const dist = Math.hypot(x - mouseX, y - mouseY);
            if (dist < radius) {
              const alpha = Math.pow(1 - dist / radius, 1.8) * 0.6;
              ctx.beginPath();
              ctx.arc(x, y, 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${theme.rgb}, ${alpha})`;
              ctx.shadowColor = `rgba(${theme.rgb}, 0.75)`;
              ctx.shadowBlur = 6;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ willChange: "transform, opacity" }}
    />
  );
};


