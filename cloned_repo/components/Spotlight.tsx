"use client";

import { useEffect, useRef } from "react";

export default function Spotlight() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const spotlight = spotlightRef.current;
    if (!cursor || !ring || !spotlight) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let isHovered = false;
    let isClicking = false;

    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;

      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;

      spotlight.style.left = `${mx}px`;
      spotlight.style.top = `${my}px`;
      spotlight.style.opacity = "1";
    };

    const handleMouseDown = () => {
      isClicking = true;
      ring.classList.add("clicking");
    };

    const handleMouseUp = () => {
      isClicking = false;
      ring.classList.remove("clicking");
    };

    let frameId: number;
    const updateRing = () => {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
      frameId = requestAnimationFrame(updateRing);
    };

    frameId = requestAnimationFrame(updateRing);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    // Setup hover listeners for interactive elements
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll(
        "a, button, input, textarea, select, .pill, .project-card, .stat-item, .manifesto-rule, .timeline-item, [role='button']"
      );

      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          cursor.classList.add("hovered");
          ring.classList.add("hovered");
        });
        el.addEventListener("mouseleave", () => {
          cursor.classList.remove("hovered");
          ring.classList.remove("hovered");
        });
      });
    };

    // Initial setup
    addHoverListeners();

    // Re-bind when DOM mutations happen (e.g. expanding articles)
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={spotlightRef} className="spotlight hidden md:block" />
      <div ref={cursorRef} className="cursor hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}
