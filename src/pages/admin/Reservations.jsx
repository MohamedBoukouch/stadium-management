import { useState } from "react";
import {
  IconSearch,
  IconFileTypePdf,
  IconChevronDown,
  IconCalendarStats,
  IconCircleCheck,
  IconClock,
  IconCircleX,
  IconEye,
  IconEdit,
  IconList,
} from "@tabler/icons-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const allReservations = [
  { id: "#1042", user: "أحمد البكري", phone: "0612345678", terrain: "ملعب A", date: "22/06/2026", time: "18:00 - 19:00", amount: "200 د", status: "مؤكد" },
  { id: "#1041", user: "يوسف المنصوري", phone: "0698765432", terrain: "ملعب B", date: "22/06/2026", time: "17:00 - 18:00", amount: "250 د", status: "في الانتظار" },
  { id: "#1040", user: "سعيد الزهراني", phone: "0671122334", terrain: "ملعب A", date: "23/06/2026", time: "19:00 - 20:00", amount: "150 د", status: "مؤكد" },
  { id: "#1039", user: "ماجد الغامدي", phone: "0567788990", terrain: "ملعب C", date: "23/06/2026", time: "16:00 - 17:00", amount: "120 د", status: "ملغى" },
  { id: "#1038", user: "فاطمة العلوي", phone: "0644556677", terrain: "ملعب B", date: "24/06/2026", time: "15:00 - 16:00", amount: "250 د", status: "مؤكد" },
  { id: "#1037", user: "كريم الزياني", phone: "0655443322", terrain: "ملعب A", date: "24/06/2026", time: "20:00 - 21:00", amount: "200 د", status: "في الانتظار" },
  { id: "#1036", user: "نور الزهراء", phone: "0622334455", terrain: "ملعب C", date: "25/06/2026", time: "18:00 - 19:00", amount: "120 د", status: "مؤكد" },
  { id: "#1035", user: "عمر بنعلي", phone: "0655667788", terrain: "ملعب B", date: "25/06/2026", time: "21:00 - 22:00", amount: "250 د", status: "ملغى" },
];

const statusConfig = {
  "مؤكد":         { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0" },
  "في الانتظار":  { color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
  "ملغى":         { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" },
  "مكتمل":        { color: "#2563eb", bg: "#dbeafe", border: "#bfdbfe" },
};

const Reservations = () => {
  const [reservations, setReservations] = useState(allReservations);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("كل الحالات");
  const [filterTerrain, setFilterTerrain] = useState("كل الملاعب");
  const [filterDate, setFilterDate] = useState("");
  const [openStatusId, setOpenStatusId] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const font = "'Cairo', sans-serif";
 

  const changeStatus = (id, s) => {
    setReservations(prev => prev.map(r => r.id === id ? { ...r, status: s } : r));
    setOpenStatusId(null);
  };

  const filtered = reservations.filter(r => {
    const matchSearch = !search || r.user.includes(search) || r.id.includes(search) || r.phone.includes(search);
    const matchStatus = filterStatus === "كل الحالات" || r.status === filterStatus;
    const matchTerrain = filterTerrain === "كل الملاعب" || r.terrain === filterTerrain;
    const matchDate = !filterDate || r.date === filterDate.split("-").reverse().join("/");
    return matchSearch && matchStatus && matchTerrain && matchDate;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const counts = {
    total: reservations.length,
    confirmed: reservations.filter(r => r.status === "مؤكد").length,
    waiting: reservations.filter(r => r.status === "في الانتظار").length,
    cancelled: reservations.filter(r => r.status === "ملغى").length,
  };

  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(14);
    doc.text("Rapport Réservations", 14, 16);
    autoTable(doc, {
      startY: 24,
      head: [["N°", "Client", "Tél", "Terrain", "Date", "Heure", "Montant", "Statut"]],
      body: filtered.map(r => [r.id, r.user, r.phone, r.terrain, r.date, r.time, r.amount, r.status]),
      styles: { fontSize: 9, halign: "center" },
      headStyles: { fillColor: [22, 101, 52], textColor: 255 },
      alternateRowStyles: { fillColor: [220, 252, 231] },
    });
    doc.save("reservations.pdf");
  };

  const stats = [
    { label: "إجمالي الحجوزات", value: counts.total, icon: <IconCalendarStats size={22} />, iconBg: "#dcfce7", iconColor: "#16a34a", borderColor: "#16a34a" },
    { label: "مؤكدة", value: counts.confirmed, icon: <IconCircleCheck size={22} />, iconBg: "#dcfce7", iconColor: "#16a34a", borderColor: "#16a34a" },
    { label: "في الانتظار", value: counts.waiting, icon: <IconClock size={22} />, iconBg: "#fef3c7", iconColor: "#d97706", borderColor: "#d97706" },
    { label: "ملغاة", value: counts.cancelled, icon: <IconCircleX size={22} />, iconBg: "#fee2e2", iconColor: "#dc2626", borderColor: "#dc2626" },
  ];

  return (
    <div style={{ padding: "20px 24px", fontFamily: font, direction: "rtl", background: "#f9fafb", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; }
        .sc-r { transition: transform .2s; }
        .sc-r:hover { transform: translateY(-2px); }
        .tbl-row { transition: background .15s; }
        .tbl-row:hover { background: #f0fdf4 !important; }
        .act-btn { transition: all .15s; cursor: pointer; }
        .act-btn:hover { opacity: .75; }
        .status-opt { transition: background .1s; cursor: pointer; }
        .status-opt:hover { background: #f9fafb !important; }
        .filter-sel { transition: border .15s; }
        .filter-sel:hover { border-color: #16a34a !important; }
      `}</style>

      {/* ── Page Title ── */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IconCalendarStats size={22} color="#16a34a" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#111827" }}>الحجوزات</div>
            <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>متابعة وإدارة جميع الحجوزات</div>
          </div>
        </div>
      </div>

      {/* ── Stats Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} className="sc-r" style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb",
            borderBottom: `3px solid ${s.borderColor}`,
            padding: "16px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: s.iconBg, color: s.iconColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
              border: `1px solid ${s.borderColor}30`,
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.iconColor, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{
        background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
        padding: "14px 16px", marginBottom: 16,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{
          flex: 1, minWidth: 200,
          display: "flex", alignItems: "center", gap: 8,
          background: "#f9fafb", border: "1px solid #e5e7eb",
          borderRadius: 8, padding: "8px 12px",
        }}>
          <IconSearch size={15} color="#9ca3af" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="ابحث باسم العميل..."
            style={{ border: "none", background: "none", outline: "none", fontFamily: font, fontSize: 13, color: "#374151", width: "100%", direction: "rtl" }}
          />
        </div>

        {/* Filter Status */}
        <div style={{ position: "relative" }}>
          <div
            className="filter-sel"
            onClick={() => setOpenStatusId(openStatusId === "status" ? null : "status")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: 8, cursor: "pointer",
              border: "1px solid #e5e7eb", background: "#f9fafb",
              fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: font,
              minWidth: 140,
            }}
          >
            <span style={{ flex: 1 }}>{filterStatus}</span>
            <IconChevronDown size={14} color="#9ca3af" />
          </div>
          {openStatusId === "status" && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", right: 0,
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              zIndex: 50, minWidth: 160,
            }}>
              {["كل الحالات", "مؤكد", "في الانتظار", "مكتمل", "ملغى"].map((opt, i, arr) => (
                <div
                  key={opt}
                  className="status-opt"
                  onClick={() => { setFilterStatus(opt); setOpenStatusId(null); setCurrentPage(1); }}
                  style={{
                    padding: "10px 14px", fontSize: 13, fontWeight: 600,
                    color: filterStatus === opt ? "#16a34a" : "#374151",
                    background: filterStatus === opt ? "#f0fdf4" : "transparent",
                    borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >{opt}</div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Terrain */}
        <div style={{ position: "relative" }}>
          <div
            className="filter-sel"
            onClick={() => setOpenStatusId(openStatusId === "terrain" ? null : "terrain")}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: 8, cursor: "pointer",
              border: "1px solid #e5e7eb", background: "#f9fafb",
              fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: font,
              minWidth: 140,
            }}
          >
            <span style={{ flex: 1 }}>{filterTerrain}</span>
            <IconChevronDown size={14} color="#9ca3af" />
          </div>
          {openStatusId === "terrain" && (
            <div style={{
              position: "absolute", top: "calc(100% + 4px)", right: 0,
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 10, overflow: "hidden",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              zIndex: 50, minWidth: 160,
            }}>
              {["كل الملاعب", "ملعب A", "ملعب B", "ملعب C"].map((opt, i, arr) => (
                <div
                  key={opt}
                  className="status-opt"
                  onClick={() => { setFilterTerrain(opt); setOpenStatusId(null); setCurrentPage(1); }}
                  style={{
                    padding: "10px 14px", fontSize: 13, fontWeight: 600,
                    color: filterTerrain === opt ? "#16a34a" : "#374151",
                    background: filterTerrain === opt ? "#f0fdf4" : "transparent",
                    borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}
                >{opt}</div>
              ))}
            </div>
          )}
        </div>

        {/* Date Filter */}
        <input
          type="date"
          value={filterDate}
          onChange={e => { setFilterDate(e.target.value); setCurrentPage(1); }}
          style={{
            padding: "8px 12px", borderRadius: 8, cursor: "pointer",
            border: "1px solid #e5e7eb", background: "#f9fafb",
            fontSize: 13, fontWeight: 600, color: "#374151",
            fontFamily: font, outline: "none",
          }}
        />

        {/* Export PDF */}
        <button onClick={exportPDF} className="act-btn" style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 8,
          border: "1px solid #e5e7eb", background: "#fff",
          fontSize: 13, fontWeight: 700, color: "#374151", fontFamily: font,
        }}>
          <IconFileTypePdf size={16} color="#374151" /> تصدير PDF
        </button>


      </div>

      {/* ── Table ── */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", overflow: "hidden" }}>

        {/* Table Header */}
        <div style={{
          padding: "14px 20px", borderBottom: "1px solid #f3f4f6",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <IconList size={16} color="#6b7280" />
            <span style={{ fontSize: 15, fontWeight: 800, color: "#111827" }}>قائمة الحجوزات</span>
          </div>
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            عرض {Math.min((currentPage - 1) * perPage + 1, filtered.length)} إلى {Math.min(currentPage * perPage, filtered.length)} من {filtered.length} حجوزات
          </span>
        </div>

        {/* Cols */}
        <div style={{
          display: "grid", gridTemplateColumns: "80px 1fr 90px 110px 110px 80px 110px 90px",
          padding: "10px 20px", background: "#f9fafb",
          borderBottom: "1px solid #f3f4f6",
          fontSize: 12, fontWeight: 700, color: "#6b7280",
        }}>
          <span>الرقم</span>
          <span>العميل</span>
          <span>الملعب</span>
          <span>التاريخ</span>
          <span>الوقت</span>
          <span>المبلغ</span>
          <span>الحالة</span>
          <span style={{ textAlign: "center" }}>الإجراءات</span>
        </div>

        {/* Rows */}
        {paginated.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
            🔍 لا توجد نتائج
          </div>
        ) : paginated.map((r, i) => {
          const sc = statusConfig[r.status] || statusConfig["مؤكد"];
          return (
            <div
              key={r.id}
              className="tbl-row"
              onMouseEnter={() => setHoveredRow(r.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: "grid", gridTemplateColumns: "80px 1fr 90px 110px 110px 80px 110px 90px",
                padding: "13px 20px", alignItems: "center",
                borderBottom: i < paginated.length - 1 ? "1px solid #f9fafb" : "none",
                background: hoveredRow === r.id ? "#f0fdf4" : "transparent",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#9ca3af" }}>{r.id}</span>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  background: "#dcfce7", color: "#16a34a",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900,
                }}>{r.user.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{r.user}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{r.phone}</div>
                </div>
              </div>

              <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{r.terrain}</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>{r.date}</span>
              <span style={{ fontSize: 12, color: "#6b7280" }}>{r.time}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{r.amount}</span>

              {/* Status dropdown */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setOpenStatusId(openStatusId === r.id ? null : r.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 12, fontWeight: 700,
                    color: sc.color, background: sc.bg,
                    padding: "5px 10px", borderRadius: 20,
                    border: `1px solid ${sc.border}`,
                    cursor: "pointer", fontFamily: font,
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.status} <IconChevronDown size={11} />
                </button>
                {openStatusId === r.id && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", right: 0,
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: 10, overflow: "hidden",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    zIndex: 50, minWidth: 130,
                  }}>
                    {Object.keys(statusConfig).map((opt, j) => {
                      const oc = statusConfig[opt];
                      return (
                        <div
                          key={opt}
                          className="status-opt"
                          onClick={() => changeStatus(r.id, opt)}
                          style={{
                            padding: "9px 14px",
                            display: "flex", alignItems: "center", gap: 8,
                            borderBottom: j < Object.keys(statusConfig).length - 1 ? "1px solid #f3f4f6" : "none",
                            background: r.status === opt ? oc.bg : "transparent",
                          }}
                        >
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: oc.color, display: "block" }} />
                          <span style={{ fontSize: 12, fontWeight: 700, color: r.status === opt ? oc.color : "#374151" }}>{opt}</span>
                          {r.status === opt && <span style={{ marginRight: "auto", color: oc.color, fontSize: 11 }}>✓</span>}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                <button className="act-btn" style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IconEye size={15} color="#16a34a" />
                </button>
                <button className="act-btn" style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "#f0fdf4", border: "1px solid #bbf7d0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <IconEdit size={15} color="#16a34a" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Pagination */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 20px", borderTop: "1px solid #f3f4f6", background: "#f9fafb",
        }}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            عرض {Math.min((currentPage - 1) * perPage + 1, filtered.length)} إلى {Math.min(currentPage * perPage, filtered.length)} من {filtered.length} حجوزات
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: 30, height: 30, borderRadius: 8,
                border: "1px solid #e5e7eb", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.4 : 1,
                fontSize: 13, color: "#374151",
              }}>›</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                style={{
                  width: 30, height: 30, borderRadius: 8,
                  border: p === currentPage ? "none" : "1px solid #e5e7eb",
                  background: p === currentPage ? "#166534" : "#fff",
                  color: p === currentPage ? "#fff" : "#374151",
                  fontSize: 12, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{p}</button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                width: 30, height: 30, borderRadius: 8,
                border: "1px solid #e5e7eb", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.4 : 1,
                fontSize: 13, color: "#374151",
              }}>‹</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
