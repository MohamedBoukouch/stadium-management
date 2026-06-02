import { useState } from "react";
import {
  IconPlus,
  IconEdit,
  IconEye,
  IconCircleCheck,
  IconTools,
  IconChartBar,
  IconBuildingStadium,
  IconSearch,
  IconChevronDown,
  IconCalendarEvent,
  IconTag,
  IconUsers,
  IconX,
  IconTrash,
} from "@tabler/icons-react";

// ─── Terrain images (SVG illustrations) ───────────────────────
const TerrainImg = ({ type, status }) => {

  
  const isIndoor = type === "7 ضد 7";
  const bgColor = isIndoor ? "#1e3a5f" : status === "في الصيانة" ? "#fef3c7" : "#d1fae5";

  return (
    <svg viewBox="0 0 400 200" width="100%" height="180" style={{ display: "block" }}>
      {/* Sky / Background */}
      <rect width="400" height="200" fill={bgColor} />

      {status === "في الصيانة" ? (
        <>
          {/* Sandy field */}
          <rect x="0" y="80" width="400" height="120" fill="#fbbf24" opacity="0.3" />
          <rect x="20" y="90" width="360" height="100" rx="4" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8,4" />
          {/* Cone */}
          <polygon points="200,130 220,170 180,170" fill="#f97316" />
          <rect x="175" y="168" width="50" height="8" rx="2" fill="#f97316" />
          <line x1="185" y1="145" x2="215" y2="145" stroke="#fff" strokeWidth="3" />
          <line x1="182" y1="155" x2="218" y2="155" stroke="#fff" strokeWidth="3" />
          {/* Warning stripes */}
          {[0,1,2,3,4,5].map(i => (
            <rect key={i} x={i*70} y="85" width="35" height="8" fill="#f59e0b" opacity="0.6" />
          ))}
          {/* Goal */}
          <rect x="30" y="100" width="60" height="35" rx="2" fill="none" stroke="#d1d5db" strokeWidth="2" />
          <rect x="310" y="100" width="60" height="35" rx="2" fill="none" stroke="#d1d5db" strokeWidth="2" />
        </>
      ) : isIndoor ? (
        <>
          {/* Indoor stadium */}
          <rect x="0" y="60" width="400" height="140" fill="#1e40af" opacity="0.4" />
          <rect x="20" y="70" width="360" height="120" rx="4" fill="#1d4ed8" opacity="0.3" />
          {/* Field lines */}
          <rect x="30" y="80" width="340" height="100" rx="3" fill="none" stroke="#60a5fa" strokeWidth="2" />
          <line x1="200" y1="80" x2="200" y2="180" stroke="#60a5fa" strokeWidth="1.5" />
          <circle cx="200" cy="130" r="20" fill="none" stroke="#60a5fa" strokeWidth="1.5" />
          <rect x="30" y="100" width="50" height="60" rx="2" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
          <rect x="320" y="100" width="50" height="60" rx="2" fill="none" stroke="#93c5fd" strokeWidth="1.5" />
          {/* Stadium lights */}
          {[60, 200, 340].map(x => (
            <g key={x}>
              <line x1={x} y1="20" x2={x} y2="70" stroke="#fbbf24" strokeWidth="2" />
              <circle cx={x} cy="15" r="6" fill="#fef08a" />
            </g>
          ))}
          {/* Goals */}
          <rect x="22" y="108" width="8" height="44" rx="1" fill="#93c5fd" />
          <rect x="30" y="108" width="1" height="44" fill="#93c5fd" />
          <rect x="370" y="108" width="8" height="44" rx="1" fill="#93c5fd" />
          <rect x="369" y="108" width="1" height="44" fill="#93c5fd" />
        </>
      ) : (
        <>
          {/* Outdoor field */}
          <rect x="0" y="50" width="400" height="150" fill="#16a34a" opacity="0.2" />
          {/* Grass stripes */}
          {[0,1,2,3,4].map(i => (
            <rect key={i} x={i * 80} y="50" width="40" height="150" fill="#15803d" opacity="0.15" />
          ))}
          {/* Field */}
          <rect x="20" y="60" width="360" height="120" rx="4" fill="none" stroke="#4ade80" strokeWidth="2" />
          <line x1="200" y1="60" x2="200" y2="180" stroke="#4ade80" strokeWidth="1.5" />
          <circle cx="200" cy="120" r="22" fill="none" stroke="#4ade80" strokeWidth="1.5" />
          <circle cx="200" cy="120" r="2" fill="#4ade80" />
          {/* Goal areas */}
          <rect x="20" y="88" width="45" height="64" rx="2" fill="none" stroke="#86efac" strokeWidth="1.5" />
          <rect x="335" y="88" width="45" height="64" rx="2" fill="none" stroke="#86efac" strokeWidth="1.5" />
          {/* Goals */}
          <rect x="14" y="100" width="6" height="40" fill="#e5e7eb" rx="1" />
          <rect x="20" y="100" width="1" height="40" fill="#e5e7eb" />
          <rect x="380" y="100" width="6" height="40" fill="#e5e7eb" rx="1" />
          <rect x="379" y="100" width="1" height="40" fill="#e5e7eb" />
          {/* Corner flags */}
          {[[20,60],[380,60],[20,180],[380,180]].map(([x,y],i) => (
            <g key={i}>
              <line x1={x} y1={y} x2={x} y2={y-14} stroke="#fbbf24" strokeWidth="1.5" />
              <polygon points={`${x},${y-14} ${x+8},${y-10} ${x},${y-6}`} fill="#fbbf24" />
            </g>
          ))}
          {/* Trees */}
          {[0,370].map(x => (
            <g key={x}>
              <rect x={x+10} y="30" width="4" height="20" fill="#92400e" />
              <circle cx={x+12} cy="25" r="12" fill="#15803d" opacity="0.7" />
            </g>
          ))}
        </>
      )}
    </svg>
  );
};

// ─── Sub Components ────────────────────────────────────────────
const Modal = ({ children, onClose }) => (
  <div onClick={onClose} style={{
    position: "fixed", inset: 0, zIndex: 200,
    background: "rgba(0,0,0,0.5)",
    display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
  }}>
    <div onClick={e => e.stopPropagation()}>{children}</div>
  </div>
);

const FormField = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 5 }}>{label}</div>
    {children}
  </div>
);

// ─── ModalForm (OUTSIDE Terrains) ────────────────────────────
const ModalForm = ({ isAdd, form, setForm, selectedTerrain, saveAdd, saveEdit, setShowAddModal, setShowEditModal, inputStyle, font }) => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: 24,
    width: "100%", maxWidth: 460,
    border: "1px solid #e5e7eb",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
    maxHeight: "90vh", overflowY: "auto",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <div style={{ fontSize: 16, fontWeight: 900, color: "#111827" }}>
        {isAdd ? "إضافة ملعب جديد" : `تعديل ${selectedTerrain?.name}`}
      </div>
      <button onClick={() => isAdd ? setShowAddModal(false) : setShowEditModal(false)}
        style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: 6, cursor: "pointer" }}>
        <IconX size={16} color="#6b7280" />
      </button>
    </div>

    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: "#f9fafb", borderRadius: 9, border: "1px solid #e5e7eb", marginBottom: 16 }}>
      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>
        حالة الملعب — {form.status === "نشط" ? "نشط ✅" : "غير نشط ⛔"}
      </span>
      <div onClick={() => setForm(f => ({ ...f, status: f.status === "نشط" ? "غير نشط" : "نشط" }))}
        style={{ width: 42, height: 24, borderRadius: 12, cursor: "pointer", background: form.status === "نشط" ? "#166534" : "#d1d5db", position: "relative", transition: "background .2s" }}>
        <div style={{ position: "absolute", top: 3, left: form.status === "نشط" ? 20 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left .2s" }} />
      </div>
    </div>

    <FormField label="اسم الملعب">
      <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="مثال: ملعب D" />
    </FormField>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <FormField label="نوع الملعب">
        <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          <option>5 ضد 5</option><option>7 ضد 7</option><option>11 ضد 11</option>
        </select>
      </FormField>
      <FormField label="السعر / ساعة (درهم)">
        <input style={inputStyle} value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="200" />
      </FormField>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      <FormField label="الطاقة الاستيعابية">
        <input style={inputStyle} value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} placeholder="10" />
      </FormField>
      <FormField label="ساعات العمل">
        <input style={inputStyle} value={form.hours} onChange={e => setForm(f => ({ ...f, hours: e.target.value }))} placeholder="08:00 - 23:00" />
      </FormField>
    </div>
    <FormField label="الوصف">
      <textarea style={{ ...inputStyle, resize: "none", height: 70 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="وصف مختصر للملعب..." />
    </FormField>

    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <button onClick={() => isAdd ? setShowAddModal(false) : setShowEditModal(false)}
        style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 13, fontWeight: 700, color: "#6b7280", fontFamily: font, cursor: "pointer" }}>
        إلغاء
      </button>
      <button onClick={isAdd ? saveAdd : saveEdit}
        style={{ flex: 2, padding: "10px", borderRadius: 10, border: "none", background: "#166534", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: font, cursor: "pointer" }}>
        {isAdd ? "➕ إضافة الملعب" : "💾 حفظ التعديلات"}
      </button>
    </div>
  </div>
);

// ─── Initial Data ─────────────────────────────────────────────
const initialTerrains = [
  { id: 1, name: "ملعب A", type: "5 ضد 5", price: "200", capacity: "10", hours: "08:00 - 23:00", description: "ملعب احترافي بعشب اصطناعي الجيل الخامس مع إضاءة LED", status: "في الصيانة", bookingsToday: 14, occupancy: 35 },
  { id: 2, name: "ملعب B", type: "7 ضد 7", price: "250", capacity: "14", hours: "08:00 - 23:00", description: "ملعب متكامل بمرافق حديثة ومدرجات للمشجعين", status: "نشط", bookingsToday: 11, occupancy: 68 },
  { id: 3, name: "ملعب C", type: "11 ضد 11", price: "300", capacity: "22", hours: "08:00 - 23:00", description: "ملعب كبير مناسب للمباريات الرسمية والبطولات", status: "نشط", bookingsToday: 6, occupancy: 70 },
];

const emptyForm = { name: "", type: "5 ضد 5", price: "", capacity: "", hours: "08:00 - 23:00", description: "", status: "نشط" };

const Terrains = () => {
  const [terrains, setTerrains] = useState(initialTerrains);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("جميع الحالات");
  const [filterType, setFilterType] = useState("جميع الأنواع");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const font = "'Cairo', sans-serif";
  

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: "1px solid #e5e7eb", background: "#f9fafb",
    fontFamily: font, fontSize: 13, color: "#111827", outline: "none",
  };

  const filtered = terrains.filter(t => {
    const matchSearch = !search || t.name.includes(search) || t.type.includes(search);
    const matchStatus = filterStatus === "جميع الحالات" || t.status === filterStatus;
    const matchType = filterType === "جميع الأنواع" || t.type === filterType;
    return matchSearch && matchStatus && matchType;
  });

  const totalTerrains = terrains.length;
  const activeTerrains = terrains.filter(t => t.status === "نشط").length;
  const maintenanceTerrains = terrains.filter(t => t.status === "في الصيانة").length;
  const avgOccupancy = Math.round(terrains.reduce((a, t) => a + t.occupancy, 0) / terrains.length);

  const openEdit = (t) => { setSelectedTerrain(t); setForm({ ...t }); setShowEditModal(true); };
  const openDelete = (t) => { setSelectedTerrain(t); setShowDeleteModal(true); };
  const saveEdit = () => { setTerrains(prev => prev.map(t => t.id === selectedTerrain.id ? { ...t, ...form } : t)); setShowEditModal(false); };
  const saveAdd = () => {
    setTerrains(prev => [...prev, { ...form, id: Date.now(), bookingsToday: 0, occupancy: 0 }]);
    setShowAddModal(false); setForm(emptyForm);
  };
  const deleteTerrain = () => { setTerrains(prev => prev.filter(t => t.id !== selectedTerrain.id)); setShowDeleteModal(false); };
  const toggleMaintenance = (t) => setTerrains(prev => prev.map(x => x.id === t.id ? { ...x, status: x.status === "في الصيانة" ? "نشط" : "في الصيانة" } : x));

  const statusBadge = (status) => {
    const cfg = {
      "نشط": { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0" },
      "في الصيانة": { color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
      "غير نشط": { color: "#6b7280", bg: "#f3f4f6", border: "#e5e7eb" },
    };
    const c = cfg[status] || cfg["غير نشط"];
    return (
      <span style={{
        fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20,
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
        display: "inline-flex", alignItems: "center", gap: 4,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: c.color, display: "inline-block" }} />
        {status}
      </span>
    );
  };

  const stats = [
    { label: "إجمالي الملاعب", value: totalTerrains, icon: <IconBuildingStadium size={22} />, iconBg: "#dcfce7", iconColor: "#16a34a", borderColor: "#16a34a" },
    { label: "ملاعب نشطة", value: activeTerrains, icon: <IconCircleCheck size={22} />, iconBg: "#dcfce7", iconColor: "#16a34a", borderColor: "#16a34a" },
    { label: "في الصيانة", value: maintenanceTerrains, icon: <IconTools size={22} />, iconBg: "#fef3c7", iconColor: "#d97706", borderColor: "#d97706" },
    { label: "متوسط الإشغال", value: `${avgOccupancy}%`, icon: <IconChartBar size={22} />, iconBg: "#dbeafe", iconColor: "#2563eb", borderColor: "#2563eb" },
  ];

  return (
    <div style={{ padding: "20px 24px", fontFamily: font, direction: "rtl", background: "#f9fafb", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; }
        .tc { transition: transform .2s, box-shadow .2s; }
        .tc:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
        .sc-t { transition: transform .2s; }
        .sc-t:hover { transform: translateY(-2px); }
        .act-btn { transition: all .15s; cursor: pointer; }
        .act-btn:hover { opacity: .8; }
        .dd-opt { transition: background .1s; cursor: pointer; }
        .dd-opt:hover { background: #f0fdf4 !important; }
      `}</style>

      {/* ── Page Title ── */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#111827" }}>الملاعب</div>
          <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>إدارة ومتابعة جميع الملاعب</div>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowAddModal(true); }} className="act-btn" style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 10, border: "none",
          background: "#166534", color: "#fff",
          fontSize: 13, fontWeight: 800, fontFamily: font,
          boxShadow: "0 2px 8px rgba(22,101,52,0.3)",
        }}>
          <IconPlus size={16} /> إضافة ملعب جديد
        </button>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
        {stats.map((s, i) => (
          <div key={i} className="sc-t" style={{
            background: "#fff", borderRadius: 12,
            border: "1px solid #e5e7eb",
            borderBottom: `3px solid ${s.borderColor}`,
            padding: "16px",
            display: "flex", alignItems: "center", gap: 14,
          }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: s.iconBg, color: s.iconColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.iconColor, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 3 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb", padding: "14px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px" }}>
          <IconSearch size={15} color="#9ca3af" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="البحث عن ملعب..."
            style={{ border: "none", background: "none", outline: "none", fontFamily: font, fontSize: 13, color: "#374151", width: "100%", direction: "rtl" }} />
        </div>

        {/* Filter Status */}
        <div style={{ position: "relative" }}>
          <div onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: font, minWidth: 150 }}>
            <IconChevronDown size={14} color="#9ca3af" style={{ marginLeft: "auto" }} />
            <span style={{ flex: 1 }}>{filterStatus}</span>
          </div>
          {openDropdown === "status" && (
            <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, minWidth: 160 }}>
              {["جميع الحالات", "نشط", "في الصيانة", "غير نشط"].map((opt, i, arr) => (
                <div key={opt} className="dd-opt" onClick={() => { setFilterStatus(opt); setOpenDropdown(null); }}
                  style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: filterStatus === opt ? "#16a34a" : "#374151", background: filterStatus === opt ? "#f0fdf4" : "transparent", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Type */}
        <div style={{ position: "relative" }}>
          <div onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 8, cursor: "pointer", border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 13, fontWeight: 600, color: "#374151", fontFamily: font, minWidth: 150 }}>
            <IconChevronDown size={14} color="#9ca3af" style={{ marginLeft: "auto" }} />
            <span style={{ flex: 1 }}>{filterType}</span>
          </div>
          {openDropdown === "type" && (
            <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", zIndex: 50, minWidth: 160 }}>
              {["جميع الأنواع", "5 ضد 5", "7 ضد 7", "11 ضد 11"].map((opt, i, arr) => (
                <div key={opt} className="dd-opt" onClick={() => { setFilterType(opt); setOpenDropdown(null); }}
                  style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: filterType === opt ? "#16a34a" : "#374151", background: filterType === opt ? "#f0fdf4" : "transparent", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Terrain Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
        {filtered.map(t => (
          <div key={t.id} className="tc" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>

            {/* Image */}
            <div style={{ position: "relative" }}>
              <TerrainImg type={t.type} status={t.status} />
              <div style={{ position: "absolute", top: 10, right: 10 }}>
                {statusBadge(t.status)}
              </div>
            </div>

            {/* Body */}
            <div style={{ padding: "16px" }}>
              <div style={{ fontSize: 18, fontWeight: 900, color: "#111827", textAlign: "center", marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 13, color: "#6b7280", textAlign: "center", marginBottom: 16 }}>{t.type}</div>

              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 16 }}>
                {[
                  { icon: <IconTag size={16} />, label: "السعر / ساعة", value: `${t.price} د` },
                  { icon: <IconChartBar size={16} />, label: "الإشغال اليوم", value: `${t.occupancy}%`, color: t.occupancy >= 60 ? "#16a34a" : "#d97706" },
                  { icon: <IconCalendarEvent size={16} />, label: "حجوزات اليوم", value: t.bookingsToday },
                  { icon: <IconUsers size={16} />, label: "السعة", value: `${t.capacity} لاعبين` },
                ].map((info, j) => (
                  <div key={j} style={{ textAlign: "center" }}>
                    <div style={{ color: "#9ca3af", marginBottom: 2, display: "flex", justifyContent: "center" }}>{info.icon}</div>
                    <div style={{ fontSize: 9, color: "#9ca3af", marginBottom: 3 }}>{info.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: info.color || "#111827" }}>{info.value}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button className="act-btn" onClick={() => openEdit(t)} style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "9px", borderRadius: 9,
                  border: "1px solid #e5e7eb", background: "#f9fafb",
                  fontSize: 13, fontWeight: 700, color: "#374151", fontFamily: font,
                }}>
                  <IconEdit size={15} /> تعديل
                </button>
                <button className="act-btn" style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "9px", borderRadius: 9, border: "none",
                  background: "#166534", color: "#fff",
                  fontSize: 13, fontWeight: 700, fontFamily: font,
                }}>
                  <IconEye size={15} /> عرض
                </button>
              </div>

              {/* Maintenance toggle */}
              <button className="act-btn" onClick={() => toggleMaintenance(t)} style={{
                width: "100%", marginTop: 8, padding: "7px",
                borderRadius: 9, border: `1px solid ${t.status === "في الصيانة" ? "#bbf7d0" : "#fde68a"}`,
                background: t.status === "في الصيانة" ? "#f0fdf4" : "#fef9c3",
                color: t.status === "في الصيانة" ? "#16a34a" : "#d97706",
                fontSize: 12, fontWeight: 700, fontFamily: font,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                {t.status === "في الصيانة" ? <><IconCircleCheck size={14} /> تفعيل الملعب</> : <><IconTools size={14} /> وضع في الصيانة</>}
              </button>

              {/* Delete */}
              <button className="act-btn" onClick={() => openDelete(t)} style={{
                width: "100%", marginTop: 6, padding: "7px",
                borderRadius: 9, border: "1px solid #fecaca",
                background: "#fff5f5", color: "#dc2626",
                fontSize: 12, fontWeight: 700, fontFamily: font,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <IconTrash size={14} /> حذف الملعب
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ════ MODAL ADD / EDIT ════ */}
      {showAddModal && <Modal onClose={() => setShowAddModal(false)}><ModalForm isAdd={true} form={form} setForm={setForm} selectedTerrain={selectedTerrain} saveAdd={saveAdd} saveEdit={saveEdit} setShowAddModal={setShowAddModal} setShowEditModal={setShowEditModal} inputStyle={inputStyle} font={font} /></Modal>}
      {showEditModal && <Modal onClose={() => setShowEditModal(false)}><ModalForm isAdd={false} form={form} setForm={setForm} selectedTerrain={selectedTerrain} saveAdd={saveAdd} saveEdit={saveEdit} setShowAddModal={setShowAddModal} setShowEditModal={setShowEditModal} inputStyle={inputStyle} font={font} /></Modal>}

      {/* ════ MODAL DELETE ════ */}
      {showDeleteModal && (
        <Modal onClose={() => setShowDeleteModal(false)}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 380, border: "1px solid #fecaca", boxShadow: "0 20px 60px rgba(220,38,38,0.15)", textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#fee2e2", border: "2px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <IconTrash size={28} color="#dc2626" />
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: "#111827", marginBottom: 8 }}>هل أنت متأكد؟</div>
            <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.8, marginBottom: 24 }}>
              سيتم حذف <strong style={{ color: "#dc2626" }}>{selectedTerrain?.name}</strong> نهائياً
              <br />لا يمكن التراجع عن هذا الإجراء
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#f9fafb", fontSize: 13, fontWeight: 700, color: "#6b7280", fontFamily: font, cursor: "pointer" }}>إلغاء</button>
              <button onClick={deleteTerrain} style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#dc2626", color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: font, cursor: "pointer" }}>🗑️ نعم، احذف</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Terrains;
