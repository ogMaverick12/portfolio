"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LogLine {
  text: string;
  type: "kernel" | "systemd" | "progress" | "logo" | "info" | "success" | "raw";
  time?: string;
  status?: string;
}

export default function BootScreen() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const logsContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (line: LogLine) => {
    setLines((prev) => [...prev, line]);
  };

  const updateLastLog = (text: string, status?: string) => {
    setLines((prev) => {
      if (prev.length === 0) return prev;
      const next = [...prev];
      next[next.length - 1] = { ...next[next.length - 1], text, status };
      return next;
    });
  };

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const hasBooted = localStorage.getItem("portfolio-booted") === "true";

    if (isMobile || hasBooted) {
      return;
    }

    setShow(true);
    setMounted(true);
    document.body.style.overflow = "hidden";

    const timeouts: NodeJS.Timeout[] = [];

    const runSequence = async () => {
      const sleep = (ms: number) =>
        new Promise<void>((resolve) => {
          const t = setTimeout(resolve, ms);
          timeouts.push(t);
        });

      // 1. Kernel init
      addLog({ text: "Booting Linux kernel version 6.12.0-mav-edge-x86_64...", type: "kernel", time: "0.000000" });
      await sleep(60);
      addLog({ text: "x86/fpu: Supporting XSAVE feature 0x01: 'x87 floating point registers'", type: "kernel", time: "0.000004" });
      await sleep(40);
      addLog({ text: "Memory: 8192MB RAM physical mapped (6.4GB usable for inference)", type: "kernel", time: "0.000010" });
      await sleep(50);
      addLog({ text: "ACPI: Core revision 20260115 initialization complete.", type: "kernel", time: "0.021045" });
      await sleep(40);
      addLog({ text: "Storage: EXT4-fs (sda1): mounted root filesystem (ordered mode)", type: "kernel", time: "0.045102" });
      await sleep(60);
      addLog({ text: "CPU0: BCM2712 Quad-Core Cortex-A76 @ 2.40 GHz (ARMv8-A)", type: "kernel", time: "0.089122" });
      await sleep(100);

      // 2. systemd services
      addLog({ text: "Started Journal Daemon Service.", type: "systemd", status: "OK" });
      await sleep(80);
      addLog({ text: "Created slice User Application Slice.", type: "systemd", status: "OK" });
      await sleep(60);
      addLog({ text: "Reached target PathForge Decision Router Engine.", type: "systemd", status: "OK" });
      await sleep(90);
      addLog({ text: "Initialized SoilSense Quantization Core (4-bit Gemma-4).", type: "systemd", status: "OK" });
      await sleep(70);
      addLog({ text: "Mapped PrepPilot Adaptive Feedback Handlers.", type: "systemd", status: "OK" });
      await sleep(80);
      addLog({ text: "Activated Local Socket Handshake with MavCore Node.", type: "systemd", status: "OK" });
      await sleep(150);

      // 3. Simulated progress loading
      addLog({ text: "Loading Gemma-4 weights: [░░░░░░░░░░░░░░░░░░░░] 0%", type: "progress" });
      await sleep(80);
      updateLastLog("Loading Gemma-4 weights: [████░░░░░░░░░░░░░░░░] 20%");
      await sleep(80);
      updateLastLog("Loading Gemma-4 weights: [████████░░░░░░░░░░░░] 40%");
      await sleep(80);
      updateLastLog("Loading Gemma-4 weights: [████████████░░░░░░░░] 60%");
      await sleep(80);
      updateLastLog("Loading Gemma-4 weights: [████████████████░░░░] 80%");
      await sleep(80);
      updateLastLog("Loading Gemma-4 weights: [████████████████████] 100% [SUCCESS]", "SUCCESS");
      await sleep(100);

      addLog({ text: "Allocating inference memory: [░░░░░░░░░░░░░░░░░░░░] 0%", type: "progress" });
      await sleep(80);
      updateLastLog("Allocating inference memory: [██████████░░░░░░░░░░] 50%");
      await sleep(80);
      updateLastLog("Allocating inference memory: [████████████████████] 100% [SUCCESS]", "SUCCESS");
      await sleep(150);

      // 4. Custom Neofetch Panel
      addLog({ text: "\n", type: "raw" });
      addLog({ text: "   __  ___           ______     __", type: "logo" });
      addLog({ text: "  /  |/  /___ __   _/ ____/____/ /___ ____", type: "logo" });
      addLog({ text: " / /|_/ / __ `/ | / / __/ / __  / __ `/ _ \\", type: "logo" });
      addLog({ text: "/_/  /_/\\__,_/ |___/_____/\\__,_/\\__, /\\___/", type: "logo" });
      addLog({ text: "                               /____/", type: "logo" });
      addLog({ text: "  MAV-EDGE OS v4.16.0-lts (x86_64) diagnostics", type: "logo" });
      addLog({ text: "  -------------------------------------------------", type: "logo" });
      addLog({ text: "  OS: MavEdge GNU/Linux 2026.06", type: "info" });
      addLog({ text: "  Kernel: 6.12.0-edge-inference-lts", type: "info" });
      addLog({ text: "  Host: Raspberry Pi 5 Model B Rev 1.1 (8GB)", type: "info" });
      addLog({ text: "  Uptime: 0m", type: "info" });
      addLog({ text: "  CPU: BCM2712 Quad-Core Cortex-A76 @ 2.40 GHz", type: "info" });
      addLog({ text: "  Memory: 6428MiB / 8192MiB (78%)", type: "info" });
      addLog({ text: "  LLM Quantization: Gemma-4-4bit (Local Inference)", type: "info" });
      addLog({ text: "  Status: SYSTEM ONLINE (https://sreejitdev.app)", type: "info" });
      addLog({ text: "  -------------------------------------------------", type: "logo" });
      addLog({ text: "\n", type: "raw" });
      await sleep(400);

      // 5. Success check & complete
      addLog({ text: "GUI display server active. Launching portfolio interface...", type: "success" });
      await sleep(350);

      handleComplete();
    };

    runSequence();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        handleComplete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const handleComplete = () => {
      localStorage.setItem("portfolio-booted", "true");
      document.body.style.overflow = "";
      setShow(false);
    };

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      timeouts.forEach(clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  const handleManualSkip = () => {
    localStorage.setItem("portfolio-booted", "true");
    document.body.style.overflow = "";
    setShow(false);
  };

  if (!show || !mounted) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="boot-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4, ease: "easeOut" } }}
        className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-8 md:p-16 font-mono text-[0.82rem] leading-relaxed text-accent select-none"
      >
        {/* Terminal Header */}
        <div className="flex justify-between items-center border-b border-border/40 pb-4 opacity-75">
          <div>DEVICE: MAV-EDGE-01</div>
          <div>STATUS: RUNNING_BOOT_SEQUENCE</div>
        </div>

        {/* Boot Logs Container */}
        <div
          ref={logsContainerRef}
          className="flex-1 py-8 overflow-y-auto flex flex-col justify-start gap-2 pr-2 scrollbar-thin scrollbar-thumb-border"
        >
          {lines.map((line, idx) => {
            if (line.type === "raw") {
              return <div key={idx} className="h-4" />;
            }
            if (line.type === "kernel") {
              return (
                <div key={idx} className="flex gap-3 text-muted2 font-mono text-[0.78rem]">
                  <span className="text-muted/40 select-none w-[90px] inline-block text-right pr-2">
                    [{line.time}]
                  </span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === "systemd") {
              return (
                <div key={idx} className="flex gap-3 text-text font-mono text-[0.78rem]">
                  <span className="text-[#7ec891] font-semibold select-none w-[90px] inline-block text-center pr-2">
                    [&nbsp;{line.status || "OK"}&nbsp;]
                  </span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === "progress") {
              const isSuccess = line.status === "SUCCESS";
              return (
                <div
                  key={idx}
                  className={`flex gap-3 font-mono text-[0.78rem] ${
                    isSuccess ? "text-[#7ec891]" : "text-accent"
                  }`}
                >
                  <span className="text-muted/40 select-none w-[90px] inline-block text-center pr-2">
                    [&nbsp;LOAD&nbsp;]
                  </span>
                  <span>{line.text}</span>
                </div>
              );
            }
            if (line.type === "logo") {
              return (
                <div key={idx} className="font-mono text-accent text-[0.75rem] whitespace-pre leading-tight pl-2">
                  {line.text}
                </div>
              );
            }
            if (line.type === "info") {
              return (
                <div key={idx} className="font-mono text-muted2 text-[0.75rem] pl-2">
                  {line.text}
                </div>
              );
            }
            if (line.type === "success") {
              return (
                <div key={idx} className="flex gap-3 text-[#7ec891] font-mono text-[0.8rem] font-bold pl-2">
                  <span className="select-none">→</span>
                  <span>{line.text}</span>
                </div>
              );
            }
            return null;
          })}
        </div>

        {/* Skip Prompt */}
        <div className="flex justify-between items-center border-t border-border/40 pt-4 opacity-75 text-[0.72rem]">
          <div>PRESS [ESC / ENTER] TO BYPASS</div>
          <button
            onClick={handleManualSkip}
            className="hover:text-text hover:underline transition-all duration-200 uppercase cursor-pointer"
          >
            skip boot ↗
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
