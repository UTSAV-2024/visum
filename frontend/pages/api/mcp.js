// Minimal Model Context Protocol (MCP) endpoint for Visum.
//
// This is a real, working endpoint — not a discovery stub:
//   GET  /api/mcp  -> server manifest (protocolVersion, capabilities, tools)
//   POST /api/mcp  -> MCP JSON-RPC 2.0 (initialize, tools/list, tools/call)
//
// The single tool, `scan_website`, proxies to Visum's live scan API so an AI
// agent can request an AI-readiness report for any URL and get structured
// results back.

const API_URL =
  process.env.VISUM_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://visum-xoe3.onrender.com";

const PROTOCOL_VERSION = "2024-11-05";

const SERVER_INFO = { name: "visum", version: "0.1.0" };

const TOOLS = [
  {
    name: "scan_website",
    description:
      "Scan a website for AI-agent readiness. Returns a 0–100 score plus per-check " +
      "findings and fixes covering robots.txt permissions for AI crawlers, JSON-LD " +
      "structured data, llms.txt, sitemap, meta/Open Graph tags, JavaScript-rendering " +
      "dependence, MCP/OpenAPI availability, and page speed.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The website URL to scan, e.g. https://example.com",
        },
      },
      required: ["url"],
    },
  },
];

// The GET manifest doubles as the capabilities discovery document.
const MANIFEST = {
  protocolVersion: PROTOCOL_VERSION,
  serverInfo: SERVER_INFO,
  capabilities: { tools: { listChanged: false } },
  tools: TOOLS,
  instructions:
    "Call tools/call with name 'scan_website' and an argument { url } to get an " +
    "AI-agent-readiness report for that URL.",
};

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function rpcResult(id, result) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function rpcError(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

async function runScan(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 55000);
  try {
    const resp = await fetch(`${API_URL}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
    const text = await resp.text();
    if (!resp.ok) {
      let detail = text;
      try {
        detail = JSON.parse(text).detail || text;
      } catch {
        /* keep raw text */
      }
      throw new Error(`Scan API returned ${resp.status}: ${detail}`);
    }
    return JSON.parse(text);
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req, res) {
  setCors(res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Discovery: a plain GET returns the server manifest.
  if (req.method === "GET") {
    return res.status(200).json(MANIFEST);
  }

  if (req.method !== "POST") {
    return res.status(405).json(rpcError(null, -32600, "Method not allowed"));
  }

  const body = req.body || {};
  const { id, method, params } = body;

  if (body.jsonrpc !== "2.0" || typeof method !== "string") {
    return res.status(400).json(rpcError(id, -32600, "Invalid JSON-RPC request"));
  }

  try {
    switch (method) {
      case "initialize":
        return res.status(200).json(
          rpcResult(id, {
            protocolVersion: PROTOCOL_VERSION,
            serverInfo: SERVER_INFO,
            capabilities: { tools: { listChanged: false } },
          })
        );

      case "notifications/initialized":
        // Notification — no response body expected.
        return res.status(204).end();

      case "ping":
        return res.status(200).json(rpcResult(id, {}));

      case "tools/list":
        return res.status(200).json(rpcResult(id, { tools: TOOLS }));

      case "tools/call": {
        const name = params?.name;
        const args = params?.arguments || {};
        if (name !== "scan_website") {
          return res
            .status(200)
            .json(rpcError(id, -32602, `Unknown tool: ${name}`));
        }
        const url = args.url;
        if (!url || typeof url !== "string") {
          return res
            .status(200)
            .json(rpcError(id, -32602, "Missing required argument: url"));
        }

        try {
          const data = await runScan(url);
          const result = data.result || data;
          const summary =
            `Visum AI-readiness score for ${result.url || url}: ` +
            `${result.total_score}/100 (${result.band}).`;
          return res.status(200).json(
            rpcResult(id, {
              content: [
                { type: "text", text: summary },
                { type: "text", text: JSON.stringify(result, null, 2) },
              ],
            })
          );
        } catch (err) {
          // Tool-level error: report via isError so the agent can react.
          return res.status(200).json(
            rpcResult(id, {
              isError: true,
              content: [{ type: "text", text: `Scan failed: ${err.message}` }],
            })
          );
        }
      }

      default:
        return res
          .status(200)
          .json(rpcError(id, -32601, `Method not found: ${method}`));
    }
  } catch (err) {
    console.error("[mcp] handler error:", err);
    return res.status(500).json(rpcError(id, -32603, "Internal error"));
  }
}
