import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { terrains, generateSlots } from "../api/Terrains";

const days = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function todayLabel() {
  const d = new Date();
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

export default function AvailableSlots() {
  const [activeTerrain, setActiveTerrain] = useState(terrains[0].id);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  const terrain = terrains.find((t) => t.id === activeTerrain);
  const slots = generateSlots(activeTerrain);
  const freeCount = slots.filter((s) => s.available).length;

  return (
    <section style={{
      background: "#f8fbf7",
      padding: "100px 80px",
      direction: "rtl",
      borderTop: "1px solid #c8e6c0",
    }}>
      <style>{`
        @media (max-width: 900px) {
          .slots-header { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .slots-section { padding: 60px 40px !important; }
        }
        @media (max-width: 600px) {
          .slots-section { padding: 48px 20px !important; }
          .slots-header h2 { font-size: 28px !important; }
          .terrain-tabs { flex-wrap: wrap !important; }
          .slots-grid { grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)) !important; }
          .terrain-info-row { flex-direction: column !important; gap: 12px !important; }
          .slot-cta { flex-direction: column !important; gap: 14px !important; align-items: flex-start !important; }
        }
      `}</style>

      {/* Header */}
      <div className="slots-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div>
          <span style={{
            display: "inline-block",
            background: "rgba(45,106,33,0.1)", color: "#2d6a21",
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            padding: "5px 16px", borderRadius: 4,
            border: "1px solid rgba(45,106,33,0.2)",
            fontFamily: "'Cairo', sans-serif",
            marginBottom: 12,
          }}>
            الأوقات المتاحة
          </span>
          <h2 style={{ fontSize: 40, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", margin: 0 }}>
            احجز وقتك اليوم
          </h2>
          <p style={{ color: "#5a8a50", fontSize: 15, marginTop: 8, fontFamily: "'Cairo', sans-serif" }}>
            {todayLabel()} · <span style={{ color: "#2d6a21", fontWeight: 700 }}>{freeCount} وقت متاح</span>
          </p>
        </div>

        {/* Terrain tabs */}
        <div className="terrain-tabs" style={{ display: "flex", gap: 10 }}>
          {terrains.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTerrain(t.id); setSelectedSlot(null); }}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 14, fontWeight: 700,
                padding: "10px 22px", borderRadius: 8, cursor: "pointer",
                border: "1px solid",
                borderColor: activeTerrain === t.id ? "#5cb844" : "#c8e6c0",
                background: activeTerrain === t.id ? "rgba(45,106,33,0.12)" : "#ffffff",
                color: activeTerrain === t.id ? "#2d6a21" : "#5a8a50",
                transition: "all 0.2s",
                boxShadow: activeTerrain === t.id ? "0 2px 10px rgba(45,106,33,0.15)" : "none",
              }}
            >{t.name}</button>
          ))}
        </div>
      </div>

      {/* Terrain mini info */}
      <div className="terrain-info-row" style={{
        background: "#ffffff",
        border: "1px solid #c8e6c0",
        borderRadius: 16,
        padding: "20px 28px",
        marginBottom: 32,
        display: "flex", alignItems: "center", gap: 20,
        boxShadow: "0 2px 12px rgba(45,106,33,0.06)",
      }}>
        <img
          src={terrain.image}
          alt=""
          style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>{terrain.name}</div>
          <div style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif" }}>{terrain.type} · {terrain.size}</div>
        </div>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>
          {terrain.price} <span style={{ fontSize: 12, color: "#5a8a50", fontWeight: 400 }}>درهم/س</span>
        </div>
      </div>

      {/* Slots grid */}
      <div className="slots-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
        gap: 12,
        marginBottom: 40,
      }}>
        {slots.map((slot) => {
          const isSelected = selectedSlot === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => slot.available && setSelectedSlot(isSelected ? null : slot.id)}
              style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 16, fontWeight: 700,
                padding: "16px 8px",
                borderRadius: 10,
                border: "1px solid",
                cursor: slot.available ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                borderColor: isSelected ? "#5cb844"
                  : slot.available ? "#c8e6c0"
                  : "#e8f5e0",
                background: isSelected ? "rgba(45,106,33,0.12)"
                  : slot.available ? "#ffffff"
                  : "#f5f5f5",
                color: isSelected ? "#2d6a21"
                  : slot.available ? "#1a3d14"
                  : "#b0c8aa",
                boxShadow: isSelected ? "0 2px 10px rgba(45,106,33,0.15)" : "none",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {slot.label}
              {!slot.available && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#b0c8aa", fontFamily: "'Cairo', sans-serif",
                  background: "rgba(245,245,245,0.7)",
                }}>محجوز</div>
              )}
              {isSelected && (
                <div style={{
                  position: "absolute", top: 4, left: 4,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#5cb844",
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* CTA */}
      {selectedSlot ? (
        <div className="slot-cta" style={{
          background: "rgba(45,106,33,0.07)",
          border: "1px solid rgba(92,184,68,0.4)",
          borderRadius: 14,
          padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>
              ✓ اخترت الساعة {slots.find(s => s.id === selectedSlot)?.label} · {terrain.name}
            </div>
            <div style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", marginTop: 4 }}>
              السعر: {terrain.price} درهم لمدة ساعة واحدة
            </div>
          </div>
          <button
            onClick={() => navigate("/reservation", { state: { terrainId: activeTerrain, slotId: selectedSlot } })}
            style={{
              background: "linear-gradient(135deg, #2d6a21, #5cb844)",
              color: "#fff", border: "none",
              padding: "14px 36px", borderRadius: 50,
              fontSize: 16, fontWeight: 800,
              fontFamily: "'Cairo', sans-serif",
              cursor: "pointer",
              boxShadow: "0 6px 24px rgba(45,106,33,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            تأكيد الحجز ←
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", color: "#a0c090", fontSize: 14, fontFamily: "'Cairo', sans-serif" }}>
          انقر على وقت متاح لاختياره
        </div>
      )}
    </section>
  );
}