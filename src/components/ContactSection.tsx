import React, { useState } from "react";
import { sound } from "../lib/sound";
import { triggerParticleExplosion } from "../lib/animeEffects";
import confetti from "canvas-confetti";
import {
  Mail,
  Linkedin,
  Github,
  Twitter,
  Copy,
  Check,
  Send,
  Sparkles,
  ExternalLink,
  MessageSquare,
  Globe,
} from "lucide-react";

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [briefingTopic, setBriefingTopic] = useState("Edge AI Systems & Offline LLMs");
  const [senderName, setSenderName] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);

  const emailAddress = "sreejit.dev12@gmail.com";

  const copyEmail = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playClick();
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);

    const rect = e.currentTarget.getBoundingClientRect();
    triggerParticleExplosion(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      35,
      ["#F27D26", "#10B981", "#E07A5F", "#FBBF24", "#FFFFFF"]
    );

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#d4ff4a", "#00f5a0", "#c084fc"],
    });
    sound.playSuccess();
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sound.playClick();
    sound.playSuccess();
    setMessageSent(true);

    // Trigger Anime.js radial burst from form button position
    const submitBtn = (e.currentTarget.querySelector("button[type='submit']") || e.currentTarget) as HTMLElement;
    const rect = submitBtn.getBoundingClientRect();
    const clickX = rect.left + rect.width / 2;
    const clickY = rect.top + rect.height / 2;

    triggerParticleExplosion(clickX, clickY, 48, [
      "#F27D26",
      "#10B981",
      "#FBBF24",
      "#38BDF8",
      "#FFFFFF",
    ]);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.7 },
      colors: ["#d4ff4a", "#00f5a0", "#fbbf24"],
    });

    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
      `[Portfolio Outreach] ${briefingTopic} - from ${senderName || "Collaborator"}`
    )}&body=${encodeURIComponent(senderMessage || "Hello Sreejit, I saw your portfolio and would like to connect!")}`;

    window.open(mailtoUrl, "_blank");
  };

  const socialLinks = [
    {
      label: "GitHub",
      url: "https://github.com/ogMaverick12",
      handle: "@ogMaverick12",
      icon: Github,
    },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/sreejit-pradhan-b27b19401",
      handle: "sreejit-pradhan",
      icon: Linkedin,
    },
    {
      label: "Twitter / X",
      url: "https://x.com/SreejitX",
      handle: "@SreejitX",
      icon: Twitter,
    },
    {
      label: "Dev.to",
      url: "https://dev.to/sreejit_",
      handle: "@sreejit_",
      icon: Globe,
    },
  ];

  return (
    <section
      id="contact"
      className="py-24 px-4 sm:px-8 border-b border-[var(--border-subtle)] relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Quote Block */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <blockquote className="font-editorial text-2xl sm:text-4xl italic text-[var(--text-primary)] leading-snug">
            "Prompting is a superpower — the quality of an LLM's output is limited less by the model itself and more by the clarity, depth, and intelligence of the prompt behind it."
          </blockquote>
          <div className="font-code text-xs text-[var(--accent-neon)] uppercase tracking-widest mt-6">
            — Sreejit Pradhan · Age 16
          </div>
        </div>

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <Mail className="w-3.5 h-3.5" />
              <span>Section 09 · Collaboration & Contact</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              Let's <span className="italic text-[var(--accent-neon)]">build together.</span>
            </h2>
          </div>

          <p className="text-sm text-[var(--text-muted)] max-w-md font-normal">
            Open to discussing edge AI hardware implementations, competitive programming problem sets, and hackathon teams.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
          {/* Left: Interactive Briefing Message Composer */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] shadow-2xl">
            <div className="flex items-center gap-2 font-code text-xs text-[var(--accent-neon)] uppercase tracking-wider mb-4">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Compose Quick Outreach / Project Inquiry</span>
            </div>

            <form onSubmit={handleSendMessage} className="space-y-4 font-code text-xs">
              <div>
                <label className="text-[var(--text-dim)] uppercase text-[0.62rem] block mb-1">
                  Topic of Collaboration
                </label>
                <select
                  value={briefingTopic}
                  onChange={(e) => setBriefingTopic(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-neon)] cursor-pointer"
                >
                  <option value="Edge AI Systems & Offline LLMs">Edge AI Systems & Offline LLMs (Gemma 4 / Pi)</option>
                  <option value="Competitive Programming & Algorithms">Competitive Programming & Algorithms (C++)</option>
                  <option value="Hackathon Team / Open Source Collab">Hackathon Team / Open Source Project</option>
                  <option value="General Technical Exchange">General Technical Exchange</option>
                </select>
              </div>

              <div>
                <label className="text-[var(--text-dim)] uppercase text-[0.62rem] block mb-1">
                  Your Name or Handle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex (Engineer / Recruiter)"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-neon)]"
                />
              </div>

              <div>
                <label className="text-[var(--text-dim)] uppercase text-[0.62rem] block mb-1">
                  Message / Briefing Note
                </label>
                <textarea
                  rows={4}
                  placeholder="Share details about the project, inquiry, or question..."
                  value={senderMessage}
                  onChange={(e) => setSenderMessage(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] outline-none focus:border-[var(--accent-neon)] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[var(--accent-neon)] text-black font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--glow-color)] text-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch Mail Client with Pre-filled Briefing</span>
              </button>

              {messageSent && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-center">
                  ✓ Mail composer generated successfully! Looking forward to connecting.
                </div>
              )}
            </form>
          </div>

          {/* Right: Direct Channels Bento */}
          <div className="flex flex-col gap-4">
            {/* Direct Copyable Email Card */}
            <div className="p-6 rounded-2xl glass-panel border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] transition-all">
              <div className="font-code text-xs text-[var(--text-dim)] uppercase tracking-wider mb-2">
                Primary Direct Channel
              </div>
              <div className="font-code text-sm font-bold text-[var(--text-primary)] truncate mb-4">
                {emailAddress}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={copyEmail}
                  className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] font-code text-xs text-[var(--text-primary)] hover:text-[var(--accent-neon)] transition-all flex items-center gap-1.5"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${emailAddress}`}
                  onClick={() => sound.playClick()}
                  className="px-4 py-2 rounded-xl bg-[var(--accent-neon)]/10 text-[var(--accent-neon)] border border-[var(--accent-neon)]/30 hover:bg-[var(--accent-neon)] hover:text-black font-code text-xs font-semibold transition-all flex items-center gap-1.5"
                >
                  <span>Open Mailto</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Social Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((s, idx) => {
                const Icon = s.icon;
                return (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => sound.playHover()}
                    onClick={() => sound.playClick()}
                    className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] transition-all flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between font-code text-xs text-[var(--text-dim)] mb-2">
                      <span>{s.label}</span>
                      <ExternalLink className="w-3 h-3 group-hover:text-[var(--accent-neon)] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-[var(--accent-neon)]" />
                      <span className="font-code text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors truncate">
                        {s.handle}
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
