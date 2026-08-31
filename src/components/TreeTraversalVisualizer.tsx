import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { sound } from "../lib/sound";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Search,
  CheckCircle2,
  Layers,
  Terminal,
  Activity,
} from "lucide-react";

interface TreeNodeData {
  id: string;
  value: number;
  label?: string;
  children?: TreeNodeData[];
}

const INITIAL_TREE_DATA: TreeNodeData = {
  id: "node-50",
  value: 50,
  children: [
    {
      id: "node-25",
      value: 25,
      children: [
        { id: "node-12", value: 12 },
        { id: "node-37", value: 37 },
      ],
    },
    {
      id: "node-75",
      value: 75,
      children: [
        { id: "node-62", value: 62 },
        { id: "node-87", value: 87 },
      ],
    },
  ],
};

type TraversalType = "inorder" | "preorder" | "postorder" | "bfs";

interface TraversalStep {
  nodeId: string;
  value: number;
  action: string;
  stackOrQueue: number[];
  visitedSoFar: number[];
}

export const TreeTraversalVisualizer: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [traversalType, setTraversalType] = useState<TraversalType>("inorder");
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [searchTarget, setSearchTarget] = useState<number | "">("");
  const [searchPath, setSearchPath] = useState<string[]>([]);
  const [searchResultFound, setSearchResultFound] = useState<boolean | null>(null);

  // Precomputed traversal steps for the tree
  const [steps, setSteps] = useState<TraversalStep[]>([]);

  // Compute traversal steps whenever traversalType changes
  useEffect(() => {
    const computedSteps: TraversalStep[] = [];
    const visited: number[] = [];

    const root = INITIAL_TREE_DATA;

    if (traversalType === "inorder") {
      // In-Order: Left -> Root -> Right
      const stack: TreeNodeData[] = [];
      const traverse = (node: TreeNodeData | undefined) => {
        if (!node) return;
        stack.push(node);
        if (node.children && node.children[0]) {
          traverse(node.children[0]);
        }
        visited.push(node.value);
        computedSteps.push({
          nodeId: node.id,
          value: node.value,
          action: `Visited Root/Subtree Node ${node.value} (Left subtree completed)`,
          stackOrQueue: stack.map((n) => n.value),
          visitedSoFar: [...visited],
        });
        if (node.children && node.children[1]) {
          traverse(node.children[1]);
        }
        stack.pop();
      };
      traverse(root);
    } else if (traversalType === "preorder") {
      // Pre-Order: Root -> Left -> Right
      const stack: TreeNodeData[] = [root];
      const traverse = (node: TreeNodeData | undefined) => {
        if (!node) return;
        visited.push(node.value);
        computedSteps.push({
          nodeId: node.id,
          value: node.value,
          action: `Process Node ${node.value} immediately before descending`,
          stackOrQueue: stack.map((n) => n.value),
          visitedSoFar: [...visited],
        });
        if (node.children) {
          if (node.children[0]) {
            stack.push(node.children[0]);
            traverse(node.children[0]);
            stack.pop();
          }
          if (node.children[1]) {
            stack.push(node.children[1]);
            traverse(node.children[1]);
            stack.pop();
          }
        }
      };
      traverse(root);
    } else if (traversalType === "postorder") {
      // Post-Order: Left -> Right -> Root
      const stack: TreeNodeData[] = [];
      const traverse = (node: TreeNodeData | undefined) => {
        if (!node) return;
        stack.push(node);
        if (node.children && node.children[0]) traverse(node.children[0]);
        if (node.children && node.children[1]) traverse(node.children[1]);
        visited.push(node.value);
        computedSteps.push({
          nodeId: node.id,
          value: node.value,
          action: `Process Node ${node.value} (both children processed)`,
          stackOrQueue: stack.map((n) => n.value),
          visitedSoFar: [...visited],
        });
        stack.pop();
      };
      traverse(root);
    } else if (traversalType === "bfs") {
      // BFS / Level Order
      const queue: TreeNodeData[] = [root];
      while (queue.length > 0) {
        const current = queue.shift()!;
        visited.push(current.value);
        if (current.children) {
          current.children.forEach((c) => queue.push(c));
        }
        computedSteps.push({
          nodeId: current.id,
          value: current.value,
          action: `Dequeued & Visited Node ${current.value} at level depth`,
          stackOrQueue: queue.map((n) => n.value),
          visitedSoFar: [...visited],
        });
      }
    }

    setSteps(computedSteps);
    setCurrentStepIdx(-1);
    setIsPlaying(false);
    setSearchPath([]);
    setSearchResultFound(null);
  }, [traversalType]);

  // Handle D3 Render
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const containerWidth = containerRef.current.clientWidth || 600;
    const width = Math.max(containerWidth, 420);
    const height = 240;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", height);

    // Defs for cyber neon glow filter
    const defs = svg.append("defs");
    const filter = defs.append("filter").attr("id", "neon-glow").attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
    filter.append("feGaussianBlur").attr("stdDeviation", "4").attr("result", "coloredBlur");
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // D3 Hierarchy Layout
    const hierarchyData = d3.hierarchy<TreeNodeData>(INITIAL_TREE_DATA);
    const treeLayout = d3.tree<TreeNodeData>().size([width - 80, height - 80]);
    const rootNode = treeLayout(hierarchyData);

    const g = svg.append("g").attr("transform", "translate(40, 36)");

    // Determine current active and visited sets
    const currentStep = currentStepIdx >= 0 ? steps[currentStepIdx] : null;
    const visitedIds = new Set<string>();
    const visitedOrderMap = new Map<string, number>();

    if (currentStepIdx >= 0) {
      for (let i = 0; i <= currentStepIdx; i++) {
        visitedIds.add(steps[i].nodeId);
        visitedOrderMap.set(steps[i].nodeId, i + 1);
      }
    }

    // Draw Links
    g.selectAll(".tree-link")
      .data(rootNode.links())
      .enter()
      .append("path")
      .attr("class", "tree-link")
      .attr(
        "d",
        d3
          .linkVertical<any, d3.HierarchyPointNode<TreeNodeData>>()
          .x((d) => d.x)
          .y((d) => d.y)
      )
      .attr("fill", "none")
      .attr("stroke", (d) => {
        const isConnectedInSearch =
          searchPath.includes(d.source.data.id) && searchPath.includes(d.target.data.id);
        const isTraversed =
          visitedIds.has(d.source.data.id) && visitedIds.has(d.target.data.id);

        if (isConnectedInSearch) return "#FF4D26";
        if (isTraversed) return "#10B981";
        return "rgba(255, 255, 255, 0.15)";
      })
      .attr("stroke-width", (d) => {
        const isConnectedInSearch =
          searchPath.includes(d.source.data.id) && searchPath.includes(d.target.data.id);
        return isConnectedInSearch ? 2.5 : 1.5;
      })
      .attr("stroke-dasharray", (d) => {
        const isTraversed =
          visitedIds.has(d.source.data.id) && visitedIds.has(d.target.data.id);
        return isTraversed ? "none" : "3,3";
      });

    // Draw Nodes
    const nodeGroups = g
      .selectAll(".tree-node")
      .data(rootNode.descendants())
      .enter()
      .append("g")
      .attr("class", "tree-node cursor-pointer")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
      .on("click", (_event, d) => {
        sound.playClick();
        handleSearchNode(d.data.value);
      });

    // Node Outer Glow Ring for Active State
    nodeGroups
      .filter((d) => (currentStep ? currentStep.nodeId === d.data.id : false))
      .append("circle")
      .attr("r", 24)
      .attr("fill", "none")
      .attr("stroke", "#FF4D26")
      .attr("stroke-width", 2)
      .attr("opacity", 0.8)
      .attr("filter", "url(#neon-glow)");

    // Base Node Circle
    nodeGroups
      .append("circle")
      .attr("r", 18)
      .attr("fill", (d) => {
        if (currentStep && currentStep.nodeId === d.data.id) return "#FF4D26";
        if (searchPath.includes(d.data.id)) return "rgba(255, 77, 38, 0.35)";
        if (visitedIds.has(d.data.id)) return "rgba(16, 185, 129, 0.25)";
        return "#14151C";
      })
      .attr("stroke", (d) => {
        if (currentStep && currentStep.nodeId === d.data.id) return "#FFFFFF";
        if (searchPath.includes(d.data.id)) return "#FF7034";
        if (visitedIds.has(d.data.id)) return "#10B981";
        return "rgba(255, 255, 255, 0.25)";
      })
      .attr("stroke-width", (d) => {
        if (currentStep && currentStep.nodeId === d.data.id) return 2.5;
        if (searchPath.includes(d.data.id)) return 2;
        return 1.2;
      });

    // Node Numerical Value Label
    nodeGroups
      .append("text")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", (d) => {
        if (currentStep && currentStep.nodeId === d.data.id) return "#000000";
        if (visitedIds.has(d.data.id)) return "#34D399";
        return "#F3EFE9";
      })
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .text((d) => d.data.value);

    // Step Sequence Number Badge (①, ②, etc.)
    nodeGroups
      .filter((d) => visitedOrderMap.has(d.data.id))
      .append("circle")
      .attr("cx", 14)
      .attr("cy", -14)
      .attr("r", 7)
      .attr("fill", "#10B981");

    nodeGroups
      .filter((d) => visitedOrderMap.has(d.data.id))
      .append("text")
      .attr("x", 14)
      .attr("y", -14)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#000000")
      .attr("font-family", "JetBrains Mono, monospace")
      .attr("font-size", "8px")
      .attr("font-weight", "bold")
      .text((d) => visitedOrderMap.get(d.data.id) || "");
  }, [currentStepIdx, steps, searchPath]);

  // Playback Auto Timer
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      if (currentStepIdx < steps.length - 1) {
        timer = setTimeout(() => {
          setCurrentStepIdx((prev) => prev + 1);
          sound.playKey();
        }, 650);
      } else {
        setIsPlaying(false);
        sound.playSuccess();
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIdx, steps.length]);

  const handleNextStep = () => {
    if (currentStepIdx < steps.length - 1) {
      sound.playKey();
      setCurrentStepIdx((prev) => prev + 1);
      if (currentStepIdx + 1 === steps.length - 1) {
        sound.playSuccess();
      }
    }
  };

  const handleReset = () => {
    sound.playClick();
    setIsPlaying(false);
    setCurrentStepIdx(-1);
    setSearchPath([]);
    setSearchResultFound(null);
  };

  const handleSearchNode = (targetVal: number) => {
    setSearchTarget(targetVal);
    handleReset();

    // BST Search Simulation
    const path: string[] = [];
    let curr: TreeNodeData | undefined = INITIAL_TREE_DATA;
    let found = false;

    while (curr) {
      path.push(curr.id);
      if (curr.value === targetVal) {
        found = true;
        break;
      } else if (targetVal < curr.value) {
        curr = curr.children ? curr.children[0] : undefined;
      } else {
        curr = curr.children ? curr.children[1] : undefined;
      }
    }

    setSearchPath(path);
    setSearchResultFound(found);
    if (found) sound.playSuccess();
    else sound.playKey();
  };

  const currentStepData = currentStepIdx >= 0 ? steps[currentStepIdx] : null;

  return (
    <div className="space-y-6">
      {/* Top Header and Traversal Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 font-code text-xs">
          <Activity className="w-4 h-4 text-[var(--accent-neon)]" />
          <span className="text-[var(--text-primary)] font-bold">D3.js Binary Search Tree Engine</span>
          <span className="cyber-badge text-[0.6rem] text-[var(--accent-neon)]">Depth: 3 · N=7 Nodes</span>
        </div>

        {/* Traversal Algorithm Modes */}
        <div className="flex items-center gap-1 p-1 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-subtle)] font-code text-[0.7rem] flex-wrap">
          <button
            onClick={() => {
              sound.playClick();
              setTraversalType("inorder");
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              traversalType === "inorder"
                ? "bg-[var(--accent-neon)] text-black font-bold shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            In-Order (L-Root-R)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTraversalType("preorder");
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              traversalType === "preorder"
                ? "bg-[var(--accent-neon)] text-black font-bold shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            Pre-Order (Root-L-R)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTraversalType("postorder");
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              traversalType === "postorder"
                ? "bg-[var(--accent-neon)] text-black font-bold shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            Post-Order (L-R-Root)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setTraversalType("bfs");
            }}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              traversalType === "bfs"
                ? "bg-[var(--accent-neon)] text-black font-bold shadow-sm"
                : "text-[var(--text-muted)] hover:text-white"
            }`}
          >
            BFS Level-Order
          </button>
        </div>
      </div>

      {/* SVG Canvas for D3 Tree Visualization */}
      <div
        ref={containerRef}
        className="relative p-4 rounded-2xl bg-[#090A0E] border border-[var(--border-subtle)] overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[250px]"
      >
        <svg ref={svgRef} className="w-full max-w-2xl overflow-visible" />

        {/* Floating helper note */}
        <div className="absolute bottom-2 left-3 font-code text-[0.62rem] text-[var(--text-dim)] flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-neon)] animate-pulse" />
          <span>Click any node circle to run O(log N) BST pointer query</span>
        </div>
      </div>

      {/* Live Traversal Stream & Memory Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-code text-xs">
        {/* Left: Current Traversal Stream Output */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-dim)] pb-2 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-[var(--accent-neon)] font-bold">
              <Terminal className="w-3.5 h-3.5" />
              Traversal Sequence
            </span>
            <span>
              {currentStepIdx >= 0 ? currentStepIdx + 1 : 0} / {steps.length} Nodes
            </span>
          </div>

          {/* Visited array pills */}
          <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
            {currentStepData && currentStepData.visitedSoFar.length > 0 ? (
              currentStepData.visitedSoFar.map((val, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[0.72rem] font-bold flex items-center gap-1"
                >
                  <span className="text-[0.6rem] text-emerald-400 opacity-60">#{idx + 1}</span>
                  {val}
                </span>
              ))
            ) : (
              <span className="text-[var(--text-dim)] italic">Press 'Step Traversal' or 'Auto Play' to begin sequence...</span>
            )}
          </div>

          {currentStepData && (
            <p className="text-[0.68rem] text-[var(--text-muted)] pt-1">
              ⚡ {currentStepData.action}
            </p>
          )}
        </div>

        {/* Right: Call Stack / Queue State */}
        <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-2">
          <div className="flex items-center justify-between text-[var(--text-dim)] pb-2 border-b border-white/5">
            <span className="flex items-center gap-1.5 text-[var(--text-primary)] font-bold">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              {traversalType === "bfs" ? "BFS FIFO Queue" : "DFS Recursion Stack"}
            </span>
            <span className="text-[var(--text-dim)]">O(H) Memory Space</span>
          </div>

          <div className="flex items-center gap-1.5 min-h-[32px] overflow-x-auto">
            {currentStepData && currentStepData.stackOrQueue.length > 0 ? (
              currentStepData.stackOrQueue.map((v, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-[var(--bg-primary)] border border-blue-500/40 text-blue-300 text-[0.72rem] font-mono font-bold"
                >
                  {v}
                </span>
              ))
            ) : (
              <span className="text-[var(--text-dim)] italic">Stack frame / Queue empty</span>
            )}
          </div>

          <p className="text-[0.68rem] text-[var(--text-dim)]">
            {traversalType === "bfs"
              ? "Queue unrolls breadth-first across depth tiers."
              : "System stack holds active activation frames along root-to-leaf paths."}
          </p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-code text-xs gap-4">
        {/* Search Input for BST */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-[var(--text-muted)]">BST Query:</span>
          <select
            value={searchTarget}
            onChange={(e) => {
              if (e.target.value !== "") {
                handleSearchNode(Number(e.target.value));
              }
            }}
            className="px-2 py-1.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--accent-neon)] font-bold cursor-pointer text-xs"
          >
            <option value="">Select Target...</option>
            {[12, 25, 37, 50, 62, 75, 87].map((v) => (
              <option key={v} value={v}>
                Node {v}
              </option>
            ))}
          </select>

          {searchResultFound !== null && (
            <span className="text-[0.72rem] text-emerald-400 font-bold ml-1">
              ✓ Path length: {searchPath.length} ($O(\log N)$)
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => {
              sound.playClick();
              setIsPlaying(!isPlaying);
            }}
            className={`px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              isPlaying
                ? "bg-amber-500 text-black shadow-sm hover:brightness-110"
                : "bg-[var(--accent-neon)] text-black shadow-sm hover:brightness-110 active:scale-95"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          <button
            onClick={handleNextStep}
            disabled={isPlaying || currentStepIdx >= steps.length - 1}
            className="px-3.5 py-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-neon)] disabled:opacity-40 flex items-center gap-1"
            title="Next Step"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Step Next</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-white"
            title="Reset Traversal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
