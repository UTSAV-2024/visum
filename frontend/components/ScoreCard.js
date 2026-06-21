export default function ScoreCard({ score, band, message }) {
  const color =
    score >= 85 ? "#16A34A" :
    score >= 65 ? "#2563EB" :
    score >= 40 ? "#EA580C" : "#DC2626";

  const bg =
    score >= 85 ? "#DCFCE7" :
    score >= 65 ? "#DBEAFE" :
    score >= 40 ? "#FFEDD5" : "#FEE2E2";

  return (
    <div style={{ background: bg, borderRadius: 16, padding: "32px 24px", textAlign: "center", marginBottom: 24 }}>
      <div style={{ fontSize: 80, fontWeight: 800, color, lineHeight: 1 }}>
        {score}
      </div>
      <div style={{ fontSize: 14, color: "#94A3B8", marginBottom: 8 }}>out of 100</div>
      <div style={{ fontSize: 22, fontWeight: 700, color, marginBottom: 12 }}>
        {band}
      </div>
      <div style={{ fontSize: 15, color: "#475569", maxWidth: 480, margin: "0 auto" }}>
        {message}
      </div>
    </div>
  );
}
