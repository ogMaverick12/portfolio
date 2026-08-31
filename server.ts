import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Assistant for Terminal and Interactive Queries
  app.post("/api/terminal", async (req, res) => {
    try {
      const { question } = req.body;
      if (!question || typeof question !== "string") {
        return res.status(400).json({ error: "Missing question query parameter" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      const profileKnowledge = `
You are the interactive AI terminal assistant on Sreejit Pradhan's portfolio.
Sreejit Pradhan is a 16-year-old self-taught programmer and high school student (DPS Siliguri Grade 11) from India.
His core focus is learning Python & C++ for competitive programming (CP), algorithmic logic, time complexity analysis, standard STL data structures, and edge AI applications.

Flagship Systems:
1. SoilSense AI: Offline agricultural intelligence on Raspberry Pi using quantized 4-bit Gemma 4 and NPK/pH sensors via ADC. $0/mo cost, 100% offline edge computing.
2. PathForge AI: Career roadmap generator & curriculum compiler built for IBM Hackathon using IBM Granite. Generates customized dynamic graphs with ~0.6s latency.
3. PrepPilot: Adaptive AI interview & exam coach using Gemini API that detects knowledge gaps in code submissions and dynamically drills weak points.

Credentials & Awards:
- Google AI Professional Certificate (Coursera)
- Python Certification (freeCodeCamp)
- 21+ Google Cloud skill badges (GKE, DevOps, Security, AI Agents with ADK, Cloud Network)
- Dev.to Competition Badges (Google Cloud NEXT '26 Challenge Winner, Gemma Challenge, Hermes Agent Challenge, Google AI Studio Challenge Winner)

Writings:
15+ technical articles on Dev.to and Medium covering AI agents, Hermes Agent 7-day tests, offline Gemma 4, Google Cloud NEXT '26, and multi-agent systems.

Manifesto:
1. USEFUL > FANTASY (Utility beats vanity)
2. FREE > PAYWALLED (Open source is a moral imperative)
3. EXECUTION > PLAN (Ship to learn, broken app in prod beats whiteboard)

Contact:
Email: sreejit.dev12@gmail.com
LinkedIn: sreejit-pradhan-b27b19401
GitHub: https://github.com/ogMaverick12
Twitter/X: https://x.com/SreejitX

Guidelines for your response:
- Answer the user's prompt succinctly and accurately as Sreejit's AI assistant in a stylish terminal format.
- Keep output concise (under 4-6 lines) so it looks great in the terminal window.
- If asking about projects, skills, or achievements, give precise details.
`;

      if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `${profileKnowledge}\n\nUser Question: ${question}\n\nAnswer concisely in terminal friendly format:`,
                  },
                ],
              },
            ],
          });

          const text = response.text || "No response generated.";
          return res.json({ text });
        } catch (geminiErr: any) {
          console.warn("Gemini API error, falling back to local heuristic response:", geminiErr?.message);
        }
      }

      // Offline intelligent heuristic fallback
      const q = question.toLowerCase();
      let fallbackText = "";

      if (q.includes("soilsense") || q.includes("farm") || q.includes("soil") || q.includes("pi")) {
        fallbackText = "SoilSense AI: Offline agricultural intelligence running Gemma 4 (4-bit quantized) on Raspberry Pi.\nInterfaces with NPK & pH sensors via ADC to give real-time soil advice with zero internet and $0/mo cost.";
      } else if (q.includes("pathforge") || q.includes("granite") || q.includes("roadmap") || q.includes("career")) {
        fallbackText = "PathForge AI: Goal-oriented curriculum compiler built with IBM Granite.\nCompiles dynamic learning graphs with instant dependency resolution and ~0.6s average latency.";
      } else if (q.includes("preppilot") || q.includes("interview") || q.includes("exam") || q.includes("prep")) {
        fallbackText = "PrepPilot: Adaptive exam & interview coach powered by Gemini API.\nAnalyzes code submission misconceptions in real-time and dynamically generates targeted drill scenarios.";
      } else if (q.includes("skills") || q.includes("stack") || q.includes("languages") || q.includes("tech")) {
        fallbackText = "Primary Stack: Python & C++\nFocus: Algorithmic logic, STL data structures, time complexity analysis, and Edge ML / Offline LLMs.\nCloud: 21+ Google Cloud Badges (GKE, DevOps, AI Agents, Cloud Security).";
      } else if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach")) {
        fallbackText = "Reach Sreejit at sreejit.dev12@gmail.com\nLinkedIn: https://www.linkedin.com/in/sreejit-pradhan-b27b19401\nGitHub: https://github.com/ogMaverick12";
      } else if (q.includes("cert") || q.includes("badge") || q.includes("google") || q.includes("coursera")) {
        fallbackText = "Certifications: Google AI Professional Certificate (Coursera), Python Certification (freeCodeCamp)\n21+ Google Cloud Badges (Arcade, Infrastructure, AI/ML, DevOps)\nWinner in Dev.to Google Cloud NEXT '26 & AI Studio challenges.";
      } else if (q.includes("manifesto") || q.includes("principle") || q.includes("philosophy")) {
        fallbackText = "Core Principles:\n1. USEFUL > FANTASY (Utility beats vanity)\n2. FREE > PAYWALLED (Open source compounds morally)\n3. EXECUTION > PLAN (Ship to learn; broken code teaches more than whiteboards)";
      } else if (q.includes("age") || q.includes("school") || q.includes("who") || q.includes("about") || q.includes("education")) {
        fallbackText = "Sreejit Pradhan · 16-year-old student at DPS Siliguri (Grade 11), India.\nSelf-taught programmer learning competitive programming and building offline edge AI tools.";
      } else {
        fallbackText = `Context search query for "${question}":\nSreejit is an edge AI developer & competitive programmer proficient in C++ & Python.\nFlagship systems include SoilSense AI (offline edge), PathForge AI, and PrepPilot.\nType 'help' to explore all commands.`;
      }

      return res.json({ text: fallbackText });
    } catch (err: any) {
      console.error("Terminal API error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
