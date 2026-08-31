import React, { useState } from "react";
import { BLOG_ARTICLES } from "../data/portfolioData";
import { sound } from "../lib/sound";
import { BookOpen, ExternalLink, Sparkles, Tag, Clock } from "lucide-react";

export const BlogSection: React.FC = () => {
  const [platformFilter, setPlatformFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredArticles = BLOG_ARTICLES.filter((art) => {
    const matchesPlatform = platformFilter === "ALL" || art.platform === platformFilter;
    const matchesSearch =
      searchQuery.trim() === "" ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesPlatform && matchesSearch;
  });

  return (
    <section
      id="articles"
      className="py-24 px-4 sm:px-8 border-b border-[var(--border-subtle)] relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Section 07 · Technical Publications</span>
            </div>
            <h2 className="font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              15+ Articles on <span className="italic text-[var(--accent-neon)]">Agents & Edge AI.</span>
            </h2>
          </div>

          <p className="text-sm text-[var(--text-muted)] max-w-md font-normal">
            Deep-dive architectural breakdowns published on Dev.to and Medium exploring Gemma 4, Hermes Agent, and multi-agent coordination.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            {["ALL", "DEV.TO", "MEDIUM"].map((plat) => {
              const isSelected = platformFilter === plat;
              return (
                <button
                  key={plat}
                  onClick={() => {
                    sound.playClick();
                    setPlatformFilter(plat);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`px-3.5 py-1.5 rounded-xl font-code text-xs transition-all border ${
                    isSelected
                      ? "bg-[var(--accent-neon)] text-black font-bold border-[var(--accent-neon)] shadow-sm"
                      : "bg-[var(--bg-secondary)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
                  }`}
                >
                  {plat}
                </button>
              );
            })}
          </div>

          <input
            type="text"
            placeholder="Search articles by keyword (e.g. Gemma, Hermes, GKE)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-xs text-[var(--text-primary)] placeholder-[var(--text-dim)] focus:border-[var(--accent-neon)] outline-none max-w-sm w-full"
          />
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => sound.playHover()}
              onClick={() => sound.playClick()}
              className="p-6 rounded-2xl glass-panel border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3 font-code text-[0.65rem]">
                  <span
                    className={`px-2 py-0.5 rounded border font-bold ${
                      article.platform === "DEV.TO"
                        ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                        : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                    }`}
                  >
                    {article.platform}
                  </span>

                  <div className="flex items-center gap-2 text-[var(--text-dim)]">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <h3 className="font-editorial text-lg sm:text-xl font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors leading-snug mb-3">
                  {article.title}
                </h3>
              </div>

              <div>
                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {article.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-[0.62rem] text-[var(--text-dim)]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between font-code text-xs text-[var(--accent-neon)]">
                  <span className="text-[0.68rem] text-[var(--text-dim)] font-normal">{article.type}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
