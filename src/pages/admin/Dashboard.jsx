import { useState } from "react";
import {
  IconCalendarStats,
  IconReportMoney,
  IconCalendarEvent,
  IconCash,
} from "@tabler/icons-react";

const stats = [
  {
    label: "إجمالي الحجوزات", value: "1,284", trend: "▲ +12% هذا الشهر",
    icon: <IconCalendarStats size={24} />,
    icoBg: "#edf7ea", icoColor: "#2d6a21",
    trendBg: "#edf7ea", trendColor: "#2d6a21",
  },
  {
    label: "الإيرادات (درهم)", value: "48,750", trend: "▲ +8% هذا الشهر",
    icon: <IconReportMoney size={24} />,
    icoBg: "#e6f0fc", icoColor: "#1565c0",
    trendBg: "#e6f0fc", trendColor: "#1565c0",
  },
  {
    label: "حجوزات اليوم", value: "31", trend: "▲ +5 من أمس",
    icon: <IconCalendarEvent size={24} />,
    icoBg: "#f0e8fc", icoColor: "#6a1b9a",
    trendBg: "#f0e8fc", trendColor: "#6a1b9a",
  },
  {
    label: "إيرادات اليوم (درهم)", value: "6,200", trend: "▲ +8% من أمس",
    icon: <IconCash size={24} />,
    icoBg: "#fef0e6", icoColor: "#e65100",
    trendBg: "#fef0e6", trendColor: "#e65100",
  },
];

const terrains = [
  { name: "ملعب A — 5×5", bookings: 14, next: "19:00", status: "متاح", dot: "#5cb844", pillBg: "#edf7ea", pillColor: "#2d6a21" },
  { name: "ملعب B — 7×7", bookings: 11, next: "21:00", status: "محجوز", dot: "#ff7043", pillBg: "rgba(230,81,0,0.1)", pillColor: "#e65100" },
  { name: "ملعب C — 11×11", bookings: 6, next: "غداً", status: "صيانة", dot: "#ef5350", pillBg: "rgba(183,28,28,0.1)", pillColor: "#b71c1c" },
];

const dailySummary = [
  { label: "حجوزات اليوم", value: "31", bg: "#f8fbf7", border: "#e8f0e8", color: "#1a3d14", labelColor: "#5a6a50" },
  { label: "إيرادات اليوم", value: "6,200 د", bg: "#f8fbf7", border: "#e8f0e8", color: "#2d6a21", labelColor: "#5a6a50" },
  { label: "في الانتظار", value: "8 حجوزات", bg: "#fff8e1", border: "#ffe082", color: "#b8860b", labelColor: "#b8860b" },
  { label: "ملغاة اليوم", value: "2 حجوزات", bg: "#fce8e8", border: "#ffcdd2", color: "#b71c1c", labelColor: "#b71c1c" },
];

const recentReservations = [
  { user: "أحمد البكري", when: "اليوم", terrain: "ملعب A", time: "18:00-19:00", status: "مؤكد", sColor: "#2d6a21", sBg: "rgba(45,106,33,0.1)" },
  { user: "يوسف المنصوري", when: "اليوم", terrain: "ملعب B", time: "17:00-18:00", status: "انتظار", sColor: "#e65100", sBg: "rgba(230,81,0,0.1)" },
  { user: "كريم الزياني", when: "أمس", terrain: "ملعب A", time: "20:00-21:00", status: "مكتمل", sColor: "#1565c0", sBg: "rgba(21,101,192,0.1)" },
  { user: "سارة الحسني", when: "أمس", terrain: "ملعب C", time: "16:00-17:00", status: "ملغى", sColor: "#b71c1c", sBg: "rgba(183,28,28,0.1)" },
  { user: "إلياس بوعزة", when: "21/06", terrain: "ملعب B", time: "19:00-20:00", status: "مؤكد", sColor: "#2d6a21", sBg: "rgba(45,106,33,0.1)" },
];

const Dashboard = () => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const font = "'Cairo', sans-serif";
  const cardBg = "#ffffff";
  const border = "#e8f0e8";
  const bg = "#f4f8f3";
  const green = "#2d6a21";

  return (
    <div style={{ padding: 24, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .sc-dash { transition: transform .2s, box-shadow .2s; }
        .sc-dash:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.08) !important; }
        .res-row-d { transition: background .15s; }
        .res-row-d:hover { background: #f8fcf6 !important; }
        @media (max-width: 900px) {
          .stats-dash { grid-template-columns: repeat(2,1fr) !important; }
          .mid-dash { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Page Title ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a3d14" }}>لوحة التحكم</h1>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7ab870" }}>هذا ملخص نشاط اليوم</p>
      </div>

      {/* ── Stats Cards ── */}
      <div className="stats-dash" style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 14, marginBottom: 24,
      }}>
        {stats.map((s, i) => (
          <div key={i} className="sc-dash" style={{
            background: cardBg, borderRadius: 14,
            border: `1px solid ${border}`,
            padding: "22px 20px",
            display: "flex", alignItems: "center", gap: 16,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: s.icoBg, color: s.icoColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: "#1a3d14", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#8aaa80", fontWeight: 600, marginTop: 4 }}>
                {s.label}
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, marginTop: 6,
                display: "inline-block", padding: "2px 8px", borderRadius: 6,
                background: s.trendBg, color: s.trendColor,
              }}>
                {s.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mid Row ── */}
      <div className="mid-dash" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: 14, marginBottom: 24,
      }}>

        {/* Terrain Status */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1a3d14", marginBottom: 16 }}>
            ⚽ حالة الملاعب الآن
          </div>
          {terrains.map((t, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 14px", background: bg,
              borderRadius: 10, border: `1px solid ${border}`,
              marginBottom: i < terrains.length - 1 ? 8 : 0,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: "50%",
                  background: t.dot, display: "block",
                  boxShadow: `0 0 6px ${t.dot}`,
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a3d14" }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2 }}>
                    {t.bookings} حجز اليوم · التالي {t.next}
                  </div>
                </div>
              </div>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
                background: t.pillBg, color: t.pillColor,
              }}>{t.status}</span>
            </div>
          ))}
        </div>

        {/* Daily Summary */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1a3d14", marginBottom: 16 }}>
            📊 ملخص اليوم
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dailySummary.map((d, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 14px", background: d.bg,
                borderRadius: 10, border: `1px solid ${d.border}`,
              }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: d.labelColor }}>{d.label}</span>
                <span style={{ fontSize: 18, fontWeight: 900, color: d.color }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Reservations ── */}
      <div style={{
        background: cardBg, borderRadius: 14,
        border: `1px solid ${border}`, overflow: "hidden",
      }}>
        <div style={{
          padding: "16px 20px", borderBottom: `1px solid ${border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1a3d14" }}>
            📋 آخر الحجوزات
          </div>
          <button style={{
            padding: "6px 16px", borderRadius: 8,
            border: `1px solid ${border}`, background: bg,
            fontSize: 11, fontWeight: 700, color: green,
            fontFamily: font, cursor: "pointer",
          }}>عرض الكل ←</button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 90px 110px 80px",
          padding: "9px 20px", background: bg,
          borderBottom: `1px solid ${border}`,
          fontSize: 11, fontWeight: 700, color: "#8aaa80",
        }}>
          <span>العميل</span>
          <span>الملعب</span>
          <span>الوقت</span>
          <span>الحالة</span>
        </div>

        {recentReservations.map((r, i) => (
          <div
            key={i}
            className="res-row-d"
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              display: "grid", gridTemplateColumns: "1fr 90px 110px 80px",
              padding: "13px 20px", alignItems: "center",
              borderBottom: i < recentReservations.length - 1 ? `1px solid #f4f8f3` : "none",
              background: hoveredRow === i ? "#f8fcf6" : "transparent",
              cursor: "default",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg,#2d6a21,#5cb844)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0,
              }}>{r.user.charAt(0)}</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>{r.user}</div>
                <div style={{ fontSize: 10, color: "#8aaa80" }}>{r.when}</div>
              </div>
            </div>
            <span style={{ fontSize: 12, color: "#5a8a50", fontWeight: 600 }}>{r.terrain}</span>
            <span style={{ fontSize: 12, color: "#5a8a50" }}>{r.time}</span>
            <span style={{
              fontSize: 11, fontWeight: 700,
              color: r.sColor, background: r.sBg,
              padding: "3px 10px", borderRadius: 6,
              borderRight: `3px solid ${r.sColor}`,
              display: "inline-block",
            }}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
