import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { terrains, generateSlots } from "../../api/terrains";

const days = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const months = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function todayLabel() {
  const d = new Date();
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
}

const STEPS = ["اختر الملعب", "اختر الوقت", "بياناتك", "تأكيد"];

function generateReservationCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

function generateReservationId() {
  return 'RES-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
}

function formatTimeWithPeriod(hour, minute = 0) {
  const period = hour >= 12 ? "م" : "ص";
  const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
  const displayMinute = minute.toString().padStart(2, '0');
  return `${displayHour.toString().padStart(2, '0')}:${displayMinute} ${period}`;
}

export default function Reservation() {
  const location = useLocation();
  const navigate = useNavigate();

  const initTerrain = location.state?.terrainId || terrains[0].id;
  const initSlot = location.state?.slotId || null;

  const [step, setStep] = useState(initSlot ? 2 : 0);
  const [selectedTerrain, setSelectedTerrain] = useState(initTerrain);
  const [selectedSlot, setSelectedSlot] = useState(initSlot);
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [reservationCode, setReservationCode] = useState("");
  const [reservationId, setReservationId] = useState("");

  const terrain = terrains.find((t) => t.id === selectedTerrain);
  const slots = generateSlots(selectedTerrain);
  const slot = slots.find((s) => s.id === selectedSlot);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "الاسم مطلوب";
    if (!form.phone.trim() || !/^[0-9+]{9,14}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "رقم هاتف غير صحيح";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = "البريد الإلكتروني غير صحيح";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setReservationCode(generateReservationCode());
    setReservationId(generateReservationId());
    setSubmitted(true);
  };

  const generateQRData = () => {
    const qrData = JSON.stringify({
      id: reservationId,
      code: reservationCode,
      name: form.name,
      terrain: terrain?.name,
      slot: slot?.label,
      date: todayLabel(),
      phone: form.phone,
    });
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  };

  const inputStyle = (err) => ({
    width: "100%",
    padding: "14px 18px",
    borderRadius: 10,
    border: `1.5px solid ${err ? "#e57373" : "#c8e6c0"}`,
    background: err ? "#fff5f5" : "#fff",
    fontSize: 15,
    fontFamily: "'Cairo', sans-serif",
    color: "#1a3d14",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
    direction: "rtl",
  });

  if (submitted) {
    return (
      <div style={{ background: "#f8fbf7", minHeight: "100vh" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');`}</style>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "120px 24px 60px", direction: "rtl" }}>
          <div style={{ background: "#fff", border: "1px solid #c8e6c0", borderRadius: 24, padding: "60px 48px", textAlign: "center", maxWidth: 520, width: "100%", boxShadow: "0 8px 40px rgba(45,106,33,0.1)" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, #2d6a21, #5cb844)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, margin: "0 auto 24px", boxShadow: "0 8px 24px rgba(45,106,33,0.3)", color: "#fff" }}>✓</div>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 12 }}>تم تأكيد حجزك!</h2>
            <p style={{ color: "#5a8a50", fontFamily: "'Cairo', sans-serif", fontSize: 16, lineHeight: 1.8, marginBottom: 32 }}>
              مرحباً {form.name}، تم حجز <strong style={{ color: "#2d6a21" }}>{terrain?.name}</strong> بنجاح للساعة <strong style={{ color: "#2d6a21" }}>{slot?.label}</strong> بتاريخ {todayLabel()}
            </p>
            <div style={{ background: "#f0f7ee", border: "1.5px solid #c8e6c0", borderRadius: 16, padding: "28px 24px", marginBottom: 32, textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", marginBottom: 16 }}>رمز تأكيد الحجز</div>
              <div style={{ marginBottom: 20 }}>
                <img src={generateQRData()} alt="QR Code" style={{ width: 180, height: 180, borderRadius: 12, border: "2px solid #c8e6c0", background: "#fff", padding: 8 }} />
                <div style={{ fontSize: 11, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", marginTop: 8 }}>اعرض هذا الرمز عند وصولك للملعب</div>
              </div>
              <div style={{ background: "#fff", border: "2px dashed #5cb844", borderRadius: 12, padding: "16px 24px", display: "inline-block" }}>
                <div style={{ fontSize: 12, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", marginBottom: 4 }}>كود التأكيد</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", letterSpacing: 8, direction: "ltr" }}>{reservationCode}</div>
              </div>
              <div style={{ fontSize: 11, color: "#a0c090", fontFamily: "'Cairo', sans-serif", marginTop: 12 }}>رقم الحجز: {reservationId}</div>
            </div>
            <div style={{ background: "#f0f7ee", border: "1px solid #c8e6c0", borderRadius: 12, padding: "16px 20px", marginBottom: 32, textAlign: "right" }}>
              {[
                { label: "الملعب", value: terrain?.name },
                { label: "الوقت", value: slot?.label },
                { label: "السعر", value: `${terrain?.price} درهم` },
                { label: "الهاتف", value: form.phone },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #ddf0d8" }}>
                  <span style={{ color: "#5a8a50", fontFamily: "'Cairo', sans-serif", fontSize: 14 }}>{label}</span>
                  <span style={{ color: "#1a3d14", fontFamily: "'Cairo', sans-serif", fontSize: 14, fontWeight: 700 }}>{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/")} style={{ background: "linear-gradient(135deg, #2d6a21, #5cb844)", color: "#fff", border: "none", padding: "14px 40px", borderRadius: 50, fontSize: 16, fontWeight: 800, fontFamily: "'Cairo', sans-serif", cursor: "pointer", boxShadow: "0 6px 20px rgba(45,106,33,0.3)" }}>العودة للرئيسية</button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#f8fbf7", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');

        .res-layout { display: grid; grid-template-columns: 1fr 340px; gap: 28px; align-items: start; }

        @media (max-width: 960px) {
          .res-layout { grid-template-columns: 1fr !important; }
          .res-summary { order: -1; }
          .res-container { padding: 100px 24px 60px !important; }
        }

        @media (max-width: 600px) {
          .res-container { padding: 90px 0 48px !important; }
          .step-label { display: none !important; }

          /* ========== STEP 0: TERRAIN CHOICE - SWIPE CARDS 85vw ========== */
          .terrains-picker { 
            display: flex !important; 
            flex-direction: row !important; 
            overflow-x: auto !important; 
            gap: 12px !important;
            padding: 0 16px 12px 16px !important;
            scroll-snap-type: x mandatory !important;
            -webkit-overflow-scrolling: touch !important;
            scroll-padding-left: 16px;
            scroll-padding-right: 16px;
          }
          .terrains-picker::-webkit-scrollbar { display: none; }
          .terrain-card { 
            min-width: 85vw !important; 
            max-width: 85vw !important;
            flex-shrink: 0 !important; 
            scroll-snap-align: center !important;
          }
          .terrain-card img { height: 200px !important; }

          /* ========== STEP 1: TIME SLOTS - FULL WIDTH, 2 COLS, AM/PM ========== */
          .slots-grid-res { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 10px !important;
            padding: 0 16px !important;
          }
          .slot-btn {
            padding: 18px 8px !important;
            font-size: 15px !important;
            min-height: 64px !important;
          }

          /* ========== STEP 2: FORM - FULL WIDTH ========== */
          .form-row { flex-direction: column !important; gap: 18px !important; }
          .form-row > div { width: 100% !important; }

          /* ========== STEP 3: CONFIRM - FULL WIDTH CARDS ========== */
          .confirm-card {
            padding: 14px 16px !important;
          }
          .confirm-card img {
            width: 56px !important;
            height: 40px !important;
          }

          /* ========== MOBILE LAYOUT ORDER ========== */
          .res-layout { display: flex !important; flex-direction: column !important; }
          .res-stepper-mobile { order: -2 !important; margin: 0 16px 20px !important; }
          .res-main-content { order: -1 !important; }
          .res-summary { order: 0 !important; margin: 0 16px !important; }

          /* Remove side borders on mobile for full-width feel */
          .res-main { 
            border-radius: 0 !important; 
            border-left: none !important; 
            border-right: none !important;
            padding: 24px 0 !important;
          }
          .res-main > h3,
          .res-main > p,
          .res-main > .terrains-picker,
          .res-main > .slots-grid-res,
          .res-main > div > button,
          .res-main > .confirm-stack {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
        }

        input:focus, textarea:focus {
          border-color: #5cb844 !important;
          box-shadow: 0 0 0 3px rgba(92,184,68,0.15) !important;
        }
      `}</style>

      <Navbar />

      <div className="res-container" style={{ padding: "110px 60px 80px", direction: "rtl", maxWidth: 1200, margin: "0 auto" }}>

        {/* Page title */}
        <div style={{ marginBottom: 32 }}>
          <span style={{ display: "inline-block", background: "rgba(45,106,33,0.08)", color: "#2d6a21", fontSize: 11, fontWeight: 700, letterSpacing: 2, padding: "5px 16px", borderRadius: 4, border: "1px solid rgba(45,106,33,0.18)", fontFamily: "'Cairo', sans-serif", marginBottom: 10 }}>حجز ملعب</span>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", margin: 0 }}>احجز ملعبك الآن</h1>
        </div>

        {/* Stepper */}
        <div className="res-stepper-mobile" style={{ display: "flex", alignItems: "center", marginBottom: 28, background: "#fff", border: "1px solid #c8e6c0", borderRadius: 14, padding: "14px 24px", overflowX: "auto", boxShadow: "0 2px 8px rgba(45,106,33,0.04)" }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: i < step ? "pointer" : "default" }} onClick={() => i < step && setStep(i)}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: i <= step ? "linear-gradient(135deg, #2d6a21, #5cb844)" : "#f0f7ee", border: `2px solid ${i <= step ? "#5cb844" : "#c8e6c0"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: i <= step ? "#fff" : "#a0c090", flexShrink: 0, boxShadow: i === step ? "0 4px 12px rgba(45,106,33,0.25)" : "none", transition: "all 0.3s" }}>{i < step ? "✓" : i + 1}</div>
                <span className="step-label" style={{ fontSize: 13, fontWeight: i === step ? 700 : 500, color: i === step ? "#2d6a21" : i < step ? "#5a8a50" : "#a0c090", fontFamily: "'Cairo', sans-serif", whiteSpace: "nowrap" }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: 1, height: 2, background: i < step ? "#5cb844" : "#e0f0da", margin: "0 12px", minWidth: 16 }} />
              )}
            </div>
          ))}
        </div>

        <div className="res-layout">
          {/* Main panel */}
          <div className="res-main-content">

            {/* ========== STEP 0: CHOOSE TERRAIN ========== */}
            {step === 0 && (
              <div className="res-main" style={{ background: "#fff", border: "1px solid #c8e6c0", borderRadius: 20, padding: "32px", boxShadow: "0 2px 16px rgba(45,106,33,0.06)" }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 24, marginTop: 0 }}>اختر الملعب</h3>
                <div className="terrains-picker" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {terrains.map((t) => {
                    const active = selectedTerrain === t.id;
                    return (
                      <div key={t.id} className="terrain-card" onClick={() => setSelectedTerrain(t.id)} style={{ border: `2px solid ${active ? "#5cb844" : "#c8e6c0"}`, borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "all 0.25s", background: active ? "rgba(45,106,33,0.04)" : "#fff", boxShadow: active ? "0 4px 20px rgba(45,106,33,0.15)" : "0 1px 4px rgba(45,106,33,0.04)", transform: active ? "translateY(-3px)" : "none" }}>
                        <div style={{ position: "relative", height: 130 }}>
                          <img src={t.image} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          {active && (
                            <div style={{ position: "absolute", top: 10, left: 10, width: 24, height: 24, borderRadius: "50%", background: "#5cb844", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 900 }}>✓</div>
                          )}
                        </div>
                        <div style={{ padding: "14px 16px" }}>
                          <div style={{ fontSize: 15, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>{t.name}</div>
                          <div style={{ fontSize: 12, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", margin: "4px 0 8px" }}>{t.size}</div>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                            {t.features.slice(0, 2).map(f => (
                              <span key={f} style={{ background: "rgba(45,106,33,0.07)", border: "1px solid #c8e6c0", color: "#2d6a21", fontSize: 10, fontFamily: "'Cairo', sans-serif", padding: "2px 8px", borderRadius: 5 }}>{f}</span>
                            ))}
                          </div>
                          <div style={{ fontSize: 18, fontWeight: 900, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>
                            {t.price} <span style={{ fontSize: 11, fontWeight: 400, color: "#5a8a50" }}>درهم/س</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 28 }}>
                  <button onClick={() => setStep(1)} style={{ background: "linear-gradient(135deg, #2d6a21, #5cb844)", color: "#fff", border: "none", padding: "14px 40px", borderRadius: 50, fontSize: 16, fontWeight: 800, fontFamily: "'Cairo', sans-serif", cursor: "pointer", boxShadow: "0 6px 20px rgba(45,106,33,0.3)", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >التالي ←</button>
                </div>
              </div>
            )}

            {/* ========== STEP 1: CHOOSE TIME ========== */}
            {step === 1 && (
              <div className="res-main" style={{ background: "#fff", border: "1px solid #c8e6c0", borderRadius: 20, padding: "32px", boxShadow: "0 2px 16px rgba(45,106,33,0.06)" }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 6, marginTop: 0 }}>اختر الوقت</h3>
                <p style={{ color: "#5a8a50", fontFamily: "'Cairo', sans-serif", fontSize: 14, marginBottom: 24, marginTop: 0 }}>
                  {todayLabel()} · <span style={{ color: "#2d6a21", fontWeight: 700 }}>{slots.filter(s => s.available).length} وقت متاح</span>
                </p>

                {/* Legend */}
                <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
                  {[
                    { color: "#fff", border: "#c8e6c0", label: "متاح" },
                    { color: "rgba(45,106,33,0.1)", border: "#5cb844", label: "مختار" },
                    { color: "#f5f5f5", border: "#eef5ec", label: "محجوز" },
                  ].map(({ color, border, label }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <div style={{ width: 16, height: 16, borderRadius: 4, background: color, border: `1.5px solid ${border}` }} />
                      <span style={{ fontSize: 12, color: "#5a8a50", fontFamily: "'Cairo', sans-serif" }}>{label}</span>
                    </div>
                  ))}
                </div>

                <div className="slots-grid-res" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10, marginBottom: 28 }}>
                  {slots.map((s) => {
                    const isSel = selectedSlot === s.id;
                    const hour = s.hour !== undefined ? s.hour : parseInt(s.label);
                    const timeLabel = formatTimeWithPeriod(hour);
                    return (
                      <button key={s.id} className="slot-btn" onClick={() => s.available && setSelectedSlot(isSel ? null : s.id)} style={{
                        fontFamily: "'Cairo', sans-serif", fontSize: 15, fontWeight: 700, padding: "14px 6px", borderRadius: 10,
                        border: `1.5px solid ${isSel ? "#5cb844" : s.available ? "#c8e6c0" : "#eef5ec"}`,
                        background: isSel ? "rgba(45,106,33,0.1)" : s.available ? "#fff" : "#f5f5f5",
                        color: isSel ? "#2d6a21" : s.available ? "#1a3d14" : "#c0d4bc",
                        cursor: s.available ? "pointer" : "not-allowed", transition: "all 0.2s",
                        boxShadow: isSel ? "0 2px 10px rgba(45,106,33,0.2)" : "none", position: "relative",
                        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 56,
                      }}>
                        <span style={{ fontSize: 15, fontWeight: 700 }}>{timeLabel}</span>
                        {!s.available && (
                          <div style={{ position: "absolute", inset: 0, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#b0c8aa", fontFamily: "'Cairo', sans-serif", background: "rgba(245,245,245,0.8)", fontWeight: 600 }}>محجوز</div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(0)} style={{ background: "#fff", color: "#5a8a50", border: "1.5px solid #c8e6c0", padding: "13px 28px", borderRadius: 50, fontSize: 15, fontWeight: 700, fontFamily: "'Cairo', sans-serif", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#5cb844"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#c8e6c0"}
                  >← رجوع</button>
                  <button disabled={!selectedSlot} onClick={() => selectedSlot && setStep(2)} style={{
                    background: selectedSlot ? "linear-gradient(135deg, #2d6a21, #5cb844)" : "#e0f0da",
                    color: selectedSlot ? "#fff" : "#a0c090", border: "none", padding: "14px 40px", borderRadius: 50,
                    fontSize: 16, fontWeight: 800, fontFamily: "'Cairo', sans-serif",
                    cursor: selectedSlot ? "pointer" : "not-allowed",
                    boxShadow: selectedSlot ? "0 6px 20px rgba(45,106,33,0.3)" : "none", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => selectedSlot && (e.currentTarget.style.transform = "translateY(-2px)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                  >التالي ←</button>
                </div>
              </div>
            )}

            {/* ========== STEP 2: PERSONAL INFO ========== */}
            {step === 2 && (
              <div className="res-main" style={{ background: "#fff", border: "1px solid #c8e6c0", borderRadius: 20, padding: "32px", boxShadow: "0 2px 16px rgba(45,106,33,0.06)" }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 24, marginTop: 0 }}>بياناتك الشخصية</h3>

                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div className="form-row" style={{ display: "flex", gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", marginBottom: 7 }}>الاسم الكامل *</label>
                      <input type="text" placeholder="محمد الأمين" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle(errors.name)} />
                      {errors.name && <span style={{ fontSize: 11, color: "#e57373", fontFamily: "'Cairo', sans-serif", display: "block", marginTop: 4 }}>{errors.name}</span>}
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", marginBottom: 7 }}>رقم الهاتف *</label>
                      <input type="tel" placeholder="+212 6xx xxx xxx" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputStyle(errors.phone)} dir="ltr" />
                      {errors.phone && <span style={{ fontSize: 11, color: "#e57373", fontFamily: "'Cairo', sans-serif", display: "block", marginTop: 4 }}>{errors.phone}</span>}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", marginBottom: 7 }}>البريد الإلكتروني <span style={{ color: "#a0c090", fontWeight: 400 }}>(اختياري)</span></label>
                    <input type="email" placeholder="example@gmail.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle(errors.email)} dir="ltr" />
                    {errors.email && <span style={{ fontSize: 11, color: "#e57373", fontFamily: "'Cairo', sans-serif", display: "block", marginTop: 4 }}>{errors.email}</span>}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", marginBottom: 7 }}>ملاحظات <span style={{ color: "#a0c090", fontWeight: 400 }}>(اختياري)</span></label>
                    <textarea rows={3} placeholder="أي طلبات خاصة أو ملاحظات..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle(false), resize: "vertical", minHeight: 90 }} />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 28 }}>
                  <button onClick={() => setStep(1)} style={{ background: "#fff", color: "#5a8a50", border: "1.5px solid #c8e6c0", padding: "13px 28px", borderRadius: 50, fontSize: 15, fontWeight: 700, fontFamily: "'Cairo', sans-serif", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#5cb844"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#c8e6c0"}
                  >← رجوع</button>
                  <button onClick={() => { if (validate()) setStep(3); }} style={{ background: "linear-gradient(135deg, #2d6a21, #5cb844)", color: "#fff", border: "none", padding: "14px 40px", borderRadius: 50, fontSize: 16, fontWeight: 800, fontFamily: "'Cairo', sans-serif", cursor: "pointer", boxShadow: "0 6px 20px rgba(45,106,33,0.3)", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >مراجعة الحجز ←</button>
                </div>
              </div>
            )}

            {/* ========== STEP 3: CONFIRM ========== */}
            {step === 3 && (
              <div className="res-main" style={{ background: "#fff", border: "1px solid #c8e6c0", borderRadius: 20, padding: "32px", boxShadow: "0 2px 16px rgba(45,106,33,0.06)" }}>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 24, marginTop: 0 }}>مراجعة وتأكيد الحجز</h3>

                <div className="confirm-stack" style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
                  {/* Terrain */}
                  <div className="confirm-card" style={{ display: "flex", gap: 16, alignItems: "center", background: "#f8fbf7", border: "1px solid #c8e6c0", borderRadius: 14, padding: "16px 20px" }}>
                    <img src={terrain?.image} alt="" style={{ width: 72, height: 50, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>{terrain?.name}</div>
                      <div style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif" }}>{terrain?.type} · {terrain?.size}</div>
                    </div>
                    <button onClick={() => setStep(0)} style={{ background: "none", border: "1px solid #c8e6c0", color: "#5a8a50", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: "'Cairo', sans-serif", cursor: "pointer" }}>تغيير</button>
                  </div>

                  {/* Slot + date */}
                  <div className="confirm-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fbf7", border: "1px solid #c8e6c0", borderRadius: 14, padding: "16px 20px" }}>
                    <div>
                      <div style={{ fontSize: 12, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", marginBottom: 4 }}>التاريخ والوقت</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>{todayLabel()} · {slot?.label}</div>
                    </div>
                    <button onClick={() => setStep(1)} style={{ background: "none", border: "1px solid #c8e6c0", color: "#5a8a50", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: "'Cairo', sans-serif", cursor: "pointer" }}>تغيير</button>
                  </div>

                  {/* Personal info */}
                  <div className="confirm-card" style={{ background: "#f8fbf7", border: "1px solid #c8e6c0", borderRadius: 14, padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>بيانات الحجز</div>
                      <button onClick={() => setStep(2)} style={{ background: "none", border: "1px solid #c8e6c0", color: "#5a8a50", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontFamily: "'Cairo', sans-serif", cursor: "pointer" }}>تعديل</button>
                    </div>
                    {[
                      { label: "الاسم", value: form.name },
                      { label: "الهاتف", value: form.phone },
                      ...(form.email ? [{ label: "البريد", value: form.email }] : []),
                      ...(form.notes ? [{ label: "ملاحظات", value: form.notes }] : []),
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #e8f5e0" }}>
                        <span style={{ color: "#5a8a50", fontFamily: "'Cairo', sans-serif", fontSize: 13 }}>{label}</span>
                        <span style={{ color: "#1a3d14", fontFamily: "'Cairo', sans-serif", fontSize: 13, fontWeight: 600 }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(45,106,33,0.06)", border: "1.5px solid rgba(92,184,68,0.4)", borderRadius: 14, padding: "18px 20px" }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>المجموع</span>
                    <span style={{ fontSize: 28, fontWeight: 900, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>
                      {terrain?.price} <span style={{ fontSize: 13, fontWeight: 400, color: "#5a8a50" }}>درهم</span>
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12 }}>
                  <button onClick={() => setStep(2)} style={{ background: "#fff", color: "#5a8a50", border: "1.5px solid #c8e6c0", padding: "13px 28px", borderRadius: 50, fontSize: 15, fontWeight: 700, fontFamily: "'Cairo', sans-serif", cursor: "pointer", transition: "all 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#5cb844"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#c8e6c0"}
                  >← رجوع</button>
                  <button onClick={handleSubmit} style={{ background: "linear-gradient(135deg, #2d6a21, #5cb844)", color: "#fff", border: "none", padding: "14px 44px", borderRadius: 50, fontSize: 16, fontWeight: 800, fontFamily: "'Cairo', sans-serif", cursor: "pointer", boxShadow: "0 6px 24px rgba(45,106,33,0.35)", transition: "all 0.2s", flex: 1 }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >⚽ تأكيد الحجز نهائياً</button>
                </div>

                <p style={{ textAlign: "center", fontSize: 12, color: "#a0c090", fontFamily: "'Cairo', sans-serif", marginTop: 16, marginBottom: 0 }}>تأكيد فوري · بدون رسوم إضافية · إلغاء مجاني قبل 24 ساعة</p>
              </div>
            )}
          </div>

          {/* Sidebar summary */}
          <div className="res-summary">
            <div style={{ background: "#fff", border: "1px solid #c8e6c0", borderRadius: 20, padding: "24px", boxShadow: "0 2px 16px rgba(45,106,33,0.06)", position: "sticky", top: 100 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 18 }}>ملخص الحجز</div>
              <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
                <img src={terrain?.image} alt="" style={{ width: "100%", height: 120, objectFit: "cover" }} />
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 4 }}>{terrain?.name}</div>
              <div style={{ fontSize: 12, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", marginBottom: 16 }}>{terrain?.type} · {terrain?.size}</div>
              <div style={{ borderTop: "1px solid #e8f5e0", paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "التاريخ", value: todayLabel() },
                  { label: "الوقت", value: slot?.label || "—", highlight: !slot },
                  { label: "المدة", value: "ساعة واحدة" },
                ].map(({ label, value, highlight }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif" }}>{label}</span>
                    <span style={{ fontSize: 13, color: highlight ? "#c0d4bc" : "#1a3d14", fontFamily: "'Cairo', sans-serif", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: "1px solid #e8f5e0", marginTop: 14, paddingTop: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>المجموع</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>
                  {terrain?.price} <span style={{ fontSize: 11, fontWeight: 400, color: "#5a8a50" }}>درهم</span>
                </span>
              </div>
              <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                {(terrain?.features || []).map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#5cb844", flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: "#5a8a50", fontFamily: "'Cairo', sans-serif" }}>{f}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20, padding: "14px 16px", background: "#f0f7ee", borderRadius: 10, border: "1px solid #ddefd8" }}>
                {["✓ تأكيد فوري", "✓ إلغاء مجاني 24س", "✓ بدون رسوم إضافية"].map(t => (
                  <div key={t} style={{ fontSize: 12, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", padding: "3px 0", fontWeight: 600 }}>{t}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}