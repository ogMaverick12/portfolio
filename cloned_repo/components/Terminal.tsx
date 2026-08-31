"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

interface TerminalLine {
  text: string;
  type: "prompt" | "cmd" | "out" | "err" | "val" | "key" | "link" | "ai" | "raw";
  linkUrl?: string;
  isAiNote?: boolean;
}

export default function Terminal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const [inputVal, setInputVal] = useState("");
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [booted, setBooted] = useState(false);
  const [isBooting, setIsBooting] = useState(false);

  // GitHub live details cache
  const [gitData, setGitData] = useState({
    repos: 14,
    stars: 8,
    latestCommit: "fix(hero): make typewriter animation robust and immune to StrictMode",
    loading: true
  });

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        const userRes = await fetch("https://api.github.com/users/ogMaverick12");
        const userData = await userRes.json();
        
        const reposRes = await fetch("https://api.github.com/users/ogMaverick12/repos?per_page=100");
        const reposData = await reposRes.json();
        
        const eventsRes = await fetch("https://api.github.com/users/ogMaverick12/events");
        const eventsData = await eventsRes.json();

        let stars = 0;
        if (Array.isArray(reposData)) {
          stars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
        }

        let latestCommit = "update docs and edge modules";
        if (Array.isArray(eventsData)) {
          const pushEvent = eventsData.find(e => e.type === "PushEvent");
          if (pushEvent && pushEvent.payload?.commits?.[0]) {
            latestCommit = pushEvent.payload.commits[0].message;
          }
        }

        setGitData({
          repos: userData.public_repos || 14,
          stars: stars || 8,
          latestCommit: latestCommit || "fix(hero): make typewriter animation robust",
          loading: false
        });
      } catch (err) {
        setGitData((prev) => ({ ...prev, loading: false }));
      }
    }
    fetchGitHubData();
  }, []);

  const initialGreeting: TerminalLine[] = [
    { text: "sreejit@portfolio:~$", type: "prompt" },
    { text: "whoami", type: "cmd" },
    { text: "Sreejit Pradhan · 16 y/o · India · Beginner Programmer & CP Learner", type: "out" },
    { text: "Self-taught logic enthusiast practicing Python and C++ algorithms.", type: "out" },
    { text: "Type help to view all commands, or ask anything in plain English.", type: "out" },
    { text: "\u00A0", type: "raw" },
  ];

  const bootLines = [
    { text: "Initializing edge core...", type: "key" as const, delay: 100 },
    { text: "loading custom inference drivers... success", type: "out" as const, delay: 300 },
    { text: "establishing secure handshake with neural node... success", type: "out" as const, delay: 200 },
    { text: "allocating local memory structures... [OK]", type: "val" as const, delay: 150 },
    { text: "sreejit-inference-v1.4.2 active.", type: "ai" as const, delay: 200 },
    { text: "system initialized. ready.", type: "key" as const, delay: 150 },
    { text: "\u00A0", type: "raw" as const, delay: 100 }
  ];

  useEffect(() => {
    if (isInView && !booted && !isBooting) {
      runBootSequence();
    }
  }, [isInView]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines, isBooting]);

  const runBootSequence = async () => {
    setIsBooting(true);
    setLines([]);

    for (const line of bootLines) {
      await new Promise((resolve) => setTimeout(resolve, line.delay));
      setLines((prev) => [...prev, { text: line.text, type: line.type }]);
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setLines([]);
    setBooted(true);
    setIsBooting(false);

    for (const line of initialGreeting) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setLines((prev) => [...prev, line]);
    }
  };

  const executeCommand = async (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    setLines((prev) => [
      ...prev,
      { text: "sreejit@portfolio:~$", type: "prompt" },
      { text: cmd, type: "cmd" },
    ]);

    const key = cmd.toLowerCase().replace(/[^a-z]/g, "");

    const CMD_RESPONSES: Record<string, () => TerminalLine[]> = {
      help: () => [
        { text: "available commands:", type: "key" },
        { text: "  about       → Sreejit's brief profile", type: "key" },
        { text: "  projects    → list flagship products", type: "key" },
        { text: "  skills      → ASCII proficiency charts", type: "key" },
        { text: "  github      → fetch dynamic profile data", type: "key" },
        { text: "  latest      → review recent article titles", type: "key" },
        { text: "  manifesto   → view coding principles", type: "key" },
        { text: "  contact     → get in touch", type: "key" },
        { text: "  resume      → get resume link details", type: "key" },
        { text: "  clear       → clear screen buffer", type: "key" },
        { text: "  + ask in plain English (AI-powered search)", type: "ai" },
      ],
      about: () => [
        { text: "Sreejit Pradhan", type: "val" },
        { text: "16 y/o · India · Student + CP Beginner", type: "out" },
        { text: "Self-taught. Obsessed with mathematical logic and puzzle solving.", type: "out" },
        { text: "Currently: practicing C++ STL and Python problem solving.", type: "out" },
      ],
      whoami: () => [
        { text: "Sreejit Pradhan · 16 y/o competitive programming beginner from India.", type: "out" },
      ],
      projects: () => [
        { text: "flagship products:", type: "val" },
        { text: "  SoilSense AI  - local edge soil analyzer (Gemma 4 on Pi)", type: "key" },
        { text: "  PathForge AI  - career roadmap parser (IBM Granite)", type: "key" },
        { text: "  PrepPilot     - adaptive exam prep engine (Gemini API)", type: "key" },
        { text: "→ github.com/ogMaverick12", type: "link", linkUrl: "https://github.com/ogMaverick12" },
      ],
      skills: () => [
        { text: "ASCII proficiency matrices:", type: "val" },
        { text: "  Python:    [████████░░░░░░░░░░░░] 40%", type: "key" },
        { text: "  C++:       [███████░░░░░░░░░░░░░] 35%", type: "key" },
        { text: "  STL / DS:  [█████░░░░░░░░░░░░░░░] 25%", type: "key" },
        { text: "  Math/CP:   [██████░░░░░░░░░░░░░░] 30%", type: "key" },
      ],
      github: () => [
        { text: "querying api.github.com... [OK]", type: "val" },
        { text: `  username:     ogMaverick12`, type: "key" },
        { text: `  public repos: ${gitData.repos}`, type: "key" },
        { text: `  total stars:  ${gitData.stars}`, type: "key" },
        { text: `  latest commit: "${gitData.latestCommit}"`, type: "ai" },
      ],
      latest: () => [
        { text: "recent writings:", type: "val" },
        { text: "  - I Built a Local Interview Coach With Hermes Agent", type: "key" },
        { text: "  - Google I/O 2026: The Real Story was a Skill File", type: "key" },
        { text: "  - 93 Agents, 2.6B Tokens, One Operating System", type: "key" },
        { text: "→ read more at dev.to/sreejit_", type: "link", linkUrl: "https://dev.to/sreejit_" },
      ],
      manifesto: () => [
        { text: "coding principles:", type: "val" },
        { text: "  01. USEFUL > FANTASY (Utility beats ego)", type: "key" },
        { text: "  02. FREE > PAYWALLED (Open source compounds morally)", type: "key" },
        { text: "  03. EXECUTION > PLAN (A broken app teaches more than perfect whiteboards)", type: "key" },
      ],
      contact: () => [
        { text: "primary cta channels:", type: "val" },
        { text: "  email:     sreejit.dev12@gmail.com", type: "link", linkUrl: "mailto:sreejit.dev12@gmail.com" },
        { text: "  linkedin:  sreejit-pradhan-b27b19401", type: "link", linkUrl: "https://www.linkedin.com/in/sreejit-pradhan-b27b19401" },
        { text: "  twitter:   @SreejitX", type: "link", linkUrl: "https://x.com/SreejitX" },
      ],
      resume: () => [
        { text: "resume request:", type: "val" },
        { text: "  Direct download link coming soon.", type: "key" },
        { text: "  Send an email to sreejit.dev12@gmail.com to request cv.", type: "key" },
      ],
      clear: () => {
        setLines([]);
        return [];
      },
    };

    if (CMD_RESPONSES[key]) {
      const resp = CMD_RESPONSES[key]();
      if (key !== "clear") {
        setLines((prev) => [...prev, ...resp, { text: "\u00A0", type: "raw" }]);
      }
    } else {
      await askAI(cmd);
    }
  };

  const askAI = async (question: string) => {
    setLines((prev) => [...prev, { text: "loading", type: "raw" }]);

    try {
      const response = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      
      setLines((prev) => prev.slice(0, -1)); // Remove loading

      if (data.text) {
        const textLines = data.text.trim().split("\n").filter((l: string) => l.trim());
        textLines.forEach((line: string) => {
          setLines((prev) => [...prev, { text: line, type: "ai" }]);
        });
        setLines((prev) => [
          ...prev,
          { text: "↑ AI-generated · may not be 100% accurate", type: "raw", isAiNote: true },
          { text: "\u00A0", type: "raw" },
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          { text: "AI offline. Type a standard command like 'help' or 'github'.", type: "err" },
          { text: "\u00A0", type: "raw" },
        ]);
      }
    } catch (err) {
      setLines((prev) => prev.slice(0, -1));
      setLines((prev) => [
        ...prev,
        { text: "Connection error. Type a standard command like 'help'.", type: "err" },
        { text: "\u00A0", type: "raw" },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const val = inputVal;
      setInputVal("");
      executeCommand(val);
    }
  };

  const handleTagClick = (tag: string) => {
    setInputVal("");
    executeCommand(tag);
  };

  const getLineClass = (line: TerminalLine) => {
    if (line.isAiNote) return "text-[0.6rem] text-muted font-mono";
    switch (line.type) {
      case "prompt":
        return "t-prompt";
      case "cmd":
        return "t-cmd";
      case "out":
        return "t-out text-muted2";
      case "err":
        return "t-err text-[#e06c75]";
      case "val":
        return "t-val text-[#7ec891]";
      case "key":
        return "t-key text-accent";
      case "link":
        return "t-link text-[#61afef] underline cursor-pointer hover:text-accent";
      case "ai":
        return "t-ai text-[#c678dd]";
      default:
        return "text-text";
    }
  };

  const sectionNum = getSectionNum("terminal");

  return (
    <section id="terminal" ref={containerRef} className="py-32 px-6 md:px-12 border-b border-border relative z-10">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> ask the terminal
      </div>

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_720px] gap-12 items-center">
        <div>
          <h2 className="terminal-intro font-serif text-[2rem] md:text-[4.5vw] lg:text-[4rem] italic leading-tight tracking-tight mb-4 text-text">
            Ask <em className="not-italic text-accent">anything</em><br />
            about me.
          </h2>
          <p className="terminal-hint text-[0.83rem] text-muted2 mb-8">
            Interact with the local systems emulator. Type standard commands or prompt the model context in plain English.
          </p>

          {/* Quick command suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {["help", "skills", "github", "manifesto", "about"].map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="font-mono text-[0.62rem] text-accent border border-accent/20 bg-accent2/5 px-2.5 py-1 rounded hover:border-accent hover:bg-accent2/10 transition-all duration-200 cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          <span className="ai-badge border border-[#c678dd]/25 px-2.5 py-1 font-mono text-[0.62rem] text-[#c678dd] inline-flex items-center gap-2">
            <span className="ai-dot w-1.5 h-1.5 rounded-full bg-[#c678dd] animate-ping" />
            AI-powered edge context handler
          </span>
        </div>

        {/* Terminal Window */}
        <div className="term-window border border-border2 bg-bg2 w-full relative overflow-hidden rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.3),0_0_25px_var(--accent-glow)]">
          <div className="term-scanlines" />
          
          {/* Header */}
          <div className="term-header flex items-center gap-2 px-5 py-3 border-b border-border bg-bg3">
            <div className="term-dot term-dot-r w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <div className="term-dot term-dot-y w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
            <div className="term-dot term-dot-g w-2.5 h-2.5 rounded-full bg-[#28c941]" />
            <div className="term-title mx-auto font-mono text-[0.68rem] text-muted tracking-wider">
              sreejit@portfolio:~
            </div>
          </div>

          {/* Terminal Output Body */}
          <div
            ref={bodyRef}
            id="term-body"
            className="p-5 min-h-[260px] max-h-[380px] overflow-y-auto font-mono text-[0.78rem] leading-[1.8] text-text"
          >
            {lines.map((line, idx) => {
              if (line.text === "loading" && line.type === "raw") {
                return (
                  <div key={idx} className="t-loading flex gap-1 items-center py-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c678dd] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c678dd] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c678dd] animate-bounce" />
                  </div>
                );
              }

              if (line.type === "link" && line.linkUrl) {
                return (
                  <div key={idx} className="terminal-line">
                    <span
                      onClick={() => window.open(line.linkUrl, "_blank")}
                      className={getLineClass(line)}
                    >
                      {line.text}
                    </span>
                  </div>
                );
              }

              if (line.type === "prompt") {
                const nextLine = lines[idx + 1];
                if (nextLine && nextLine.type === "cmd") {
                  return (
                    <div key={idx} className="terminal-line">
                      <span className="t-prompt text-accent mr-2">{line.text}</span>
                      <span className="t-cmd text-text">{nextLine.text}</span>
                    </div>
                  );
                }
              }

              if (line.type === "cmd") {
                return null;
              }

              return (
                <div key={idx} className="terminal-line">
                  <span className={getLineClass(line)}>{line.text}</span>
                </div>
              );
            })}
          </div>

          {/* Input Row */}
          <div className="term-input-row flex items-center gap-3 px-5 py-4 border-t border-border bg-bg3">
            <span className="font-mono text-[0.78rem] text-accent whitespace-nowrap">
              sreejit@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              id="term-input"
              value={inputVal}
              disabled={isBooting}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isBooting ? "initializing core components..." : "type help, skills, github, or ask in plain English..."}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              className="flex-1 bg-transparent border-none outline-none font-mono text-[0.78rem] text-text caret-accent"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
