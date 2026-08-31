"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check saved theme or OS preference
    const savedTheme = localStorage.getItem("theme");
    const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

    if (savedTheme === "light" || (!savedTheme && prefersLight)) {
      document.body.setAttribute("data-theme", "light");
      setTheme("light");
    } else {
      document.body.removeAttribute("data-theme");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  return (
    <div
      onClick={toggleTheme}
      className="theme-toggle fixed bottom-8 right-8 z-[9999] bg-bg2 border border-border rounded-full w-14 h-14 flex items-center justify-center cursor-pointer text-text transition-all duration-300 hover:bg-bg3 hover:scale-105 hover:shadow-[0_6px_16px_rgba(0,0,0,0.3)] shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
      title="Toggle Light/Dark Theme"
    >
      {/* Sun Icon (Visible when theme is dark) */}
      <svg
        style={{ display: theme === "dark" ? "block" : "none" }}
        className="sun-icon w-[22px] h-[22px]"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </svg>

      {/* Moon Icon (Visible when theme is light) */}
      <svg
        style={{ display: theme === "light" ? "block" : "none" }}
        className="moon-icon w-[22px] h-[22px]"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </div>
  );
}
