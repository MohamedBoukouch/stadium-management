import { useNavigate } from "react-router-dom";

export default function TerrainCard({ terrain }) {
  const navigate = useNavigate();
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #c8e6c0",
      borderRadius: 20,
      overflow: "hidden",
      transition: "transform 0.3s, border-color 0.3s, box-shadow 0.3s",
      cursor: "pointer",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.borderColor = "#5cb844";
        e.currentTarget.style.boxShadow = "0 12px 36px rgba(45,106,33,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.borderColor = "#c8e6c0";
        e.currentTarget.style.boxShadow = "none";
      }}
      onClick={() => navigate("/reservation", { state: { terrainId: terrain.id } })}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={terrain.image}
          alt={terrain.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(240,247,238,0.7) 0%, transparent 60%)",
        }} />
        <div style={{
          position: "absolute", top: 14, right: 14,
          background: "rgba(45,106,33,0.9)", color: "#fff",
          fontSize: 11, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
          padding: "4px 12px", borderRadius: 6,
        }}>{terrain.type}</div>
      </div>

      {/* Info */}
      <div style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 6 }}>
          {terrain.name}
        </div>
        <div style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", marginBottom: 14 }}>
          {terrain.size}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {terrain.features.map((f) => (
            <span key={f} style={{
              background: "rgba(45,106,33,0.08)", border: "1px solid #c8e6c0",
              color: "#2d6a21", fontSize: 11, fontFamily: "'Cairo', sans-serif",
              padding: "3px 10px", borderRadius: 6,
            }}>{f}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>
            {terrain.price} <span style={{ fontSize: 12, color: "#5a8a50", fontWeight: 400 }}>درهم/س</span>
          </span>
          <button style={{
            background: "#2d6a21", color: "#fff", border: "none",
            padding: "10px 20px", borderRadius: 8,
            fontSize: 13, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
            cursor: "pointer", transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#3d8a2e"}
            onMouseLeave={e => e.currentTarget.style.background = "#2d6a21"}
          >احجز ←</button>
        </div>
      </div>
    </div>
  );
}