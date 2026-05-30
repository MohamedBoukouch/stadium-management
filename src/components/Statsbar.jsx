const stats = [
  { value: "3", label: "ملاعب متاحة", icon: "🏟️" },
  { value: "24/7", label: "ساعات العمل", icon: "🕐" },
  { value: "+2000", label: "لاعب مسجل", icon: "👤" },
  { value: "5★", label: "تقييم العملاء", icon: "⭐" },
];

export default function StatsBar() {
  return (
    <section style={{
      background: "#ffffff",
      borderTop: "1px solid #c8e6c0",
      borderBottom: "1px solid #c8e6c0",
      direction: "rtl",
    }}>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .stats-item { border-left: none !important; border-bottom: 1px solid #c8e6c0 !important; padding: 24px 12px !important; }
        }
        @media (max-width: 420px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-value { font-size: 28px !important; }
        }
      `}</style>
      <div className="stats-grid" style={{
        maxWidth: 1100, margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
      }}>
        {stats.map((s, i) => (
          <div className="stats-item" key={i} style={{
            padding: "40px 24px", textAlign: "center",
            borderLeft: i < 3 ? "1px solid #c8e6c0" : "none",
            position: "relative",
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
            <div className="stats-value" style={{ fontSize: 38, fontWeight: 900, color: "#2d6a21", lineHeight: 1, fontFamily: "'Cairo', sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 14, color: "#5a8a50", marginTop: 6, fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}