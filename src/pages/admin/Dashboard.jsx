import { useState } from "react";
import {
  IconCalendarStats,
  IconReportMoney,
  IconUsers,
  IconChartPie,
  IconTrophy,
  IconCash,
  IconDownload,
} from "@tabler/icons-react";

const stats = [
  {
    label: "إجمالي الحجوزات", value: "1,284", pct: "▲ +12%",
    icon: <IconCalendarStats size={18} />,
    borderColor: "#2d6a21", icoBg: "#edf7ea", icoColor: "#2d6a21",
    pctBg: "#edf7ea", pctColor: "#2d6a21",
    sparkColor: "#c8e6c0", sparkActive: "#2d6a21",
    sparks: [40, 55, 38, 70, 62, 85, 100],
  },
  {
    label: "الإيرادات (درهم)", value: "48,750", pct: "▲ +8%",
    icon: <IconReportMoney size={18} />,
    borderColor: "#1565c0", icoBg: "#e6f0fc", icoColor: "#1565c0",
    pctBg: "#e6f0fc", pctColor: "#1565c0",
    sparkColor: "#bbdefb", sparkActive: "#1565c0",
    sparks: [30, 50, 45, 65, 75, 80, 100],
  },
  {
    label: "المستخدمون النشطون", value: "326", pct: "▲ +24",
    icon: <IconUsers size={18} />,
    borderColor: "#6a1b9a", icoBg: "#f0e8fc", icoColor: "#6a1b9a",
    pctBg: "#f0e8fc", pctColor: "#6a1b9a",
    sparkColor: "#e1bee7", sparkActive: "#6a1b9a",
    sparks: [50, 60, 55, 70, 80, 90, 100],
  },
  {
    label: "معدل الإشغال", value: "73%", pct: "73%",
    icon: <IconChartPie size={18} />,
    borderColor: "#e65100", icoBg: "#fef0e6", icoColor: "#e65100",
    pctBg: "#fef0e6", pctColor: "#e65100",
    sparkColor: "#ffe0b2", sparkActive: "#e65100",
    sparks: [60, 65, 70, 68, 72, 75, 73],
  },
];

const weeklyData = [
  { day: "الإثنين", h: 52, weekend: false },
  { day: "الثلاثاء", h: 63, weekend: false },
  { day: "الأربعاء", h: 42, weekend: false },
  { day: "الخميس", h: 78, weekend: false },
  { day: "الجمعة", h: 95, weekend: true },
  { day: "السبت", h: 110, weekend: true },
  { day: "الأحد", h: 100, weekend: true },
];

const terrainStatus = [
  { name: "ملعب A - 5×5", status: "متاح", today: 14, next: "19:00", dot: "#5cb844", color: "#2d6a21", bg: "rgba(45,106,33,0.1)" },
  { name: "ملعب B - 7×7", status: "محجوز", today: 11, next: "21:00", dot: "#ff7043", color: "#e65100", bg: "rgba(230,81,0,0.1)" },
  { name: "ملعب C - 11×11", status: "صيانة", today: 6, next: "غداً", dot: "#ef5350", color: "#b71c1c", bg: "rgba(183,28,28,0.1)" },
];

const recentReservations = [
  { id: "#1042", user: "أحمد البكري", terrain: "ملعب A", date: "اليوم", time: "18:00-19:00", amount: "200 د", status: "مؤكد", sColor: "#2d6a21", sBg: "rgba(45,106,33,0.1)" },
  { id: "#1041", user: "يوسف المنصوري", terrain: "ملعب B", date: "اليوم", time: "17:00-18:00", amount: "250 د", status: "انتظار", sColor: "#e65100", sBg: "rgba(230,81,0,0.1)" },
  { id: "#1040", user: "كريم الزياني", terrain: "ملعب A", date: "أمس", time: "20:00-21:00", amount: "200 د", status: "مكتمل", sColor: "#1565c0", sBg: "rgba(21,101,192,0.1)" },
  { id: "#1039", user: "سارة الحسني", terrain: "ملعب C", date: "أمس", time: "16:00-17:00", amount: "300 د", status: "ملغى", sColor: "#b71c1c", sBg: "rgba(183,28,28,0.1)" },
  { id: "#1038", user: "إلياس بوعزة", terrain: "ملعب B", date: "21/06", time: "19:00-20:00", amount: "250 د", status: "مؤكد", sColor: "#2d6a21", sBg: "rgba(45,106,33,0.1)" },
];

const topUsers = [
  { name: "أحمد البكري", count: 24, amount: "4,800 د", rank: 1 },
  { name: "يوسف المنصوري", count: 19, amount: "3,800 د", rank: 2 },
  { name: "كريم الزياني", count: 16, amount: "3,200 د", rank: 3 },
  { name: "إلياس بوعزة", count: 12, amount: "2,400 د", rank: 4 },
];

const revenues = [
  { name: "ملعب A - 5×5", pct: 45, amount: "21,937 د", color: "#2d6a21", gradFrom: "#6aaa60" },
  { name: "ملعب B - 7×7", pct: 35, amount: "17,062 د", color: "#1565c0", gradFrom: "#64b5f6" },
  { name: "ملعب C - 11×11", pct: 20, amount: "9,750 د", color: "#6a1b9a", gradFrom: "#ce93d8" },
];

const Dashboard = () => {
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredBar, setHoveredBar] = useState(null);

  const font = "'Cairo', sans-serif";
  const cardBg = "#ffffff";
  const border = "#e8f0e8";
  const bg = "#f4f8f3";
  const green = "#2d6a21";

  return (
    <div style={{ padding: 24, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .sc-card { transition: transform .2s, box-shadow .2s; }
        .sc-card:hover { transform: translateY(-3px); box-shadow: 0 8px 28px rgba(0,0,0,0.08) !important; }
        .res-row { transition: background .15s; }
        .res-row:hover { background: #f8fcf6 !important; }
        .act-btn { transition: all .2s; cursor: pointer; }
        .act-btn:hover { opacity: .8; }
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .mid-grid { grid-template-columns: 1fr !important; }
          .bot-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Page Title ── */}
      <div style={{ marginBottom: 22, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a3d14" }}>لوحة التحكم</h1>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7ab870" }}>مرحباً، هذا ملخص نشاط اليوم</p>
        </div>
        <button className="act-btn" style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 18px", borderRadius: 10,
          border: `1.5px solid ${border}`, background: cardBg,
          fontSize: 12, fontWeight: 700, color: green, fontFamily: font,
        }}>
          <IconDownload size={13} />
          تصدير التقرير
        </button>
      </div>

      {/* ── Stats Cards V1 ── */}
      <div className="stats-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20,
      }}>
        {stats.map((s, i) => (
          <div key={i} className="sc-card" style={{
            background: cardBg, borderRadius: 12,
            border: `1px solid ${border}`,
            borderRight: `4px solid ${s.borderColor}`,
            padding: "18px 16px 14px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 9,
                background: s.icoBg, color: s.icoColor,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {s.icon}
              </div>
              <span style={{
                fontSize: 10, fontWeight: 800, padding: "2px 7px", borderRadius: 10,
                background: s.pctBg, color: s.pctColor,
              }}>{s.pct}</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#1a3d14", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#8aaa80", fontWeight: 600, marginTop: 3 }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 24, marginTop: 10 }}>
              {s.sparks.map((h, j) => (
                <div key={j} style={{
                  flex: 1, height: `${h}%`, borderRadius: "3px 3px 2px 2px",
                  background: j >= 5 ? s.sparkActive : s.sparkColor,
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + Terrain Status ── */}
      <div className="mid-grid" style={{
        display: "grid", gridTemplateColumns: "1fr 290px", gap: 14, marginBottom: 20,
      }}>
        {/* Bar Chart */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>الحجوزات الأسبوعية</div>
          <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2, marginBottom: 14 }}>هذا الأسبوع · 208 حجز إجمالاً</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 110 }}>
            {weeklyData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                {hoveredBar === i && (
                  <div style={{
                    background: "#1a3d14", color: "#fff", fontSize: 9, fontWeight: 700,
                    padding: "2px 6px", borderRadius: 5, whiteSpace: "nowrap",
                  }}>{d.h} حجز</div>
                )}
                <div
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                  style={{
                    width: "100%", height: d.h,
                    background: d.weekend
                      ? "linear-gradient(180deg,#5cb844,#2d6a21)"
                      : "#c8e6c0",
                    borderRadius: "5px 5px 3px 3px",
                    cursor: "pointer", transition: "opacity .2s",
                  }}
                />
                <div style={{ fontSize: 9, color: "#aaa", fontWeight: 600 }}>{d.day.slice(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Terrain Status */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>حالة الملاعب</div>
          <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2, marginBottom: 14 }}>الوضع الحالي</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {terrainStatus.map((t, i) => (
              <div key={i} style={{
                background: bg, borderRadius: 10, padding: "11px 13px",
                border: `1px solid ${border}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: "50%",
                      background: t.dot, boxShadow: `0 0 5px ${t.dot}`, display: "block",
                    }} />
                    {t.name}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, color: t.color,
                    background: t.bg, padding: "2px 8px", borderRadius: 6,
                  }}>{t.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#8aaa80" }}>
                  <span>اليوم: <strong style={{ color: "#1a3d14" }}>{t.today}</strong></span>
                  <span>التالي: <strong style={{ color: "#1a3d14" }}>{t.next}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Reservations Table ── */}
      <div style={{
        background: cardBg, borderRadius: 14, border: `1px solid ${border}`,
        overflow: "hidden", marginBottom: 20,
      }}>
        <div style={{
          padding: "14px 18px", borderBottom: `1px solid ${border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>آخر الحجوزات</div>
            <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2 }}>آخر 5 حجوزات مسجلة</div>
          </div>
          <button className="act-btn" style={{
            padding: "6px 14px", borderRadius: 8,
            border: `1px solid ${border}`, background: bg,
            fontSize: 11, fontWeight: 700, color: green, fontFamily: font,
          }}>عرض الكل ←</button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "60px 1fr 85px 80px 90px 70px 72px",
          padding: "8px 18px", background: bg,
          borderBottom: `1px solid ${border}`,
          fontSize: 10, fontWeight: 700, color: "#8aaa80",
        }}>
          <span>الرقم</span><span>المستخدم</span><span>الملعب</span>
          <span>التاريخ</span><span>الوقت</span><span>المبلغ</span><span>الحالة</span>
        </div>

        {recentReservations.map((r, i) => (
          <div
            key={i}
            className="res-row"
            onMouseEnter={() => setHoveredRow(i)}
            onMouseLeave={() => setHoveredRow(null)}
            style={{
              display: "grid", gridTemplateColumns: "60px 1fr 85px 80px 90px 70px 72px",
              padding: "12px 18px", alignItems: "center",
              borderBottom: i < recentReservations.length - 1 ? `1px solid #f8fbf7` : "none",
              background: hoveredRow === i ? "#f8fcf6" : "transparent",
              cursor: "pointer",
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: "#8aaa80" }}>{r.id}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "linear-gradient(135deg,#2d6a21,#5cb844)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 900, color: "#fff", flexShrink: 0,
              }}>{r.user.charAt(0)}</div>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>{r.user}</span>
            </div>
            <span style={{ fontSize: 11, color: "#5a8a50", fontWeight: 600 }}>{r.terrain}</span>
            <span style={{ fontSize: 11, color: "#8aaa80" }}>{r.date}</span>
            <span style={{ fontSize: 11, color: "#5a8a50" }}>{r.time}</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#1a3d14" }}>{r.amount}</span>
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: r.sColor, background: r.sBg,
              padding: "3px 8px", borderRadius: 6,
              borderRight: `3px solid ${r.sColor}`,
              display: "inline-block",
            }}>{r.status}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom Cards ── */}
      <div className="bot-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* Top Users */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 18 }}>
          <div style={{
            fontSize: 13, fontWeight: 800, color: "#1a3d14", marginBottom: 12,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <IconTrophy size={14} style={{ color: "#f9a825" }} />
            أكثر المستخدمين حجزاً
          </div>
          {topUsers.map((u, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 0",
              borderBottom: i < topUsers.length - 1 ? `1px solid #f0f5f0` : "none",
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                background: i === 0 ? "linear-gradient(135deg,#f9a825,#ffd54f)" : bg,
                border: `1px solid ${i === 0 ? "#ffd54f" : border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 900,
                color: i === 0 ? "#e65100" : "#8aaa80",
              }}>{u.rank}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>{u.name}</div>
                <div style={{ fontSize: 10, color: "#8aaa80" }}>{u.count} حجز</div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: green }}>{u.amount}</div>
            </div>
          ))}
        </div>

        {/* Revenue by Terrain */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 18 }}>
          <div style={{
            fontSize: 13, fontWeight: 800, color: "#1a3d14", marginBottom: 14,
            display: "flex", alignItems: "center", gap: 6,
          }}>
            <IconCash size={14} style={{ color: "#2d6a21" }} />
            الإيرادات حسب الملعب
          </div>
          {revenues.map((r, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: "#1a3d14", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: r.color, display: "inline-block" }} />
                  {r.name}
                </span>
                <span style={{ fontWeight: 800, color: r.color }}>{r.amount}</span>
              </div>
              <div style={{ height: 6, background: "#f0f5f0", borderRadius: 8, overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${r.pct}%`, borderRadius: 8,
                  background: `linear-gradient(90deg,${r.gradFrom},${r.color})`,
                }} />
              </div>
              <div style={{ fontSize: 9, color: "#aaa", marginTop: 2, textAlign: "left" }}>{r.pct}%</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;