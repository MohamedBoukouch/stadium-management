import { useState} from "react";
import { useNavigate } from "react-router-dom";
import {
  IconCalendarStats,
  IconWallet,
  IconCalendarEvent,
  IconCash,
  IconTrendingUp,
  IconBuildingStadium,
  IconUsers,
  IconClock,
  IconChevronLeft,
} from "@tabler/icons-react";

const recentReservations = [
  { user: "أحمد العلوي", terrain: "ملعب النهضة", date: "2 يونيو 2026", time: "19:00 - 20:00", status: "مؤكد", sColor: "#16a34a", sBg: "#dcfce7" },
  { user: "يوسف البحري", terrain: "ملعب السلام", date: "2 يونيو 2026", time: "21:00 - 22:00", status: "مؤكد", sColor: "#16a34a", sBg: "#dcfce7" },
  { user: "سعيد الزهراني", terrain: "ملعب الأمل", date: "3 يونيو 2026", time: "18:00 - 19:00", status: "قيد الانتظار", sColor: "#d97706", sBg: "#fef3c7" },
  { user: "فاطمة المنصوري", terrain: "ملعب النهضة", date: "3 يونيو 2026", time: "20:00 - 21:00", status: "مؤكد", sColor: "#16a34a", sBg: "#dcfce7" },
];

const chartData = [
  { day: "27 مايو", val: 2800 },
  { day: "28 مايو", val: 4200 },
  { day: "29 مايو", val: 5800 },
  { day: "30 مايو", val: 6500 },
  { day: "31 مايو", val: 5200 },
  { day: "1 يونيو", val: 7100 },
  { day: "2 يونيو", val: 8400 },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const font = "'Cairo', sans-serif";
  const maxVal = Math.max(...chartData.map(d => d.val));

 

  // Chart dimensions
  const cW = 420, cH = 140, padL = 36, padB = 24, padT = 10, padR = 10;
  const pts = chartData.map((d, i) => ({
    x: padL + (i / (chartData.length - 1)) * (cW - padL - padR),
    y: padT + (1 - d.val / maxVal) * (cH - padB - padT),
    ...d,
  }));
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `${pts[0].x},${cH - padB} ${polyline} ${pts[pts.length - 1].x},${cH - padB}`;

  return (
    <div style={{ padding: "20px 24px", fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; }
        .kpi-card { transition: transform .2s, box-shadow .2s; }
        .kpi-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
        .res-row { transition: background .15s; cursor: pointer; }
        .res-row:hover { background: #f0fdf4 !important; }
        .terrain-card { transition: transform .2s; }
        .terrain-card:hover { transform: translateY(-2px); }
        .nav-link { transition: background .15s; cursor: pointer; }
        .nav-link:hover { background: rgba(255,255,255,0.1) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

      {/* ── Page Title ── */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ fontSize: 28, fontWeight: 900, color: "#14532d", lineHeight: 1 }}>
          لوحة التحكم
        </div>
        <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
             مرحباً بك في لوحة تحكم نظام حجز الملاعب
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, margin: "16px 0" }}>
        {[
          { label: "إجمالي الحجوزات", value: "1,284", unit: "حجز", trend: "+15% هذا الشهر", icon: <IconCalendarStats size={22} />, icoBg: "#f0fdf4", icoColor: "#16a34a" },
          { label: "إجمالي الإيرادات", value: "48,750", unit: "درهم", trend: "+9% هذا الشهر", icon: <IconWallet size={22} />, icoBg: "#eff6ff", icoColor: "#2563eb" },
          { label: "حجوزات اليوم", value: "31", unit: "حجز", trend: "+7% مقارنة بالأمس", icon: <IconCalendarEvent size={22} />, icoBg: "#faf5ff", icoColor: "#7c3aed" },
          { label: "إيرادات اليوم", value: "6,200", unit: "درهم", trend: "+12% مقارنة بالأمس", icon: <IconCash size={22} />, icoBg: "#f0fdf4", icoColor: "#16a34a" },
        ].map((s, i) => (
          <div key={i} className="kpi-card" style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb", padding: "10px 10px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#6b7280" }}>{s.label}</div>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: s.icoBg, color: s.icoColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#111827", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{s.unit}</div>
            <div style={{ fontSize: 10, color: "#16a34a", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
              <IconTrendingUp size={13} />
              {s.trend}
            </div>
          </div>
        ))}
      </div>

      {/* ── Mid Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>

        {/* حالة الملاعب الآن */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <IconBuildingStadium size={17} color="#6b7280" />
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>حالة الملاعب الآن</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {[
              { label: "متاحة", count: 2, unit: "ملاعب", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", fieldBg: "#dcfce7" },
              { label: "محجوزة", count: 5, unit: "ملاعب", color: "#d97706", bg: "#fffbeb", border: "#fde68a", fieldBg: "#fef3c7" },
              { label: "تحت الصيانة", count: 1, unit: "ملعب", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", fieldBg: "#fee2e2" },
            ].map((t, i) => (
              <div key={i} className="terrain-card" style={{
                background: t.bg, borderRadius: 12,
                border: `1px solid ${t.border}`, padding: "14px 12px",
                textAlign: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginBottom: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.color, display: "block" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.label}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: t.color, lineHeight: 1 }}>{t.count}</div>
                <div style={{ fontSize: 11, color: t.color, opacity: 0.8, marginBottom: 10 }}>{t.unit}</div>
                {/* Field illustration */}
                <div style={{ background: t.fieldBg, borderRadius: 8, padding: "8px 4px", border: `1px solid ${t.border}` }}>
                  <svg viewBox="0 0 80 50" width="100%" height="40">
                    <rect x="4" y="4" width="72" height="42" rx="4" fill="none" stroke={t.color} strokeWidth="1.5" opacity="0.5" />
                    <circle cx="40" cy="25" r="10" fill="none" stroke={t.color} strokeWidth="1.5" opacity="0.4" />
                    <line x1="40" y1="4" x2="40" y2="46" stroke={t.color} strokeWidth="1" opacity="0.3" />
                    <rect x="4" y="15" width="10" height="20" rx="2" fill="none" stroke={t.color} strokeWidth="1.5" opacity="0.5" />
                    <rect x="66" y="15" width="10" height="20" rx="2" fill="none" stroke={t.color} strokeWidth="1.5" opacity="0.5" />
                  </svg>
                </div>
                <div style={{ fontSize: 11, color: t.color, marginTop: 8, cursor: "pointer", fontWeight: 700 }}
                  onClick={() => navigate("/admin/terrains")}>
                  عرض الملاعب ←
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ملخص اليوم */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <IconTrendingUp size={17} color="#6b7280" />
            <div style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>ملخص اليوم</div>
          </div>
          {[
            { label: "حجوزات اليوم", value: "31", icon: <IconCalendarStats size={16} />, bg: "#f0fdf4", color: "#16a34a" },
            { label: "إيرادات اليوم", value: "6,200 درهم", icon: <IconCash size={16} />, bg: "#eff6ff", color: "#2563eb" },
            { label: "عملاء جدد", value: "12", icon: <IconUsers size={16} />, bg: "#faf5ff", color: "#7c3aed" },
            { label: "متوسط مدة الحجز", value: "1.8 ساعة", icon: <IconClock size={16} />, bg: "#fff7ed", color: "#ea580c" },
          ].map((d, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "10px 12px", borderRadius: 10,
              border: "1px solid #f3f4f6",
              marginBottom: i < 3 ? 8 : 0,
              background: "#fafafa",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: d.bg, color: d.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {d.icon}
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{d.label}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 900, color: "#111827" }}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

        {/* Recent Reservations */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid #f3f4f6",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <IconCalendarStats size={16} color="#6b7280" />
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111827" }}>أحدث الحجوزات</div>
            </div>
            <button
              onClick={() => navigate("/admin/reservations")}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "5px 12px", borderRadius: 8, cursor: "pointer",
                border: "1px solid #e5e7eb", background: "#f9fafb",
                fontSize: 11, fontWeight: 700, color: "#16a34a", fontFamily: font,
              }}
            >
              <IconChevronLeft size={13} />
              عرض الكل
            </button>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 90px 90px 70px",
            padding: "8px 18px", background: "#f9fafb",
            borderBottom: "1px solid #f3f4f6",
            fontSize: 10, fontWeight: 700, color: "#9ca3af",
          }}>
            <span>العميل</span><span>الملعب</span><span>الوقت</span><span>الحالة</span>
          </div>
          {recentReservations.map((r, i) => (
            <div
              key={i}
              className="res-row"
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: "grid", gridTemplateColumns: "1fr 90px 90px 70px",
                padding: "11px 18px", alignItems: "center",
                borderBottom: i < recentReservations.length - 1 ? "1px solid #f9fafb" : "none",
                background: hoveredRow === i ? "#f0fdf4" : "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "#dcfce7", color: "#16a34a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 900, flexShrink: 0,
                }}>{r.user.charAt(0)}</div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>{r.user}</span>
              </div>
              <span style={{ fontSize: 11, color: "#6b7280" }}>{r.terrain}</span>
              <span style={{ fontSize: 11, color: "#6b7280" }}>{r.time}</span>
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: r.sColor, background: r.sBg,
                padding: "3px 8px", borderRadius: 20,
                display: "inline-block", whiteSpace: "nowrap",
              }}>{r.status}</span>
            </div>
          ))}
        </div>

        {/* Line Chart */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 4 }}>الإيرادات خلال آخر 7 أيام (درهم)</div>
          <div style={{ position: "relative" }}>
            <svg viewBox={`0 0 ${cW} ${cH}`} width="100%" height={cH} style={{ overflow: "visible" }}>
              {/* Grid lines */}
              {[0, 0.33, 0.66, 1].map((v, i) => {
                const y = padT + (1 - v) * (cH - padB - padT);
                const label = Math.round(v * maxVal / 1000) + "K";
                return (
                  <g key={i}>
                    <line x1={padL} y1={y} x2={cW - padR} y2={y} stroke="#f3f4f6" strokeWidth="1" />
                    <text x={padL - 4} y={y + 4} fontSize="9" fill="#9ca3af" textAnchor="end">{label}</text>
                  </g>
                );
              })}
              {/* Area */}
              <polygon points={area} fill="#dcfce7" opacity="0.6" />
              {/* Line */}
              <polyline points={polyline} fill="none" stroke="#16a34a" strokeWidth="2" strokeLinejoin="round" />
              {/* Points */}
              {pts.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r={hoveredPoint === i ? 6 : 4} fill="#fff" stroke="#16a34a" strokeWidth="2"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                  {hoveredPoint === i && (
                    <g>
                      <rect x={p.x - 28} y={p.y - 26} width={56} height={18} rx="4" fill="#14532d" />
                      <text x={p.x} y={p.y - 13} fontSize="9" fill="white" textAnchor="middle">
                        {p.val.toLocaleString()} د
                      </text>
                    </g>
                  )}
                  {/* Day label */}
                  <text x={p.x} y={cH - 6} fontSize="8" fill="#9ca3af" textAnchor="middle">
                    {p.day.replace(" مايو", "").replace(" يونيو", "")}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
