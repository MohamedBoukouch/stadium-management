import { useState } from "react";
import {
  IconUsers,
  IconUserCheck,
  IconUserOff,
  IconTrophy,
  IconSearch,
  IconFileTypePdf,
  IconFileTypeXls,
  IconEye,
  IconBan,
  IconTrash,
  IconX,
  IconPhone,
  IconMail,
  IconCalendar,
  IconCash,
} from "@tabler/icons-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ─── Mock Data ─────────────────────────────────────────────────
const initialUsers = [
  { id: 1, name: "أحمد البكري", phone: "0612345678", email: "ahmed@gmail.com", reservations: 24, spent: 4800, joinDate: "15/01/2025", status: "نشط" },
  { id: 2, name: "يوسف المنصوري", phone: "0698765432", email: "youssef@gmail.com", reservations: 19, spent: 3800, joinDate: "20/02/2025", status: "نشط" },
  { id: 3, name: "كريم الزياني", phone: "0655443322", email: "karim@gmail.com", reservations: 16, spent: 3200, joinDate: "05/03/2025", status: "نشط" },
  { id: 4, name: "سارة الحسني", phone: "0677889900", email: "sara@gmail.com", reservations: 12, spent: 2400, joinDate: "10/03/2025", status: "محظور" },
  { id: 5, name: "إلياس بوعزة", phone: "0633221100", email: "ilyas@gmail.com", reservations: 10, spent: 2000, joinDate: "18/04/2025", status: "نشط" },
  { id: 6, name: "فاطمة العلوي", phone: "0644556677", email: "fatima@gmail.com", reservations: 8, spent: 1600, joinDate: "22/04/2025", status: "نشط" },
  { id: 7, name: "محمد الإدريسي", phone: "0661234567", email: "mohammed@gmail.com", reservations: 6, spent: 1200, joinDate: "01/05/2025", status: "محظور" },
  { id: 8, name: "نور الزهراء", phone: "0622334455", email: "nour@gmail.com", reservations: 5, spent: 1000, joinDate: "14/05/2025", status: "نشط" },
  { id: 9, name: "عمر بنعلي", phone: "0655667788", email: "omar@gmail.com", reservations: 4, spent: 800, joinDate: "20/05/2025", status: "نشط" },
  { id: 10, name: "ليلى الفاسي", phone: "0699001122", email: "laila@gmail.com", reservations: 3, spent: 600, joinDate: "28/05/2025", status: "نشط" },
];

const userReservations = {
  1: [
    { id: "#1042", terrain: "ملعب A", date: "22/06", time: "18:00-19:00", amount: "200 د", status: "مؤكد", sColor: "#2d6a21", sBg: "rgba(45,106,33,0.1)" },
    { id: "#1035", terrain: "ملعب B", date: "18/06", time: "20:00-21:00", amount: "250 د", status: "مكتمل", sColor: "#1565c0", sBg: "rgba(21,101,192,0.1)" },
    { id: "#1028", terrain: "ملعب A", date: "14/06", time: "19:00-20:00", amount: "200 د", status: "مكتمل", sColor: "#1565c0", sBg: "rgba(21,101,192,0.1)" },
  ],
  2: [
    { id: "#1041", terrain: "ملعب B", date: "22/06", time: "17:00-18:00", amount: "250 د", status: "انتظار", sColor: "#e65100", sBg: "rgba(230,81,0,0.1)" },
    { id: "#1030", terrain: "ملعب A", date: "15/06", time: "18:00-19:00", amount: "200 د", status: "مكتمل", sColor: "#1565c0", sBg: "rgba(21,101,192,0.1)" },
  ],
};

// ─── Sub Components (OUTSIDE main) ────────────────────────────

const Modal = ({ children, onClose }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }}
  >
    <div onClick={e => e.stopPropagation()}>{children}</div>
  </div>
);

// ─── Main Component ────────────────────────────────────────────
const Clients = () => {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("الكل");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  const font = "'Cairo', sans-serif";
  const cardBg = "#ffffff";
  const border = "#e8f0e8";
  const bg = "#f4f8f3";
  const green = "#2d6a21";

  // ─── Computed ───
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "نشط").length;
  const bannedUsers = users.filter(u => u.status === "محظور").length;
  const topUser = [...users].sort((a, b) => b.reservations - a.reservations)[0];

  const filtered = users.filter(u => {
    const matchSearch = search === "" || u.name.includes(search) || u.phone.includes(search) || u.email.includes(search);
    const matchFilter = activeFilter === "الكل" || u.status === activeFilter;
    return matchSearch && matchFilter;
  });

  // ─── Actions ───
  const toggleBan = (id) => {
    setUsers(prev => prev.map(u =>
      u.id === id ? { ...u, status: u.status === "نشط" ? "محظور" : "نشط" } : u
    ));
  };

  const deleteUser = () => {
    setUsers(prev => prev.filter(u => u.id !== selectedUser.id));
    setShowDeleteModal(false);
  };

  const openProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  const openDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // ─── Export ───
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFontSize(16);
    doc.text("Rapport Utilisateurs", 14, 16);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString("fr-FR")}`, 14, 24);
    autoTable(doc, {
      startY: 30,
      head: [["Nom", "Téléphone", "Email", "Réservations", "Dépenses", "Inscription", "Statut"]],
      body: filtered.map(u => [u.name, u.phone, u.email, u.reservations, `${u.spent} DH`, u.joinDate, u.status]),
      styles: { fontSize: 9, halign: "center" },
      headStyles: { fillColor: [45, 106, 33], textColor: 255 },
      alternateRowStyles: { fillColor: [237, 247, 234] },
    });
    doc.save("utilisateurs.pdf");
  };

  const exportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ["Nom", "Téléphone", "Email", "Réservations", "Dépenses (DH)", "Inscription", "Statut"],
      ...filtered.map(u => [u.name, u.phone, u.email, u.reservations, u.spent, u.joinDate, u.status]),
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Utilisateurs");
    XLSX.writeFile(wb, "utilisateurs.xlsx");
  };

  const stats = [
    { label: "إجمالي المستخدمين", value: totalUsers, icon: <IconUsers size={17} />, borderColor: "#2d6a21", icoBg: "#edf7ea", icoColor: "#2d6a21" },
    { label: "مستخدمون نشطون", value: activeUsers, icon: <IconUserCheck size={17} />, borderColor: "#1565c0", icoBg: "#e6f0fc", icoColor: "#1565c0" },
    { label: "مستخدمون محظورون", value: bannedUsers, icon: <IconUserOff size={17} />, borderColor: "#b71c1c", icoBg: "#fce8e8", icoColor: "#b71c1c" },
    { label: "أعلى عميل حجزاً", value: topUser?.name.split(" ")[0], icon: <IconTrophy size={17} />, borderColor: "#e65100", icoBg: "#fef0e6", icoColor: "#e65100" },
  ];

  return (
    <div style={{ padding: 24, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .usr-card { transition: transform .2s, box-shadow .2s; }
        .usr-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.08) !important; }
        .usr-row { transition: background .15s; }
        .usr-row:hover { background: #f8fcf6 !important; }
        .usr-btn { transition: opacity .2s; cursor: pointer; }
        .usr-btn:hover { opacity: .75; }
        @media (max-width: 900px) {
          .usr-stats { grid-template-columns: repeat(2,1fr) !important; }
          .usr-cols { display: none !important; }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a3d14" }}>المستخدمون</h1>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7ab870" }}>إدارة ومتابعة جميع المستخدمين</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={exportPDF} className="usr-btn" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 9, cursor: "pointer",
            background: "#fff5f5", color: "#b71c1c", border: "1px solid #ffcdd2",
            fontSize: 11, fontWeight: 800, fontFamily: font,
          }}>
            <IconFileTypePdf size={14} /> PDF
          </button>
          <button onClick={exportExcel} className="usr-btn" style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 9, cursor: "pointer",
            background: "#e8f5e0", color: green, border: "1px solid #c8e6c0",
            fontSize: 11, fontWeight: 800, fontFamily: font,
          }}>
            <IconFileTypeXls size={14} /> Excel
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="usr-stats" style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 12, marginBottom: 18,
      }}>
        {stats.map((s, i) => (
          <div key={i} className="usr-card" style={{
            background: cardBg, borderRadius: 12,
            border: `1px solid ${border}`,
            borderRight: `4px solid ${s.borderColor}`,
            padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: s.icoBg, color: s.icoColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: "#1a3d14", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: "#8aaa80", fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{
        background: cardBg, borderRadius: 12, border: `1px solid ${border}`,
        padding: "12px 16px", marginBottom: 12,
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: bg, border: `1px solid ${border}`,
          borderRadius: 9, padding: "8px 12px", flex: 1, minWidth: 200,
        }}>
          <IconSearch size={14} color="#aaa" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو البريد..."
            style={{
              border: "none", background: "none", outline: "none",
              fontFamily: font, fontSize: 12, color: "#333",
              width: "100%", direction: "rtl",
            }}
          />
        </div>
      </div>

      {/* ── Status Tabs ── */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[
          { key: "الكل", color: "#1a3d14", count: totalUsers },
          { key: "نشط", color: "#2d6a21", count: activeUsers },
          { key: "محظور", color: "#b71c1c", count: bannedUsers },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveFilter(t.key)}
            style={{
              padding: "6px 16px", borderRadius: 20, cursor: "pointer",
              border: `1.5px solid ${activeFilter === t.key ? t.color : border}`,
              background: activeFilter === t.key ? t.color : cardBg,
              color: activeFilter === t.key ? "#fff" : t.color,
              fontSize: 11, fontWeight: 800, fontFamily: font,
              display: "flex", alignItems: "center", gap: 6,
              transition: "all .2s",
            }}
          >
            {t.key}
            <span style={{
              fontSize: 9, padding: "1px 6px", borderRadius: 10,
              background: activeFilter === t.key ? "rgba(255,255,255,0.25)" : `${t.color}15`,
              color: activeFilter === t.key ? "#fff" : t.color,
              fontWeight: 900,
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* ── Table ── */}
      <div style={{
        background: cardBg, borderRadius: 14, border: `1px solid ${border}`,
        overflow: "hidden",
      }}>
        <div style={{
          padding: "14px 20px", borderBottom: `1px solid ${border}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>قائمة المستخدمين</div>
            <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2 }}>
              عرض {filtered.length} من {users.length} مستخدم
            </div>
          </div>
        </div>

        {/* Cols */}
        <div className="usr-cols" style={{
          display: "grid",
          gridTemplateColumns: "1fr 120px 160px 90px 100px 100px 80px 100px",
          padding: "9px 20px", background: bg,
          borderBottom: `1px solid ${border}`,
          fontSize: 10, fontWeight: 700, color: "#8aaa80",
        }}>
          <span>المستخدم</span>
          <span>الهاتف</span>
          <span>البريد</span>
          <span>الحجوزات</span>
          <span>المصروف</span>
          <span>الانضمام</span>
          <span>الحالة</span>
          <span>إجراءات</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#8aaa80", fontSize: 13 }}>لا توجد نتائج</div>
        ) : (
          filtered.map((u, i) => (
            <div
              key={u.id}
              className="usr-row"
              onMouseEnter={() => setHoveredRow(u.id)}
              onMouseLeave={() => setHoveredRow(null)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 120px 160px 90px 100px 100px 80px 100px",
                padding: "13px 20px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "1px solid #f8fbf7" : "none",
                background: hoveredRow === u.id ? "#f8fcf6" : "transparent",
              }}
            >
              {/* User */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: u.status === "محظور"
                    ? "linear-gradient(135deg,#b71c1c,#e53935)"
                    : "linear-gradient(135deg,#2d6a21,#5cb844)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: "#fff", flexShrink: 0,
                }}>{u.name.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>{u.name}</div>
                  <div style={{ fontSize: 9, color: "#8aaa80" }}>#{u.id.toString().padStart(4, "0")}</div>
                </div>
              </div>

              <span style={{ fontSize: 11, color: "#5a8a50" }}>{u.phone}</span>
              <span style={{ fontSize: 11, color: "#8aaa80" }}>{u.email}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#1a3d14" }}>{u.reservations}</span>
              <span style={{ fontSize: 12, fontWeight: 800, color: green }}>{u.spent.toLocaleString()} د</span>
              <span style={{ fontSize: 11, color: "#8aaa80" }}>{u.joinDate}</span>

              {/* Status */}
              <span style={{
                fontSize: 10, fontWeight: 700,
                color: u.status === "نشط" ? "#2d6a21" : "#b71c1c",
                background: u.status === "نشط" ? "rgba(45,106,33,0.1)" : "rgba(183,28,28,0.1)",
                padding: "3px 9px", borderRadius: 6,
                borderRight: `3px solid ${u.status === "نشط" ? "#2d6a21" : "#b71c1c"}`,
                display: "inline-block",
              }}>{u.status}</span>

              {/* Actions */}
              <div style={{ display: "flex", gap: 5 }}>
                {/* View */}
                <button
                  className="usr-btn"
                  onClick={() => openProfile(u)}
                  title="عرض الملف"
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: "#e6f0fc", border: "1px solid #bbdefb",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <IconEye size={14} color="#1565c0" />
                </button>

                {/* Ban/Unban */}
                <button
                  className="usr-btn"
                  onClick={() => toggleBan(u.id)}
                  title={u.status === "نشط" ? "حظر المستخدم" : "رفع الحظر"}
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: u.status === "نشط" ? "#fff8e1" : "#edf7ea",
                    border: `1px solid ${u.status === "نشط" ? "#ffe082" : "#c8e6c0"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <IconBan size={14} color={u.status === "نشط" ? "#b8860b" : "#2d6a21"} />
                </button>

                {/* Delete */}
                <button
                  className="usr-btn"
                  onClick={() => openDelete(u)}
                  title="حذف المستخدم"
                  style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: "#fff5f5", border: "1px solid #ffcdd2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <IconTrash size={14} color="#b71c1c" />
                </button>
              </div>
            </div>
          ))
        )}

        {/* Pagination */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 20px", borderTop: `1px solid ${border}`, background: bg,
        }}>
          <div style={{ fontSize: 11, color: "#8aaa80", fontWeight: 600 }}>
            عرض 1-{filtered.length} من {users.length} مستخدم
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["›", "1", "2", "3", "‹"].map((p, i) => (
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

      {/* ════════════ MODAL — PROFILE ════════════ */}
      {showProfileModal && selectedUser && (
        <Modal onClose={() => setShowProfileModal(false)}>
          <div style={{
            background: cardBg, borderRadius: 16, width: "100%", maxWidth: 480,
            border: `1px solid ${border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            {/* Header */}
            <div style={{
              background: "linear-gradient(135deg,#0f2a0c,#2d6a21)",
              padding: "24px 20px", borderRadius: "16px 16px 0 0",
              display: "flex", justifyContent: "space-between", alignItems: "flex-start",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: selectedUser.status === "محظور"
                    ? "linear-gradient(135deg,#b71c1c,#e53935)"
                    : "linear-gradient(135deg,#5cb844,#2d6a21)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, fontWeight: 900, color: "#fff",
                  border: "3px solid rgba(255,255,255,0.3)",
                }}>{selectedUser.name.charAt(0)}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>{selectedUser.name}</div>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: "2px 10px", borderRadius: 20,
                    background: selectedUser.status === "نشط" ? "rgba(92,184,68,0.3)" : "rgba(183,28,28,0.4)",
                    color: "#fff", marginTop: 4, display: "inline-block",
                  }}>{selectedUser.status}</span>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}
              >
                <IconX size={16} color="#fff" />
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {/* Info Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                {[
                  { icon: <IconPhone size={14} />, label: "الهاتف", value: selectedUser.phone },
                  { icon: <IconMail size={14} />, label: "البريد", value: selectedUser.email },
                  { icon: <IconCalendar size={14} />, label: "تاريخ الانضمام", value: selectedUser.joinDate },
                  { icon: <IconCash size={14} />, label: "إجمالي المصروف", value: `${selectedUser.spent.toLocaleString()} د` },
                ].map((info, i) => (
                  <div key={i} style={{
                    background: bg, borderRadius: 10, padding: "10px 12px",
                    border: `1px solid ${border}`,
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <div style={{ color: green, flexShrink: 0 }}>{info.icon}</div>
                    <div>
                      <div style={{ fontSize: 9, color: "#8aaa80", fontWeight: 700 }}>{info.label}</div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#1a3d14", marginTop: 1 }}>{info.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div style={{
                display: "flex", gap: 10, marginBottom: 18,
                padding: "12px 16px", background: "#edf7ea",
                borderRadius: 10, border: "1px solid #c8e6c0",
              }}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: green }}>{selectedUser.reservations}</div>
                  <div style={{ fontSize: 10, color: "#5a8a50" }}>إجمالي الحجوزات</div>
                </div>
                <div style={{ width: 1, background: "#c8e6c0" }} />
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: green }}>{selectedUser.spent.toLocaleString()} د</div>
                  <div style={{ fontSize: 10, color: "#5a8a50" }}>إجمالي المصروف</div>
                </div>
              </div>

              {/* Recent Reservations */}
              <div style={{ fontSize: 12, fontWeight: 800, color: "#1a3d14", marginBottom: 10 }}>آخر الحجوزات</div>
              {(userReservations[selectedUser.id] || []).length === 0 ? (
                <div style={{ textAlign: "center", color: "#8aaa80", fontSize: 12, padding: 20 }}>لا توجد حجوزات مسجلة</div>
              ) : (
                (userReservations[selectedUser.id] || []).map((r, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "10px 12px", background: bg,
                    borderRadius: 9, border: `1px solid ${border}`,
                    marginBottom: 7,
                  }}>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#1a3d14" }}>{r.terrain}</div>
                      <div style={{ fontSize: 10, color: "#8aaa80" }}>{r.date} · {r.time}</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 800, color: green }}>{r.amount}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: r.sColor, background: r.sBg, padding: "2px 8px", borderRadius: 6, borderRight: `3px solid ${r.sColor}` }}>{r.status}</span>
                    </div>
                  </div>
                ))
              )}

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button
                  onClick={() => { toggleBan(selectedUser.id); setShowProfileModal(false); }}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 10, cursor: "pointer",
                    border: `1px solid ${selectedUser.status === "نشط" ? "#ffe082" : "#c8e6c0"}`,
                    background: selectedUser.status === "نشط" ? "#fff8e1" : "#edf7ea",
                    color: selectedUser.status === "نشط" ? "#b8860b" : green,
                    fontSize: 12, fontWeight: 800, fontFamily: font,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <IconBan size={14} />
                  {selectedUser.status === "نشط" ? "حظر المستخدم" : "رفع الحظر"}
                </button>
                <button
                  onClick={() => { setShowProfileModal(false); openDelete(selectedUser); }}
                  style={{
                    flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg,#b71c1c,#e53935)",
                    color: "#fff", fontSize: 12, fontWeight: 800, fontFamily: font,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}
                >
                  <IconTrash size={14} /> حذف المستخدم
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ════════════ MODAL — DELETE ════════════ */}
      {showDeleteModal && selectedUser && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div style={{
            background: cardBg, borderRadius: 16, padding: 28,
            width: "100%", maxWidth: 380,
            border: "1px solid #ffcdd2",
            boxShadow: "0 20px 60px rgba(183,28,28,0.15)",
            textAlign: "center",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: "50%",
              background: "#fff5f5", border: "2px solid #ffcdd2",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <IconTrash size={28} color="#b71c1c" />
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#1a3d14", marginBottom: 8 }}>هل أنت متأكد؟</div>
            <div style={{ fontSize: 12, color: "#8aaa80", lineHeight: 1.8, marginBottom: 24 }}>
              سيتم حذف <strong style={{ color: "#b71c1c" }}>{selectedUser.name}</strong> نهائياً
              <br />لا يمكن التراجع عن هذا الإجراء
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: `1px solid ${border}`, background: bg,
                  fontSize: 12, fontWeight: 700, color: "#8aaa80", fontFamily: font, cursor: "pointer",
                }}
              >إلغاء</button>
              <button
                onClick={deleteUser}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#b71c1c,#e53935)",
                  color: "#fff", fontSize: 12, fontWeight: 800, fontFamily: font,
                  cursor: "pointer", boxShadow: "0 4px 14px rgba(183,28,28,0.3)",
                }}
              >🗑️ نعم، احذف</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Clients;
