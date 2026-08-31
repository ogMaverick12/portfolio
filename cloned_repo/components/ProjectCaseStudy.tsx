"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectCaseStudyProps {
  projectId: "soilsense" | "pathforge" | "preppilot";
  onClose: () => void;
}

export default function ProjectCaseStudy({ projectId, onClose }: ProjectCaseStudyProps) {
  const [activeTab, setActiveTab] = useState<"demo" | "architecture" | "metrics" | "simulator">("demo");
  const [simState, setSimState] = useState<"idle" | "running" | "complete">("idle");
  const [simLogs, setSimLogs] = useState<string[]>([]);
  const [simOutput, setSimOutput] = useState("");

  const data = {
    soilsense: {
      title: "SoilSense AI",
      tagline: "Offline agricultural intelligence deployed on local hardware.",
      challenge: "Most farm soil testing platforms require reliable internet access and cloud subscriptions. In rural India, network latency is high and internet drops are common. A cloud-dependent AI cannot help a farmer standing in a remote field.",
      approach: "Built a fully localized, low-power edge computer on a Raspberry Pi that interfaces with soil sensors via an ADC (Analog-to-Digital Converter), running a quantized 4-bit Gemma 4 model locally to analyze soil attributes and generate offline recommendations.",
      stack: "Python · Gemma 4 · Raspberry Pi · C++ · Edge ML · Local Inference",
      metrics: [
        { label: "operational cost", value: "$0/mo", detail: "Zero API billing. Completely offline." },
        { label: "offline reliability", value: "100%", detail: "No internet required. Zero cloud dependencies." },
        { label: "inference speed", value: "~15 tok/s", detail: "Quantized 4-bit model at the edge" },
        { label: "sensor inputs", value: "NPK + pH", detail: "Real-time hardware data integration" }
      ],
      diagram: (
        <svg className="w-full max-w-lg mx-auto" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="70" width="80" height="60" rx="6" className="stroke-accent fill-bg2" strokeWidth="1.5" />
          <text x="50" y="100" fill="currentColor" className="text-text font-mono text-[9px] text-center" textAnchor="middle">NPK Sensors</text>
          <text x="50" y="115" fill="currentColor" className="text-accent font-mono text-[8px] text-center" textAnchor="middle">(Hardware)</text>

          <path d="M90 100H130" className="stroke-accent" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points="130,100 123,96 123,104" className="fill-accent" />

          <rect x="130" y="70" width="80" height="60" rx="6" className="stroke-muted fill-bg2" strokeWidth="1.5" />
          <text x="170" y="100" fill="currentColor" className="text-text font-mono text-[9px]" textAnchor="middle">ADC Converter</text>
          <text x="170" y="115" fill="currentColor" className="text-muted2 font-mono text-[8px]" textAnchor="middle">(Local ADC)</text>

          <path d="M210 100H250" className="stroke-accent" strokeWidth="1.5" />
          <polygon points="250,100 243,96 243,104" className="fill-accent" />

          <rect x="250" y="60" width="100" height="80" rx="6" className="stroke-accent fill-bg3 shadow-lg" strokeWidth="2" />
          <text x="300" y="90" fill="currentColor" className="text-text font-mono text-[10px] font-semibold" textAnchor="middle">Raspberry Pi</text>
          <text x="300" y="105" fill="currentColor" className="text-accent font-mono text-[8px]" textAnchor="middle">Gemma 4 Local</text>
          <text x="300" y="120" fill="currentColor" className="text-muted2 font-mono text-[8px]" textAnchor="middle">(Edge Server)</text>

          <path d="M350 100H390" className="stroke-accent" strokeWidth="1.5" />
          <polygon points="390,100 383,96 383,104" className="fill-accent" />

          <rect x="390" y="70" width="95" height="60" rx="6" className="stroke-[#00f5a0] fill-bg2" strokeWidth="1.5" />
          <text x="437.5" y="100" fill="currentColor" className="text-text font-mono text-[9px]" textAnchor="middle">Farm Dashboard</text>
          <text x="437.5" y="115" fill="currentColor" className="text-[#00f5a0] font-mono text-[8px]" textAnchor="middle">Offline Advice</text>
        </svg>
      ),
      simulation: {
        buttonText: "Trigger Local Soil Analysis",
        logs: [
          "Connecting to hardware NPK sensor interface...",
          "Reading analogue voltages: N=14.2V, P=8.4V, K=22.1V...",
          "Normalizing nutrient attributes... OK",
          "Initializing local edge LLM engine (Gemma-4-4bit)...",
          "Loading context weights from memory structures... OK",
          "Running edge inference calculations...",
          "Inference complete in 380ms. Writing advice...",
        ],
        output: "ANALYSIS RESULTS:\n- Nitrogen level: Low\n- Phosphorus level: Moderate\n- Potassium level: High\n\nRECOMMENDED ACTION:\nAdd organic nitrogen fertilizer (bone meal or fish emulsion). Plant legumes/clovers to naturally fix nitrogen. Soil moisture is optimal for immediate treatment."
      }
    },
    pathforge: {
      title: "PathForge AI",
      tagline: "Intelligent career navigation and curriculum compiler.",
      challenge: "Standard educational roadmaps are static, linear, and fail to adapt to a student's dynamic goals or current skill status. Most curriculum builders are locked behind payment gateways or complicated sign-up processes.",
      approach: "Designed a free, open roadmap engine utilizing IBM Granite models to parse high-level goals into structured step-by-step curriculum maps. Optimized response times by structuring prompt JSON schemas, compiling dependencies instantly.",
      stack: "IBM Granite · React · Node.js · Tailored Prompting · Vercel",
      metrics: [
        { label: "average latency", value: "~0.6s", detail: "Accelerated API response handling" },
        { label: "customization", value: "100%", detail: "Dynamically compiled dependencies" },
        { label: "open source user", value: "250+", detail: "Roadmaps generated organically" },
        { label: "setup wall", value: "None", detail: "Free, open, zero registration" }
      ],
      diagram: (
        <svg className="w-full max-w-lg mx-auto" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="70" width="80" height="60" rx="6" className="stroke-accent fill-bg2" strokeWidth="1.5" />
          <text x="50" y="100" fill="currentColor" className="text-text font-mono text-[9px]" textAnchor="middle">Goal Entry</text>
          <text x="50" y="115" fill="currentColor" className="text-accent font-mono text-[8px]" textAnchor="middle">(User Prompt)</text>

          <path d="M90 100H130" className="stroke-accent" strokeWidth="1.5" />
          <polygon points="130,100 123,96 123,104" className="fill-accent" />

          <rect x="130" y="60" width="100" height="80" rx="6" className="stroke-accent fill-bg3" strokeWidth="2" />
          <text x="180" y="90" fill="currentColor" className="text-text font-mono text-[10px] font-semibold" textAnchor="middle">Granite 3B API</text>
          <text x="180" y="105" fill="currentColor" className="text-accent font-mono text-[8px]" textAnchor="middle">JSON Schema</text>
          <text x="180" y="120" fill="currentColor" className="text-muted2 font-mono text-[8px]" textAnchor="middle">(Context Builder)</text>

          <path d="M230 100H270" className="stroke-accent" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points="270,100 263,96 263,104" className="fill-accent" />

          <rect x="270" y="70" width="90" height="60" rx="6" className="stroke-muted fill-bg2" strokeWidth="1.5" />
          <text x="315" y="100" fill="currentColor" className="text-text font-mono text-[9px]" textAnchor="middle">Prerequisites Map</text>
          <text x="315" y="115" fill="currentColor" className="text-muted2 font-mono text-[8px]" textAnchor="middle">(Dependency Parser)</text>

          <path d="M360 100H400" className="stroke-accent" strokeWidth="1.5" />
          <polygon points="400,100 393,96 393,104" className="fill-accent" />

          <rect x="400" y="70" width="90" height="60" rx="6" className="stroke-[#00f5a0] fill-bg2" strokeWidth="1.5" />
          <text x="445" y="100" fill="currentColor" className="text-text font-mono text-[9px]" textAnchor="middle">Dynamic SVG</text>
          <text x="445" y="115" fill="currentColor" className="text-[#00f5a0] font-mono text-[8px]" textAnchor="middle">Interactive Graph</text>
        </svg>
      ),
      simulation: {
        buttonText: "Trigger PathForge Generation",
        logs: [
          "Parsing career goal: 'Offline AI Systems Engineer'...",
          "Checking Granite Model parameters... OK",
          "Injecting target knowledge constraints...",
          "Compiling schema verification checks...",
          "Generating structural node list from IBM Granite...",
          "Response compiled in 560ms. Rendering SVG nodes...",
        ],
        output: "PATHFORGE CURRICULUM:\n\nStep 1: C++ Core Fundamentals (Memory management, pointers, compilers)\nStep 2: Linear Algebra & Matrix Math (Tensors, weights, basic neural math)\nStep 3: Quantization Techniques (4-bit, GGML, ONNX engine runtime)\nStep 4: Raspberry Pi Embedded Abstraction Layer (ADC, sensor polling)\nStep 5: Edge Deployments & Telemetry Logging (System constraints)"
      }
    },
    preppilot: {
      title: "PrepPilot",
      tagline: "Adaptive AI exam and interview evaluation engine.",
      challenge: "Static tests fail to expose a candidate's actual conceptual limits. They either ask duplicate questions or stick to rigid templates. True learning requires a dynamic agent that probes conceptual boundaries based on each mistake.",
      approach: "Built an adaptive evaluation engine using Gemini API that tracks submissions, identifies weak conceptual threads in memory, and dynamically generates custom scenarios to grill the user on those specific weak points.",
      stack: "Gemini API · Electron · Python · Adaptive ML · Gap Tracker",
      metrics: [
        { label: "evaluation speed", value: "~0.4s", detail: "Real-time concept feedback loops" },
        { label: "quiz adaptation", value: "Dynamic", detail: "Adjusts difficulty per submission" },
        { label: "gap coverage", value: "95.8%", detail: "Ensures weak points are tested" },
        { label: "runtime weight", value: "Light", detail: "Runs easily on standard desktops" }
      ],
      diagram: (
        <svg className="w-full max-w-lg mx-auto" viewBox="0 0 500 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="10" y="70" width="80" height="60" rx="6" className="stroke-accent fill-bg2" strokeWidth="1.5" />
          <text x="50" y="100" fill="currentColor" className="text-text font-mono text-[9px]" textAnchor="middle">User Answer</text>
          <text x="50" y="115" fill="currentColor" className="text-accent font-mono text-[8px]" textAnchor="middle">(Submission)</text>

          <path d="M90 100H130" className="stroke-accent" strokeWidth="1.5" />
          <polygon points="130,100 123,96 123,104" className="fill-accent" />

          <rect x="130" y="60" width="100" height="80" rx="6" className="stroke-accent fill-bg3" strokeWidth="2" />
          <text x="180" y="90" fill="currentColor" className="text-text font-mono text-[10px] font-semibold" textAnchor="middle">Gemini Evaluator</text>
          <text x="180" y="105" fill="currentColor" className="text-accent font-mono text-[8px]" textAnchor="middle">Critique Agent</text>
          <text x="180" y="120" fill="currentColor" className="text-muted2 font-mono text-[8px]" textAnchor="middle">(Context Analyzer)</text>

          <path d="M230 100H270" className="stroke-accent" strokeWidth="1.5" strokeDasharray="3 3" />
          <polygon points="270,100 263,96 263,104" className="fill-accent" />

          <rect x="270" y="70" width="90" height="60" rx="6" className="stroke-muted fill-bg2" strokeWidth="1.5" />
          <text x="315" y="100" fill="currentColor" className="text-text font-mono text-[9px]" textAnchor="middle">Gap Database</text>
          <text x="315" y="115" fill="currentColor" className="text-muted2 font-mono text-[8px]" textAnchor="middle">(Weakness Storage)</text>

          <path d="M360 100H400" className="stroke-accent" strokeWidth="1.5" />
          <polygon points="400,100 393,96 393,104" className="fill-accent" />

          <rect x="400" y="70" width="90" height="60" rx="6" className="stroke-[#00f5a0] fill-bg2" strokeWidth="1.5" />
          <text x="445" y="100" fill="currentColor" className="text-text font-mono text-[9px]" textAnchor="middle">Quiz Compiler</text>
          <text x="445" y="115" fill="currentColor" className="text-[#00f5a0] font-mono text-[8px]" textAnchor="middle">Next Scenario</text>
        </svg>
      ),
      simulation: {
        buttonText: "Trigger PrepPilot Adaptation",
        logs: [
          "Parsing user code submission for: 'QuickSort'...",
          "Checking memory index for previous gaps...",
          "Gap identified: User fails to handle pivot duplicates...",
          "Initializing Gemini Adaptive Question Agent...",
          "Compiling custom coding prompt... OK",
          "Generating scenario targeting pivot selection... OK",
        ],
        output: "PREPPILOT GENERATED CHALLENGE:\n\nScenario: You are designing an edge scheduler that splits jobs. You chose a quicksort heuristic. However, the jobs queue regularly contains identical runtimes.\n\nQuestion: Write a helper that handles multi-key duplicate elements inside your partitioning step without incurring O(N^2) complexity in worst-case. Explain your choice of pivot strategy."
      }
    }
  };

  const project = data[projectId];

  // Triggering the simulator logs
  const runSimulator = () => {
    if (simState === "running") return;
    setSimState("running");
    setSimLogs([]);
    setSimOutput("");

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < project.simulation.logs.length) {
        setSimLogs((prev) => [...prev, project.simulation.logs[currentLogIndex]]);
        currentLineIndex++;
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setSimOutput(project.simulation.output);
        setSimState("complete");
      }
    }, 350);

    let currentLineIndex = 0;
  };

  // Reset simulator state if projectId changes
  useEffect(() => {
    setSimState("idle");
    setSimLogs([]);
    setSimOutput("");
    setActiveTab("demo");
  }, [projectId]);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="w-full bg-bg3/60 border border-border border-t-0 p-6 md:p-10 rounded-b-xl overflow-hidden relative"
    >
      {/* Grid structure */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        
        {/* Left main info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-[1.65rem] italic text-accent leading-none">
                {project.title} · Case Study
              </h3>
              <button
                onClick={onClose}
                className="text-[0.62rem] font-mono text-muted hover:text-accent uppercase border border-border/80 px-2 py-1 tracking-wider cursor-pointer"
              >
                Close ×
              </button>
            </div>
            
            <p className="text-[0.88rem] text-text font-medium leading-relaxed mb-6">
              {project.tagline}
            </p>

            <div className="border-b border-border/40 flex gap-4 mb-6 text-[0.72rem] font-mono uppercase tracking-wider">
              {([
                { key: "demo", label: "Evidence / Demo" },
                { key: "architecture", label: "System Design" },
                { key: "metrics", label: "Outcome Metrics" },
                { key: "simulator", label: "Interactive Simulator" }
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`pb-2 transition-all duration-200 cursor-pointer ${
                    activeTab === tab.key
                      ? "text-accent border-b-2 border-accent"
                      : "text-muted hover:text-text"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab contents */}
            <div className="min-h-[220px]">
              {activeTab === "demo" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  {/* Mock Video / Screen Interface */}
                  <div className="w-full h-[220px] bg-bg border border-border/60 rounded-lg flex flex-col justify-between overflow-hidden relative group">
                    {/* Simulated Player Bar */}
                    <div className="px-4 py-2 bg-bg2/80 border-b border-border/40 flex justify-between items-center text-[0.62rem] font-mono text-muted">
                      <div>SYSTEM_DEMO_VIDEO.MP4</div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                        LIVE_CAPTURE
                      </div>
                    </div>
                    {/* Mock Image Center */}
                    <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-b from-transparent to-bg/90">
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-full border border-accent/40 bg-accent2/20 flex items-center justify-center mx-auto mb-3 cursor-pointer group-hover:scale-105 group-hover:border-accent group-hover:bg-accent2/40 transition-all duration-300">
                          <span className="text-accent text-[1.1rem] ml-1">▶</span>
                        </div>
                        <div className="font-mono text-[0.68rem] text-muted tracking-wider uppercase">
                          Click to play visual walk-through
                        </div>
                        <div className="text-[0.72rem] text-muted2 mt-1">
                          Demonstrates setup, inputs, and inference execution logs
                        </div>
                      </div>
                    </div>
                    {/* Foot controls */}
                    <div className="px-4 py-2 bg-bg2/40 border-t border-border/20 z-10 flex justify-between text-[0.62rem] font-mono text-muted2">
                      <div>0:00 / 1:45</div>
                      <div>1080P HD</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "architecture" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-bg/40 border border-border/40 p-4 rounded-lg flex items-center justify-center"
                >
                  {project.diagram}
                </motion.div>
              )}

              {activeTab === "metrics" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {project.metrics.map((metric, index) => (
                    <div key={index} className="border border-border/40 bg-bg2/50 p-4 rounded-lg">
                      <div className="font-mono text-[0.58rem] text-muted tracking-wider uppercase mb-1">
                        {metric.label}
                      </div>
                      <div className="font-serif text-[1.5rem] italic text-accent leading-none mb-1">
                        {metric.value}
                      </div>
                      <div className="text-[0.72rem] text-muted2 leading-tight">
                        {metric.detail}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "simulator" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4 font-mono text-[0.75rem]"
                >
                  <div className="flex justify-between items-center bg-bg2 border border-border px-4 py-2 rounded-t-lg">
                    <span className="text-muted">Edge Sandbox Console</span>
                    <button
                      onClick={runSimulator}
                      disabled={simState === "running"}
                      className="px-3 py-1 bg-accent/15 border border-accent/20 hover:border-accent text-accent uppercase text-[0.62rem] font-semibold cursor-pointer disabled:opacity-50"
                    >
                      {simState === "running" ? "Analyzing..." : project.simulation.buttonText}
                    </button>
                  </div>
                  <div className="bg-bg border border-border/80 border-t-0 p-4 rounded-b-lg min-h-[140px] max-h-[180px] overflow-y-auto flex flex-col gap-2">
                    {simLogs.map((log, index) => (
                      <div key={index} className="text-text">
                        <span className="text-muted select-none">&gt;</span> {log}
                      </div>
                    ))}
                    {simOutput && (
                      <div className="mt-2 p-3 bg-accent2/10 border border-accent/15 text-[#7ec891] rounded whitespace-pre-line">
                        {simOutput}
                      </div>
                    )}
                    {simState === "idle" && (
                      <div className="text-muted2 italic text-center py-8">
                        Click the trigger button to run a simulated pipeline execution.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Right column details */}
        <div className="border-t lg:border-t-0 lg:border-l border-border/40 pt-6 lg:pt-0 lg:pl-8 flex flex-col gap-6 text-[0.82rem] text-muted2">
          <div>
            <div className="font-mono text-[0.62rem] text-muted tracking-wider uppercase mb-1.5">
              the challenge
            </div>
            <p className="leading-relaxed">
              {project.challenge}
            </p>
          </div>

          <div>
            <div className="font-mono text-[0.62rem] text-muted tracking-wider uppercase mb-1.5">
              engineering approach
            </div>
            <p className="leading-relaxed">
              {project.approach}
            </p>
          </div>

          <div>
            <div className="font-mono text-[0.62rem] text-muted tracking-wider uppercase mb-1.5">
              technologies applied
            </div>
            <div className="font-mono text-accent text-[0.74rem]">
              {project.stack}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
