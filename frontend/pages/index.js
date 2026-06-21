import { useState } from "react";
import { useRouter } from "next/router";
import { scanUrl } from "../lib/api";
import { track } from "../lib/posthog";

export default function Home() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleScan() {
    if (!url.trim()) return;
    setError("");
    setLoading(true);
    track("scan_initiated", { url });

    try {
      const data = await scanUrl(url.trim());
      track("scan_completed", {
        url,
        score: data.result.total_score,
        band: data.result.band,
      });
      // Store result in sessionStorage, redirect to result page
      sessionStorage.setItem("visum_result", JSON.stringify(data));
      router.push("/result");
    } catch (err) {
      setError(err.message || "Scan failed. Try again.");
      track("scan_error", { url, error: err.message });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleScan();
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ maxWidth: 560, width: "100%" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#1B2A4A", marginBottom: 8 }}>
            Visum
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "#0F172A", marginBottom: 12 }}>
            Is your site visible to AI agents?
          </div>
          <div style={{ fontSize: 15, color: "#475569", lineHeight: 1.6 }}>
            Shopify stores are agent-discoverable by default.
            WooCommerce, Webflow, and custom sites are not.
            Find out where you stand — free.
          </div>
        </div>

        {/* Scan box */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          marginBottom: 24,
        }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1B2A4A", marginBottom: 8 }}>
            Enter your website URL
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://yourstore.com"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px 16px",
              fontSize: 15,
              border: "1px solid #E2E8F0",
              borderRadius: 8,
              marginBottom: 12,
              boxSizing: "border-box",
              outline: "none",
              color: "#0F172A",
            }}
          />
          <button
            onClick={handleScan}
            disabled={loading || !url.trim()}
            style={{
              width: "100%",
              padding: "12px",
              background: loading ? "#94A3B8" : "#2563EB",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Scanning... (15-30 seconds)" : "Check Agent Readiness →"}
          </button>
          {error && (
            <div style={{ marginTop: 12, color: "#DC2626", fontSize: 13 }}>
              {error}
            </div>
          )}
        </div>

        {/* Social proof */}
        <div style={{ textAlign: "center", fontSize: 13, color: "#94A3B8" }}>
          Free · No signup · Takes 15–30 seconds
        </div>

        {/* Stats strip */}
        <div style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 32,
          padding: "16px",
          background: "#FFFFFF",
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}>
          {[
            ["393%", "AI traffic growth YoY"],
            ["42%", "Better conversion vs search"],
            ["8", "Checks in 30 seconds"],
          ].map(([stat, label]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#2563EB" }}>{stat}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
