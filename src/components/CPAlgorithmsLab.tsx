import React, { useState, useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";
import { SKILL_CATEGORIES } from "../data/portfolioData";
import { sound } from "../lib/sound";
import { TreeTraversalVisualizer } from "./TreeTraversalVisualizer";
import {
  Cpu,
  Code2,
  Boxes,
  Cloud,
  Play,
  RotateCcw,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  GitFork,
  Copy,
  Check,
  Terminal,
} from "lucide-react";

const ALGO_CODE_SNIPPETS: Record<
  string,
  { title: string; filename: string; complexity: string; code: string }
> = {
  binary_search: {
    title: "Binary Search (Iterative)",
    filename: "binary_search.cpp",
    complexity: "O(log N) Time · O(1) Space",
    code: `// C++20 Binary Search with Overflow-Safe Midpoint Calculation
#include <vector>
#include <iostream>

int binary_search(const std::vector<int>& arr, int target) {
    int low = 0;
    int high = static_cast<int>(arr.size()) - 1;

    while (low <= high) {
        // Safe midpoint prevents integer overflow (low + high)
        int mid = low + (high - low) / 2;

        if (arr[mid] == target) {
            return mid; // Target found in O(log N)
        } else if (arr[mid] < target) {
            low = mid + 1; // Search right half
        } else {
            high = mid - 1; // Search left half
        }
    }
    return -1; // Target not found
}`,
  },
  two_pointers: {
    title: "Two Pointers (Sorted Array Sum)",
    filename: "two_pointers.cpp",
    complexity: "O(N) Time · O(1) Space",
    code: `// C++20 Two Pointers Invariant on Monotonic Sequence
#include <vector>
#include <utility>

std::pair<int, int> two_sum_sorted(const std::vector<int>& arr, int target) {
    int left = 0;
    int right = static_cast<int>(arr.size()) - 1;

    while (left < right) {
        int current_sum = arr[left] + arr[right];

        if (current_sum == target) {
            return {left, right}; // Match found in linear time
        } else if (current_sum < target) {
            ++left; // Increase sum monotonically
        } else {
            --right; // Decrease sum monotonically
        }
    }
    return {-1, -1}; // No valid pair
}`,
  },
  tree_traversal: {
    title: "Binary Tree Traversal (DFS / BFS)",
    filename: "tree_traversal.cpp",
    complexity: "O(N) Time · O(H) Space",
    code: `// C++20 Tree Depth-First & Breadth-First Search
#include <vector>
#include <queue>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

void inorder_traversal(TreeNode* root, std::vector<int>& out) {
    if (!root) return;
    inorder_traversal(root->left, out);
    out.push_back(root->val);
    inorder_traversal(root->right, out);
}

std::vector<int> bfs_level_order(TreeNode* root) {
    if (!root) return {};
    std::vector<int> result;
    std::queue<TreeNode*> q;
    q.push(root);

    while (!q.empty()) {
        TreeNode* curr = q.front();
        q.pop();
        result.push_back(curr->val);
        if (curr->left) q.push(curr->left);
        if (curr->right) q.push(curr->right);
    }
    return result;
}`,
  },
  vector_alloc: {
    title: "std::vector Dynamic Doubling Invariant",
    filename: "vector_allocator.cpp",
    complexity: "Amortized O(1) Push · O(N) Reallocation",
    code: `// C++20 Geometric Expansion Contiguous Buffer Simulation
#include <cstddef>
#include <utility>

template <typename T>
class MiniVector {
    T* data = nullptr;
    size_t size_ = 0;
    size_t cap_ = 0;

public:
    void push_back(const T& val) {
        if (size_ >= cap_) {
            // Growth factor: 2x doubling strategy avoids O(N^2) total copies
            size_t next_cap = (cap_ == 0) ? 1 : cap_ * 2;
            T* next_buffer = new T[next_cap];

            for (size_t i = 0; i < size_; ++i) {
                next_buffer[i] = std::move(data[i]);
            }
            delete[] data;
            data = next_buffer;
            cap_ = next_cap;
        }
        data[size_++] = val;
    }
};`,
  },
};

export const CPAlgorithmsLab: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("languages");
  const [algoMode, setAlgoMode] = useState<
    "binary_search" | "tree_traversal" | "two_pointers" | "vector_alloc"
  >("binary_search");
  const [showCodeSnippet, setShowCodeSnippet] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);

  // === Binary Search Sandbox State ===
  const sortedArray = [3, 7, 12, 19, 24, 31, 42, 55, 68, 77, 89, 94];
  const [bsTarget, setBsTarget] = useState(42);
  const [bsLow, setBsLow] = useState(0);
  const [bsHigh, setBsHigh] = useState(sortedArray.length - 1);
  const [bsMid, setBsMid] = useState<number | null>(null);
  const [bsStepCount, setBsStepCount] = useState(0);
  const [bsFound, setBsFound] = useState<boolean | null>(null);

  // === Two Pointers State ===
  const tpArray = [2, 4, 7, 11, 15, 18, 22, 29];
  const [tpTarget, setTpTarget] = useState(26);
  const [tpLeft, setTpLeft] = useState(0);
  const [tpRight, setTpRight] = useState(tpArray.length - 1);
  const [tpFound, setTpFound] = useState<boolean | null>(null);

  // === Vector Allocation Visualizer State ===
  const [vectorElements, setVectorElements] = useState<number[]>([10, 20, 30]);
  const [vectorCapacity, setVectorCapacity] = useState(4);
  const [reallocFlash, setReallocFlash] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Anime.js viewport cascade reveal for child elements based on index
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Header animation
            animate(".cplab-header-item", {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 650,
              delay: stagger(75),
              ease: "outExpo",
            });

            // Simulator sandbox panel entrance
            animate(".cplab-sandbox-panel", {
              opacity: [0, 1],
              translateY: [28, 0],
              scale: [0.97, 1],
              duration: 750,
              delay: 140,
              ease: "outExpo",
            });

            // Category domain selector tabs
            animate(".cplab-domain-tab", {
              opacity: [0, 1],
              translateX: [-18, 0],
              duration: 600,
              delay: stagger(60, { start: 240 }),
              ease: "outExpo",
            });

            // Detailed skill matrix cards staggered based on their index
            animate(".cplab-skill-card", {
              opacity: [0, 1],
              translateY: [24, 0],
              scale: [0.96, 1],
              duration: 700,
              delay: stagger(80, { start: 320 }),
              ease: "outExpo",
            });

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Reset Binary Search
  const resetBS = () => {
    sound.playClick();
    setBsLow(0);
    setBsHigh(sortedArray.length - 1);
    setBsMid(null);
    setBsStepCount(0);
    setBsFound(null);
  };

  // Step Binary Search
  const stepBS = () => {
    sound.playKey();
    if (bsLow > bsHigh) {
      setBsFound(false);
      return;
    }

    const mid = Math.floor((bsLow + bsHigh) / 2);
    setBsMid(mid);
    setBsStepCount((prev) => prev + 1);

    if (sortedArray[mid] === bsTarget) {
      setBsFound(true);
      sound.playSuccess();
    } else if (sortedArray[mid] < bsTarget) {
      setBsLow(mid + 1);
    } else {
      setBsHigh(mid - 1);
    }
  };

  // Step Two Pointers
  const stepTP = () => {
    sound.playKey();
    if (tpLeft >= tpRight) {
      setTpFound(false);
      return;
    }

    const sum = tpArray[tpLeft] + tpArray[tpRight];
    if (sum === tpTarget) {
      setTpFound(true);
      sound.playSuccess();
    } else if (sum < tpTarget) {
      setTpLeft((prev) => prev + 1);
    } else {
      setTpRight((prev) => prev - 1);
    }
  };

  const resetTP = () => {
    sound.playClick();
    setTpLeft(0);
    setTpRight(tpArray.length - 1);
    setTpFound(null);
  };

  // Push to Vector
  const pushToVector = () => {
    sound.playKey();
    const nextVal = (vectorElements[vectorElements.length - 1] || 0) + 10;
    const newSize = vectorElements.length + 1;

    if (newSize > vectorCapacity) {
      const newCap = vectorCapacity === 0 ? 1 : vectorCapacity * 2;
      setVectorCapacity(newCap);
      setReallocFlash(true);
      setTimeout(() => setReallocFlash(false), 600);
      sound.playSuccess();
    }

    setVectorElements((prev) => [...prev, nextVal]);
  };

  const popFromVector = () => {
    sound.playClick();
    if (vectorElements.length > 0) {
      setVectorElements((prev) => prev.slice(0, -1));
    }
  };

  const categoryIcons: Record<string, any> = {
    languages: Code2,
    cp: Cpu,
    edge_ai: Boxes,
    cloud_devops: Cloud,
  };

  return (
    <section
      id="cp-lab"
      ref={containerRef}
      className="py-24 px-4 sm:px-8 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 relative z-10"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="cplab-header-item inline-flex items-center gap-2 font-code text-[0.68rem] text-[var(--accent-neon)] uppercase tracking-widest mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Section 02 · Technical Foundations</span>
            </div>
            <h2 className="cplab-header-item font-editorial text-3xl sm:text-5xl font-normal text-[var(--text-primary)] tracking-tight">
              DSA, STL & <span className="italic text-[var(--accent-neon)]">Competitive Logic.</span>
            </h2>
          </div>

          <p className="cplab-header-item text-sm text-[var(--text-muted)] max-w-md font-normal">
            Mastering algorithmic time complexities ($O(1)$, $O(\log N)$), memory boundaries, and standard C++ STL data structures.
          </p>
        </div>

        {/* TOP: Interactive Algorithmic Simulator Sandbox */}
        <div className="cplab-sandbox-panel mb-14 glass-panel p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <div className="flex items-center gap-2 font-code text-xs text-[var(--accent-neon)] uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Algorithm Laboratory</span>
              </div>
              <h3 className="font-editorial text-2xl text-[var(--text-primary)]">
                Step-by-Step Complexity Visualizer
              </h3>
            </div>

            {/* Sandbox Mode Switcher */}
            <div className="p-1 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] flex items-center font-code text-xs flex-wrap gap-1">
              <button
                onClick={() => {
                  sound.playClick();
                  setAlgoMode("binary_search");
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  algoMode === "binary_search"
                    ? "bg-[var(--accent-neon)] text-black font-semibold"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                Binary Search (O(log N))
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setAlgoMode("tree_traversal");
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  algoMode === "tree_traversal"
                    ? "bg-[var(--accent-neon)] text-black font-semibold"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Tree Traversal (D3.js)</span>
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setAlgoMode("two_pointers");
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  algoMode === "two_pointers"
                    ? "bg-[var(--accent-neon)] text-black font-semibold"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                Two Pointers (O(N))
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  setAlgoMode("vector_alloc");
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  algoMode === "vector_alloc"
                    ? "bg-[var(--accent-neon)] text-black font-semibold"
                    : "text-[var(--text-muted)] hover:text-white"
                }`}
              >
                STL Vector (Amortized O(1))
              </button>
            </div>
          </div>

          {/* 1. Tree Traversal D3.js Visualizer */}
          {algoMode === "tree_traversal" && <TreeTraversalVisualizer />}

          {/* 2. Binary Search Visualizer */}
          {algoMode === "binary_search" && (
            <div className="space-y-6">
              {/* Array Bar Blocks */}
              <div className="flex flex-wrap gap-2 justify-center py-4">
                {sortedArray.map((val, idx) => {
                  const isMid = bsMid === idx;
                  const isLow = bsLow === idx;
                  const isHigh = bsHigh === idx;
                  const inRange = idx >= bsLow && idx <= bsHigh;
                  const isTargetFound = bsFound && val === bsTarget && isMid;

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center p-3 rounded-xl border font-code transition-all duration-300 min-w-[56px] text-center ${
                        isTargetFound
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-110 shadow-[0_0_15px_rgba(52,211,153,0.4)]"
                          : isMid
                          ? "bg-[var(--accent-neon)]/20 border-[var(--accent-neon)] text-[var(--accent-neon)] scale-105"
                          : inRange
                          ? "bg-[var(--bg-secondary)] border-white/20 text-[var(--text-primary)]"
                          : "bg-[var(--bg-primary)] border-white/5 text-[var(--text-dim)] opacity-40"
                      }`}
                    >
                      <span className="text-[0.62rem] text-[var(--text-dim)] mb-1">[{idx}]</span>
                      <span className="text-base font-bold">{val}</span>
                      <div className="mt-1 h-3 flex items-center justify-center font-code text-[0.55rem] font-bold">
                        {isMid && <span className="text-[var(--accent-neon)]">MID</span>}
                        {!isMid && isLow && <span className="text-blue-400">LOW</span>}
                        {!isMid && isHigh && <span className="text-purple-400">HIGH</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Controls & Metrics */}
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-xs gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--text-muted)]">Target:</span>
                    <select
                      value={bsTarget}
                      onChange={(e) => {
                        sound.playClick();
                        setBsTarget(Number(e.target.value));
                        resetBS();
                      }}
                      className="px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--accent-neon)] font-bold cursor-pointer"
                    >
                      {sortedArray.map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-[var(--text-dim)]">
                    Steps: <strong className="text-[var(--text-primary)]">{bsStepCount}</strong> (Max: ~4 steps for N=12)
                  </div>

                  {bsFound !== null && (
                    <div className={bsFound ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {bsFound ? "✓ Element Located at Index " + bsMid : "✗ Element Not Found"}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={stepBS}
                    disabled={bsFound === true}
                    className="px-4 py-2 rounded-lg bg-[var(--accent-neon)] text-black font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Next Halving Step</span>
                  </button>
                  <button
                    onClick={resetBS}
                    className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
                    title="Reset Array Pointers"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Two Pointers Visualizer */}
          {algoMode === "two_pointers" && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2 justify-center py-4">
                {tpArray.map((val, idx) => {
                  const isLeft = tpLeft === idx;
                  const isRight = tpRight === idx;
                  const isMatch = tpFound && (isLeft || isRight);

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col items-center p-3 rounded-xl border font-code transition-all duration-300 min-w-[56px] text-center ${
                        isMatch
                          ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-110 shadow-lg"
                          : isLeft || isRight
                          ? "bg-[var(--accent-neon)]/20 border-[var(--accent-neon)] text-[var(--accent-neon)] scale-105"
                          : "bg-[var(--bg-secondary)] border-white/10 text-[var(--text-primary)]"
                      }`}
                    >
                      <span className="text-[0.62rem] text-[var(--text-dim)] mb-1">[{idx}]</span>
                      <span className="text-base font-bold">{val}</span>
                      <div className="mt-1 h-3 flex items-center justify-center font-code text-[0.55rem] font-bold">
                        {isLeft && <span className="text-blue-400">L</span>}
                        {isRight && <span className="text-purple-400">R</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-xs gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="text-[var(--text-muted)]">
                    Target Sum: <strong className="text-[var(--accent-neon)]">{tpTarget}</strong>
                  </div>
                  <div className="text-[var(--text-muted)]">
                    Current Sum:{" "}
                    <strong className="text-[var(--text-primary)]">
                      {tpArray[tpLeft] + tpArray[tpRight]} ({tpArray[tpLeft]} + {tpArray[tpRight]})
                    </strong>
                  </div>
                  {tpFound !== null && (
                    <div className={tpFound ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {tpFound ? `✓ Found Pair: Indices [${tpLeft}, ${tpRight}]` : "✗ No Pair Matches Target"}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={stepTP}
                    disabled={tpFound === true}
                    className="px-4 py-2 rounded-lg bg-[var(--accent-neon)] text-black font-bold hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Advance Pointers</span>
                  </button>
                  <button
                    onClick={resetTP}
                    className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. STL Vector Allocation Visualizer */}
          {algoMode === "vector_alloc" && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-[#0a0a0e] border border-[var(--border-subtle)] font-code text-xs">
                <div className="flex justify-between items-center mb-4 text-[var(--text-dim)]">
                  <span>std::vector&lt;int&gt; Contiguous Memory Buffer</span>
                  <span>
                    size() = <strong className="text-[var(--accent-neon)]">{vectorElements.length}</strong> | capacity() ={" "}
                    <strong className="text-emerald-400">{vectorCapacity}</strong>
                  </span>
                </div>

                {/* Capacity Slots */}
                <div
                  className={`flex flex-wrap gap-2 p-3 rounded-xl border transition-all duration-300 ${
                    reallocFlash
                      ? "border-[var(--accent-neon)] bg-[var(--accent-neon)]/10 shadow-[0_0_20px_var(--glow-color)]"
                      : "border-white/10 bg-[var(--bg-secondary)]"
                  }`}
                >
                  {Array.from({ length: vectorCapacity }).map((_, slotIdx) => {
                    const hasElem = slotIdx < vectorElements.length;
                    return (
                      <div
                        key={slotIdx}
                        className={`p-3 rounded-lg border font-code text-center min-w-[50px] transition-all ${
                          hasElem
                            ? "bg-[var(--accent-neon)]/10 border-[var(--accent-neon)]/40 text-[var(--accent-neon)] font-bold"
                            : "bg-[var(--bg-primary)] border-dashed border-white/10 text-[var(--text-dim)]"
                        }`}
                      >
                        <div className="text-[0.55rem] text-[var(--text-dim)]">0x{slotIdx * 4}</div>
                        <div className="text-sm">{hasElem ? vectorElements[slotIdx] : "—"}</div>
                      </div>
                    );
                  })}
                </div>

                {reallocFlash && (
                  <div className="mt-3 text-xs text-[var(--accent-neon)] font-bold animate-pulse">
                    ⚡ Capacity Exceeded! Doubling Heap Buffer: malloc({vectorCapacity} * sizeof(int)) & amortized O(1) copy
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-xs">
                <div className="text-[var(--text-muted)]">
                  Simulate dynamic container pushes to observe exponential growth factor ($\times 2$).
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={pushToVector}
                    className="px-4 py-2 rounded-lg bg-[var(--accent-neon)] text-black font-bold hover:brightness-110 active:scale-95 transition-all"
                  >
                    push_back()
                  </button>
                  <button
                    onClick={popFromVector}
                    className="px-4 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
                  >
                    pop_back()
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Interactive C++ Implementation Viewer & Copy to Clipboard */}
          {ALGO_CODE_SNIPPETS[algoMode] && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 font-code text-xs">
                  <Terminal className="w-3.5 h-3.5 text-[var(--accent-neon)]" />
                  <span className="text-[var(--text-primary)] font-bold">
                    {ALGO_CODE_SNIPPETS[algoMode].filename}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-white/10 text-[0.62rem] text-[var(--accent-neon)]">
                    {ALGO_CODE_SNIPPETS[algoMode].complexity}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCodeSnippet(!showCodeSnippet)}
                    className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[0.68rem] font-code text-[var(--text-muted)] hover:text-white transition-all"
                  >
                    {showCodeSnippet ? "Hide C++ Source" : "View C++ Source"}
                  </button>

                  <button
                    onClick={() => {
                      sound.playClick();
                      navigator.clipboard.writeText(ALGO_CODE_SNIPPETS[algoMode].code);
                      setCodeCopied(true);
                      setTimeout(() => setCodeCopied(false), 1500);
                    }}
                    className="px-3 py-1 rounded-md bg-[var(--accent-neon)]/15 hover:bg-[var(--accent-neon)]/25 border border-[var(--accent-neon)]/40 text-[var(--accent-neon)] transition-all flex items-center gap-1.5 text-xs font-code font-bold"
                    title="Copy algorithm C++ snippet to clipboard"
                  >
                    {codeCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy C++ Code</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {showCodeSnippet && (
                <div className="p-4 rounded-xl bg-[#060609] border border-white/10 font-code text-xs text-[var(--text-muted)] overflow-x-auto selection:bg-[var(--accent-neon)]/30">
                  <pre className="whitespace-pre">
                    <code>{ALGO_CODE_SNIPPETS[algoMode].code}</code>
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM: Technical Skill Category Breakdown Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Category Tabs */}
          <div className="flex flex-col gap-2">
            <div className="font-code text-xs text-[var(--text-dim)] uppercase tracking-wider mb-2">
              Domain Categories
            </div>
            {SKILL_CATEGORIES.map((cat) => {
              const IconComp = categoryIcons[cat.id] || Code2;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory(cat.id);
                  }}
                  onMouseEnter={() => sound.playHover()}
                  className={`cplab-domain-tab p-3.5 rounded-xl border text-left font-code text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? "border-[var(--accent-neon)] bg-[var(--accent-neon)]/10 text-[var(--accent-neon)] font-bold shadow-sm"
                      : "border-[var(--border-subtle)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="w-4 h-4" />
                    <span>{cat.title}</span>
                  </div>
                  <span className="text-[0.62rem] opacity-60">({cat.skills.length})</span>
                </button>
              );
            })}
          </div>

          {/* Detailed Skill Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_CATEGORIES.find((c) => c.id === activeCategory)?.skills.map((skill, idx) => (
              <div
                key={idx}
                className="cplab-skill-card skill-card-item p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] hover:border-[var(--accent-neon)] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-code text-sm font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-neon)] transition-colors">
                      {skill.name}
                    </span>
                    {skill.complexity && (
                      <span className="cyber-badge font-mono text-[0.62rem]">
                        {skill.complexity}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                    {skill.details}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between font-code text-[0.68rem] text-[var(--text-dim)]">
                  <span>Applied In: <strong className="text-[var(--text-muted)] font-normal">{skill.appliedProject}</strong></span>
                  <span>{skill.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
