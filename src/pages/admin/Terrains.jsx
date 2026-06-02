import { useState } from "react";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconTools,
  IconCircleCheck,
  IconBuildingStadium,
  IconChartBar,
  IconX,
} from "@tabler/icons-react";

// ─── Initial Data ─────────────────────────────────────────────
const initialTerrains = [
  {
    id: 1,
    name: "ملعب A",
    type: "5 ضد 5",
    price: "200",
    capacity: "10",
    hours: "08:00 - 23:00",
    description: "ملعب احترافي بعشب اصطناعي الجيل الخامس مع إضاءة LED",
    status: "نشط",
    bookingsToday: 14,
    occupancy: 85,
    color: "linear-gradient(135deg,#1a3d14,#2d6a21)",
    image: null,
  },
  {
    id: 2,
    name: "ملعب B",
    type: "7 ضد 7",
    price: "250",
    capacity: "14",
    hours: "08:00 - 23:00",
    description: "ملعب متكامل بمرافق حديثة ومدرجات للمشجعين",
    status: "نشط",
    bookingsToday: 11,
    occupancy: 70,
    color: "linear-gradient(135deg,#0d2e5e,#1565c0)",
    image: null,
  },
  {
    id: 3,
    name: "ملعب C",
    type: "11 ضد 11",
    price: "300",
    capacity: "22",
    hours: "08:00 - 23:00",
    description: "ملعب كبير مناسب للمباريات الرسمية والبطولات",
    status: "صيانة",
    bookingsToday: 6,
    occupancy: 40,
    color: "linear-gradient(135deg,#3d1a00,#6d3a00)",
    image: null,
  },
];

const emptyForm = {
  name: "",
  type: "5 ضد 5",
  price: "",
  capacity: "",
  hours: "08:00 - 23:00",
  description: "",
  status: "نشط",
  color: "linear-gradient(135deg,#1a3d14,#2d6a21)",
  image: null,
};

// ─── Sub-components (OUTSIDE Terrains) ────────────────────────

const StatusBadge = ({ status }) => {
  const config = {
    "نشط":   { bg: "rgba(92,184,68,0.9)",   text: "● نشط" },
    "صيانة": { bg: "rgba(230,81,0,0.9)",    text: "🔧 صيانة" },
    "معطل":  { bg: "rgba(100,100,100,0.8)", text: "⛔ معطل" },
  };
  const c = config[status] || config["معطل"];
  return (
    <span style={{
      position: "absolute", top: 10, right: 10,
      padding: "4px 10px", borderRadius: 20,
      fontSize: 10, fontWeight: 800,
      background: c.bg, color: "#fff",
    }}>{c.text}</span>
  );
};

const FormField = ({ label, children }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: "#5a8a50", marginBottom: 5 }}>{label}</div>
    {children}
  </div>
);

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
    <div onClick={e => e.stopPropagation()}>
      {children}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────
const Terrains = () => {
  const [terrains, setTerrains] = useState(initialTerrains);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const font = "'Cairo', sans-serif";
  const cardBg = "#ffffff";
  const border = "#e8f0e8";
  const bg = "#f4f8f3";
  const green = "#2d6a21";

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 9,
    border: `1px solid ${border}`, background: bg,
    fontFamily: font, fontSize: 12, color: "#1a3d14",
    outline: "none", direction: "rtl",
  };

  // ─── Stats ───
  const totalTerrains = terrains.length;
  const activeTerrains = terrains.filter(t => t.status === "نشط").length;
  const maintenanceTerrains = terrains.filter(t => t.status === "صيانة").length;
  const avgOccupancy = terrains.length > 0
    ? Math.round(terrains.reduce((a, t) => a + t.occupancy, 0) / terrains.length)
    : 0;

  // ─── Handlers ───
  const openEdit = (terrain) => {
    setSelectedTerrain(terrain);
    setForm({ ...terrain });
    setShowEditModal(true);
  };

  const openDelete = (terrain) => {
    setSelectedTerrain(terrain);
    setShowDeleteModal(true);
  };

  const saveEdit = () => {
    setTerrains(prev => prev.map(t => t.id === selectedTerrain.id ? { ...t, ...form } : t));
    setShowEditModal(false);
  };

  const saveAdd = () => {
    const newTerrain = {
      ...form,
      id: Date.now(),
      bookingsToday: 0,
      occupancy: 0,
    };
    setTerrains(prev => [...prev, newTerrain]);
    setShowAddModal(false);
    setForm(emptyForm);
  };

  const deleteTerrain = () => {
    setTerrains(prev => prev.filter(t => t.id !== selectedTerrain.id));
    setShowDeleteModal(false);
  };

  const toggleMaintenance = (terrain) => {
    setTerrains(prev => prev.map(t =>
      t.id === terrain.id
        ? { ...t, status: t.status === "صيانة" ? "نشط" : "صيانة" }
        : t
    ));
  };

  // ─── Handle image upload ───
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(f => ({ ...f, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const closeModals = () => {
    setShowAddModal(false);
    setShowEditModal(false);
  };

  return (
    <div style={{ padding: 24, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .tc-card { transition: transform .2s, box-shadow .2s; }
        .tc-card:hover { transform: translateY(-3px); box-shadow: 0 10px 32px rgba(0,0,0,0.1); }
        .tc-btn-h { transition: opacity .2s; cursor: pointer; }
        .tc-btn-h:hover { opacity: .8; }
        .img-upload-area { border: 2px dashed #c8e6c0; border-radius: 10px; padding: 20px; text-align: center; cursor: pointer; background: #f8fbf7; transition: border-color .2s; }
        .img-upload-area:hover { border-color: #2d6a21; }
        @media (max-width: 900px) {
          .tg-grid { grid-template-columns: repeat(2,1fr) !important; }
          .st-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .tg-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a3d14" }}>الملاعب</h1>
          <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7ab870" }}>إدارة ومتابعة جميع الملاعب</p>
        </div>
        <button
          className="tc-btn-h"
          onClick={() => { setForm(emptyForm); setShowAddModal(true); }}
          style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg,#2d6a21,#5cb844)",
            color: "#fff", fontSize: 12, fontWeight: 800, fontFamily: font,
            boxShadow: "0 4px 14px rgba(45,106,33,0.3)",
          }}
        >
          <IconPlus size={15} />
          إضافة ملعب جديد
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="st-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 12, marginBottom: 20,
      }}>
        {[
          { label: "إجمالي الملاعب", value: totalTerrains, icon: <IconBuildingStadium size={18} />, borderColor: "#2d6a21", icoBg: "#edf7ea", icoColor: "#2d6a21" },
          { label: "ملاعب نشطة", value: activeTerrains, icon: <IconCircleCheck size={18} />, borderColor: "#5cb844", icoBg: "#edf7ea", icoColor: "#5cb844" },
          { label: "في الصيانة", value: maintenanceTerrains, icon: <IconTools size={18} />, borderColor: "#e65100", icoBg: "#fef0e6", icoColor: "#e65100" },
          { label: "متوسط الإشغال", value: `${avgOccupancy}%`, icon: <IconChartBar size={18} />, borderColor: "#6a1b9a", icoBg: "#f0e8fc", icoColor: "#6a1b9a" },
        ].map((s, i) => (
          <div key={i} style={{
            background: cardBg, borderRadius: 12,
            border: `1px solid ${border}`,
            borderRight: `4px solid ${s.borderColor}`,
            padding: "14px 16px",
            display: "flex", alignItems: "center", gap: 12,
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

      {/* ── Terrain Cards ── */}
      <div className="tg-grid" style={{
        display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16,
      }}>
        {terrains.map(t => (
          <div key={t.id} className="tc-card" style={{
            background: cardBg, borderRadius: 16,
            border: `1px solid ${border}`, overflow: "hidden",
          }}>
            {/* Image */}
            <div style={{
              height: 160, position: "relative",
              background: t.image ? "none" : t.color,
              display: "flex", alignItems: "center", justifyContent: "center",
              overflow: "hidden",
            }}>
              {t.image ? (
                <img
                  src={t.image}
                  alt={t.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <span style={{ fontSize: 52 }}>⚽</span>
              )}
              <StatusBadge status={t.status} />
            </div>

            {/* Body */}
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: "#1a3d14", marginBottom: 2 }}>{t.name}</div>
              <div style={{ fontSize: 11, color: "#8aaa80", fontWeight: 600, marginBottom: 12 }}>
                ملعب {t.type} · عشب اصطناعي
              </div>

              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "السعر / ساعة", value: `${t.price} د`, color: green },
                  { label: "الطاقة الاستيعابية", value: `${t.capacity} لاعبين` },
                  { label: "حجوزات اليوم", value: t.bookingsToday },
                  { label: "الإشغال", value: `${t.occupancy}%`, color: t.occupancy >= 70 ? green : "#e65100" },
                ].map((info, j) => (
                  <div key={j} style={{
                    background: bg, borderRadius: 8, padding: "8px 10px",
                    border: `1px solid ${border}`,
                  }}>
                    <div style={{ fontSize: 9, color: "#8aaa80", fontWeight: 700, marginBottom: 2 }}>{info.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: info.color || "#1a3d14" }}>{info.value}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  className="tc-btn-h"
                  onClick={() => openEdit(t)}
                  style={{
                    flex: 1, padding: "8px", borderRadius: 9,
                    background: "#edf7ea", color: green,
                    border: `1px solid #c8e6c0`,
                    fontSize: 11, fontWeight: 800, fontFamily: font,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  }}
                >
                  <IconEdit size={13} /> تعديل
                </button>

                <button
                  className="tc-btn-h"
                  onClick={() => toggleMaintenance(t)}
                  style={{
                    flex: 1, padding: "8px", borderRadius: 9,
                    background: t.status === "صيانة" ? "#edf7ea" : "#fff8e1",
                    color: t.status === "صيانة" ? green : "#b8860b",
                    border: `1px solid ${t.status === "صيانة" ? "#c8e6c0" : "#ffe082"}`,
                    fontSize: 11, fontWeight: 800, fontFamily: font,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  }}
                >
                  {t.status === "صيانة"
                    ? <><IconCircleCheck size={13} /> تفعيل</>
                    : <><IconTools size={13} /> صيانة</>
                  }
                </button>

                <button
                  className="tc-btn-h"
                  onClick={() => openDelete(t)}
                  style={{
                    width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                    background: "#fff5f5", color: "#b71c1c",
                    border: "1px solid #ffcdd2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <IconTrash size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ════════════ MODAL ADD / EDIT ════════════ */}
      {(showAddModal || showEditModal) && (
        <Modal onClose={closeModals}>
          <div style={{
            background: cardBg, borderRadius: 16, padding: 24,
            width: "100%", maxWidth: 460,
            border: `1px solid ${border}`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            maxHeight: "90vh", overflowY: "auto",
          }}>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 900, color: "#1a3d14" }}>
                  {showAddModal ? "إضافة ملعب جديد" : `تعديل ${selectedTerrain?.name}`}
                </div>
                <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2 }}>
                  {showAddModal ? "أدخل معلومات الملعب الجديد" : "تعديل معلومات الملعب"}
                </div>
              </div>
              <button
                onClick={closeModals}
                style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: 6, cursor: "pointer" }}
              >
                <IconX size={16} color="#8aaa80" />
              </button>
            </div>

            {/* Toggle Status */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", background: bg, borderRadius: 9,
              border: `1px solid ${border}`, marginBottom: 16,
            }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>
                حالة الملعب — {form.status === "نشط" ? "نشط ✅" : "معطل ⛔"}
              </span>
              <div
                onClick={() => setForm(f => ({ ...f, status: f.status === "نشط" ? "معطل" : "نشط" }))}
                style={{
                  width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                  background: form.status === "نشط" ? green : "#ccc",
                  position: "relative", transition: "background .2s",
                }}
              >
                <div style={{
                  position: "absolute", top: 3,
                  left: form.status === "نشط" ? 20 : 3,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#fff", transition: "left .2s",
                }} />
              </div>
            </div>

            {/* Image Upload */}
            <FormField label="صورة الملعب">
              <label className="img-upload-area" style={{ display: "block" }}>
                {form.image ? (
                  <div style={{ position: "relative" }}>
                    <img
                      src={form.image}
                      alt="preview"
                      style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8 }}
                    />
                    <button
                      onClick={(e) => { e.preventDefault(); setForm(f => ({ ...f, image: null })); }}
                      style={{
                        position: "absolute", top: 6, left: 6,
                        width: 24, height: 24, borderRadius: "50%",
                        background: "rgba(183,28,28,0.9)", border: "none",
                        color: "#fff", cursor: "pointer", fontSize: 12,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >✕</button>
                  </div>
                ) : (
                  <div style={{ padding: "16px 0" }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>📷</div>
                    <div style={{ fontSize: 12, color: "#8aaa80", fontWeight: 600 }}>انقر لرفع صورة الملعب</div>
                    <div style={{ fontSize: 10, color: "#aaa", marginTop: 3 }}>JPG, PNG — حد أقصى 5MB</div>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </FormField>

            {/* Name */}
            <FormField label="اسم الملعب">
              <input
                style={inputStyle}
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="مثال: ملعب D"
              />
            </FormField>

            {/* Type + Price */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <FormField label="نوع الملعب">
                <select
                  style={inputStyle}
                  value={form.type}
                  onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                >
                  <option>5 ضد 5</option>
                  <option>7 ضد 7</option>
                  <option>11 ضد 11</option>
                </select>
              </FormField>
              <FormField label="السعر / ساعة (درهم)">
                <input
                  style={inputStyle}
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="200"
                />
              </FormField>
            </div>

            {/* Capacity + Hours */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <FormField label="الطاقة الاستيعابية">
                <input
                  style={inputStyle}
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                  placeholder="10"
                />
              </FormField>
              <FormField label="ساعات العمل">
                <input
                  style={inputStyle}
                  value={form.hours}
                  onChange={e => setForm(f => ({ ...f, hours: e.target.value }))}
                  placeholder="08:00 - 23:00"
                />
              </FormField>
            </div>

            {/* Description */}
            <FormField label="الوصف">
              <textarea
                style={{ ...inputStyle, resize: "none", height: 70 }}
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="وصف مختصر للملعب..."
              />
            </FormField>

            {/* Actions */}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button
                onClick={closeModals}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: `1px solid ${border}`, background: bg,
                  fontSize: 12, fontWeight: 700, color: "#8aaa80",
                  fontFamily: font, cursor: "pointer",
                }}
              >إلغاء</button>
              <button
                onClick={showAddModal ? saveAdd : saveEdit}
                style={{
                  flex: 2, padding: "10px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#2d6a21,#5cb844)",
                  color: "#fff", fontSize: 12, fontWeight: 800, fontFamily: font,
                  cursor: "pointer", boxShadow: "0 4px 14px rgba(45,106,33,0.3)",
                }}
              >
                {showAddModal ? "➕ إضافة الملعب" : "💾 حفظ التعديلات"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ════════════ MODAL DELETE ════════════ */}
      {showDeleteModal && (
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

            <div style={{ fontSize: 17, fontWeight: 900, color: "#1a3d14", marginBottom: 8 }}>
              هل أنت متأكد؟
            </div>
            <div style={{ fontSize: 12, color: "#8aaa80", lineHeight: 1.8, marginBottom: 24 }}>
              سيتم حذف <strong style={{ color: "#b71c1c" }}>{selectedTerrain?.name}</strong> نهائياً
              <br />لا يمكن التراجع عن هذا الإجراء
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10,
                  border: `1px solid ${border}`, background: bg,
                  fontSize: 12, fontWeight: 700, color: "#8aaa80",
                  fontFamily: font, cursor: "pointer",
                }}
              >إلغاء</button>
              <button
                onClick={deleteTerrain}
                style={{
                  flex: 1, padding: "10px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#b71c1c,#e53935)",
                  color: "#fff", fontSize: 12, fontWeight: 800,
                  fontFamily: font, cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(183,28,28,0.3)",
                }}
              >🗑️ نعم، احذف</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Terrains;
