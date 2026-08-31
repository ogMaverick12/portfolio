"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { getSectionNum } from "@/lib/sections";

interface BlogArticle {
  title: string;
  url: string;
  platform: string;
  type: string;
  tags: string[];
}

export default function Blog() {
  const [isExpanded, setIsExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const articles: BlogArticle[] = [
    {
      title: "I Built a Local Interview Coach That Learns From Every Submission With Hermes Agent.",
      url: "https://dev.to/sreejit_/i-built-a-local-interview-coach-that-learns-from-every-submission-with-hermes-agent-1jja",
      platform: "DEV.TO",
      type: "Article",
      tags: ["hermesagentchallenge", "devchallenge", "agents", "ai"],
    },
    {
      title: "Everyone's Talking About Gemini 3.5 Flash. The Real Story at Google I/O 2026 Was a Skill File.",
      url: "https://dev.to/sreejit_/everyones-talking-about-gemini-35-flash-the-real-story-at-google-io-2026-was-a-skill-file-4f3c",
      platform: "DEV.TO",
      type: "Article",
      tags: ["devchallenge", "googleiochallenge", "ai", "webdev"],
    },
    {
      title: "93 Agents, 2.6 Billion Tokens, One Working OS, and a Bill Under $1,000",
      url: "https://medium.com/stackademic/93-agents-2-6-billion-tokens-one-working-os-and-a-bill-under-1-000-3adc07883dda",
      platform: "MEDIUM",
      type: "Article",
      tags: ["AI", "Agents", "Infrastructure"],
    },
    {
      title: "I ran Hermes agent on the same task for 7 days. The skill file on day 7 looked nothing like day 1",
      url: "https://medium.com/towards-artificial-intelligence/i-ran-hermes-agent-on-the-same-task-for-7-days-the-skill-file-on-day-7-looked-nothing-like-day-1-c7012cf32dc9",
      platform: "MEDIUM",
      type: "Article",
      tags: ["AI", "Agents"],
    },
    {
      title: "Kimi WebBridge just gave AI agents hands inside your browser — and kept your data local",
      url: "https://dev.to/sreejit_/kimi-webbridge-just-gave-ai-agents-hands-inside-your-browser-and-kept-your-data-local-b76",
      platform: "DEV.TO",
      type: "Article",
      tags: ["ai", "webdev", "agents", "opensource"],
    },
    {
      title: "“Most AI agents forget everything between sessions. I ran Hermes continuously for 7 days to see what would happen.”",
      url: "https://dev.to/sreejit_/most-ai-agents-forget-everything-between-sessions-i-ran-hermes-continuously-for-7-days-to-see-5bg8",
      platform: "DEV.TO",
      type: "Article",
      tags: ["agents", "ai", "machinelearning", "showdev"],
    },
    {
      title: "“What good is AI if it stops working the moment the internet dies? Built an offline Gemma 4 farm doctor for real-world rural use.”",
      url: "https://dev.to/sreejit_/what-good-is-ai-if-it-stops-working-the-moment-the-internet-dies-built-an-offline-gemma-4-farm-48a1",
      platform: "DEV.TO",
      type: "Article",
      tags: ["ai", "llm", "machinelearning", "showdev"],
    },
    {
      title: "Everyone's Talking About Bigger AI Models. I Built a Gemma 4 Farm Doctor That Works When the Internet Doesn't.",
      url: "https://dev.to/sreejit_/everyones-talking-about-bigger-ai-models-i-built-a-gemma-4-farm-doctor-that-works-when-the-3j1b",
      platform: "DEV.TO",
      type: "Article",
      tags: ["devchallenge", "gemmachallenge", "gemma", "git"],
    },
    {
      title: "I Tested Gemma 4 E4B vs 31B on 50 Real Student Career Queries — The Results Surprised Me",
      url: "https://dev.to/sreejit_/i-tested-gemma-4-e4b-vs-31b-on-50-real-student-career-queries-the-results-surprised-me-kbi",
      platform: "DEV.TO",
      type: "Article",
      tags: ["devchallenge", "gemmachallenge", "gemma", "opensource"],
    },
    {
      title: "I Ran Hermes Agent on the Same Task for 7 Days. The Skill File on Day 7 Looked Nothing Like Day 1.",
      url: "https://dev.to/sreejit_/i-ran-hermes-agent-on-the-same-task-for-7-days-the-skill-file-on-day-7-looked-nothing-like-day-1-2oa8",
      platform: "DEV.TO",
      type: "Article",
      tags: ["hermesagentchallenge", "devchallenge", "agents", "ai"],
    },
    {
      title: "I Let AI Write My Entire App — Here's What Actually Happened",
      url: "https://dev.to/sreejit_/i-let-ai-write-my-entire-app-heres-what-actually-happened-3bkg",
      platform: "DEV.TO",
      type: "Article",
      tags: ["deved", "learngoogleaistudio", "ai", "gemini"],
    },
    {
      title: "From One Prompt to a Full Fantasy Nation Generator — No Code, No Cost",
      url: "https://dev.to/sreejit_/from-one-prompt-to-a-full-fantasy-nation-generator-no-code-no-cost-3j4b",
      platform: "DEV.TO",
      type: "Article",
      tags: ["deved", "learngoogleaistudio", "ai", "gemini"],
    },
    {
      title: "From One Prompt to a Full Fantasy Nation Generator — No Code, No Cost",
      url: "https://dev.to/sreejit_/from-one-prompt-to-a-full-fantasy-nation-generator-no-code-no-cost-5da3",
      platform: "DEV.TO",
      type: "Article",
      tags: ["deved", "learngoogleaistudio", "ai", "gemini"],
    },
    {
      title: "I Tested Every Gemma 4 Model on a GTX 1650. Here's What Actually Happened.",
      url: "https://dev.to/sreejit_/i-tested-every-gemma-4-model-on-a-gtx-1650-heres-what-actually-happened-59gj",
      platform: "DEV.TO",
      type: "Article",
      tags: ["devchallenge", "gemmachallenge", "gemma", "ai"],
    },
    {
      title: "Everyone's Talking About Gemini. The Real Story at Google Cloud NEXT '26 Was GKE Agent Sandbox.",
      url: "https://dev.to/sreejit_/everyones-talking-about-gemini-the-real-story-at-google-cloud-next-26-was-gke-agent-sandbox-19g2",
      platform: "DEV.TO",
      type: "Article",
      tags: ["cloudnextchallenge", "googlecloud", "ai", "devchallenge"],
    },
  ];

  const visibleArticles = isExpanded ? articles : articles.slice(0, 4);

  const toggleExpand = () => {
    setIsExpanded((prev) => {
      const next = !prev;
      if (!next) {
        // Scroll back to the blog section start when collapsing
        const blogSection = document.getElementById("blog");
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: "smooth" });
        }
      }
      return next;
    });
  };

  const sectionNum = getSectionNum("blog");

  return (
    <section id="blog" className="py-32 px-6 md:px-12 border-b border-border relative z-10">
      <div className="section-label font-mono text-[0.65rem] text-muted tracking-[0.18em] uppercase mb-16 flex items-center gap-4">
        <span className="text-accent">{sectionNum}</span> blog
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="projects-heading font-serif text-[2.5rem] md:text-[5vw] lg:text-[4.5rem] italic leading-[1.05] tracking-tight mb-16 max-w-[700px] text-text"
      >
        Writing &<br />
        <em className="not-italic text-accent">Thoughts.</em>
      </motion.h2>

      <div
        ref={containerRef}
        className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
      >
        {visibleArticles.map((article, index) => (
          <motion.a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
            className="project-card border border-border p-10 bg-bg2 relative overflow-hidden transition-all duration-350 hover:border-accent hover:bg-bg3 hover:-translate-y-1 hover:shadow-[0_0_25px_2px_var(--accent-glow),_inset_0_0_12px_rgba(212,255,74,0.05)] cursor-pointer text-inherit block"
          >
            <div className="project-meta flex items-center justify-between mb-6">
              <div className="project-status font-mono text-[0.62rem] text-text tracking-wide uppercase flex items-center gap-2">
                <span className="text-muted">{article.platform}</span>
              </div>
              <div className="project-type font-mono text-[0.62rem] text-muted tracking-wide">
                {article.type}
              </div>
            </div>
            <div className="project-name font-serif text-[1.1rem] leading-[1.3] mb-4 text-text hover:text-accent transition-colors">
              {article.title}
            </div>
            <div className="project-stack flex flex-wrap gap-1.5 mt-4">
              {article.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="stack-tag font-mono text-[0.62rem] text-muted border border-border px-2.5 py-1 tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="project-arrow absolute top-8 right-8 text-[1.2rem] text-muted transition-colors">
              ?
            </div>
          </motion.a>
        ))}
      </div>

      <div className="text-center mt-12">
        <span
          id="blog-toggle"
          onClick={toggleExpand}
          className="cursor-pointer text-accent font-mono text-[0.85rem] tracking-wider border-b border-dashed border-accent pb-0.5"
        >
          {isExpanded ? "Show Less -" : "View All Articles +"}
        </span>
      </div>
    </section>
  );
}
