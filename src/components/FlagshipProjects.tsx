import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { animate, createScope, stagger } from "animejs";
import { FLAGSHIP_PROJECTS } from "../data/portfolioData";
import { FlagshipProject } from "../types";
import { sound } from "../lib/sound";
import { attachCardParallax } from "../lib/animeEffects";
import {
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  Github,
  Play,
  CheckCircle,
  AlertTriangle,
  Flame,
  ArrowRight,
  RefreshCw,
  Sliders,
  Terminal as TerminalIcon,
  HelpCircle,
  ChevronRight,
  Copy,
  Check,
  Code2,
} from "lucide-react";

interface ProjectCodeSpec {
  filename: string;
  language: string;
  description: string;
  code: string;
}

const PROJECT_CODE_SPECS: Record<string, ProjectCodeSpec> = {
  soilsense: {
    filename: "soilsense_edge_infer.py",
    language: "Python / C++ GGML",
    description: "Hardware ADC voltage reading and quantized Gemma 4 local inference loop",
    code: `import time
from embedded_drivers import ADS1115ADC, SoilCalibrator
from llama_cpp import Llama

# 1. Initialize 16-bit ADC over I2C bus 1 (Fast-mode 400kHz)
adc = ADS1115ADC(bus=1, address=0x48, gain=1)
calibrator = SoilCalibrator(soil_type="alluvial_siliguri")

# 2. Load Quantized 4-bit Gemma 4 weights onto ARM64 CPU cache
llm = Llama(
    model_path="./weights/gemma-4-2.6b-q4_k_m.gguf",
    n_ctx=512,
    n_threads=4,
    verbose=False
)

def run_agronomy_cycle():
    raw_v = adc.read_all_channels() # [CH0: N, CH1: P, CH2: K, CH3: pH]
    n, p, k, ph = calibrator.transform_to_agronomy(raw_v)
    
    prompt = (
        f"<start_of_turn>user\\n"
        f"Soil Telemetry: N={n}mg/kg, P={p}mg/kg, K={k}mg/kg, pH={ph:.2f}. "
        f"Provide short, actionable agronomy prescription for local crops.<end_of_turn>\\n"
        f"<start_of_turn>model\\n"
    )
    
    start_t = time.perf_counter()
    output = llm(prompt, max_tokens=150, temperature=0.2, stop=["<end_of_turn>"])
    elapsed_ms = (time.perf_counter() - start_t) * 1000
    
    print(f"[EDGE] Inference complete in {elapsed_ms:.1f}ms (Cost: $0.00)")
    return output["choices"][0]["text"]`,
  },
  pathforge: {
    filename: "curriculum_compiler.ts",
    language: "TypeScript / DAG Engine",
    description: "Topological prerequisite sort and dynamic learning graph compiler",
    code: `import { IBMGraniteClient } from "@ibm/granite-sdk";

export interface SkillNode {
  id: string;
  title: string;
  prerequisites: string[];
  estimatedHours: number;
}

export class RoadmapCompiler {
  private granite = new IBMGraniteClient({ model: "granite-3b-instruct" });

  async compileDAG(careerTarget: string, userBackground: string[]): Promise<SkillNode[]> {
    const schema = {
      type: "object",
      properties: {
        nodes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              title: { type: "string" },
              prerequisites: { type: "array", items: { type: "string" } },
              estimatedHours: { type: "number" }
            },
            required: ["id", "title", "prerequisites", "estimatedHours"]
          }
        }
      }
    };

    const response = await this.granite.generateJSON({
      prompt: \`Generate a strictly acyclic curriculum DAG for \${careerTarget}. Known: \${userBackground.join(", ")}\`,
      schema
    });

    return this.topologicalSort(response.nodes);
  }

  private topologicalSort(nodes: SkillNode[]): SkillNode[] {
    const visited = new Set<string>();
    const order: SkillNode[] = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    const visit = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const node = nodeMap.get(id);
      if (node) {
        node.prerequisites.forEach(pre => visit(pre));
        order.push(node);
      }
    };

    nodes.forEach(n => visit(n.id));
    return order;
  }
}`,
  },
  preppilot: {
    filename: "adaptive_evaluator.py",
    language: "Python / Gemini Critic",
    description: "Adaptive candidate memory graph tracking conceptual invariant failures",
    code: `from dataclasses import dataclass
from typing import List, Dict
import google.genai as genai

@dataclass
class ConceptualGap:
    invariant_id: str
    failure_frequency: int
    last_context: str

class AdaptiveExamEngine:
    def __init__(self):
        self.ai = genai.Client()
        self.gap_catalog: Dict[str, ConceptualGap] = {}

    def record_mistake(self, candidate_code: str, failed_test_case: str, invariant: str):
        if invariant not in self.gap_catalog:
            self.gap_catalog[invariant] = ConceptualGap(invariant, 0, "")
        self.gap_catalog[invariant].failure_frequency += 1
        self.gap_catalog[invariant].last_context = failed_test_case

    def synthesize_counter_probe(self, top_gap: str) -> str:
        prompt = (
            f"Candidate struggles with invariant: '{top_gap}'. "
            f"Generate a targeted coding question that forces this exact boundary condition."
        )
        response = self.ai.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text`,
  },
};

export const FlagshipProjects: React.FC = () => {
  const [activeProject, setActiveProject] = useState<FlagshipProject>(FLAGSHIP_PROJECTS[0]);
  const [activeTab, setActiveTab] = useState<"simulator" | "architecture" | "metrics">("simulator");
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Anime.js viewport reveal & card parallax
  useEffect(() => {
    if (!containerRef.current) return;

    // Attach mouse-follow parallax to project selector cards and main showcase
    const cardTabs = containerRef.current.querySelectorAll<HTMLElement>(".project-card-tab");
    const cleanups: (() => void)[] = [];
    cardTabs.forEach((card) => {
      cleanups.push(attachCardParallax(card, 6, 4));
    });

    const mainPanel = containerRef.current.querySelector<HTMLElement>(".project-content-panel");
    if (mainPanel) {
      cleanups.push(attachCardParallax(mainPanel, 4, 2));
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Header badge & title stagger
            animate(".flagship-header-item", {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 650,
              delay: stagger(80),
              ease: "outExpo",
            });

            // Project cards stagger based on index
            animate(".project-card-tab", {
              opacity: [0, 1],
              translateY: [28, 0],
              scale: [0.96, 1],
              duration: 750,
              delay: stagger(100, { start: 120 }),
              ease: "outExpo",
            });

            // Main project showcase panel entrance
            animate(".project-content-panel", {
              opacity: [0, 1],
              translateY: [32, 0],
              duration: 800,
              delay: 320,
              ease: "outExpo",
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    observer.observe(containerRef.current);

    // Periodic animated glass-surface light-sweep effect
    const triggerLightSweep = () => {
      animate(".card-light-sheen", {
        translateX: ["-160%", "180%"],
        opacity: [0, 0.8, 0],
        duration: 1300,
        delay: stagger(180),
        ease: "easeInOutCubic",
      });
    };

    const initialSweepTimer = setTimeout(triggerLightSweep, 1400);
    const sweepInterval = setInterval(triggerLightSweep, 5500);

    return () => {
      observer.disconnect();
      clearTimeout(initialSweepTimer);
      clearInterval(sweepInterval);
      cleanups.forEach((fn) => fn());
    };
  }, []);

  const handleSelectProject = (proj: FlagshipProject) => {
    sound.playClick();
    setActiveProject(proj);
    animate(".project-content-panel", {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 400,
      ease: "outQuad",
    });
  };

  const handleSelectTab = (tab: "simulator" | "architecture" | "metrics") => {
    sound.playClick();
    setActiveTab(tab);
    animate(".project-tab-view", {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 350,
      ease: "outQuad",
    });
  };

  // === SoilSense AI Simulator State ===
  const [nitrogen, setNitrogen] = useState(42);
  const [phosphorus, setPhosphorus] = useState(18);
  const [potassium, setPotassium] = useState(65);
  const [moisture, setMoisture] = useState(38);
  const [ph, setPh] = useState(6.4);
  const [isInferring, setIsInferring] = useState(false);
  const [soilDiagnosis, setSoilDiagnosis] = useState<{
    status: "OPTIMAL" | "DEFICIENT" | "CRITICAL";
    cropSuitability: string;
    prescription: string;
    deficiencyText: string;
  } | null>(null);

  // === PathForge AI Simulator State ===
  const [selectedGoal, setSelectedGoal] = useState("edge_ai");
  const [isGeneratingGraph, setIsGeneratingGraph] = useState(false);

  // === PrepPilot Simulator State ===
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Run initial SoilSense inference
  useEffect(() => {
    runSoilInference();
  }, []);

  const runSoilInference = () => {
    sound.playKey();
    setIsInferring(true);
    setTimeout(() => {
      let status: "OPTIMAL" | "DEFICIENT" | "CRITICAL" = "OPTIMAL";
      let cropSuitability = "Wheat, Mustard, Legumes";
      let prescription = "Soil nitrogen balance is stable. Add 5kg/acre compost to sustain micro-organisms.";
      let deficiencyText = "None detected.";

      if (nitrogen < 30) {
        status = "DEFICIENT";
        cropSuitability = "Legumes, Pulses (Nitrogen-fixing crops)";
        prescription = "Apply Urea (46% N) at 20kg/hectare or incorporate bio-fertilizer Rhizobium culture.";
        deficiencyText = "Low Nitrogen (N) detected. Leaf chlorosis risk.";
      } else if (ph < 5.8) {
        status = "CRITICAL";
        cropSuitability = "Tea, Acid-tolerant varieties";
        prescription = "Soil is acidic (pH < 5.8). Apply Agricultural Lime (CaCO3) at 200kg/acre before seeding.";
        deficiencyText = "Acidic Soil Stress. Phosphorus lockup likely.";
      } else if (moisture < 25) {
        status = "DEFICIENT";
        cropSuitability = "Millets, Sorghum, Drought-hardy crops";
        prescription = "Soil moisture critically low. Schedule drip irrigation immediately before nutrient dosing.";
        deficiencyText = "Moisture deficit (<25%). Root absorption impaired.";
      }

      setSoilDiagnosis({ status, cropSuitability, prescription, deficiencyText });
      setIsInferring(false);
      sound.playSuccess();
    }, 450);
  };

  const pathForgeRoadmaps: Record<string, { title: string; nodes: string[]; days: string; difficulty: string }> = {
    edge_ai: {
      title: "Edge AI & Offline LLM Systems",
      days: "45 Days",
      difficulty: "Advanced",
      nodes: [
        "1. C++ Pointers & Memory Boundaries",
        "2. GGML & 4-bit Quantization Math",
        "3. Raspberry Pi GPIO & ADC Drivers",
        "4. Gemma 4 GGML Engine Compilation",
        "5. Zero-Cloud Telemetry & Local Shell",
      ],
    },
    cp_expert: {
      title: "Competitive Programming (C++ & Big-O)",
      days: "60 Days",
      difficulty: "Intense",
      nodes: [
        "1. STL Containers (Vector, Map, Priority Queue)",
        "2. Binary Search on Answer & Monotonic Predicates",
        "3. Two Pointers & Sliding Window Invariants",
        "4. Fast Number Theory & Sieve of Eratosthenes",
        "5. Asymptotic Time & Memory Proofs",
      ],
    },
    distributed_cloud: {
      title: "Google Cloud Infrastructure & DevOps",
      days: "30 Days",
      difficulty: "Intermediate",
      nodes: [
        "1. VPC Networking & Subnets",
        "2. GKE Operations & Pod Deployments",
        "3. Cloud Security & IAM Least Privilege",
        "4. CI/CD DevOps Workflows with Cloud Build",
        "5. Multi-Region Serverless Architecture",
      ],
    },
  };

  const prepPilotQuizzes = [
    {
      q: "In C++, what occurs when you push_back to a std::vector whose size() has reached its capacity()?",
      options: [
        "It crashes immediately with std::out_of_range",
        "It allocates new contiguous memory (~2x), copies elements, and invalidates all existing iterators/pointers",
        "It links an auxiliary node without reallocating existing addresses",
        "It silently drops the pushed element",
      ],
      correct: 1,
      concept: "Vector Iterator Invalidation & Amortized O(1) Growth",
      counterExample: "Remember: Any pointer pointing to old elements before capacity reallocation becomes a dangling pointer!",
    },
    {
      q: "Why is Gemma 4 4-bit quantization suitable for Raspberry Pi without GPUs?",
      options: [
        "It converts float32 weights to 4-bit integers, shrinking RAM footprint from ~8GB to <2.2GB with minimal perplexity loss",
        "It deletes all transformer attention layers",
        "It requires a cloud server to decode the 4-bit tokens",
        "It doubles the CPU clock frequency",
      ],
      correct: 0,
      concept: "Weight Quantization & Memory Bandwidth Bounds",
      counterExample: "LLM execution on CPU is memory-bandwidth bound. 4-bit quantization reduces memory bandwidth traffic by 4x!",
    },
    {
      q: "What is the worst-case time complexity of std::sort in standard C++17 implementations?",
      options: [
        "O(N^2) due to worst-case Quicksort pivots",
        "O(N log N) guaranteed by Introsort (Quicksort + Heapsort fallback)",
        "O(N) with Radix sort",
        "O(log N)",
      ],
      correct: 1,
      concept: "Introsort Guarantee in C++ STL",
      counterExample: "Standard C++ uses Introsort, which falls back to Heapsort if Quicksort recursion depth exceeds 2 * log2(N).",
    },
  ];

  const handleSelectQuizOption = (optIdx: number) => {
    sound.playClick();
    setSelectedAnswer(optIdx);
    const curr = prepPilotQuizzes[quizQuestionIndex];
    if (optIdx === curr.correct) {
      setQuizFeedback(`Correct! Invariant Verified: ${curr.concept}`);
      sound.playSuccess();
    } else {
      setQuizFeedback(`Misconception Detected! ${curr.counterExample}`);
    }
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="py-24 px-4 sm:px-8 border-b border-[var(--border-subtle)] relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flagship-header-item inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <Layers className="w-3.5 h-3.5" />
              <span>Section 01 · Flagship Systems</span>
            </div>
            <h2 className="flagship-header-item font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              Real systems, <span className="italic text-[var(--accent-neon)]">zero cloud vanity.</span>
            </h2>
          </div>

          <p className="flagship-header-item text-sm text-[var(--text-muted)] max-w-md font-normal">
            Production-grade open-source systems prioritizing offline resilience, low token overhead, and edge hardware.
          </p>
        </div>

        {/* Project Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {FLAGSHIP_PROJECTS.map((proj) => {
            const isSelected = activeProject.id === proj.id;
            return (
              <motion.button
                key={proj.id}
                whileHover={{ scale: 1.02, y: -3 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => handleSelectProject(proj)}
                onMouseEnter={() => sound.playHover()}
                className={`project-card-tab p-4 rounded-xl text-left border transition-colors relative overflow-hidden group ${
                  isSelected
                    ? "glass-panel bg-[var(--bg-tertiary)] border-[var(--accent-neon)] shadow-[0_0_20px_var(--glow-color)]"
                    : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-white/20 text-[var(--text-muted)]"
                }`}
              >
                {/* Anime.js Glass-Surface Light Sweep Reflection */}
                <div
                  className="card-light-sheen absolute inset-0 pointer-events-none opacity-0"
                  style={{
                    background:
                      "linear-gradient(110deg, transparent 20%, rgba(242,125,38,0.15) 45%, rgba(255,255,255,0.35) 50%, rgba(242,125,38,0.15) 55%, transparent 80%)",
                    transform: "translateX(-160%) skewX(-20deg)",
                  }}
                />

                <div className="flex items-center justify-between font-code text-[0.65rem] mb-2">
                  <span className="uppercase text-[var(--text-dim)]">{proj.category}</span>
                  <span className="text-[var(--accent-neon)] font-bold">{proj.metric}</span>
                </div>
                <div className="font-code text-sm font-bold text-[var(--text-primary)] mb-1">
                  {proj.name}
                </div>
                <div className="text-xs text-[var(--text-muted)] line-clamp-1">
                  {proj.tagline}
                </div>

                {isSelected && (
                  <motion.span
                    layoutId="activeFlagshipUnderline"
                    className="absolute bottom-0 left-4 right-4 h-[2px] bg-[var(--accent-neon)] rounded-full shadow-[0_0_8px_var(--glow-color)]"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Active Project Main Showcase Card */}
        <div className="project-content-panel glass-panel rounded-2xl border border-[var(--border-subtle)] overflow-hidden shadow-2xl relative">
          {/* Glass-Surface Light Sweep Reflection */}
          <div
            className="card-light-sheen absolute inset-0 pointer-events-none opacity-0 z-30"
            style={{
              background:
                "linear-gradient(115deg, transparent 20%, rgba(255,77,38,0.08) 40%, rgba(255,255,255,0.28) 50%, rgba(255,77,38,0.08) 60%, transparent 80%)",
              transform: "translateX(-180%) skewX(-24deg)",
            }}
          />

          {/* Top Project Sub-Navigation & Meta */}
          <div className="p-6 sm:p-8 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-editorial text-2xl sm:text-4xl text-[var(--text-primary)] font-medium">
                  {activeProject.name}
                </h3>
                <span className="cyber-badge">{activeProject.category}</span>
              </div>
              <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-2xl">
                {activeProject.valueProp}
              </p>
            </div>

            {/* Links & Sub-tabs */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Simulator / Architecture / Metrics Switcher */}
              <div className="p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center font-code text-xs relative">
                <button
                  onClick={() => handleSelectTab("simulator")}
                  className={`relative px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 select-none ${
                    activeTab === "simulator"
                      ? "text-black font-semibold"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {activeTab === "simulator" && (
                    <motion.div
                      layoutId="activeFlagshipTabPill"
                      className="absolute inset-0 bg-[var(--accent-neon)] rounded-lg shadow-sm -z-0"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Play className="w-3 h-3 fill-current" />
                    <span>Simulator</span>
                  </span>
                </button>
                <button
                  onClick={() => handleSelectTab("architecture")}
                  className={`relative px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 select-none ${
                    activeTab === "architecture"
                      ? "text-black font-semibold"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {activeTab === "architecture" && (
                    <motion.div
                      layoutId="activeFlagshipTabPill"
                      className="absolute inset-0 bg-[var(--accent-neon)] rounded-lg shadow-sm -z-0"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Cpu className="w-3 h-3" />
                    <span>Architecture</span>
                  </span>
                </button>
                <button
                  onClick={() => handleSelectTab("metrics")}
                  className={`relative px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 select-none ${
                    activeTab === "metrics"
                      ? "text-black font-semibold"
                      : "text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {activeTab === "metrics" && (
                    <motion.div
                      layoutId="activeFlagshipTabPill"
                      className="absolute inset-0 bg-[var(--accent-neon)] rounded-lg shadow-sm -z-0"
                      transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Sliders className="w-3 h-3" />
                    <span>Impact</span>
                  </span>
                </button>
              </div>

              {/* GitHub Link */}
              <motion.a
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                href={activeProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] text-[var(--text-primary)] font-code text-xs flex items-center gap-2 hover:text-[var(--accent-neon)] transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Source Code</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </motion.a>
            </div>
          </div>

          {/* TAB 1: INTERACTIVE SYSTEM SIMULATORS */}
          {activeTab === "simulator" && (
            <div className="p-6 sm:p-8">
              {/* 1. SoilSense AI Interactive Hardware Simulator */}
              {activeProject.id === "soilsense" && (
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
                  {/* Left: Interactive Sensor Dials */}
                  <div className="flex flex-col gap-6">
                    <div className="font-code text-xs text-[var(--text-dim)] uppercase tracking-wider flex items-center justify-between">
                      <span className="flex items-center gap-2 text-[var(--text-primary)] font-medium">
                        <Sliders className="w-4 h-4 text-[var(--accent-neon)]" />
                        Hardware Sensor Telemetry (ADC ADS1115 Channels)
                      </span>
                      <span>16-bit Precision</span>
                    </div>

                    <div className="space-y-4">
                      {/* Nitrogen */}
                      <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                        <div className="flex justify-between text-xs font-code mb-2">
                          <span className="text-[var(--text-muted)]">Nitrogen (N) Content</span>
                          <span className="font-bold text-[var(--accent-neon)]">{nitrogen} mg/kg</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="120"
                          value={nitrogen}
                          onChange={(e) => setNitrogen(Number(e.target.value))}
                          className="w-full accent-[var(--accent-neon)] cursor-pointer"
                        />
                      </div>

                      {/* Phosphorus & Potassium */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <div className="flex justify-between text-xs font-code mb-2">
                            <span className="text-[var(--text-muted)]">Phosphorus (P)</span>
                            <span className="font-bold text-emerald-400">{phosphorus} mg/kg</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="80"
                            value={phosphorus}
                            onChange={(e) => setPhosphorus(Number(e.target.value))}
                            className="w-full accent-emerald-400 cursor-pointer"
                          />
                        </div>

                        <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <div className="flex justify-between text-xs font-code mb-2">
                            <span className="text-[var(--text-muted)]">Potassium (K)</span>
                            <span className="font-bold text-amber-400">{potassium} mg/kg</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="150"
                            value={potassium}
                            onChange={(e) => setPotassium(Number(e.target.value))}
                            className="w-full accent-amber-400 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Moisture & pH */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <div className="flex justify-between text-xs font-code mb-2">
                            <span className="text-[var(--text-muted)]">Soil Moisture</span>
                            <span className="font-bold text-blue-400">{moisture}%</span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="90"
                            value={moisture}
                            onChange={(e) => setMoisture(Number(e.target.value))}
                            className="w-full accent-blue-400 cursor-pointer"
                          />
                        </div>

                        <div className="p-3.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <div className="flex justify-between text-xs font-code mb-2">
                            <span className="text-[var(--text-muted)]">Soil pH Level</span>
                            <span className="font-bold text-purple-400">{ph.toFixed(1)}</span>
                          </div>
                          <input
                            type="range"
                            min="4.0"
                            max="9.0"
                            step="0.1"
                            value={ph}
                            onChange={(e) => setPh(Number(e.target.value))}
                            className="w-full accent-purple-400 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={runSoilInference}
                      disabled={isInferring}
                      className="w-full py-3 rounded-xl bg-[var(--accent-neon)] text-black font-code text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_var(--glow-color)]"
                    >
                      {isInferring ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Quantized Gemma 4 Executing on ARM CPU...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-black" />
                          <span>Run Local Offline Inference (~380ms)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Right: Edge Output Terminal */}
                  <div className="flex flex-col h-full">
                    <div className="p-4 rounded-xl bg-[#09090d] border border-[var(--border-subtle)] font-code text-xs flex-1 flex flex-col justify-between">
                      {/* Terminal Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[var(--text-dim)] text-[0.68rem]">
                        <span className="flex items-center gap-1.5">
                          <TerminalIcon className="w-3.5 h-3.5 text-[var(--accent-neon)]" />
                          <span>gemma-4-4bit.ggml · Offline Output</span>
                        </span>
                        <span className="text-emerald-400 font-semibold">100% Zero Cloud</span>
                      </div>

                      {/* Diagnostic Stream Content */}
                      <div className="py-4 space-y-4 flex-1">
                        <div>
                          <div className="text-[0.65rem] text-[var(--text-dim)] uppercase">Soil Health Status</div>
                          <div
                            className={`text-base font-bold mt-0.5 flex items-center gap-2 ${
                              soilDiagnosis?.status === "OPTIMAL"
                                ? "text-emerald-400"
                                : soilDiagnosis?.status === "DEFICIENT"
                                ? "text-amber-400"
                                : "text-rose-400"
                            }`}
                          >
                            {soilDiagnosis?.status === "OPTIMAL" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertTriangle className="w-4 h-4" />
                            )}
                            <span>{soilDiagnosis?.status} SOIL BALANCE</span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[0.65rem] text-[var(--text-dim)] uppercase">Recommended Crop Rotation</div>
                          <div className="text-xs text-[var(--text-primary)] font-medium mt-0.5">
                            {soilDiagnosis?.cropSuitability}
                          </div>
                        </div>

                        <div>
                          <div className="text-[0.65rem] text-[var(--text-dim)] uppercase">Hardware Anomaly Assessment</div>
                          <div className="text-xs text-[var(--text-muted)] mt-0.5">
                            {soilDiagnosis?.deficiencyText}
                          </div>
                        </div>

                        <div className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                          <div className="text-[0.65rem] text-[var(--accent-neon)] font-bold uppercase mb-1">
                            Agronomy Prescription (Gemma 4 Edge)
                          </div>
                          <div className="text-xs text-[var(--text-primary)] leading-relaxed">
                            {soilDiagnosis?.prescription}
                          </div>
                        </div>
                      </div>

                      {/* Footer telemetry */}
                      <div className="pt-3 border-t border-white/10 flex justify-between text-[0.62rem] text-[var(--text-dim)]">
                        <span>Model: Gemma-4-E4B-Q4</span>
                        <span>Power Draw: 3.4W (Pi 4)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. PathForge AI Interactive Curriculum Graph */}
              {activeProject.id === "pathforge" && (
                <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8">
                  {/* Left: Goal Configuration */}
                  <div className="flex flex-col gap-4">
                    <div className="font-code text-xs text-[var(--text-dim)] uppercase tracking-wider">
                      Target Career Specification
                    </div>

                    {Object.entries(pathForgeRoadmaps).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => {
                          sound.playClick();
                          setSelectedGoal(key);
                        }}
                        className={`p-4 rounded-xl border text-left font-code text-xs transition-all ${
                          selectedGoal === key
                            ? "border-[var(--accent-neon)] bg-[var(--accent-neon)]/10 text-[var(--accent-neon)] font-bold shadow-sm"
                            : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-white/20"
                        }`}
                      >
                        <div className="flex justify-between mb-1">
                          <span>{data.title}</span>
                          <span className="text-[0.62rem] text-[var(--text-dim)]">{data.difficulty}</span>
                        </div>
                        <div className="text-[0.68rem] text-[var(--text-dim)]">Estimated Horizon: {data.days}</div>
                      </button>
                    ))}

                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-xs text-[var(--text-muted)]">
                      <div className="text-[var(--text-primary)] font-bold mb-1">IBM Granite Engine:</div>
                      Generates strict JSON schema graphs with zero hallucinations and topological sorting.
                    </div>
                  </div>

                  {/* Right: Interactive Compiled Graph Nodes */}
                  <div className="p-6 rounded-xl bg-[#0a0a0e] border border-[var(--border-subtle)] font-code text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[0.68rem] text-[var(--text-dim)]">
                        <span>COMPILED TOPOLOGICAL PREREQUISITES</span>
                        <span className="text-[var(--accent-neon)]">~0.6s Compilation Time</span>
                      </div>

                      <div className="space-y-3">
                        {pathForgeRoadmaps[selectedGoal].nodes.map((node, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] transition-all flex items-center justify-between group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="w-5 h-5 rounded-full bg-[var(--accent-neon)]/10 text-[var(--accent-neon)] text-[0.65rem] flex items-center justify-center font-bold">
                                {i + 1}
                              </span>
                              <span className="text-[var(--text-primary)] text-xs group-hover:text-[var(--accent-neon)] transition-colors">
                                {node}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[var(--text-dim)] group-hover:translate-x-1 transition-transform" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-[0.65rem] text-[var(--text-dim)]">
                      <span>DAG Dependencies: Verified Complete</span>
                      <span className="text-emerald-400">Status: Validated JSON Schema</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. PrepPilot Adaptive Question Evaluator */}
              {activeProject.id === "preppilot" && (
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
                  {/* Left: Code Question & Options */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between font-code text-xs text-[var(--text-dim)]">
                      <span>SCENARIO {quizQuestionIndex + 1} OF {prepPilotQuizzes.length}</span>
                      <span className="text-[var(--accent-neon)]">Adaptive Difficulty · 100% Invariant Checking</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                      {prepPilotQuizzes[quizQuestionIndex].q}
                    </div>

                    <div className="space-y-2.5">
                      {prepPilotQuizzes[quizQuestionIndex].options.map((opt, optIdx) => {
                        const isChosen = selectedAnswer === optIdx;
                        const isCorrect = optIdx === prepPilotQuizzes[quizQuestionIndex].correct;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(optIdx)}
                            className={`w-full p-3.5 rounded-xl border text-left font-code text-xs transition-all flex items-start gap-3 ${
                              isChosen
                                ? isCorrect
                                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-300"
                                  : "bg-rose-500/10 border-rose-500 text-rose-300"
                                : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] hover:border-white/20 text-[var(--text-muted)]"
                            }`}
                          >
                            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-[0.65rem] font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span className="leading-snug">{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button
                        onClick={() => {
                          sound.playClick();
                          setSelectedAnswer(null);
                          setQuizFeedback(null);
                          setQuizQuestionIndex((prev) => (prev + 1) % prepPilotQuizzes.length);
                        }}
                        className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] font-code text-xs text-[var(--text-primary)] hover:text-[var(--accent-neon)] transition-all flex items-center gap-1.5"
                      >
                        <span>Next Probe Question</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Right: Real-time Gemini Misconception Breakdown */}
                  <div className="p-5 rounded-xl bg-[#09090d] border border-[var(--border-subtle)] font-code text-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10 text-[0.68rem] text-[var(--text-dim)]">
                        <span>ADAPTIVE EVALUATION FEEDBACK</span>
                        <span className="text-[var(--accent-neon)]">Gemini API Latency: ~0.4s</span>
                      </div>

                      {quizFeedback ? (
                        <div className="space-y-4">
                          <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                            <div className="text-[0.62rem] text-[var(--accent-neon)] uppercase font-bold mb-1">
                              Analysis Assessment
                            </div>
                            <div className="text-xs text-[var(--text-primary)] leading-relaxed">
                              {quizFeedback}
                            </div>
                          </div>

                          <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                            <div className="text-[0.62rem] text-[var(--text-dim)] uppercase mb-1">
                              Target Concept Invariant
                            </div>
                            <div className="text-xs text-amber-300 font-medium">
                              {prepPilotQuizzes[quizQuestionIndex].concept}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 text-center text-[var(--text-dim)]">
                          <HelpCircle className="w-8 h-8 mx-auto mb-3 opacity-40" />
                          <p>Select an option on the left to trigger the adaptive reasoning engine.</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/10 text-[0.65rem] text-[var(--text-dim)] flex justify-between">
                      <span>Engine: Gemini 2.5 Flash</span>
                      <span>Adaptive State: Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ARCHITECTURE & UNDER THE HOOD */}
          {activeTab === "architecture" && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                  <div className="font-code text-xs text-[var(--accent-neon)] font-bold uppercase mb-2">
                    The Engineering Challenge
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {activeProject.challenge}
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                  <div className="font-code text-xs text-emerald-400 font-bold uppercase mb-2">
                    The Implemented Solution
                  </div>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                    {activeProject.solution}
                  </p>
                </div>
              </div>

              {/* Data Flow Architecture Breakdown */}
              <div className="p-6 rounded-xl bg-[#09090d] border border-[var(--border-subtle)] font-code text-xs">
                <div className="text-[0.68rem] text-[var(--text-dim)] uppercase tracking-wider mb-4 pb-2 border-b border-white/10">
                  Sub-System Execution Pipeline
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div className="text-[0.6rem] text-[var(--text-dim)] uppercase">1. Inputs</div>
                    <div className="text-xs text-[var(--text-primary)] font-medium mt-1">
                      {activeProject.architectureDetails.inputs}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div className="text-[0.6rem] text-[var(--text-dim)] uppercase">2. Pre-Processing</div>
                    <div className="text-xs text-[var(--text-primary)] font-medium mt-1">
                      {activeProject.architectureDetails.processing}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div className="text-[0.6rem] text-[var(--text-dim)] uppercase">3. Inference Model</div>
                    <div className="text-xs text-[var(--accent-neon)] font-medium mt-1">
                      {activeProject.architectureDetails.model}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-subtle)]">
                    <div className="text-[0.6rem] text-[var(--text-dim)] uppercase">4. Latency Target</div>
                    <div className="text-xs text-emerald-400 font-medium mt-1">
                      {activeProject.architectureDetails.latency}
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Code Implementation & Developer Blueprint */}
              {PROJECT_CODE_SPECS[activeProject.id] && (
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[#07070b] overflow-hidden">
                  {/* Code Snippet Header */}
                  <div className="px-4 py-3 bg-[#0f0f15] border-b border-white/10 flex flex-wrap items-center justify-between gap-2 font-code text-xs">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-3.5 h-3.5 text-[var(--accent-neon)]" />
                      <span className="text-[var(--text-primary)] font-bold">
                        {PROJECT_CODE_SPECS[activeProject.id].filename}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-white/10 text-[0.62rem] text-[var(--text-dim)]">
                        {PROJECT_CODE_SPECS[activeProject.id].language}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        sound.playClick();
                        navigator.clipboard.writeText(PROJECT_CODE_SPECS[activeProject.id].code);
                        setCopiedSnippet(true);
                        setTimeout(() => setCopiedSnippet(false), 1500);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--accent-neon)] text-[var(--text-primary)] transition-all flex items-center gap-1.5 text-xs"
                      title="Copy code snippet to clipboard"
                    >
                      {copiedSnippet ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied Snippet</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy to Clipboard</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Code Body */}
                  <div className="p-4 sm:p-5 font-code text-xs overflow-x-auto selection:bg-[var(--accent-neon)]/30 text-[var(--text-muted)] leading-relaxed">
                    <pre className="text-xs font-code whitespace-pre">
                      <code>{PROJECT_CODE_SPECS[activeProject.id].code}</code>
                    </pre>
                  </div>

                  {/* Footer caption */}
                  <div className="px-4 py-2 bg-[#0a0a0e] border-t border-white/5 font-code text-[0.65rem] text-[var(--text-dim)] flex items-center justify-between">
                    <span>{PROJECT_CODE_SPECS[activeProject.id].description}</span>
                    <span>Deterministic & Offline Executable</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMPACT & METRICS */}
          {activeTab === "metrics" && (
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {activeProject.metricsBreakdown.map((m, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] transition-all"
                  >
                    <div className="font-editorial text-3xl font-medium text-[var(--accent-neon)] mb-1">
                      {m.value}
                    </div>
                    <div className="font-code text-xs font-bold text-[var(--text-primary)] mb-1">
                      {m.label}
                    </div>
                    <div className="text-xs text-[var(--text-dim)] leading-tight">
                      {m.subtext}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="font-code text-xs text-[var(--text-primary)] font-bold">
                    Tech Stack Composition
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activeProject.techStack.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] font-code text-[0.68rem] text-[var(--text-muted)]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={activeProject.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-[var(--accent-neon)] text-black font-code text-xs font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Github className="w-4 h-4 fill-black" />
                  <span>Inspect GitHub Repo</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
