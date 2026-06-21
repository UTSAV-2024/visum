export default function CheckItem({ check }) {
  const { name, score, max_score, passed, partial, finding, fix } = check;

  const color = passed ? "#16A34A" : partial ? "#EA580C" : "#DC2626";
  const bg    = passed ? "#DCFCE7" : partial ? "#FFEDD5" : "#FEE2E2";
  const label = passed ? "PASS"    : partial ? "PART"    : "FAIL";

  return (
    <div style={{
      border: "1px solid #E2E8F0",
      borderRadius: 12,
      padding: "16px 20px",
      marginBottom: 12,
      background: "#FFFFFF",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div style={{ fontWeight: 600, fontSize: 15, color: "#0F172A" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            background: bg, color, fontSize: 11, fontWeight: 700,
            padding: "2px 8px", borderRadius: 99,
          }}>{label}</span>
          <span style={{ fontWeight: 700, color, fontSize: 15 }}>
            {score}/{max_score}
          </span>
        </div>
      </div>
      <div style={{ fontSize: 13, color: "#475569", marginBottom: 6 }}>{finding}</div>
      {!passed && (
        <div style={{ fontSize: 13, color: "#2563EB", background: "#DBEAFE", borderRadius: 6, padding: "6px 10px" }}>
          Fix: {fix}
        </div>
      )}
    </div>
  );
}
