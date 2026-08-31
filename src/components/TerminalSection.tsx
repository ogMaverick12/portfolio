import React, { useState, useEffect, useRef } from "react";
import { sound } from "../lib/sound";
import { animate } from "animejs";
import { TerminalLog } from "../types";
import {
  Terminal as TerminalIcon,
  Play,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  TerminalSquare,
  Code2,
  Activity,
  Zap,
} from "lucide-react";

const LS_OUTPUT = `total 8 projects & system modules
drwxr-xr-x  2 sreejit  staff   4096 Aug 24 14:20 soilsense-ai/       [Gemma 4 Edge Agritech Engine]
drwxr-xr-x  2 sreejit  staff   4096 Aug 19 09:12 pathforge-core/     [IBM Granite Fast Career Engine]
drwxr-xr-x  2 sreejit  staff   4096 Aug 11 18:45 preppilot-coach/    [Gemini API Scenario Exam System]
drwxr-xr-x  2 sreejit  staff   4096 Aug 05 11:30 dsa-cp-lab/         [C++20 Zero-Overhead Benchmarks]
-rw-r--r--  1 sreejit  staff   1.1G Aug 24 14:15 model_gemma4_q4.gguf [Quantized ARM64 On-Device Weights]
-rw-r--r--  1 sreejit  staff   8420 Aug 22 17:02 ads1115_driver.cpp  [16-Bit Analogue Sensor Driver]
-rw-r--r--  1 sreejit  staff   2048 Aug 24 10:10 Makefile            [Deterministic Embedded Toolchain]
-rw-r--r--  1 sreejit  staff   4120 Aug 25 16:30 README.md           [Architecture & Systems Manifesto]`;

const HELP_OUTPUT = `=== SREEJIT PRADHAN · CLI COMMAND DIRECTORY [v4.5-offline-ready] ===

Available Interactive Commands & System Actions:
----------------------------------------------------------------------
  • help / ?          : Display this command directory with syntax manual
  • about / whoami    : Profile breakdown, high school background, & research goals
  • clear / cls       : Flush terminal log screen buffer
  • matrix [on|off]   : Toggle interactive Matrix code rain canvas
  • diagnostics       : Run live edge hardware & GGML inference speed benchmark
  • goto <section>    : Navigate to section (projects, cp-lab, manifesto, contact)
  • projects          : Enumerate Flagship AI Systems (SoilSense, PathForge, PrepPilot)
  • soilsense         : Technical specs for offline Gemma 4 on Raspberry Pi
  • skills            : Core language proficiencies, C++20 STL & DSA complexity
  • certs             : 21+ Google Cloud skill badges, Hackathons, & Certifications
  • manifesto         : 3 non-negotiable core engineering principles
  • articles          : Published deep dives & benchmarks on Dev.to / Medium
  • contact           : Direct communication links (Email, LinkedIn, GitHub, X)
  • ask <query>       : Send interactive query to server-side Gemini 2.5 AI

Shortcuts & Tips:
  - Use Up/Down arrow keys to cycle through previous shell commands.
  - Click any quick command button below to execute instantly without typing.
  - Type 'matrix' or click the header button to toggle the interactive code rain.`;


interface TerminalSectionProps {
  matrixRainEnabled?: boolean;
  onToggleMatrixRain?: () => void;
}

export const TerminalSection: React.FC<TerminalSectionProps> = ({
  matrixRainEnabled = false,
  onToggleMatrixRain,
}) => {
  const [logs, setLogs] = useState<TerminalLog[]>([
    {
      id: "init-1",
      text: "Sreejit Pradhan [System Kernel v4.5-offline-ready]",
      type: "out",
    },
    {
      id: "init-2",
      text: "Siliguri Edge Node initialized. Type 'help', 'about', or 'matrix' to explore.",
      type: "out",
    },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const terminalLogsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const simulationAbortRef = useRef<boolean>(false);
  const hasAutoSimulatedRef = useRef<boolean>(false);

  const scrollToBottom = () => {
    if (terminalLogsContainerRef.current) {
      terminalLogsContainerRef.current.scrollTop = terminalLogsContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Anime.js-powered typewriter effect for terminal command outputs
  const typewriteOutputWithAnime = (fullText: string, logId: string, durationMs: number = 850) => {
    const animProxy = { charCount: 0 };
    const totalLength = fullText.length;

    animate(animProxy, {
      charCount: totalLength,
      duration: durationMs,
      ease: "linear",
      onUpdate: () => {
        const idx = Math.floor(animProxy.charCount);
        const partial = fullText.slice(0, idx);
        setLogs((prev) =>
          prev.map((log) => (log.id === logId ? { ...log, text: partial } : log))
        );
        if (idx % 14 === 0) {
          sound.playKey();
        }
      },
      onComplete: () => {
        setLogs((prev) =>
          prev.map((log) => (log.id === logId ? { ...log, text: fullText } : log))
        );
        sound.playSuccess();
      },
    });
  };

  // Anime.js-powered staggered typewriter effect for terminal 'ls' command simulation & directory listing
  const typewriteStaggeredLinesWithAnime = (
    fullText: string,
    logId: string,
    lineDelayMs: number = 70,
    charDurationMs: number = 14
  ) => {
    const lines = fullText.split("\n");
    const currentRenderedLines: string[] = [];

    const typeLine = (index: number) => {
      if (index >= lines.length) {
        sound.playSuccess();
        return;
      }

      const targetLine = lines[index];
      const animProxy = { charCount: 0 };
      const lineLen = targetLine.length;

      animate(animProxy, {
        charCount: lineLen,
        duration: Math.max(90, lineLen * charDurationMs),
        ease: "linear",
        onUpdate: () => {
          const charIdx = Math.floor(animProxy.charCount);
          const partialLine = targetLine.slice(0, charIdx);
          const assembled = [...currentRenderedLines, partialLine].join("\n");
          setLogs((prev) =>
            prev.map((log) => (log.id === logId ? { ...log, text: assembled } : log))
          );
          if (charIdx % 4 === 0) {
            sound.playKey();
          }
        },
        onComplete: () => {
          currentRenderedLines.push(targetLine);
          setLogs((prev) =>
            prev.map((log) =>
              log.id === logId ? { ...log, text: currentRenderedLines.join("\n") } : log
            )
          );
          setTimeout(() => {
            typeLine(index + 1);
          }, lineDelayMs);
        },
      });
    };

    typeLine(0);
  };

  // Typing simulation helper
  const typeText = async (text: string, charDelay: number = 32): Promise<boolean> => {
    for (let i = 0; i <= text.length; i++) {
      if (simulationAbortRef.current) return false;
      setInputVal(text.slice(0, i));
      if (i % 2 === 0) sound.playKey();
      await new Promise((r) => setTimeout(r, charDelay + (Math.random() * 18 - 9)));
    }
    return true;
  };

  // Run automated typing demo
  const runTypingSimulation = async () => {
    if (isSimulating || isProcessing) return;
    simulationAbortRef.current = false;
    setIsSimulating(true);

    try {
      // Command 1: git clone
      const cmd1 = "git clone https://github.com/ogMaverick12/SoilSense-AI.git";
      const ok1 = await typeText(cmd1, 26);
      if (!ok1 || simulationAbortRef.current) return;

      await new Promise((r) => setTimeout(r, 400));
      setInputVal("");
      setLogs((prev) => [
        ...prev,
        { id: "sim-cmd-1", text: cmd1, type: "cmd" },
        {
          id: "sim-out-1",
          text: `Cloning into 'SoilSense-AI'...
remote: Enumerating objects: 142, done.
remote: Compressing objects: 100% (98/98), done.
Receiving objects: 100% (142/142), 12.40 MiB | 8.20 MiB/s, done.
Resolving deltas: 100% (64/64), done.`,
          type: "out",
        },
      ]);
      sound.playSuccess();

      await new Promise((r) => setTimeout(r, 600));
      if (simulationAbortRef.current) return;

      // Command 2: ls -la with Anime.js staggered typewriter animation
      const cmdLs = "ls -la";
      const okLs = await typeText(cmdLs, 30);
      if (!okLs || simulationAbortRef.current) return;

      await new Promise((r) => setTimeout(r, 350));
      setInputVal("");
      const lsLogId = "sim-ls-" + Date.now();
      setLogs((prev) => [
        ...prev,
        { id: "sim-cmd-ls", text: cmdLs, type: "cmd" },
        { id: lsLogId, text: "", type: "out" },
      ]);
      typewriteStaggeredLinesWithAnime(LS_OUTPUT, lsLogId, 60, 12);

      await new Promise((r) => setTimeout(r, 1100));
      if (simulationAbortRef.current) return;

      // Command 3: python train_model.py
      const cmd2 = "python train_model.py --target rpi4 --quantize 4bit";
      const ok2 = await typeText(cmd2, 28);
      if (!ok2 || simulationAbortRef.current) return;

      await new Promise((r) => setTimeout(r, 450));
      setInputVal("");
      setLogs((prev) => [
        ...prev,
        { id: "sim-cmd-2", text: cmd2, type: "cmd" },
        {
          id: "sim-out-2",
          text: `[EDGE COMPILER] Target Hardware: ARM Cortex-A72 (Raspberry Pi 4 Model B)
[EDGE COMPILER] Loading base Gemma 4 checkpoint (2.6B params)...
[EDGE COMPILER] Applying 4-bit GGML symmetric weight quantization [████████████████] 100%
[STATUS] Model size reduced from 5.2GB -> 1.14GB.
[BENCHMARK] Inference speed: 15.2 tok/s | RAM footprint: 1.18 GB | Cloud API Cost: $0.00/mo.`,
          type: "out",
        },
      ]);
      sound.playSuccess();

      await new Promise((r) => setTimeout(r, 650));
      if (simulationAbortRef.current) return;

      // Command 4: soilsense
      const cmd3 = "soilsense";
      const ok3 = await typeText(cmd3, 35);
      if (!ok3 || simulationAbortRef.current) return;

      await new Promise((r) => setTimeout(r, 400));
      setInputVal("");
      handleExecute("soilsense");
    } finally {
      setIsSimulating(false);
    }
  };

  // Viewport observer: auto-run typing simulation once as section enters view
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoSimulatedRef.current) {
            hasAutoSimulatedRef.current = true;
            setTimeout(() => {
              runTypingSimulation();
            }, 600);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => {
      simulationAbortRef.current = true;
      observer.disconnect();
    };
  }, []);

  const quickCommands = [
    { label: "ls -la", cmd: "ls -la" },
    { label: "help", cmd: "help" },
    { label: "about", cmd: "about" },
    { label: "matrix", cmd: "matrix" },
    { label: "projects", cmd: "projects" },
    { label: "skills", cmd: "skills" },
    { label: "diagnostics", cmd: "diagnostics" },
    { label: "soilsense", cmd: "soilsense" },
    { label: "manifesto", cmd: "manifesto" },
    { label: "Ask AI: Gemma 4", cmd: "ask how does SoilSense run Gemma 4 offline?" },
    { label: "clear", cmd: "clear" },
  ];

  const handleExecute = async (commandStr: string) => {
    simulationAbortRef.current = true;
    setIsSimulating(false);

    const rawCmd = commandStr.trim();
    if (!rawCmd) return;

    sound.playKey();
    setInputVal("");
    setHistory((prev) => [...prev, rawCmd]);
    setHistoryIndex(-1);

    // Add user prompt to logs
    const userLog: TerminalLog = {
      id: "cmd-" + Date.now(),
      text: rawCmd,
      type: "cmd",
    };
    setLogs((prev) => [...prev, userLog]);

    const lower = rawCmd.toLowerCase();

    // 1. Built-in: Clear
    if (lower === "clear" || lower === "cls") {
      setLogs([
        {
          id: "cleared-" + Date.now(),
          text: "Terminal buffer cleared. System ready for commands.",
          type: "out",
        },
      ]);
      return;
    }

    // 2. Built-in: About / Whoami
    if (lower === "about" || lower === "whoami" || lower === "bio" || lower === "profile") {
      const logId = "about-" + Date.now();
      const aboutText = `======================================================================
SREEJIT PRADHAN · SYSTEMS DEVELOPER & RESEARCHER (AGE 16)
DPS Siliguri, Grade 11 · Focus: Edge AI, C++ Algorithmic Systems, Agritech
======================================================================
• Philosophy: Practical utility over vanity. If a system doesn't run offline 
  or solve a tangible need, it's just compute pollution.
• Flagship Work: SoilSense (offline Gemma 4 model on Raspberry Pi),
  PathForge (IBM Granite career path compiler), PrepPilot (Scenario AI coach).
• Core Stack: Modern C++ (C++20, STL, memory bounds), Python (3.11+, PyTorch/GGML),
  Embedded ARM (Pi 4, ADS1115 ADC), 21+ Google Cloud Certified Badges.`;

      setLogs((prev) => [
        ...prev,
        {
          id: logId,
          text: "",
          type: "out",
        },
      ]);
      typewriteOutputWithAnime(aboutText, logId, 850);
      return;
    }

    // 3. Built-in: Matrix Code Rain Toggle
    if (
      lower === "matrix" ||
      lower === "matrix on" ||
      lower === "matrix off" ||
      lower === "matrix toggle" ||
      lower === "rain" ||
      lower === "code rain"
    ) {
      if (onToggleMatrixRain) {
        onToggleMatrixRain();
      } else {
        window.dispatchEvent(new CustomEvent("toggle-matrix-rain"));
      }

      const nextState = !matrixRainEnabled;
      setLogs((prev) => [
        ...prev,
        {
          id: "matrix-" + Date.now(),
          text: `[CANVAS ENGINE] Interactive Grid Matrix Rain ${
            nextState ? "ENABLED (Active within cursor radius)" : "DISABLED (Muted)"
          }.\nCascades dynamically from illuminated grid lines in sync with theme palette.`,
          type: "out",
        },
      ]);
      sound.playClick();
      return;
    }

    // 4. Built-in: System Diagnostics / Benchmark
    if (
      lower === "diagnostics" ||
      lower === "benchmark" ||
      lower === "test" ||
      lower === "diag"
    ) {
      const logId = "diag-" + Date.now();
      const diagText = `[DIAGNOSTICS] Initializing Edge Hardware & Memory Bus Test...
[TEST 1/4] ARM Cortex-A72 CPU Integrity: PASSED (4 Cores @ 1.80 GHz)
[TEST 2/4] ADS1115 I2C Bus Latency: 0.28ms (400 kHz Fast-Mode)
[TEST 3/4] Gemma 4-bit Quantized Tensor VRAM Footprint: 1.18 GB / 4.00 GB (OPTIMAL)
[TEST 4/4] STL Memory Allocator Stress Test: 1,000,000 push_back cycles -> 14.2ms
[SYSTEM HEALTH] Overall Status: 100% OPERATIONAL · $0.00 Cloud Compute Cost`;

      setLogs((prev) => [
        ...prev,
        {
          id: logId,
          text: "",
          type: "out",
        },
      ]);
      typewriteOutputWithAnime(diagText, logId, 800);
      return;
    }

    // 6. Built-in: Goto Section Navigation
    if (lower.startsWith("goto ") || lower.startsWith("cd ") || lower.startsWith("jump ")) {
      const targetSec = lower.replace(/^(goto|cd|jump)\s+/, "").trim();
      const sectionMap: Record<string, string> = {
        hero: "hero",
        home: "hero",
        root: "hero",
        snapshot: "snapshot",
        about: "snapshot",
        projects: "projects",
        soilsense: "projects",
        cplab: "cp-lab",
        "cp-lab": "cp-lab",
        dsa: "cp-lab",
        lab: "cp-lab",
        algorithms: "cp-lab",
        timeline: "journey",
        journey: "journey",
        education: "education",
        academics: "education",
        credentials: "credentials",
        certs: "credentials",
        badges: "credentials",
        manifesto: "manifesto",
        articles: "articles",
        blog: "articles",
        terminal: "terminal",
        shell: "terminal",
        contact: "contact",
        comms: "contact",
      };

      const targetId = sectionMap[targetSec];
      if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setLogs((prev) => [
            ...prev,
            {
              id: "nav-" + Date.now(),
              text: `[ROUTER] Smoothly navigated viewport to #${targetId}.`,
              type: "out",
            },
          ]);
          sound.playLaser();
          return;
        }
      }
    }

    if (
      lower === "ls" ||
      lower === "ls -la" ||
      lower === "ls -l" ||
      lower === "ls -a" ||
      lower === "dir" ||
      lower === "ll"
    ) {
      const logId = "ls-out-" + Date.now();
      setLogs((prev) => [
        ...prev,
        {
          id: logId,
          text: "",
          type: "out",
        },
      ]);
      typewriteStaggeredLinesWithAnime(LS_OUTPUT, logId, 65, 12);
      return;
    }

    if (
      lower === "help" ||
      lower === "help -a" ||
      lower === "help --all" ||
      lower === "?" ||
      lower === "-h" ||
      lower === "--help" ||
      lower === "commands" ||
      lower === "man"
    ) {
      const logId = "help-out-" + Date.now();
      setLogs((prev) => [
        ...prev,
        {
          id: logId,
          text: "",
          type: "out",
        },
      ]);
      typewriteOutputWithAnime(HELP_OUTPUT, logId, 950);
      return;
    }

    if (lower === "projects") {
      setLogs((prev) => [
        ...prev,
        {
          id: "proj-" + Date.now(),
          text: `FLAGSHIP SYSTEMS:
1. SoilSense AI: Offline agricultural intelligence on Raspberry Pi (4-bit Gemma 4 + NPK sensors). $0/mo cost.
2. PathForge AI: Goal-oriented career roadmap compiler built with IBM Granite (~0.6s latency).
3. PrepPilot: Scenario-based adaptive exam coach powered by Gemini API.`,
          type: "out",
        },
      ]);
      return;
    }

    if (lower === "soilsense") {
      setLogs((prev) => [
        ...prev,
        {
          id: "soil-" + Date.now(),
          text: `SoilSense AI Technical Blueprint:
• Hardware: Raspberry Pi 4 Model B (4GB RAM) + ADS1115 16-bit ADC
• Probes: NPK Analogue Volts, pH electrode, Capacitive Soil Moisture
• Model: Quantized Gemma 4 (4-bit GGML) running locally on ARM64 CPU (~15 tok/s)
• Network: 100% Offline with zero cloud token charges`,
          type: "out",
        },
      ]);
      return;
    }

    if (lower === "skills") {
      setLogs((prev) => [
        ...prev,
        {
          id: "skills-" + Date.now(),
          text: `TECHNICAL PROFILE:
• Languages: C++ (C++20, STL, memory bounds), Python (3.11+, Edge ML), Java (OOP Foundations)
• Algorithms: Binary Search, Two Pointers, Asymptotic Complexity, STL Vector/Set/Map
• Edge AI: Quantized GGML LLMs (Gemma 4), Raspberry Pi ADC, Agent Development Kit (ADK)
• Cloud: 21+ Google Cloud Badges (GKE, DevOps, IAM Security, Firebase)`,
          type: "out",
        },
      ]);
      return;
    }

    if (lower === "certs") {
      setLogs((prev) => [
        ...prev,
        {
          id: "certs-" + Date.now(),
          text: `CREDENTIALS:
• Google AI Professional Certificate (Coursera)
• Scientific Computing with Python (freeCodeCamp)
• Google Cloud NEXT '26 Challenge Winner (Dev.to)
• 21+ Google Cloud Skill Badges (GKE, Cloud Security, DevOps)`,
          type: "out",
        },
      ]);
      return;
    }

    if (lower === "manifesto") {
      setLogs((prev) => [
        ...prev,
        {
          id: "man-" + Date.now(),
          text: `THE MANIFESTO:
01. USEFUL > FANTASY (Utility beats vanity)
02. FREE > PAYWALLED (Open source is a moral imperative)
03. EXECUTION > PLAN (Ship to learn)`,
          type: "out",
        },
      ]);
      return;
    }

    if (lower === "contact") {
      setLogs((prev) => [
        ...prev,
        {
          id: "contact-" + Date.now(),
          text: `CHANNELS:
• Email: sreejit.dev12@gmail.com
• LinkedIn: https://www.linkedin.com/in/sreejit-pradhan-b27b19401
• GitHub: https://github.com/ogMaverick12
• Twitter/X: https://x.com/SreejitX`,
          type: "out",
        },
      ]);
      return;
    }

    // Forward query to AI Assistant endpoint
    setIsProcessing(true);
    const query = rawCmd.startsWith("ask ") ? rawCmd.slice(4) : rawCmd;

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setLogs((prev) => [
        ...prev,
        {
          id: "ai-" + Date.now(),
          text: data.text || "No output returned.",
          type: "ai",
          isAiNote: true,
        },
      ]);
      sound.playSuccess();
    } catch (err: any) {
      setLogs((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          text: `[SYSTEM] Command or query parsed: ${query}\nSreejit is an edge AI developer & CP learner focused on C++ & Python.\nType 'help' for built-in commands.`,
          type: "out",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    simulationAbortRef.current = true;
    setIsSimulating(false);

    if (e.key === "Enter") {
      handleExecute(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIndex + 1 < history.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInputVal("");
      }
    }
  };

  const copyTerminalLogs = () => {
    sound.playClick();
    const textToCopy = logs.map((l) => `${l.type === "cmd" ? "> " : ""}${l.text}`).join("\n");
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const copySingleLog = (id: string, text: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedLogId(id);
    setTimeout(() => setCopiedLogId(null), 1500);
  };

  return (
    <section
      id="terminal"
      ref={sectionRef}
      className="py-24 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>Section 08 · Interactive Shell</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              Edge Terminal & <span className="italic text-[var(--accent-neon)]">AI Assistant.</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                runTypingSimulation();
              }}
              disabled={isSimulating}
              className="px-3.5 py-1.5 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] bg-[var(--bg-secondary)] text-xs font-code text-[var(--text-muted)] hover:text-[var(--accent-neon)] transition-all flex items-center gap-2"
            >
              <TerminalSquare className="w-3.5 h-3.5" />
              <span>{isSimulating ? "Typing..." : "Replay Simulation"}</span>
            </button>
            <p className="text-sm text-[var(--text-muted)] max-w-xs font-normal hidden lg:block">
              Interact with Sreejit's shell. Execute native commands or prompt Gemini.
            </p>
          </div>
        </div>

        {/* Terminal Window Box */}
        <div
          className={`rounded-2xl border border-[var(--border-subtle)] bg-[#08080c] shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
            isFullscreen ? "fixed inset-4 z-50 bg-[#08080c]" : "h-[520px]"
          }`}
        >
          {/* Window Chrome Titlebar */}
          <div className="px-4 py-3 bg-[#111116] border-b border-white/10 flex items-center justify-between font-code text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-[var(--text-muted)] text-[0.68rem]">
                sreejit@siliguri-edge:~$ (bash / gemma-4-ggml / gemini-2.5-flash)
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-[var(--text-dim)]">
              {/* Interactive Matrix Rain Quick Toggle */}
              <button
                onClick={() => {
                  sound.playClick();
                  if (onToggleMatrixRain) {
                    onToggleMatrixRain();
                  } else {
                    window.dispatchEvent(new CustomEvent("toggle-matrix-rain"));
                  }
                }}
                className={`px-2.5 py-1 rounded-md border font-code text-[0.62rem] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  matrixRainEnabled
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                    : "bg-white/5 border-white/10 text-[var(--text-muted)] hover:text-white hover:border-white/25"
                }`}
                title="Toggle Matrix Code Rain Canvas"
              >
                <Code2 className="w-3 h-3" />
                <span className="hidden sm:inline">Matrix Rain:</span>
                <span>{matrixRainEnabled ? "ON" : "OFF"}</span>
              </button>

              {isSimulating && (
                <span className="text-[0.62rem] text-[var(--accent-neon)] animate-pulse font-mono mr-2 hidden md:inline">
                  [Simulating Live Shell Session]
                </span>
              )}
              <button
                onClick={copyTerminalLogs}
                className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1 text-[0.68rem]"
                title="Copy full terminal session output to clipboard"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Copied Session</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy All</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setIsFullscreen(!isFullscreen);
                }}
                className="hover:text-[var(--text-primary)] transition-colors p-1"
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Terminal"}
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Logs Output Screen */}
          <div
            ref={terminalLogsContainerRef}
            className="p-4 sm:p-6 font-code text-xs overflow-y-auto flex-1 space-y-3 selection:bg-[var(--accent-neon)]/30 selection:text-white max-h-[460px]"
          >
            {logs.map((log) => {
              const isItemCopied = copiedLogId === log.id;
              return (
                <div key={log.id} className="leading-relaxed group/log relative">
                  {log.type === "cmd" ? (
                    <div className="flex items-center justify-between gap-2 text-[var(--accent-neon)] font-bold">
                      <div className="flex items-center gap-2 flex-1">
                        <span>sreejit@siliguri:~$</span>
                        <span className="text-[var(--text-primary)]">{log.text}</span>
                      </div>
                      <button
                        onClick={() => copySingleLog(log.id, log.text)}
                        className="opacity-0 group-hover/log:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--accent-neon)] shrink-0"
                        title="Copy command to clipboard"
                      >
                        {isItemCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  ) : log.isAiNote ? (
                    <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] whitespace-pre-wrap relative">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="text-[0.62rem] text-[var(--accent-neon)] font-bold uppercase flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3" />
                          <span>Gemini Edge AI Response:</span>
                        </div>
                        <button
                          onClick={() => copySingleLog(log.id, log.text)}
                          className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--accent-neon)] text-[0.62rem] text-[var(--text-muted)] hover:text-white transition-all flex items-center gap-1"
                          title="Copy AI response to clipboard"
                        >
                          {isItemCopied ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>
                      <div>{log.text}</div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[var(--text-muted)] whitespace-pre-wrap flex-1">{log.text}</div>
                      {log.text.trim().length > 0 && (
                        <button
                          onClick={() => copySingleLog(log.id, log.text)}
                          className="opacity-0 group-hover/log:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-[var(--text-dim)] hover:text-white shrink-0"
                          title="Copy output block to clipboard"
                        >
                          {isItemCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {isProcessing && (
              <div className="flex items-center gap-2 text-[var(--accent-neon)] animate-pulse">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-neon)]" />
                <span>Executing Gemini API query...</span>
              </div>
            )}
          </div>

          {/* Terminal Input Line */}
          <div className="p-3 sm:p-4 bg-[#0d0d12] border-t border-white/10 flex items-center gap-2 font-code text-xs">
            <span className="text-[var(--accent-neon)] font-bold shrink-0">sreejit@edge:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onFocus={() => {
                simulationAbortRef.current = true;
                setIsSimulating(false);
              }}
              onChange={(e) => {
                simulationAbortRef.current = true;
                setIsSimulating(false);
                setInputVal(e.target.value);
              }}
              onKeyDown={handleKeyDown}
              placeholder={isSimulating ? "Typing simulation in progress..." : "Type command (e.g. 'help', 'soilsense', 'ask <question>')..."}
              className="w-full bg-transparent text-[var(--text-primary)] placeholder-[var(--text-dim)] outline-none"
              autoComplete="off"
              spellCheck="false"
            />
            {isSimulating && (
              <span className="w-2 h-4 bg-[var(--accent-neon)] animate-pulse inline-block shrink-0" />
            )}
            <button
              onClick={() => handleExecute(inputVal)}
              disabled={isProcessing || !inputVal.trim()}
              className="p-1.5 rounded-lg bg-[var(--accent-neon)] text-black hover:brightness-110 disabled:opacity-30 transition-all shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
            </button>
          </div>
        </div>

        {/* Quick Command Action Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="font-code text-[0.65rem] text-[var(--text-dim)] uppercase py-1 pr-1 flex items-center">
            Quick Run:
          </span>
          {quickCommands.map((qc, idx) => (
            <button
              key={idx}
              onClick={() => handleExecute(qc.cmd)}
              onMouseEnter={() => sound.playHover()}
              className="px-2.5 py-1 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] font-code text-[0.68rem] text-[var(--text-muted)] hover:text-[var(--accent-neon)] transition-all"
            >
              {qc.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
