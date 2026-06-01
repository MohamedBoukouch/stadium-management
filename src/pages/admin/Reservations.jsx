import { useState } from "react";
import {
  IconCalendarStats,
  IconCircleCheck,
  IconClock,
  IconX,
  IconReportMoney,
  IconFileTypePdf,
  IconChevronDown,
  IconSearch,
} from "@tabler/icons-react";

// ─── Mock Data ───────────────────────────────────────────────
const allReservations = [
  { id: "#1042", user: "أحمد البكري", phone: "0612345678", terrain: "ملعب A - 5×5", date: "22/06", time: "18:00-19:00", amount: "200 د", status: "مؤكد" },
  { id: "#1041", user: "يوسف المنصوري", phone: "0698765432", terrain: "ملعب B - 7×7", date: "22/06", time: "17:00-18:00", amount: "250 د", status: "انتظار" },
  { id: "#1040", user: "كريم الزياني", phone: "0655443322", terrain: "ملعب A - 5×5", date: "21/06", time: "20:00-21:00", amount: "200 د", status: "مكتمل" },
  { id: "#1039", user: "سارة الحسني", phone: "0677889900", terrain: "ملعب C - 11×11", date: "21/06", time: "16:00-17:00", amount: "300 د", status: "ملغى" },
  { id: "#1038", user: "إلياس بوعزة", phone: "0633221100", terrain: "ملعب B - 7×7", date: "20/06", time: "19:00-20:00", amount: "250 د", status: "مؤكد" },
  { id: "#1037", user: "فاطمة العلوي", phone: "0644556677", terrain: "ملعب A - 5×5", date: "20/06", time: "15:00-16:00", amount: "200 د", status: "مكتمل" },
  { id: "#1036", user: "محمد الإدريسي", phone: "0661234567", terrain: "ملعب C - 11×11", date: "19/06", time: "14:00-15:00", amount: "300 د", status: "مؤكد" },
  { id: "#1035", user: "نور الزهراء", phone: "0622334455", terrain: "ملعب B - 7×7", date: "19/06", time: "21:00-22:00", amount: "250 د", status: "انتظار" },
];

const statusConfig = {
  "مؤكد":   { color: "#2d6a21", bg: "rgba(45,106,33,0.1)",   border: "#2d6a21" },
  "انتظار": { color: "#e65100", bg: "rgba(230,81,0,0.1)",    border: "#e65100" },
  "مكتمل":  { color: "#1565c0", bg: "rgba(21,101,192,0.1)",  border: "#1565c0" },
  "ملغى":   { color: "#b71c1c", bg: "rgba(183,28,28,0.1)",   border: "#b71c1c" },
};

const statusOptions = ["مؤكد", "انتظار", "مكتمل", "ملغى"];

const Reservations = () => {
  const [reservations, setReservations] = useState(allReservations);
  const [activeTab, setActiveTab] = useState("الكل");
  const [activePeriod, setActivePeriod] = useState("أسبوع");
  const [activeTerrain, setActiveTerrain] = useState("كل الملاعب");
  const [search, setSearch] = useState("");
  const [openStatusId, setOpenStatusId] = useState(null);

  const font = "'Cairo', sans-serif";
  const cardBg = "#ffffff";
  const border = "#e8f0e8";
  const bg = "#f4f8f3";
  const green = "#2d6a21";

  // ─── Change Status ───
  const changeStatus = (id, newStatus) => {
    setReservations(prev =>
      prev.map(r => r.id === id ? { ...r, status: newStatus } : r)
    );
    setOpenStatusId(null);
  };

  // ─── Filter ───
  const filtered = reservations.filter(r => {
    const matchTab = activeTab === "الكل" || r.status === activeTab;
    const matchTerrain = activeTerrain === "كل الملاعب" || r.terrain.includes(activeTerrain.replace("ملعب ", "").charAt(0));
    const matchSearch = search === "" ||
      r.user.includes(search) ||
      r.id.includes(search);
    return matchTab && matchTerrain && matchSearch;
  });

  // ─── Counts ───
  const counts = {
    "الكل": reservations.length,
    "مؤكد": reservations.filter(r => r.status === "مؤكد").length,
    "انتظار": reservations.filter(r => r.status === "انتظار").length,
    "مكتمل": reservations.filter(r => r.status === "مكتمل").length,
    "ملغى": reservations.filter(r => r.status === "ملغى").length,
  };

  const tabs = [
    { key: "الكل", color: "#1a3d14" },
    { key: "مؤكد", color: "#2d6a21" },
    { key: "انتظار", color: "#e65100" },
    { key: "مكتمل", color: "#1565c0" },
    { key: "ملغى", color: "#b71c1c" },
  ];

  const stats = [
    { label: "إجمالي الحجوزات", value: "1,284", trend: "▲ +12% هذا الشهر", icon: <IconCalendarStats size={17} />, borderColor: "#2d6a21", icoBg: "#edf7ea", icoColor: "#2d6a21", trendBg: "#edf7ea", trendColor: "#2d6a21" },
    { label: "مؤكدة", value: "847", trend: "66% من الإجمالي", icon: <IconCircleCheck size={17} />, borderColor: "#2d6a21", icoBg: "#edf7ea", icoColor: "#2d6a21", trendBg: "#edf7ea", trendColor: "#2d6a21" },
    { label: "في الانتظار", value: "203", trend: "16% من الإجمالي", icon: <IconClock size={17} />, borderColor: "#e65100", icoBg: "#fef0e6", icoColor: "#e65100", trendBg: "#fef0e6", trendColor: "#e65100" },
    { label: "ملغاة", value: "94", trend: "7% من الإجمالي", icon: <IconX size={17} />, borderColor: "#b71c1c", icoBg: "#fce8e8", icoColor: "#b71c1c", trendBg: "#fce8e8", trendColor: "#b71c1c" },
    { label: "الإيرادات (درهم)", value: "48,750", trend: "▲ +8% هذا الشهر", icon: <IconReportMoney size={17} />, borderColor: "#6a1b9a", icoBg: "#f0e8fc", icoColor: "#6a1b9a", trendBg: "#f0e8fc", trendColor: "#6a1b9a" },
  ];

  return (
    <div style={{ padding: 24, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .sc-res { transition: transform .2s, box-shadow .2s; }
        .sc-res:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
        .res-row-r { transition: background .15s; cursor: pointer; }
        .res-row-r:hover { background: #f8fcf6 !important; }
        .period-btn { transition: all .2s; }
        .tab-btn { transition: all .2s; }
        .status-opt { transition: background .15s; cursor: pointer; }
        .status-opt:hover { background: #f4f8f3 !important; }
        @media (max-width: 900px) {
          .stats-res { grid-template-columns: repeat(3,1fr) !important; }
          .tbl-cols-res { display: none !important; }
        }
      `}</style>

      {/* ── Page Title ── */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a3d14" }}>الحجوزات</h1>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7ab870" }}>إدارة ومتابعة جميع حجوزات الملاعب</p>
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "9px 18px", borderRadius: 10, border: "none",
          background: "linear-gradient(135deg, #2d6a21, #5cb844)",
          color: "#fff", fontSize: 12, fontWeight: 800, fontFamily: font,
          cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,33,0.3)",
        }}>
          <IconFileTypePdf size={15} />
          تصدير PDF
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="stats-res" style={{
        display: "grid", gridTemplateColumns: "repeat(5,1fr)",
        gap: 12, marginBottom: 18,
      }}>
        {stats.map((s, i) => (
          <div key={i} className="sc-res" style={{
            background: cardBg, borderRadius: 12,
            border: `1px solid ${border}`,
            borderRight: `4px solid ${s.borderColor}`,
            padding: "16px 14px 12px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: s.icoBg, color: s.icoColor,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{s.icon}</div>
              <span style={{
                fontSize: 9, fontWeight: 800, padding: "2px 7px", borderRadius: 10,
                background: s.trendBg, color: s.trendColor,
              }}>{s.trend}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: "#1a3d14", lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#8aaa80", fontWeight: 600, marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{
        background: cardBg, borderRadius: 12, border: `1px solid ${border}`,
        padding: "12px 16px", marginBottom: 12,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        {/* Search */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: bg, border: `1px solid ${border}`,
          borderRadius: 9, padding: "8px 12px", flex: 1, minWidth: 200,
        }}>
          <IconSearch size={14} color="#aaa" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث باسم المستخدم أو رقم الحجز..."
            style={{
              border: "none", background: "none", outline: "none",
              fontFamily: font, fontSize: 12, color: "#333",
              width: "100%", direction: "rtl",
            }}
          />
        </div>

        {/* Period */}
        <div style={{ display: "flex", gap: 4 }}>
          {["يوم", "أسبوع", "شهر"].map(p => (
            <button
              key={p}
              className="period-btn"
              onClick={() => setActivePeriod(p)}
              style={{
                padding: "7px 14px", borderRadius: 8,
                border: `1px solid ${activePeriod === p ? green : border}`,
                background: activePeriod === p ? green : bg,
                color: activePeriod === p ? "#fff" : "#8aaa80",
                fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: font,
              }}
            >{p}</button>
          ))}
        </div>

        {/* Terrain */}
        <select
          value={activeTerrain}
          onChange={e => setActiveTerrain(e.target.value)}
          style={{
            padding: "8px 12px", borderRadius: 9,
            border: `1px solid ${border}`, background: bg,
            fontSize: 11, fontWeight: 700, color: "#5a8a50",
            fontFamily: font, cursor: "pointer",
          }}
        >
          <option>كل الملاعب</option>
          <option>ملعب A - 5×5</option>
          <option>ملعب B - 7×7</option>
          <option>ملعب C - 11×11</option>
        </select>
      </div>

      {/* ── Status Tabs ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button
            key={t.key}
            className="tab-btn"
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: "6px 16px", borderRadius: 20, cursor: "pointer",
              border: `1.5px solid ${activeTab === t.key ? t.color : border}`,
              background: activeTab === t.key ? t.color : cardBg,
              color: activeTab === t.key ? "#fff" : t.color,
              fontSize: 11, fontWeight: 800, fontFamily: font,
              display: "flex", alignItems: "center", gap: 6,
              transition: "all .2s",
            }}
          >
            {t.key}
            <span style={{
              fontSize: 9, padding: "1px 6px", borderRadius: 10,
              background: activeTab === t.key ? "rgba(255,255,255,0.25)" : `${t.color}15`,
              color: activeTab === t.key ? "#fff" : t.color,
              fontWeight: 900,
            }}>{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div style={{
        background: cardBg, borderRadius: 14, border: `1px solid ${border}`,
        overflow: "hidden",
      }}>
        {/* Table Header */}
        <div style={{
          padding: "14px 20px", borderBottom: `1px solid ${border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>قائمة الحجوزات</div>
            <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2 }}>
              عرض {filtered.length} من {reservations.length} حجز
            </div>
          </div>
        </div>

        {/* Cols Header */}
        <div className="tbl-cols-res" style={{
          display: "grid",
          gridTemplateColumns: "65px 1fr 110px 80px 100px 75px 100px",
          padding: "9px 20px", background: bg,
          borderBottom: `1px solid ${border}`,
          fontSize: 10, fontWeight: 700, color: "#8aaa80",
        }}>
          <span>الرقم</span>
          <span>المستخدم</span>
          <span>الملعب</span>
          <span>التاريخ</span>
          <span>الوقت</span>
          <span>المبلغ</span>
          <span>الحالة</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#8aaa80", fontSize: 13 }}>
            لا توجد نتائج
          </div>
        ) : (
          filtered.map((r, i) => {
            const sc = statusConfig[r.status];
            return (
              <div
                key={r.id}
                className="res-row-r"
                style={{
                  display: "grid",
                  gridTemplateColumns: "65px 1fr 110px 80px 100px 75px 100px",
                  padding: "13px 20px", alignItems: "center",
                  borderBottom: i < filtered.length - 1 ? `1px solid #f8fbf7` : "none",
                  background: "transparent",
                  position: "relative",
                }}
              >
                {/* ID */}
                <span style={{ fontSize: 11, fontWeight: 700, color: "#8aaa80" }}>{r.id}</span>

                {/* User */}
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "linear-gradient(135deg,#2d6a21,#5cb844)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 900, color: "#fff", flexShrink: 0,
                  }}>{r.user.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>{r.user}</div>
                    <div style={{ fontSize: 10, color: "#8aaa80" }}>{r.phone}</div>
                  </div>
                </div>

                {/* Terrain */}
                <span style={{ fontSize: 11, color: "#5a8a50", fontWeight: 600 }}>{r.terrain}</span>

                {/* Date */}
                <span style={{ fontSize: 11, color: "#8aaa80" }}>{r.date}</span>

                {/* Time */}
                <span style={{ fontSize: 11, color: "#5a8a50" }}>{r.time}</span>

                {/* Amount */}
                <span style={{ fontSize: 12, fontWeight: 800, color: "#1a3d14" }}>{r.amount}</span>

                {/* Status Dropdown */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setOpenStatusId(openStatusId === r.id ? null : r.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 10, fontWeight: 700,
                      color: sc.color, background: sc.bg,
                      padding: "4px 9px", borderRadius: 6,
                      border: `1px solid ${sc.color}30`,
                      borderRight: `3px solid ${sc.border}`,
                      cursor: "pointer", fontFamily: font,
                    }}
                  >
                    {r.status}
                    <IconChevronDown size={11} />
                  </button>

                  {/* Dropdown */}
                  {openStatusId === r.id && (
                    <div style={{
                      position: "absolute", top: "calc(100% + 4px)", right: 0,
                      background: "#fff", border: `1px solid ${border}`,
                      borderRadius: 10, overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                      zIndex: 50, minWidth: 120,
                    }}>
                      {statusOptions.map(opt => {
                        const oc = statusConfig[opt];
                        return (
                          <div
                            key={opt}
                            className="status-opt"
                            onClick={() => changeStatus(r.id, opt)}
                            style={{
                              padding: "9px 14px",
                              display: "flex", alignItems: "center", gap: 8,
                              borderBottom: opt !== "ملغى" ? `1px solid #f0f5f0` : "none",
                              background: r.status === opt ? oc.bg : "transparent",
                            }}
                          >
                            <span style={{
                              width: 7, height: 7, borderRadius: "50%",
                              background: oc.border, display: "block", flexShrink: 0,
                            }} />
                            <span style={{
                              fontSize: 12, fontWeight: 700,
                              color: r.status === opt ? oc.color : "#5a6a50",
                            }}>{opt}</span>
                            {r.status === opt && (
                              <span style={{ marginRight: "auto", fontSize: 10, color: oc.color }}>✓</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Pagination */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 20px", borderTop: `1px solid ${border}`,
          background: bg,
        }}>
          <div style={{ fontSize: 11, color: "#8aaa80", fontWeight: 600 }}>
            عرض 1-{filtered.length} من {reservations.length} نتيجة
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["›", "1", "2", "3", "...", "161", "‹"].map((p, i) => (
              <div key={i} style={{
                width: 28, height: 28, borderRadius: 7,
                border: p === "1" ? "none" : `1px solid ${border}`,
                background: p === "1" ? green : cardBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700,
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
