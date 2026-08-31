"use client";

import { useEffect, useState } from "react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav
      id="nav"
      className={`fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between px-6 md:px-12 backdrop-blur-[24px] saturate-[180%] border-b border-border transition-all duration-300 ${
        isScrolled
          ? "py-[0.9rem] bg-bg/92"
          : "py-[1.2rem] bg-bg/75"
      }`}
    >
      <a
        href="#hero"
        onClick={(e) => handleLinkClick(e, "hero")}
        className="nav-logo font-mono text-[0.88rem] font-normal text-text tracking-wider no-underline"
      >
        Sreejit<span className="text-accent">.</span>
      </a>
      
      <ul className="nav-links hidden md:flex gap-10 list-none">
        {["projects", "about", "education", "achievements", "blog", "terminal"].map((link) => (
          <li key={link}>
            <a
              href={`#${link}`}
              onClick={(e) => handleLinkClick(e, link)}
              className="font-mono text-[0.72rem] font-light text-muted tracking-widest no-underline lowercase transition-colors duration-200 hover:text-text relative block py-1"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>

      <div className="nav-status flex items-center gap-2 font-mono text-[0.68rem] text-muted">
        <div className="status-dot w-1.5 h-1.5 rounded-full bg-accent animate-blink shadow-[0_0_6px_var(--accent)]" />
        open to collabs
      </div>
    </nav>
  );
}
