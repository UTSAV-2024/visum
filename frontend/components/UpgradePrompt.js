export default function UpgradePrompt({ cta }) {
  return (
    <div style={{
      background: "#1B2A4A",
      borderRadius: 12,
      padding: "24px",
      marginBottom: 24,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 16, color: "#FFFFFF", fontWeight: 600, marginBottom: 8 }}>
        {cta}
      </div>
      <div style={{ fontSize: 13, color: "#94A3B8", marginBottom: 16 }}>
        Visum Pro · $149/month · Hosted MCP server + weekly AI monitoring
      </div>
      <a
        href="mailto:utsav@visum.io?subject=Visum Pro Interest"
        style={{
          background: "#2563EB",
          color: "#FFFFFF",
          padding: "10px 28px",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Get Early Access
      </a>
    </div>
  );
}
