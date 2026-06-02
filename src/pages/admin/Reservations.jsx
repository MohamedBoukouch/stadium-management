import { useState } from "react";
import {
  IconSearch,
  IconFileTypePdf,
  IconChevronDown,
  IconCalendarStats,
  IconCircleCheck,
  IconClock,
  IconCircleX,
} from "@tabler/icons-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const allReservations = [
  { id: "#1042", user: "أحمد البكري", phone: "0612345678", terrain: "ملعب A", date: "22/06", time: "18:00-19:00", amount: "200 د", status: "مؤكد" },
  { id: "#1041", user: "يوسف المنصوري", phone: "0698765432", terrain: "ملعب B", date: "22/06", time: "17:00-18:00", amount: "250 د", status: "انتظار" },
  { id: "#1040", user: "كريم الزياني", phone: "0655443322", terrain: "ملعب A", date: "21/06", time: "20:00-21:00", amount: "200 د", status: "مكتمل" },
  { id: "#1039", user: "سارة الحسني", phone: "0677889900", terrain: "ملعب C", date: "21/06", time: "16:00-17:00", amount: "300 د", status: "ملغى" },
  { id: "#1038", user: "إلياس بوعزة", phone: "0633221100", terrain: "ملعب B", date: "20/06", time: "19:00-20:00", amount: "250 د", status: "مؤكد" },
  { id: "#1037", user: "فاطمة العلوي", phone: "0644556677", terrain: "ملعب A", date: "20/06", time: "15:00-16:00", amount: "200 د", status: "مكتمل" },
  { id: "#1036", user: "محمد الإدريسي", phone: "0661234567", terrain: "ملعب C", date: "19/06", time: "14:00-15:00", amount: "300 د", status: "مؤكد" },
  { id: "#1035", user: "نور الزهراء", phone: "0622334455", terrain: "ملعب B", date: "19/06", time: "21:00-22:00", amount: "250 د", status: "انتظار" },
];

const statusConfig = {
  "مؤكد":   { color: "#2d6a21", bg: "rgba(45,106,33,0.1)",  border: "#2d6a21" },
  "انتظار": { color: "#b8860b", bg: "rgba(184,134,11,0.1)", border: "#b8860b" },
  "مكتمل":  { color: "#1565c0", bg: "rgba(21,101,192,0.1)", border: "#1565c0" },
  "ملغى":   { color: "#b71c1c", bg: "rgba(183,28,28,0.1)",  border: "#b71c1c" },
};

const Reservations = () => {
  const [reservations, setReservations] = useState(allReservations);
  const [search, setSearch] = useState("");
  const [terrain, setTerrain] = useState("كل الملاعب");
  const [period, setPeriod] = useState("الكل");
  const [dateFilter, setDateFilter] = useState("");
  const [openStatusId, setOpenStatusId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const font = "'Cairo', sans-serif";
  const cardBg = "#fff";
  const border = "#e8f0e8";
  const bg = "#f4f8f3";
  const green = "#2d6a21";

  const changeStatus = (id, s) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: s } : r));
    setOpenStatusId(null);
  };

  const filtered = reservations.filter(r => {
    const matchSearch = !search || r.user.includes(search) || r.id.includes(search);
    const matchTerrain = terrain === "كل الملاعب" || r.terrain === terrain;
    const matchDate = !dateFilter || r.date === new Date(dateFilter).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }).replace("/", "/");
    return matchSearch && matchTerrain && matchDate;
  });

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(14);
    doc.text("Rapport Réservations", 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [["N°", "Client", "Terrain", "Date · Heure", "Montant", "Statut"]],
      body: filtered.map(r => [r.id, r.user, r.terrain, `${r.date} · ${r.time}`, r.amount, r.status]),
      styles: { fontSize: 10, halign: "center" },
      headStyles: { fillColor: [45, 106, 33], textColor: 255 },
      alternateRowStyles: { fillColor: [237, 247, 234] },
    });
    doc.save("reservations.pdf");
  };

  const stats = [
    { label: "إجمالي الحجوزات", value: reservations.length, ico: <IconCalendarStats size={26} />, icoBg: "#edf7ea", valColor: "#1a3d14", borderColor: "#2d6a21" },
    { label: "مؤكدة", value: reservations.filter(r => r.status === "مؤكد").length, ico: <IconCircleCheck size={26} />, icoBg: "#edf7ea", valColor: "#2d6a21", borderColor: "#2d6a21" },
    { label: "في الانتظار", value: reservations.filter(r => r.status === "انتظار").length, ico: <IconClock size={26} />, icoBg: "#fff8e1", valColor: "#b8860b", borderColor: "#b8860b" },
    { label: "ملغاة", value: reservations.filter(r => r.status === "ملغى").length, ico: <IconCircleX size={26} />, icoBg: "#fce8e8", valColor: "#b71c1c", borderColor: "#b71c1c" },
  ];

  return (
    <div style={{ padding: 24, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .sc-r:hover { transform: translateY(-2px); }
        .sc-r { transition: transform .2s; }
        .row-r { transition: background .15s; }
        .row-r:hover { background: #f8fcf6 !important; }
        .opt-r:hover { background: #f4f8f3 !important; }
      `}</style>

      {/* Title */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a3d14" }}>الحجوزات</h1>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7ab870" }}>متابعة وإدارة جميع الحجوزات</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} className="sc-r" style={{
            background: cardBg, borderRadius: 14, border: `1px solid ${border}`,
            padding: "20px 18px", display: "flex", alignItems: "center", gap: 16,
            borderRight: `5px solid ${s.borderColor}`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14,
              background: s.icoBg, color: s.borderColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              {s.ico}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.valColor, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#8aaa80", fontWeight: 600, marginTop: 5 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Single Filter Bar ── */}
      <div style={{
        background: cardBg, borderRadius: 12, border: `1px solid ${border}`,
        padding: "14px 18px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{
          flex: 1, minWidth: 180,
          display: "flex", alignItems: "center", gap: 8,
          background: bg, border: `1px solid ${border}`,
          borderRadius: 9, padding: "9px 14px",
        }}>
          <IconSearch size={15} color="#aaa" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث باسم العميل..."
            style={{ border: "none", background: "none", outline: "none", fontFamily: font, fontSize: 13, color: "#333", width: "100%", direction: "rtl" }}
          />
        </div>

        {/* Period */}
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 9, border: `1px solid ${border}`, background: bg, fontSize: 13, fontWeight: 700, color: "#5a8a50", fontFamily: font, cursor: "pointer" }}
        >
          <option value="الكل">كل الفترات</option>
          <option value="يوم">اليوم</option>
          <option value="أسبوع">هذا الأسبوع</option>
          <option value="شهر">هذا الشهر</option>
        </select>

        {/* Date */}
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 9, border: `1px solid ${border}`, background: bg, fontSize: 13, fontWeight: 700, color: "#5a8a50", fontFamily: font, cursor: "pointer", outline: "none" }}
        />

        {/* Terrain */}
        <select
          value={terrain}
          onChange={e => setTerrain(e.target.value)}
          style={{ padding: "9px 14px", borderRadius: 9, border: `1px solid ${border}`, background: bg, fontSize: 13, fontWeight: 700, color: "#5a8a50", fontFamily: font, cursor: "pointer" }}
        >
          <option>كل الملاعب</option>
          <option>ملعب A</option>
          <option>ملعب B</option>
          <option>ملعب C</option>
        </select>

        {/* Export */}
        <button
          onClick={exportPDF}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "9px 18px", borderRadius: 9, border: "none",
            background: "linear-gradient(135deg,#2d6a21,#5cb844)",
            color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: font,
            cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          <IconFileTypePdf size={15} /> تصدير PDF
        </button>
      </div>

      {/* Table */}
      <div style={{ background: cardBg, borderRadius: 14, border: `1px solid ${border}`, overflow: "hidden" }}>

        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#1a3d14" }}>قائمة الحجوزات</div>
          <div style={{ fontSize: 12, color: "#8aaa80" }}>{filtered.length} حجز</div>
        </div>

        {/* Cols */}
        <div style={{
          display: "grid", gridTemplateColumns: "70px 1fr 100px 130px 80px 110px",
          padding: "10px 20px", background: bg,
          borderBottom: `1px solid ${border}`,
          fontSize: 11, fontWeight: 700, color: "#8aaa80",
        }}>
          <span>الرقم</span><span>العميل</span><span>الملعب</span>
          <span>التاريخ · الوقت</span><span>المبلغ</span><span>الحالة</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#8aaa80", fontSize: 13 }}>لا توجد نتائج</div>
        ) : filtered.map((r, i) => {
          const sc = statusConfig[r.status];
          return (
            <div
              key={r.id}
              className="row-r"
              onMouseEnter={() => setHoveredRow(i)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: "grid", gridTemplateColumns: "70px 1fr 100px 130px 80px 110px",
                padding: "14px 20px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? `1px solid #f4f8f3` : "none",
                background: hoveredRow === i ? "#f8fcf6" : i % 2 === 1 ? "#fafcfa" : "transparent",
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: "#bbb" }}>{r.id}</span>

              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: "linear-gradient(135deg,#2d6a21,#5cb844)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 900, color: "#fff", flexShrink: 0,
                }}>{r.user.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1a3d14" }}>{r.user}</div>
                  <div style={{ fontSize: 10, color: "#8aaa80" }}>{r.phone}</div>
                </div>
              </div>

              <span style={{ fontSize: 12, color: "#5a8a50", fontWeight: 600 }}>{r.terrain}</span>
              <span style={{ fontSize: 12, color: "#5a8a50" }}>{r.date} · {r.time}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>{r.amount}</span>

              {/* Status Dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setOpenStatusId(openStatusId === r.id ? null : r.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 12, fontWeight: 700,
                    color: sc.color, background: sc.bg,
                    padding: "5px 10px", borderRadius: 8,
                    border: `1px solid ${sc.color}30`,
                    borderRight: `3px solid ${sc.border}`,
                    cursor: "pointer", fontFamily: font,
                  }}
                >
                  {r.status} <IconChevronDown size={12} />
                </button>

                {openStatusId === r.id && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", right: 0,
                    background: "#fff", border: `1px solid ${border}`,
                    borderRadius: 10, overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    zIndex: 50, minWidth: 120,
                  }}>
                    {Object.keys(statusConfig).map((opt, j) => {
                      const oc = statusConfig[opt];
                      return (
                        <div
                          key={opt}
                          className="opt-r"
                          onClick={() => changeStatus(r.id, opt)}
                          style={{
                            padding: "10px 14px",
                            display: "flex", alignItems: "center", gap: 8,
                            borderBottom: j < 3 ? `1px solid #f0f5f0` : "none",
                            background: r.status === opt ? oc.bg : "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: oc.border, display: "block" }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: r.status === opt ? oc.color : "#5a6a50" }}>{opt}</span>
                          {r.status === opt && <span style={{ marginRight: "auto", color: oc.color, fontSize: 11 }}>✓</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 20px", borderTop: `1px solid ${border}`, background: bg,
        }}>
          <div style={{ fontSize: 11, color: "#8aaa80", fontWeight: 600 }}>
            {filtered.length} نتيجة
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["›", "1", "2", "3", "‹"].map((p, i) => (
              <div key={i} style={{
                width: 30, height: 30, borderRadius: 8,
                border: p === "1" ? "none" : `1px solid ${border}`,
                background: p === "1" ? green : cardBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                color: p === "1" ? "#fff" : "#8aaa80",
                cursor: "pointer",
              }}>{p}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
