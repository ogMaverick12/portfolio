import { animate, stagger } from "animejs";

/**
 * Creates an interactive radial ripple / color wipe expansion for theme switching
 */
export function triggerThemeTransition(
  originX: number = window.innerWidth / 2,
  originY: number = 40,
  accentColor: string = "#F27D26"
) {
  // Create an overlay ripple DOM node
  const wipeEl = document.createElement("div");
  wipeEl.className = "theme-transition-wipe";
  wipeEl.style.position = "fixed";
  wipeEl.style.top = `${originY}px`;
  wipeEl.style.left = `${originX}px`;
  wipeEl.style.width = "10px";
  wipeEl.style.height = "10px";
  wipeEl.style.borderRadius = "50%";
  wipeEl.style.background = `radial-gradient(circle, ${accentColor} 0%, transparent 75%)`;
  wipeEl.style.opacity = "0.7";
  wipeEl.style.pointerEvents = "none";
  wipeEl.style.zIndex = "9999";
  wipeEl.style.transform = "translate(-50%, -50%) scale(1)";
  wipeEl.style.mixBlendMode = "screen";
  wipeEl.style.willChange = "transform, opacity";

  document.body.appendChild(wipeEl);

  const maxDimension = Math.max(window.innerWidth, window.innerHeight) * 2.8;

  animate(wipeEl, {
    scale: [1, maxDimension / 10],
    opacity: [0.75, 0],
    duration: 650,
    ease: "outExpo",
    onComplete: () => {
      if (wipeEl.parentNode) {
        wipeEl.parentNode.removeChild(wipeEl);
      }
    },
  });

  // Also slightly pulse main background
  animate("body", {
    filter: ["brightness(1.12)", "brightness(1)"],
    duration: 400,
    ease: "outQuad",
  });
}

/**
 * Text scramble effect simulating data decryption
 */
export function scrambleText(
  element: HTMLElement,
  targetText: string,
  duration: number = 1200,
  chars: string = "0101XYZ_<>#%*@&~[]{}+="
) {
  let startTime: number | null = null;
  const originalLength = targetText.length;

  const update = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const solvedCount = Math.floor(progress * originalLength);

    let output = "";
    for (let i = 0; i < originalLength; i++) {
      if (targetText[i] === " " || targetText[i] === "\n") {
        output += targetText[i];
      } else if (i < solvedCount) {
        output += targetText[i];
      } else {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        output += randomChar;
      }
    }

    element.textContent = output;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = targetText;
    }
  };

  requestAnimationFrame(update);
}

/**
 * Mouse-follow 3D parallax effect on interactive cards
 */
export function attachCardParallax(cardEl: HTMLElement, maxMove: number = 10, maxTilt: number = 6) {
  let isHovered = false;
  cardEl.style.willChange = "transform";

  const onMouseMove = (e: MouseEvent) => {
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const moveX = ((x - centerX) / centerX) * maxMove;
    const moveY = ((y - centerY) / centerY) * maxMove;
    const tiltX = ((y - centerY) / centerY) * -maxTilt;
    const tiltY = ((x - centerX) / centerX) * maxTilt;

    animate(cardEl, {
      translateX: moveX,
      translateY: moveY,
      rotateX: tiltX,
      rotateY: tiltY,
      transformPerspective: 1000,
      duration: 160,
      ease: "outQuad",
    });
  };

  const onMouseEnter = () => {
    isHovered = true;
    animate(cardEl, {
      scale: 1.015,
      duration: 250,
      ease: "outQuad",
    });
  };

  const onMouseLeave = () => {
    isHovered = false;
    animate(cardEl, {
      translateX: 0,
      translateY: 0,
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 700,
      ease: "outElastic(1, 0.45)",
    });
  };

  cardEl.addEventListener("mouseenter", onMouseEnter);
  cardEl.addEventListener("mousemove", onMouseMove);
  cardEl.addEventListener("mouseleave", onMouseLeave);

  return () => {
    cardEl.removeEventListener("mouseenter", onMouseEnter);
    cardEl.removeEventListener("mousemove", onMouseMove);
    cardEl.removeEventListener("mouseleave", onMouseLeave);
  };
}

/**
 * Attaches a magnetic spring pull to a button or interactive element
 */
export function attachMagneticEffect(el: HTMLElement, maxDistance: number = 18) {
  let isHovered = false;
  el.style.willChange = "transform";

  const onMouseMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = (e.clientX - centerX) * 0.35;
    const distY = (e.clientY - centerY) * 0.35;

    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, distX));
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, distY));

    animate(el, {
      translateX: clampedX,
      translateY: clampedY,
      duration: 250,
      ease: "outQuad",
    });
  };

  const onMouseEnter = () => {
    isHovered = true;
  };

  const onMouseLeave = () => {
    isHovered = false;
    animate(el, {
      translateX: 0,
      translateY: 0,
      scale: 1,
      duration: 600,
      ease: "outElastic(1, 0.4)",
    });
  };

  const onMouseDown = () => {
    animate(el, {
      scale: 0.94,
      duration: 120,
      ease: "outQuad",
    });
  };

  const onMouseUp = () => {
    animate(el, {
      scale: isHovered ? 1.04 : 1,
      duration: 350,
      ease: "outElastic(1, 0.4)",
    });
  };

  el.addEventListener("mouseenter", onMouseEnter);
  el.addEventListener("mousemove", onMouseMove);
  el.addEventListener("mouseleave", onMouseLeave);
  el.addEventListener("mousedown", onMouseDown);
  el.addEventListener("mouseup", onMouseUp);

  return () => {
    el.removeEventListener("mouseenter", onMouseEnter);
    el.removeEventListener("mousemove", onMouseMove);
    el.removeEventListener("mouseleave", onMouseLeave);
    el.removeEventListener("mousedown", onMouseDown);
    el.removeEventListener("mouseup", onMouseUp);
  };
}

/**
 * Attaches a magnetic spring pull to navigation links with layered text translation
 */
export function attachMagneticNavLinkEffect(
  containerEl: HTMLElement,
  textEl: HTMLElement | null,
  maxOffset: number = 14
) {
  let isHovered = false;
  containerEl.style.willChange = "transform";
  if (textEl) textEl.style.willChange = "transform";

  const onMouseMove = (e: MouseEvent) => {
    const rect = containerEl.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const pullX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * 0.38));
    const pullY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * 0.38));

    // Animate container subtly
    animate(containerEl, {
      translateX: pullX * 0.6,
      translateY: pullY * 0.6,
      duration: 200,
      ease: "outQuad",
    });

    // Animate inner text span with higher magnetic attraction
    if (textEl) {
      animate(textEl, {
        translateX: pullX * 1.1,
        translateY: pullY * 1.1,
        duration: 180,
        ease: "outQuad",
      });
    }
  };

  const onMouseEnter = () => {
    isHovered = true;
  };

  const onMouseLeave = () => {
    isHovered = false;
    // Spring release on leave with Anime.js elastic easing
    animate(containerEl, {
      translateX: 0,
      translateY: 0,
      scale: 1,
      duration: 650,
      ease: "outElastic(1.2, 0.42)",
    });

    if (textEl) {
      animate(textEl, {
        translateX: 0,
        translateY: 0,
        scale: 1,
        duration: 750,
        ease: "outElastic(1.4, 0.38)",
      });
    }
  };

  containerEl.addEventListener("mouseenter", onMouseEnter);
  containerEl.addEventListener("mousemove", onMouseMove);
  containerEl.addEventListener("mouseleave", onMouseLeave);

  return () => {
    containerEl.removeEventListener("mouseenter", onMouseEnter);
    containerEl.removeEventListener("mousemove", onMouseMove);
    containerEl.removeEventListener("mouseleave", onMouseLeave);
  };
}

/**
 * 3D Tilt effect on interactive cards using Anime.js
 */
export function attach3DTilt(cardEl: HTMLElement, maxTiltDeg: number = 8) {
  cardEl.style.willChange = "transform";
  const onMouseMove = (e: MouseEvent) => {
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTiltDeg;
    const rotateY = ((x - centerX) / centerX) * maxTiltDeg;

    animate(cardEl, {
      rotateX: rotateX,
      rotateY: rotateY,
      transformPerspective: 1000,
      duration: 200,
      ease: "outQuad",
    });
  };

  const onMouseEnter = () => {
    animate(cardEl, {
      scale: 1.02,
      duration: 300,
      ease: "outQuad",
    });
  };

  const onMouseLeave = () => {
    animate(cardEl, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 800,
      ease: "outElastic(1, 0.5)",
    });
  };

  cardEl.addEventListener("mouseenter", onMouseEnter);
  cardEl.addEventListener("mousemove", onMouseMove);
  cardEl.addEventListener("mouseleave", onMouseLeave);

  return () => {
    cardEl.removeEventListener("mouseenter", onMouseEnter);
    cardEl.removeEventListener("mousemove", onMouseMove);
    cardEl.removeEventListener("mouseleave", onMouseLeave);
  };
}

/**
 * Anime.js-driven particle explosion effect for actions and triggers
 */
export function triggerParticleExplosion(
  originX: number,
  originY: number,
  particleCount: number = 36,
  colors: string[] = ["#F27D26", "#10B981", "#E07A5F", "#FBBF24", "#FFFFFF"]
) {
  const container = document.createElement("div");
  container.className = "anime-explosion-container";
  container.style.position = "fixed";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "100vw";
  container.style.height = "100vh";
  container.style.pointerEvents = "none";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  const particles: HTMLElement[] = [];

  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement("div");
    const size = Math.random() * 6 + 4;
    const isSquare = Math.random() > 0.5;
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.position = "absolute";
    p.style.left = `${originX}px`;
    p.style.top = `${originY}px`;
    p.style.width = `${size}px`;
    p.style.height = `${isSquare ? size * 1.5 : size}px`;
    p.style.borderRadius = isSquare ? "1px" : "50%";
    p.style.backgroundColor = color;
    p.style.boxShadow = `0 0 ${size * 2}px ${color}`;
    p.style.transform = "translate(-50%, -50%) scale(1)";
    p.style.opacity = "1";
    p.style.willChange = "transform, opacity";

    container.appendChild(p);
    particles.push(p);

    const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
    const distance = Math.random() * 140 + 70;
    const destX = Math.cos(angle) * distance;
    const destY = Math.sin(angle) * distance + (Math.random() * 30); // slight gravity bias
    const rot = (Math.random() - 0.5) * 720;

    animate(p, {
      translateX: [0, destX],
      translateY: [0, destY],
      scale: [1, Math.random() * 0.4 + 0.2],
      rotateZ: [0, rot],
      opacity: [1, 0],
      duration: Math.random() * 400 + 700,
      ease: "outExpo",
    });
  }

  // Auto clean up after animation
  setTimeout(() => {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }, 1200);
}

/**
 * Viewport reveal-stagger and horizontal parallax scroll animation observer for main sections using Anime.js
 * Animates headers, cards, and grid children smoothly with depth-aware horizontal shift upon entering the viewport
 */
export function initSectionFadeUpObserver() {
  const sections = Array.from(document.querySelectorAll("main > section")) as HTMLElement[];
  if (!sections.length) return () => {};

  const revealedSections = new Set<string>();

  // 1. Reveal observer with alternating horizontal parallax entry
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        const id = target.id;
        if (id === "hero") {
          target.style.opacity = "1";
          target.style.transform = "none";
          return;
        }

        if (entry.isIntersecting && !revealedSections.has(id)) {
          revealedSections.add(id);
          target.style.willChange = "transform, opacity";

          // Calculate alternating horizontal entry shift based on section index
          const sectionIdx = sections.indexOf(target);
          const horizontalOffset = sectionIdx % 2 === 0 ? -22 : 22;

          // Trigger section-level smooth depth-aware entrance
          animate(target, {
            opacity: [0.2, 1],
            translateY: [22, 0],
            translateX: [horizontalOffset, 0],
            duration: 600,
            ease: "outCubic",
            onComplete: () => {
              target.style.opacity = "1";
              target.style.transform = "none";
              target.style.willChange = "auto";
            },
          });
        }
      });
    },
    { threshold: 0.02, rootMargin: "0px 0px 100px 0px" }
  );

  sections.forEach((sec) => {
    if (sec.id !== "hero") {
      sec.style.willChange = "transform, opacity";
      observer.observe(sec);
    }
  });

  // 2. Subtle continuous horizontal parallax depth shift during scroll
  let ticking = false;
  const onScrollParallax = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const viewportHeight = window.innerHeight;
        const scrollY = window.scrollY;

        sections.forEach((sec, idx) => {
          if (sec.id === "hero") return;
          const rect = sec.getBoundingClientRect();

          // Only compute parallax for sections in or near the viewport
          if (rect.top < viewportHeight && rect.bottom > 0) {
            const centerY = rect.top + rect.height / 2;
            const progress = (centerY - viewportHeight / 2) / (viewportHeight / 2);
            const clampedProgress = Math.max(-1, Math.min(1, progress));
            
            // Alternating subtle parallax factor (max ±8px)
            const direction = idx % 2 === 0 ? -1 : 1;
            const parallaxX = clampedProgress * 7 * direction;

            // Target the internal max-w container to prevent horizontal page overflow
            const innerContainer = sec.querySelector(".max-w-6xl, .max-w-5xl, .max-w-7xl") as HTMLElement | null;
            if (innerContainer) {
              innerContainer.style.transform = `translate3d(${parallaxX.toFixed(2)}px, 0, 0)`;
              innerContainer.style.willChange = "transform";
            }
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScrollParallax, { passive: true });

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", onScrollParallax);
  };
}


/**
 * Section Title Map for Terminal Tab Identity
 */
export const SECTION_TITLES: Record<string, string> = {
  hero: "[SYS://ROOT] Sreejit Pradhan · Systems & AI",
  snapshot: "[SYS://METRICS] Telemetry & Key Metrics",
  projects: "[SYS://PROJECTS] Flagship Edge & ML Systems",
  "cp-lab": "[SYS://ALGO] DSA, STL & Complexity Lab",
  journey: "[SYS://TIMELINE] Engineering Milestones",
  education: "[SYS://ACADEMICS] B.Tech CSE & Credentials",
  credentials: "[SYS://CERTS] 21+ Cloud Badges & Awards",
  manifesto: "[SYS://MANIFESTO] Core Systems Principles",
  articles: "[SYS://RESEARCH] Deep Dives & Benchmarks",
  terminal: "[SYS://CLI] Interactive Shell Session",
  contact: "[SYS://COMMS] Secure Dispatch Channel",
};

const GLITCH_CHARS = "010101_#%&*!<>[]{}//==::+~^░▒▓█";

/**
 * Tab Document Title Manager
 * Cleanly sets document title for active section
 */
export function triggerDocumentTitleGlitch(sectionId: string, durationMs: number = 700) {
  if (typeof document === "undefined") return;

  const targetTitle =
    SECTION_TITLES[sectionId] || `Sreejit Pradhan · Systems Developer`;

  document.title = targetTitle;
}

