import { useState, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  IconReportMoney,
  IconCalendarStats,
  IconTrendingUp,
  IconUsers,
  IconFileTypePdf,
  IconFileTypeXls,
} from "@tabler/icons-react";

// ─── Mock Data (indexed by period) ────────────────────────────
const dataByPeriod = {
  "يوم": {
    revenue: "1,650", reservations: 42, occupancy: 68, clients: 38,
    caChart: [
      { day: "08:00", value: 200, h: 20 }, { day: "10:00", value: 300, h: 30 },
      { day: "12:00", value: 250, h: 25 }, { day: "14:00", value: 400, h: 40 },
      { day: "16:00", value: 600, h: 60 }, { day: "18:00", value: 900, h: 90 },
      { day: "20:00", value: 1100, h: 110 },
    ],
    terrains: [
      { name: "ملعب A - 5×5", reservations: 18, revenue: 3600, avgDay: 3600, occupancy: 80, perf: "ممتاز", perfColor: "#2d6a21", perfBg: "rgba(45,106,33,0.1)", dot: "#5cb844", barColor: "linear-gradient(90deg,#6aaa60,#2d6a21)", barW: 80 },
      { name: "ملعب B - 7×7", reservations: 14, revenue: 2800, avgDay: 2800, occupancy: 65, perf: "جيد", perfColor: "#1565c0", perfBg: "rgba(21,101,192,0.1)", dot: "#1565c0", barColor: "linear-gradient(90deg,#64b5f6,#1565c0)", barW: 65 },
      { name: "ملعب C - 11×11", reservations: 10, revenue: 3000, avgDay: 3000, occupancy: 45, perf: "متوسط", perfColor: "#e65100", perfBg: "rgba(230,81,0,0.1)", dot: "#ef5350", barColor: "linear-gradient(90deg,#ce93d8,#6a1b9a)", barW: 45 },
    ],
    status: [
      { label: "مؤكد", count: 28, pct: 67, color: "#2d6a21", gradFrom: "#6aaa60" },
      { label: "في الانتظار", count: 8, pct: 19, color: "#e65100", gradFrom: "#ffb74d" },
      { label: "مكتمل", count: 4, pct: 10, color: "#1565c0", gradFrom: "#64b5f6" },
      { label: "ملغى", count: 2, pct: 4, color: "#b71c1c", gradFrom: "#ef9a9a" },
    ],
    topDays: [
      { day: "20:00-21:00", value: 1100 },
      { day: "18:00-19:00", value: 900 },
      { day: "16:00-17:00", value: 600 },
    ],
    peakHours: [
      { hour: "20:00-21:00", pct: 95 }, { hour: "19:00-20:00", pct: 88 },
      { hour: "18:00-19:00", pct: 80 }, { hour: "21:00-22:00", pct: 70 },
      { hour: "17:00-18:00", pct: 62 },
    ],
  },
  "أسبوع": {
    revenue: "48,750", reservations: 1284, occupancy: 73, clients: 326,
    caChart: [
      { day: "الإثنين", value: 3600, h: 52 }, { day: "الثلاثاء", value: 4400, h: 68 },
      { day: "الأربعاء", value: 3000, h: 44 }, { day: "الخميس", value: 5800, h: 82 },
      { day: "الجمعة", value: 7600, h: 100 }, { day: "السبت", value: 9000, h: 118 },
      { day: "الأحد", value: 8200, h: 108 },
    ],
    terrains: [
      { name: "ملعب A - 5×5", reservations: 567, revenue: 21937, avgDay: 706, occupancy: 85, perf: "ممتاز", perfColor: "#2d6a21", perfBg: "rgba(45,106,33,0.1)", dot: "#5cb844", barColor: "linear-gradient(90deg,#6aaa60,#2d6a21)", barW: 85 },
      { name: "ملعب B - 7×7", reservations: 448, revenue: 17062, avgDay: 550, occupancy: 70, perf: "جيد", perfColor: "#1565c0", perfBg: "rgba(21,101,192,0.1)", dot: "#1565c0", barColor: "linear-gradient(90deg,#64b5f6,#1565c0)", barW: 70 },
      { name: "ملعب C - 11×11", reservations: 269, revenue: 9750, avgDay: 314, occupancy: 40, perf: "متوسط", perfColor: "#e65100", perfBg: "rgba(230,81,0,0.1)", dot: "#ef5350", barColor: "linear-gradient(90deg,#ce93d8,#6a1b9a)", barW: 40 },
    ],
    status: [
      { label: "مؤكد", count: 847, pct: 66, color: "#2d6a21", gradFrom: "#6aaa60" },
      { label: "في الانتظار", count: 203, pct: 16, color: "#e65100", gradFrom: "#ffb74d" },
      { label: "مكتمل", count: 140, pct: 11, color: "#1565c0", gradFrom: "#64b5f6" },
      { label: "ملغى", count: 94, pct: 7, color: "#b71c1c", gradFrom: "#ef9a9a" },
    ],
    topDays: [
      { day: "السبت", value: 9000 }, { day: "الأحد", value: 8200 }, { day: "الجمعة", value: 7600 },
    ],
    peakHours: [
      { hour: "20:00-21:00", pct: 95 }, { hour: "19:00-20:00", pct: 88 },
      { hour: "18:00-19:00", pct: 80 }, { hour: "21:00-22:00", pct: 70 },
      { hour: "17:00-18:00", pct: 62 },
    ],
  },
  "شهر": {
    revenue: "186,400", reservations: 4820, occupancy: 78, clients: 892,
    caChart: [
      { day: "أ1", value: 22000, h: 44 }, { day: "أ2", value: 28000, h: 56 },
      { day: "أ3", value: 25000, h: 50 }, { day: "أ4", value: 34000, h: 68 },
      { day: "أ5", value: 40000, h: 80 }, { day: "أ6", value: 52000, h: 104 },
      { day: "أ7", value: 48000, h: 96 },
    ],
    terrains: [
      { name: "ملعب A - 5×5", reservations: 2100, revenue: 84000, avgDay: 2800, occupancy: 88, perf: "ممتاز", perfColor: "#2d6a21", perfBg: "rgba(45,106,33,0.1)", dot: "#5cb844", barColor: "linear-gradient(90deg,#6aaa60,#2d6a21)", barW: 88 },
      { name: "ملعب B - 7×7", reservations: 1720, revenue: 69200, avgDay: 2306, occupancy: 75, perf: "جيد", perfColor: "#1565c0", perfBg: "rgba(21,101,192,0.1)", dot: "#1565c0", barColor: "linear-gradient(90deg,#64b5f6,#1565c0)", barW: 75 },
      { name: "ملعب C - 11×11", reservations: 1000, revenue: 33200, avgDay: 1106, occupancy: 50, perf: "متوسط", perfColor: "#e65100", perfBg: "rgba(230,81,0,0.1)", dot: "#ef5350", barColor: "linear-gradient(90deg,#ce93d8,#6a1b9a)", barW: 50 },
    ],
    status: [
      { label: "مؤكد", count: 3180, pct: 66, color: "#2d6a21", gradFrom: "#6aaa60" },
      { label: "في الانتظار", count: 820, pct: 17, color: "#e65100", gradFrom: "#ffb74d" },
      { label: "مكتمل", count: 530, pct: 11, color: "#1565c0", gradFrom: "#64b5f6" },
      { label: "ملغى", count: 290, pct: 6, color: "#b71c1c", gradFrom: "#ef9a9a" },
    ],
    topDays: [
      { day: "السبت", value: 52000 }, { day: "الأحد", value: 48000 }, { day: "الجمعة", value: 40000 },
    ],
    peakHours: [
      { hour: "20:00-21:00", pct: 97 }, { hour: "19:00-20:00", pct: 90 },
      { hour: "18:00-19:00", pct: 84 }, { hour: "21:00-22:00", pct: 74 },
      { hour: "17:00-18:00", pct: 65 },
    ],
  },
  "سنة": {
    revenue: "2,140,800", reservations: 54600, occupancy: 76, clients: 4200,
    caChart: [
      { day: "يناير", value: 140000, h: 50 }, { day: "فبراير", value: 160000, h: 58 },
      { day: "مارس", value: 180000, h: 65 }, { day: "أبريل", value: 200000, h: 72 },
      { day: "ماي", value: 220000, h: 79 }, { day: "يونيو", value: 260000, h: 94 },
      { day: "يوليوز", value: 280000, h: 100 },
    ],
    terrains: [
      { name: "ملعب A - 5×5", reservations: 24000, revenue: 960000, avgDay: 2630, occupancy: 90, perf: "ممتاز", perfColor: "#2d6a21", perfBg: "rgba(45,106,33,0.1)", dot: "#5cb844", barColor: "linear-gradient(90deg,#6aaa60,#2d6a21)", barW: 90 },
      { name: "ملعب B - 7×7", reservations: 19600, revenue: 784000, avgDay: 2147, occupancy: 78, perf: "جيد", perfColor: "#1565c0", perfBg: "rgba(21,101,192,0.1)", dot: "#1565c0", barColor: "linear-gradient(90deg,#64b5f6,#1565c0)", barW: 78 },
      { name: "ملعب C - 11×11", reservations: 11000, revenue: 396800, avgDay: 1087, occupancy: 55, perf: "متوسط", perfColor: "#e65100", perfBg: "rgba(230,81,0,0.1)", dot: "#ef5350", barColor: "linear-gradient(90deg,#ce93d8,#6a1b9a)", barW: 55 },
    ],
    status: [
      { label: "مؤكد", count: 36000, pct: 66, color: "#2d6a21", gradFrom: "#6aaa60" },
      { label: "في الانتظار", count: 9300, pct: 17, color: "#e65100", gradFrom: "#ffb74d" },
      { label: "مكتمل", count: 6000, pct: 11, color: "#1565c0", gradFrom: "#64b5f6" },
      { label: "ملغى", count: 3300, pct: 6, color: "#b71c1c", gradFrom: "#ef9a9a" },
    ],
    topDays: [
      { day: "يوليوز", value: 280000 }, { day: "يونيو", value: 260000 }, { day: "ماي", value: 220000 },
    ],
    peakHours: [
      { hour: "20:00-21:00", pct: 98 }, { hour: "19:00-20:00", pct: 92 },
      { hour: "18:00-19:00", pct: 85 }, { hour: "21:00-22:00", pct: 76 },
      { hour: "17:00-18:00", pct: 68 },
    ],
  },
};

// ─── Export Helpers ────────────────────────────────────────────
const exportPDF = (title, headers, rows) => {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  doc.setFontSize(16);
  doc.text(title, 14, 16);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 14, 24);
  autoTable(doc, {
    startY: 30,
    head: [headers],
    body: rows,
    styles: { fontSize: 10, halign: "center" },
    headStyles: { fillColor: [45, 106, 33], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [237, 247, 234] },
  });
  doc.save(`${title}.pdf`);
};

const exportExcel = (title, headers, rows) => {
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title);
  XLSX.writeFile(wb, `${title}.xlsx`);
};

// ─── Reusable Components (OUTSIDE main component) ─────────────
const ExportBtns = ({ onPDF, onExcel }) => (
  <div style={{ display: "flex", gap: 6 }}>
    <button onClick={onPDF} style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "5px 12px", borderRadius: 8, cursor: "pointer",
      background: "#fff5f5", color: "#b71c1c", border: "1px solid #ffcdd2",
      fontSize: 11, fontWeight: 800, fontFamily: "'Cairo',sans-serif",
    }}>
      <IconFileTypePdf size={13} /> PDF
    </button>
    <button onClick={onExcel} style={{
      display: "flex", alignItems: "center", gap: 5,
      padding: "5px 12px", borderRadius: 8, cursor: "pointer",
      background: "#e8f5e0", color: "#2d6a21", border: "1px solid #c8e6c0",
      fontSize: 11, fontWeight: 800, fontFamily: "'Cairo',sans-serif",
    }}>
      <IconFileTypeXls size={13} /> Excel
    </button>
  </div>
);

const SectionHeader = ({ title, sub, onPDF, onExcel }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>{title}</div>
      {sub && <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2 }}>{sub}</div>}
    </div>
    <ExportBtns onPDF={onPDF} onExcel={onExcel} />
  </div>
);

// ─── Main Component ────────────────────────────────────────────
const Reports = () => {
  const [activePeriod, setActivePeriod] = useState("أسبوع");
  const [dateFrom, setDateFrom] = useState("2025-06-01");
  const [dateTo, setDateTo] = useState("2025-06-22");
  const [hoveredBar, setHoveredBar] = useState(null);

  const font = "'Cairo', sans-serif";
  const cardBg = "#ffffff";
  const border = "#e8f0e8";
  const bg = "#f4f8f3";
  const green = "#2d6a21";

  // ─── All data filtered by period ───
  const data = useMemo(() => dataByPeriod[activePeriod], [activePeriod]);

  const periodLabel = {
    "يوم": "اليوم",
    "أسبوع": "هذا الأسبوع",
    "شهر": "هذا الشهر",
    "سنة": "هذه السنة",
  }[activePeriod];

  const kpis = [
    { label: "إجمالي الإيرادات", value: `${data.revenue} د`, trend: "▲ +12%", icon: <IconReportMoney size={17} />, borderColor: "#2d6a21", icoBg: "#edf7ea", icoColor: "#2d6a21", trendBg: "#edf7ea", trendColor: "#2d6a21", sparks: [35,50,40,65,75,85,100], sparkC: "#c8e6c0", sparkA: "#2d6a21" },
    { label: "إجمالي الحجوزات", value: data.reservations.toLocaleString(), trend: "▲ +8%", icon: <IconCalendarStats size={17} />, borderColor: "#1565c0", icoBg: "#e6f0fc", icoColor: "#1565c0", trendBg: "#e6f0fc", trendColor: "#1565c0", sparks: [40,55,45,70,80,90,100], sparkC: "#bbdefb", sparkA: "#1565c0" },
    { label: "متوسط الإشغال", value: `${data.occupancy}%`, trend: "▲ +5%", icon: <IconTrendingUp size={17} />, borderColor: "#6a1b9a", icoBg: "#f0e8fc", icoColor: "#6a1b9a", trendBg: "#f0e8fc", trendColor: "#6a1b9a", sparks: [60,65,68,70,72,73,75], sparkC: "#e1bee7", sparkA: "#6a1b9a" },
    { label: "عملاء نشطون", value: data.clients.toLocaleString(), trend: "▲ +15%", icon: <IconUsers size={17} />, borderColor: "#e65100", icoBg: "#fef0e6", icoColor: "#e65100", trendBg: "#fef0e6", trendColor: "#e65100", sparks: [40,50,55,65,75,88,100], sparkC: "#ffe0b2", sparkA: "#e65100" },
  ];

  return (
    <div style={{ padding: 24, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .kpi-r { transition: transform .2s, box-shadow .2s; }
        .kpi-r:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
        @media (max-width: 900px) {
          .kpi-grid-r { grid-template-columns: repeat(2,1fr) !important; }
          .two-col-r { grid-template-columns: 1fr !important; }
          .three-col-r { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a3d14" }}>التقارير</h1>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7ab870" }}>تقارير الأداء والإيرادات</p>
      </div>

      {/* ── Filter Bar ── */}
      <div style={{
        background: cardBg, borderRadius: 12, border: `1px solid ${border}`,
        padding: "12px 16px", marginBottom: 18,
        display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", gap: 4 }}>
          {["يوم", "أسبوع", "شهر", "سنة"].map(p => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              style={{
                padding: "7px 14px", borderRadius: 8, cursor: "pointer",
                border: `1px solid ${activePeriod === p ? green : border}`,
                background: activePeriod === p ? green : bg,
                color: activePeriod === p ? "#fff" : "#8aaa80",
                fontSize: 11, fontWeight: 700, fontFamily: font,
                transition: "all .2s",
              }}
            >{p}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "#8aaa80", fontWeight: 700 }}>
          من:
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: 9, border: `1px solid ${border}`, background: bg, fontSize: 11, fontFamily: font, color: "#5a8a50", outline: "none" }}
          />
          إلى:
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{ padding: "7px 10px", borderRadius: 9, border: `1px solid ${border}`, background: bg, fontSize: 11, fontFamily: font, color: "#5a8a50", outline: "none" }}
          />
        </div>
        <span style={{ fontSize: 11, color: "#8aaa80", fontStyle: "italic" }}>
          · {dateFrom} → {dateTo}
        </span>
      </div>

      {/* ── KPI Cards ── */}
      <div className="kpi-grid-r" style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 12, marginBottom: 18,
      }}>
        {kpis.map((s, i) => (
          <div key={i} className="kpi-r" style={{
            background: cardBg, borderRadius: 12,
            border: `1px solid ${border}`,
            borderRight: `4px solid ${s.borderColor}`,
            padding: "16px 14px 12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: s.icoBg, color: s.icoColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {s.icon}
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 10, background: s.trendBg, color: s.trendColor }}>{s.trend}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#1a3d14", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#8aaa80", fontWeight: 600, marginTop: 3 }}>{s.label}</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 22, marginTop: 10 }}>
              {s.sparks.map((h, j) => (
                <div key={j} style={{ flex: 1, height: `${h}%`, borderRadius: "3px 3px 2px 2px", background: j >= 5 ? s.sparkA : s.sparkC }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── CA Chart ── */}
      <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 18, marginBottom: 16 }}>
        <SectionHeader
          title="تطور رقم الأعمال"
          sub={`${periodLabel} · ${dateFrom} → ${dateTo}`}
          onPDF={() => exportPDF("Rapport CA", ["Période", "CA (DH)"], data.caChart.map(d => [d.day, `${d.value.toLocaleString()} DH`]))}
          onExcel={() => exportExcel("CA", ["Période", "CA (DH)"], data.caChart.map(d => [d.day, d.value]))}
        />
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 130 }}>
          {data.caChart.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
              {hoveredBar === i && (
                <div style={{ background: "#1a3d14", color: "#fff", fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 5, whiteSpace: "nowrap" }}>
                  {d.value.toLocaleString()} د
                </div>
              )}
              <div
                onMouseEnter={() => setHoveredBar(i)}
                onMouseLeave={() => setHoveredBar(null)}
                style={{
                  width: "100%", height: d.h,
                  background: i >= 4 ? "linear-gradient(180deg,#5cb844,#2d6a21)" : "#c8e6c0",
                  borderRadius: "5px 5px 3px 3px", cursor: "pointer", transition: "opacity .2s",
                }}
              />
              <div style={{ fontSize: 9, color: "#aaa", fontWeight: 600 }}>{d.day.slice(0, 4)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Terrain Table ── */}
      <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden", marginBottom: 16 }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>تقرير الملاعب التفصيلي</div>
            <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2 }}>{periodLabel} · {dateFrom} → {dateTo}</div>
          </div>
          <ExportBtns
            onPDF={() => exportPDF("Rapport Terrains", ["Terrain", "Réservations", "Revenus (DH)", "Moy/Jour", "Occupation", "Performance"], data.terrains.map(d => [d.name, d.reservations, `${d.revenue.toLocaleString()} DH`, `${d.avgDay.toLocaleString()} DH`, `${d.occupancy}%`, d.perf]))}
            onExcel={() => exportExcel("Terrains", ["Terrain", "Réservations", "Revenus", "Moy/Jour", "Occupation %", "Performance"], data.terrains.map(d => [d.name, d.reservations, d.revenue, d.avgDay, d.occupancy, d.perf]))}
          />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 130px 110px 90px 90px", padding: "9px 18px", background: bg, borderBottom: `1px solid ${border}`, fontSize: 10, fontWeight: 700, color: "#8aaa80" }}>
          <span>الملعب</span><span>الحجوزات</span><span>الإيرادات</span><span>متوسط/يوم</span><span>الإشغال</span><span>الأداء</span>
        </div>
        {data.terrains.map((t, i) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: "1fr 100px 130px 110px 90px 90px",
            padding: "13px 18px", alignItems: "center",
            borderBottom: i < data.terrains.length - 1 ? `1px solid #f8fbf7` : "none",
          }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1a3d14", display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: t.dot, display: "inline-block", boxShadow: `0 0 4px ${t.dot}` }} />
                {t.name}
              </div>
              <div style={{ height: 5, background: "#f0f5f0", borderRadius: 8, overflow: "hidden", marginTop: 5, width: `${t.barW}%` }}>
                <div style={{ height: "100%", background: t.barColor, borderRadius: 8 }} />
              </div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#1a3d14" }}>{t.reservations.toLocaleString()}</span>
            <span style={{ fontSize: 13, fontWeight: 900, color: t.perfColor }}>{t.revenue.toLocaleString()} د</span>
            <span style={{ fontSize: 11, color: "#5a8a50", fontWeight: 700 }}>{t.avgDay.toLocaleString()} د</span>
            <span style={{ fontSize: 12, fontWeight: 800, color: t.perfColor }}>{t.occupancy}%</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: t.perfColor, background: t.perfBg, padding: "3px 9px", borderRadius: 6, borderRight: `3px solid ${t.perfColor}`, display: "inline-block" }}>{t.perf}</span>
          </div>
        ))}
      </div>

      {/* ── Bottom 3 cols ── */}
      <div className="three-col-r" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

        {/* Top Days */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 18 }}>
          <SectionHeader
            title="أعلى الفترات إيراداً"
            sub={periodLabel}
            onPDF={() => exportPDF("Top Périodes", ["Période", "CA (DH)"], data.topDays.map(d => [d.day, `${d.value.toLocaleString()} DH`]))}
            onExcel={() => exportExcel("TopPériodes", ["Période", "CA (DH)"], data.topDays.map(d => [d.day, d.value]))}
          />
          {data.topDays.map((d, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                <span style={{ fontWeight: 700, color: "#1a3d14" }}>{d.day}</span>
                <span style={{ fontWeight: 900, color: green }}>{d.value.toLocaleString()} د</span>
              </div>
              <div style={{ height: 7, background: "#f0f5f0", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(d.value / data.topDays[0].value) * 100}%`, background: "linear-gradient(90deg,#6aaa60,#2d6a21)", borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Status */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 18 }}>
          <SectionHeader
            title="توزيع الحجوزات حسب الحالة"
            sub={periodLabel}
            onPDF={() => exportPDF("Statuts", ["Statut", "Nombre", "%"], data.status.map(d => [d.label, d.count, `${d.pct}%`]))}
            onExcel={() => exportExcel("Statuts", ["Statut", "Nombre", "%"], data.status.map(d => [d.label, d.count, d.pct]))}
          />
          {data.status.map((s, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, color: s.color }}>{s.label}</span>
                <span style={{ fontWeight: 800, color: "#1a3d14" }}>{s.count.toLocaleString()} · {s.pct}%</span>
              </div>
              <div style={{ height: 7, background: "#f0f5f0", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${s.pct}%`, background: `linear-gradient(90deg,${s.gradFrom},${s.color})`, borderRadius: 8 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Peak Hours */}
        <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, padding: 18 }}>
          <SectionHeader
            title="أكثر الفترات ازدحاماً"
            sub="متوسط الحجوزات بالساعة"
            onPDF={() => exportPDF("Heures Pointe", ["Heure", "Taux (%)"], data.peakHours.map(d => [d.hour, `${d.pct}%`]))}
            onExcel={() => exportExcel("HeuresPointe", ["Heure", "Taux (%)"], data.peakHours.map(d => [d.hour, d.pct]))}
          />
          {data.peakHours.map((h, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8aaa80", width: 68, flexShrink: 0 }}>{h.hour}</span>
              <div style={{ flex: 1, height: 7, background: "#f0f5f0", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${h.pct}%`, borderRadius: 8, background: h.pct >= 85 ? "linear-gradient(90deg,#5cb844,#2d6a21)" : "linear-gradient(90deg,#a8d5a0,#6aaa60)" }} />
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: h.pct >= 85 ? green : "#5a8a50", width: 30, textAlign: "left" }}>{h.pct}%</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Reports;
