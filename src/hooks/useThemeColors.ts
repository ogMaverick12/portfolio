import { useState, useEffect } from "react";

export interface ThemeColors {
  themeName: string;
  accent: string;
  glow: string;
  dim: string;
  head: string;
  rgb: string;
}

export function getThemeColorsFromDOM(): ThemeColors {
  if (typeof window === "undefined") {
    return {
      themeName: "default",
      accent: "#FF4D26",
      glow: "rgba(255, 77, 38, 0.9)",
      dim: "rgba(255, 77, 38, 0.45)",
      head: "#FFF0ED",
      rgb: "255, 77, 38",
    };
  }

  const theme = document.documentElement.getAttribute("data-theme") || "default";

  // Check computed CSS variable if present
  const computedStyle = getComputedStyle(document.documentElement);
  const accentNeon = computedStyle.getPropertyValue("--accent-neon").trim() || "";

  switch (theme) {
    case "cyber-crimson":
      return {
        themeName: "cyber-crimson",
        accent: accentNeon || "#E63946",
        glow: "rgba(230, 57, 70, 0.9)",
        dim: "rgba(230, 57, 70, 0.45)",
        head: "#FECDD3",
        rgb: "230, 57, 70",
      };
    case "cyber-amber":
      return {
        themeName: "cyber-amber",
        accent: accentNeon || "#F59E0B",
        glow: "rgba(245, 158, 11, 0.9)",
        dim: "rgba(245, 158, 11, 0.45)",
        head: "#FDE68A",
        rgb: "245, 158, 11",
      };
    case "cyber-emerald":
      return {
        themeName: "cyber-emerald",
        accent: accentNeon || "#10B981",
        glow: "rgba(16, 185, 129, 0.9)",
        dim: "rgba(16, 185, 129, 0.45)",
        head: "#A7F3D0",
        rgb: "16, 185, 129",
      };
    case "light":
      return {
        themeName: "light",
        accent: accentNeon || "#E0401B",
        glow: "rgba(224, 64, 27, 0.8)",
        dim: "rgba(224, 64, 27, 0.4)",
        head: "#7F1D1D",
        rgb: "224, 64, 27",
      };
    default:
      return {
        themeName: "default",
        accent: accentNeon || "#FF4D26",
        glow: "rgba(255, 77, 38, 0.9)",
        dim: "rgba(255, 77, 38, 0.45)",
        head: "#FFF0ED",
        rgb: "255, 77, 38",
      };
  }
}

/**
 * React hook that actively synchronizes with theme changes on documentElement
 */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(getThemeColorsFromDOM);

  useEffect(() => {
    const updateColors = () => {
      setColors(getThemeColorsFromDOM());
    };

    // Listen to MutationObserver on data-theme attribute
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "data-theme" || mutation.attributeName === "class" || mutation.attributeName === "style")
        ) {
          updateColors();
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    // Custom theme change event
    window.addEventListener("theme-change", updateColors);
    window.addEventListener("storage", updateColors);

    // Initial sync
    updateColors();

    return () => {
      observer.disconnect();
      window.removeEventListener("theme-change", updateColors);
      window.removeEventListener("storage", updateColors);
    };
  }, []);

  return colors;
}
