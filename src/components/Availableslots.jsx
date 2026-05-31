import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { terrains, generateSlots } from "../api/Terrains";

const days = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function todayLabel() {
  const d = new Date();
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

/**
 * AvailableSlots Component - Terrain booking time slots selector
 * 
 * Features:
 * - Tab-based terrain switching
 * - Visual slot grid (available / booked)
 * - Slot selection with confirmation CTA
 * - Fully responsive: PC, Tablet, Mobile
 * 
 * Responsive Breakpoints:
 * - PC (>900px): Full layout, side-by-side elements
 * - Tablet (768px-900px): Stacked header, adjusted spacing
 * - Mobile (≤768px): Compact layout, full-width elements
 * - Small Mobile (≤480px): Minimal padding, smaller fonts
 */

export default function AvailableSlots() {
  const [activeTerrain, setActiveTerrain] = useState(terrains[0].id);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const navigate = useNavigate();

  const terrain = terrains.find((t) => t.id === activeTerrain);
  const slots = generateSlots(activeTerrain);
  const freeCount = slots.filter((s) => s.available).length;

  return (
    <section className="slots-section" style={{
      background: "#f8fbf7",
      padding: "100px 80px",
      direction: "rtl",
      borderTop: "1px solid #c8e6c0",
    }}>
      {/* ═══════════════════════════════════════════════
          RESPONSIVE STYLES - Complete Breakpoints
      ═══════════════════════════════════════════════ */}
      <style>{`
        /* ========== TABLET (max-width: 900px) ========== */
        @media (max-width: 900px) {
          .slots-section { padding: 60px 40px !important; }
          .slots-header { flex-direction: column !important; align-items: flex-start !important; gap: 20px !important; }
          .slots-header h2 { font-size: 34px !important; }
          .terrain-tabs { flex-wrap: wrap !important; }
        }

        /* ========== MOBILE (max-width: 768px) ========== */
        @media (max-width: 768px) {
          .slots-section { padding: 40px 20px !important; }

          /* Header: stacked, centered */
          .slots-header { 
            flex-direction: column !important; 
            align-items: center !important; 
            text-align: center !important;
            gap: 16px !important; 
            margin-bottom: 32px !important;
          }
          .slots-header h2 { font-size: 26px !important; }
          .slots-header p { font-size: 13px !important; }
          .section-badge { margin-bottom: 8px !important; }

          /* Terrain tabs: horizontal scroll */
          .terrain-tabs { 
            flex-wrap: nowrap !important; 
            overflow-x: auto !important;
            width: 100% !important;
            padding-bottom: 8px !important;
            gap: 8px !important;
            justify-content: flex-start !important;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .terrain-tabs::-webkit-scrollbar { display: none; }
          .terrain-tabs button { 
            flex-shrink: 0 !important; 
            padding: 8px 16px !important; 
            font-size: 13px !important;
          }

          /* Terrain info card: stacked layout */
          .terrain-info-row { 
            flex-direction: column !important; 
            align-items: center !important;
            gap: 12px !important; 
            padding: 16px !important;
            text-align: center !important;
          }
          .terrain-info-row img { 
            width: 100% !important; 
            height: 140px !important; 
            border-radius: 12px !important;
          }
          .terrain-info-row .terrain-name { font-size: 18px !important; }
          .terrain-info-row .terrain-meta { font-size: 12px !important; }
          .terrain-info-row .terrain-price { font-size: 22px !important; }

          /* Slots grid: 3-4 columns on mobile */
          .slots-grid { 
            grid-template-columns: repeat(3, 1fr) !important; 
            gap: 8px !important;
            margin-bottom: 24px !important;
          }
          .slots-grid button { 
            padding: 12px 4px !important; 
            font-size: 14px !important;
            border-radius: 8px !important;
          }

          /* CTA bar: stacked, full-width button */
          .slot-cta { 
            flex-direction: column !important; 
            gap: 16px !important; 
            align-items: center !important;
            text-align: center !important;
            padding: 20px 16px !important;
          }
          .slot-cta .cta-text { font-size: 14px !important; }
          .slot-cta .cta-sub { font-size: 12px !important; }
          .slot-cta button { 
            width: 100% !important; 
            padding: 14px 24px !important;
            font-size: 15px !important;
          }
        }

        /* ========== SMALL MOBILE (max-width: 480px) ========== */
        @media (max-width: 480px) {
          .slots-section { padding: 32px 16px !important; }
          .slots-header h2 { font-size: 22px !important; }
          .slots-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; }
          .slots-grid button { padding: 10px 2px !important; font-size: 12px !important; }
          .terrain-info-row img { height: 120px !important; }
        }

        /* ========== VERY SMALL (max-width: 360px) ========== */
        @media (max-width: 360px) {
          .slots-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
          HEADER: Section title + Terrain tabs
          - PC: Side by side
          - Mobile: Stacked, centered
      ═══════════════════════════════════════════════ */}
      <div className="slots-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
        <div style={{ textAlign: "right" }}>
          {/* Section badge */}
          <span className="section-badge" style={{
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

          {/* Main title */}
          <h2 style={{ fontSize: 40, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", margin: 0 }}>
            احجز وقتك اليوم
          </h2>

          {/* Date + available count */}
          <p style={{ color: "#5a8a50", fontSize: 15, marginTop: 8, fontFamily: "'Cairo', sans-serif" }}>
            {todayLabel()} · <span style={{ color: "#2d6a21", fontWeight: 700 }}>{freeCount} وقت متاح</span>
          </p>
        </div>

        {/* Terrain selector tabs - horizontal scroll on mobile */}
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
                whiteSpace: "nowrap",
              }}
            >{t.name}</button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          TERRAIN INFO CARD
          - PC: Horizontal row (img | info | price)
          - Mobile: Stacked, centered
      ═══════════════════════════════════════════════ */}
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
          alt={terrain.name}
          style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <div className="terrain-name" style={{ fontSize: 18, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>
            {terrain.name}
          </div>
          <div className="terrain-meta" style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif" }}>
            {terrain.type} · {terrain.size}
          </div>
        </div>
        <div className="terrain-price" style={{ fontSize: 24, fontWeight: 900, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", whiteSpace: "nowrap" }}>
          {terrain.price} <span style={{ fontSize: 12, color: "#5a8a50", fontWeight: 400 }}>درهم/س</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          SLOTS GRID
          - PC: Auto-fill, min 100px
          - Mobile: 3 columns, smaller padding
      ═══════════════════════════════════════════════ */}
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

              {/* Booked overlay */}
              {!slot.available && (
                <div style={{
                  position: "absolute", inset: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#b0c8aa", fontFamily: "'Cairo', sans-serif",
                  background: "rgba(245,245,245,0.7)",
                }}>محجوز</div>
              )}

              {/* Selected indicator dot */}
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

      {/* ═══════════════════════════════════════════════
          CTA / CONFIRMATION BAR
          - PC: Horizontal (text left, button right)
          - Mobile: Stacked (text top, button bottom full-width)
      ═══════════════════════════════════════════════ */}
      {selectedSlot ? (
        <div className="slot-cta" style={{
          background: "rgba(45,106,33,0.07)",
          border: "1px solid rgba(92,184,68,0.4)",
          borderRadius: 14,
          padding: "20px 28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div className="cta-text" style={{ fontSize: 16, fontWeight: 700, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>
              ✓ اخترت الساعة {slots.find(s => s.id === selectedSlot)?.label} · {terrain.name}
            </div>
            <div className="cta-sub" style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", marginTop: 4 }}>
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
              whiteSpace: "nowrap",
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