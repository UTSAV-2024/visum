import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ScoreCard from "../components/ScoreCard";
import CheckItem from "../components/CheckItem";
import UpgradePrompt from "../components/UpgradePrompt";
import { track } from "../lib/posthog";

export default function Result() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("visum_result");
    if (!stored) {
      router.push("/");
      return;
    }
    const parsed = JSON.parse(stored);
    setData(parsed);
    track("result_viewed", {
      score: parsed.result.total_score,
      band: parsed.result.band,
      url: parsed.result.url,
    });
  }, []);

  if (!data) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial, sans-serif" }}>
      <div style={{ color: "#94A3B8" }}>Loading...</div>
    </div>
  );

  const { result } = data;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F8FAFC",
      padding: "24px 16px",
      fontFamily: "Arial, sans-serif",
    }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>

        {/* Nav */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1B2A4A" }}>Visum</div>
          <button
            onClick={() => router.push("/")}
            style={{
              background: "none", border: "1px solid #E2E8F0",
              borderRadius: 8, padding: "6px 16px",
              fontSize: 13, color: "#475569", cursor: "pointer",
            }}
          >
            Scan another site
          </button>
        </div>

        {/* URL scanned */}
        <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>
          Results for: <strong style={{ color: "#0F172A" }}>{result.url}</strong>
        </div>

        {/* Score card */}
        <ScoreCard
          score={result.total_score}
          band={result.band}
          message={result.band_message}
        />

        {/* Upgrade CTA */}
        {result.total_score < 85 && (
          <UpgradePrompt cta={result.upgrade_cta} />
        )}

        {/* Check breakdown */}
        <div style={{ fontSize: 16, fontWeight: 700, color: "#1B2A4A", marginBottom: 16 }}>
          Score Breakdown
        </div>
        {result.checks.map((check, i) => (
          <CheckItem key={i} check={check} />
        ))}

        {/* Scan time */}
        <div style={{ textAlign: "center", fontSize: 12, color: "#94A3B8", marginTop: 24, marginBottom: 8 }}>
          Scanned in {(result.scan_time_ms / 1000).toFixed(1)}s
        </div>

        {/* Share */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <button
            onClick={() => {
              const text = `My site scored ${result.total_score}/100 on Visum's AI Agent Readiness scanner. Is your site visible to ChatGPT and Claude? Check free at visum.io`;
              navigator.clipboard.writeText(text);
              track("share_clicked", { score: result.total_score });
              alert("Copied to clipboard!");
            }}
            style={{
              background: "#1B2A4A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Share my score
          </button>
        </div>

      </div>
    </div>
  );
}
