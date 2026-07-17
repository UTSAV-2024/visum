"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type NodeProps,
  type Node,
  type Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Info } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  CRAWL_PAGES,
  CRAWL_EDGES,
  getNodePositions,
  STATUS_COLORS,
  STATUS_BG,
  STATUS_LABELS,
  type CrawlPage,
  type CrawlStatus,
} from "./data";
import { StatusDot, Badge } from "./shared";

// ── Custom Graph Node ───────────────────────────────────────────

function CrawlGraphNode({ data }: NodeProps) {
  const page = data.page as CrawlPage;
  const isHovered = data.isHovered as boolean;
  const isSelected = data.isSelected as boolean;

  return (
    <div
      className={cn(
        "relative rounded-xl border-2 transition-all duration-200 cursor-pointer min-w-[160px]",
        isSelected
          ? "border-accent shadow-[0_0_20px_-6px_rgba(124,58,237,0.4)]"
          : "border-transparent hover:border-foreground/20"
      )}
      style={{
        backgroundColor: STATUS_BG[page.status],
        borderColor: isSelected ? "#7c3aed" : STATUS_COLORS[page.status] + "40",
      }}
    >
      {/* Top status bar */}
      <div
        className="h-1 rounded-t-xl"
        style={{ backgroundColor: STATUS_COLORS[page.status] }}
      />

      <div className="px-3 py-2.5 space-y-1.5">
        {/* Path + status */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono font-bold text-foreground truncate">
            {page.path}
          </span>
          <StatusDot status={page.status} size="xs" />
        </div>

        {/* Title */}
        <p className="text-[9px] text-muted-foreground/60 truncate">{page.title}</p>

        {/* Stats row */}
        <div className="flex items-center gap-2 text-[9px] text-muted-foreground/50">
          <span>{page.responseTime}</span>
          {page.statusCode > 0 && (
            <>
              <span>·</span>
              <span className={page.statusCode >= 400 ? "text-red-500" : page.statusCode >= 300 ? "text-orange-500" : "text-green-500"}>
                {page.statusCode}
              </span>
            </>
          )}
          <span>·</span>
          <span>{page.tokenCount.toLocaleString()} tokens</span>
        </div>

        {/* AI score bar */}
        <div className="h-1 rounded-full bg-muted/20 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${page.aiScore}%`,
              backgroundColor: STATUS_COLORS[page.status],
            }}
          />
        </div>
      </div>

      {/* Handles for edges */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-accent !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-accent !border-2 !border-background"
      />
    </div>
  );
}

// Node type definition
const nodeTypes = { crawlNode: CrawlGraphNode };

// ── Hover Preview ───────────────────────────────────────────────

function NodePreview({ page, onClose }: { page: CrawlPage | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {page && (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.15 }}
          className="absolute bottom-4 left-4 z-20 w-72 rounded-xl border border-border bg-popover shadow-xl backdrop-blur-xl overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold text-foreground truncate">{page.path}</p>
            <button onClick={onClose} className="text-muted-foreground/40 hover:text-foreground transition-colors">
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="p-4 space-y-2 text-[10px]">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground/60">Status</span>
              <div className="flex items-center gap-1.5">
                <StatusDot status={page.status} size="xs" />
                <span className="font-medium">{STATUS_LABELS[page.status]}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground/60">Response Time</span>
              <span className="font-mono font-medium">{page.responseTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground/60">Structured Data</span>
              <Badge variant={page.structuredData ? "success" : "warning"}>
                {page.structuredData ? "Present" : "Missing"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground/60">Token Count</span>
              <span className="font-mono font-medium">{page.tokenCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground/60">AI Score</span>
              <span className={cn("font-mono font-bold", page.aiScore >= 80 ? "text-green-500" : page.aiScore >= 50 ? "text-orange-500" : "text-red-500")}>
                {page.aiScore}/100
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main Graph Component ───────────────────────────────────────

interface CrawlGraphProps {
  selectedPage: CrawlPage | null;
  onSelectPage: (page: CrawlPage | null) => void;
}

export function CrawlGraph({ selectedPage, onSelectPage }: CrawlGraphProps) {
  const [hoveredPage, setHoveredPage] = useState<CrawlPage | null>(null);

  // Stable initial nodes — computed once from CRAWL_PAGES
  const baseNodes: Node[] = useMemo(
    () =>
      CRAWL_PAGES.map((page) => {
        const pos = getNodePositions();
        return {
          id: page.id,
          type: "crawlNode",
          position: pos[page.id] || { x: 0, y: 0 },
          data: { page },
        };
      }),
    []
  );

  const initialEdges: Edge[] = useMemo(
    () =>
      CRAWL_EDGES.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: STATUS_COLORS[edge.status],
          strokeWidth: 2,
          strokeOpacity: 0.6,
        },
        labelStyle: {
          fontSize: 8,
          fill: "#a0a0a0",
          fontFamily: "monospace",
        },
        labelBgStyle: {
          fill: "#1a1a1a",
          fillOpacity: 0.8,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: STATUS_COLORS[edge.status],
          width: 12,
          height: 8,
        },
      })),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(baseNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  // Sync highlight state with selected/hovered pages
  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => {
        const page = n.data.page as CrawlPage;
        return {
          ...n,
          data: {
            ...n.data,
            isHovered: hoveredPage?.id === page.id,
            isSelected: selectedPage?.id === page.id,
          },
        };
      })
    );
  }, [hoveredPage, selectedPage, setNodes]);

  const onNodeClick = useCallback(
    (node: Node) => {
      const page = node.data.page as CrawlPage;
      onSelectPage(page.id === selectedPage?.id ? null : page);
    },
    [onSelectPage, selectedPage]
  );

  const onNodeMouseEnter = useCallback(
    (node: Node) => {
      setHoveredPage(node.data.page as CrawlPage);
    },
    []
  );

  const onNodeMouseLeave = useCallback(() => {
    setHoveredPage(null);
  }, []);

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeClick(node)}
        onNodeMouseEnter={(_, node) => onNodeMouseEnter(node)}
        onNodeMouseLeave={onNodeMouseLeave}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2.5}
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background color="rgba(255,255,255,0.03)" gap={24} />
        <Controls
          className="!bg-card !border-border !rounded-lg !shadow-none [&_button]:!text-muted-foreground [&_button]:!border-border [&_button]:!bg-card [&_button]:!rounded-none [&_button:hover]:!bg-muted/20"
        />
        <MiniMap
          nodeColor={(node) => STATUS_COLORS[(node.data?.page as CrawlPage)?.status || "unvisited"]}
          maskColor="rgba(10,10,10,0.8)"
          className="!bg-card !border-border !rounded-lg"
          style={{ width: 120, height: 80 }}
        />
      </ReactFlow>

      {/* Hover preview */}
      <NodePreview page={hoveredPage} onClose={() => setHoveredPage(null)} />

      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 rounded-lg border border-border bg-card/90 backdrop-blur-sm px-3 py-2 space-y-1">
        <p className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1.5">Legend</p>
        {Object.entries(STATUS_LABELS).map(([status, label]) => (
          <div key={status} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS[status as CrawlStatus] }} />
            <span className="text-[9px] text-muted-foreground/60">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
