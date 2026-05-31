import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { terrains, generateSlots } from "../../api/Terrains";

// ─── Constants ────────────────────────────────────────────────────────────────
const ARABIC_DAYS    = ["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
const ARABIC_MONTHS  = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const STEPS          = ["اختر الملعب","اختر الوقت","بياناتك","تأكيد"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function todayLabel() {
  const d = new Date();
  return `${ARABIC_DAYS[d.getDay()]} ${d.getDate()} ${ARABIC_MONTHS[d.getMonth()]}`;
}
function formatTime(hour, minute = 0) {
  const period = hour >= 12 ? "م" : "ص";
  const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${String(h).padStart(2,"0")}:${String(minute).padStart(2,"0")} ${period}`;
}
function randomCode() { return Math.floor(1000 + Math.random() * 9000).toString(); }
function randomId()   { return "RES-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).substr(2,4).toUpperCase(); }
function qrUrl(data)  { return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`; }

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Step progress bar */
function Stepper({ step, onBack }) {
  return (
    <div className="stepper">
      {STEPS.map((label, i) => (
        <div key={i} className="stepper-item">
          <div
            className={`stepper-circle ${i < step ? "done" : i === step ? "active" : ""}`}
            onClick={() => i < step && onBack(i)}
            style={{ cursor: i < step ? "pointer" : "default" }}
          >
            {i < step ? "✓" : i + 1}
          </div>
          <span className={`stepper-label ${i === step ? "current" : ""}`}>{label}</span>
          {i < STEPS.length - 1 && <div className={`stepper-line ${i < step ? "filled" : ""}`} />}
        </div>
      ))}
    </div>
  );
}

/** Terrain selection card */
function TerrainCard({ terrain, selected, onSelect }) {
  return (
    <div
      className={`terrain-card ${selected ? "terrain-card--active" : ""}`}
      onClick={() => onSelect(terrain.id)}
    >
      <div className="terrain-card__img-wrap">
        <img src={terrain.image} alt={terrain.name} />
        {selected && <div className="terrain-card__check">✓</div>}
      </div>
      <div className="terrain-card__body">
        <div className="terrain-card__name">{terrain.name}</div>
        <div className="terrain-card__size">{terrain.size}</div>
        <div className="terrain-card__tags">
          {terrain.features.slice(0,2).map(f => (
            <span key={f} className="tag">{f}</span>
          ))}
        </div>
        <div className="terrain-card__price">
          {terrain.price} <span className="price-unit">درهم/س</span>
        </div>
      </div>
    </div>
  );
}

/** Single time slot button */
function SlotButton({ slot, selected, onSelect }) {
  const hour = slot.hour ?? parseInt(slot.label);
  const label = formatTime(hour);
  return (
    <button
      className={`slot-btn ${selected ? "slot-btn--active" : ""} ${!slot.available ? "slot-btn--taken" : ""}`}
      onClick={() => slot.available && onSelect(slot.id === selected ? null : slot.id)}
      disabled={!slot.available}
    >
      <span className="slot-time">{label}</span>
      {!slot.available && <span className="slot-taken-label">محجوز</span>}
    </button>
  );
}

/** Booking summary sidebar */
function BookingSummary({ terrain, slot }) {
  return (
    <aside className="summary-card">
      <div className="summary-card__title">ملخص الحجز</div>
      {terrain?.image && (
        <div className="summary-card__img-wrap">
          <img src={terrain.image} alt={terrain.name} />
        </div>
      )}
      <div className="summary-card__terrain-name">{terrain?.name}</div>
      <div className="summary-card__terrain-sub">{terrain?.type} · {terrain?.size}</div>

      <div className="summary-card__divider" />

      <div className="summary-card__rows">
        {[
          { label: "التاريخ", value: todayLabel() },
          { label: "الوقت",   value: slot?.label || "—", muted: !slot },
          { label: "المدة",   value: "ساعة واحدة" },
        ].map(({ label, value, muted }) => (
          <div key={label} className="summary-card__row">
            <span className="summary-card__row-label">{label}</span>
            <span className={`summary-card__row-value ${muted ? "muted" : ""}`}>{value}</span>
          </div>
        ))}
      </div>

      <div className="summary-card__divider" />
      <div className="summary-card__total-row">
        <span className="summary-card__total-label">المجموع</span>
        <span className="summary-card__total-value">
          {terrain?.price} <span className="summary-card__total-unit">درهم</span>
        </span>
      </div>

      <div className="summary-card__features">
        {(terrain?.features || []).map(f => (
          <div key={f} className="summary-card__feature">
            <span className="dot" />
            <span>{f}</span>
          </div>
        ))}
      </div>

      <div className="summary-card__badges">
        {["✓ تأكيد فوري","✓ إلغاء مجاني 24س","✓ بدون رسوم"].map(b => (
          <div key={b} className="summary-badge">{b}</div>
        ))}
      </div>
    </aside>
  );
}

/** Auth required modal */
function AuthModal({ terrainName, terrainId, slotId, onClose }) {
  const navigate = useNavigate();
  const state = { from: "/reservation", terrainId, slotId, step: 3 };
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🔒</div>
        <h3 className="modal-title">يجب تسجيل الدخول أولاً</h3>
        <p className="modal-body">
          لإتمام حجزك في <strong>{terrainName}</strong>، يرجى تسجيل الدخول أو إنشاء حساب جديد
        </p>
        <button className="btn btn--primary btn--full" onClick={() => navigate("/login", { state })}>
          تسجيل الدخول →
        </button>
        <button className="btn btn--outline btn--full" onClick={() => navigate("/signup", { state })}>
          إنشاء حساب جديد
        </button>
        <button className="btn btn--ghost btn--full" onClick={onClose}>
          رجوع للمراجعة
        </button>
      </div>
    </div>
  );
}

/** Boarding-pass style confirmation ticket */
function BoardingPassTicket({ terrain, slot, form, reservationCode, reservationId }) {
  const qrData = { id: reservationId, code: reservationCode, name: form.name, terrain: terrain?.name, slot: slot?.label, date: todayLabel(), phone: form.phone };

  const shareText = `تم حجز ملعب ${terrain?.name} بنجاح!\n📅 التاريخ: ${todayLabel()}\n⏰ الوقت: ${slot?.label}\n💰 السعر: ${terrain?.price} درهم\n🔢 كود: ${reservationCode}\n📱 رقم الحجز: ${reservationId}`;

  function handleShare(platform) {
    const text = encodeURIComponent(shareText);
    const url  = encodeURIComponent(window.location.href);
    const links = {
      whatsapp: `https://wa.me/?text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
      twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    };
    if (platform === "copy" || platform === "instagram") {
      navigator.clipboard.writeText(shareText);
      alert("تم نسخ تفاصيل الحجز!");
      return;
    }
    if (links[platform]) window.open(links[platform], "_blank", "width=600,height=400");
  }

  return (
    <div className="ticket-wrap">
      {/* Top green header */}
      <div className="ticket-header">
        <div className="ticket-header__label">تذكرة الحجز</div>
        <div className="ticket-header__title">{terrain?.name}</div>
        <div className="ticket-header__sub">{terrain?.type} · {terrain?.size}</div>
      </div>

      {/* Notch separator */}
      <div className="ticket-notch">
        <div className="notch notch--left" />
        <div className="ticket-dashed-line" />
        <div className="notch notch--right" />
      </div>

      {/* Info grid */}
      <div className="ticket-body">
        <div className="ticket-info-grid">
          {[
            { label: "التاريخ",        value: todayLabel() },
            { label: "الوقت",          value: slot?.label || "—" },
            { label: "الاسم",          value: form.name },
            { label: "الهاتف",         value: form.phone },
            { label: "السعر",          value: `${terrain?.price} درهم` },
            { label: "رقم الحجز",      value: reservationId },
          ].map(({ label, value }) => (
            <div key={label} className="ticket-info-item">
              <span className="ticket-info-label">{label}</span>
              <span className="ticket-info-value">{value}</span>
            </div>
          ))}
        </div>

        {/* QR + PIN */}
        <div className="ticket-qr-section">
          <img src={qrUrl(qrData)} alt="QR Code" className="ticket-qr-img" />
          <div className="ticket-qr-hint">اعرض هذا الرمز عند وصولك</div>
          <div className="ticket-pin-wrap">
            <div className="ticket-pin-label">كود التأكيد</div>
            <div className="ticket-pin">{reservationCode}</div>
          </div>
        </div>
      </div>

      {/* Bottom notch */}
      <div className="ticket-notch">
        <div className="notch notch--left" />
        <div className="ticket-dashed-line" />
        <div className="notch notch--right" />
      </div>

      {/* Footer */}
      <div className="ticket-footer">
        <div className="ticket-footer-badge">⚽ استمتع بمباراتك!</div>
        <div className="ticket-footer-note">تأكيد فوري · إلغاء مجاني قبل 24 ساعة · بدون رسوم إضافية</div>
      </div>

      {/* Share */}
      <div className="ticket-share">
        <div className="ticket-share-title">شارك حجزك</div>
        <div className="ticket-share-btns">
          {[
            { id: "whatsapp",  label: "واتساب",   color: "#25D366" },
            { id: "facebook",  label: "فيسبوك",   color: "#1877F2" },
            { id: "twitter",   label: "تويتر",    color: "#1DA1F2" },
            { id: "copy",      label: "نسخ",      color: "#5a8a50" },
          ].map(({ id, label, color }) => (
            <button
              key={id}
              className="share-btn"
              style={{ background: color }}
              onClick={() => handleShare(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step panels ──────────────────────────────────────────────────────────────

function StepTerrain({ selectedTerrain, onSelect, onNext }) {
  return (
    <div className="panel">
      <h3 className="panel__title">اختر الملعب</h3>
      <div className="terrains-grid">
        {terrains.map(t => (
          <TerrainCard
            key={t.id}
            terrain={t}
            selected={selectedTerrain === t.id}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="panel__actions">
        <button className="btn btn--primary" onClick={onNext}>التالي ←</button>
      </div>
    </div>
  );
}

function StepTime({ slots, selectedSlot, onSelect, onNext, onBack }) {
  return (
    <div className="panel">
      <h3 className="panel__title">اختر الوقت</h3>
      <p className="panel__sub">
        {todayLabel()} ·{" "}
        <strong>{slots.filter(s => s.available).length} وقت متاح</strong>
      </p>

      <div className="slot-legend">
        {[
          { label: "متاح",   bg: "#fff",              border: "#c8e6c0" },
          { label: "مختار",  bg: "rgba(45,106,33,.1)", border: "#5cb844" },
          { label: "محجوز",  bg: "#f5f5f5",            border: "#eef5ec" },
        ].map(({ label, bg, border }) => (
          <div key={label} className="slot-legend-item">
            <div className="slot-legend-dot" style={{ background: bg, border: `1.5px solid ${border}` }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="slots-grid">
        {slots.map(s => (
          <SlotButton
            key={s.id}
            slot={s}
            selected={selectedSlot === s.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="panel__actions">
        <button className="btn btn--outline" onClick={onBack}>← رجوع</button>
        <button
          className="btn btn--primary"
          disabled={!selectedSlot}
          onClick={() => selectedSlot && onNext()}
        >
          التالي ←
        </button>
      </div>
    </div>
  );
}

function StepInfo({ form, onChange, errors, onNext, onBack }) {
  const inp = (field) => ({
    value: form[field],
    onChange: e => onChange(field, e.target.value),
    className: `field-input ${errors[field] ? "field-input--error" : ""}`,
  });

  return (
    <div className="panel">
      <h3 className="panel__title">بياناتك الشخصية</h3>

      <div className="form-grid">
        <div className="field">
          <label className="field-label">الاسم الكامل *</label>
          <input type="text" placeholder="محمد الأمين" {...inp("name")} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>
        <div className="field">
          <label className="field-label">رقم الهاتف *</label>
          <input type="tel" placeholder="+212 6xx xxx xxx" dir="ltr" {...inp("phone")} />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>
      </div>

      <div className="field">
        <label className="field-label">البريد الإلكتروني <span className="field-label--opt">(اختياري)</span></label>
        <input type="email" placeholder="example@gmail.com" dir="ltr" {...inp("email")} />
        {errors.email && <span className="field-error">{errors.email}</span>}
      </div>

      <div className="field">
        <label className="field-label">ملاحظات <span className="field-label--opt">(اختياري)</span></label>
        <textarea rows={3} placeholder="أي طلبات خاصة..." {...inp("notes")} />
      </div>

      <div className="panel__actions">
        <button className="btn btn--outline" onClick={onBack}>← رجوع</button>
        <button className="btn btn--primary" onClick={onNext}>مراجعة الحجز ←</button>
      </div>
    </div>
  );
}

function StepConfirm({ terrain, slot, form, onBack, onSubmit }) {
  return (
    <div className="panel">
      <h3 className="panel__title">مراجعة وتأكيد الحجز</h3>

      <div className="confirm-stack">
        {/* Terrain row */}
        <div className="confirm-row">
          <img src={terrain?.image} alt="" className="confirm-row__img" />
          <div className="confirm-row__info">
            <div className="confirm-row__name">{terrain?.name}</div>
            <div className="confirm-row__sub">{terrain?.type} · {terrain?.size}</div>
          </div>
          <button className="btn btn--xs btn--outline" onClick={() => onBack(0)}>تغيير</button>
        </div>

        {/* Slot row */}
        <div className="confirm-row">
          <div className="confirm-row__info">
            <div className="confirm-row__label">التاريخ والوقت</div>
            <div className="confirm-row__name">{todayLabel()} · {slot?.label}</div>
          </div>
          <button className="btn btn--xs btn--outline" onClick={() => onBack(1)}>تغيير</button>
        </div>

        {/* Personal info */}
        <div className="confirm-personal">
          <div className="confirm-personal__header">
            <span className="confirm-personal__title">بيانات الحجز</span>
            <button className="btn btn--xs btn--outline" onClick={() => onBack(2)}>تعديل</button>
          </div>
          {[
            { label: "الاسم",   value: form.name  },
            { label: "الهاتف",  value: form.phone },
            ...(form.email ? [{ label: "البريد", value: form.email }] : []),
            ...(form.notes ? [{ label: "ملاحظات", value: form.notes }] : []),
          ].map(({ label, value }) => (
            <div key={label} className="confirm-info-row">
              <span className="confirm-info-label">{label}</span>
              <span className="confirm-info-value">{value}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="confirm-total">
          <span className="confirm-total__label">المجموع</span>
          <span className="confirm-total__value">
            {terrain?.price} <span className="confirm-total__unit">درهم</span>
          </span>
        </div>
      </div>

      <div className="panel__actions">
        <button className="btn btn--outline" onClick={() => onBack(2)}>← رجوع</button>
        <button className="btn btn--primary btn--cta" onClick={onSubmit}>
          ⚽ تأكيد الحجز نهائياً
        </button>
      </div>

      <p className="confirm-note">تأكيد فوري · بدون رسوم إضافية · إلغاء مجاني قبل 24 ساعة</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function Reservation() {
  const location = useLocation();
  const navigate  = useNavigate();

  const [user, setUser]                   = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const initTerrain = location.state?.terrainId || terrains[0].id;
  const initSlot    = location.state?.slotId    || null;

  const [step,            setStep]            = useState(initSlot ? 2 : 0);
  const [selectedTerrain, setSelectedTerrain] = useState(initTerrain);
  const [selectedSlot,    setSelectedSlot]    = useState(initSlot);
  const [form,            setForm]            = useState({ name:"", phone:"", email:"", notes:"" });
  const [errors,          setErrors]          = useState({});
  const [submitted,       setSubmitted]       = useState(false);
  const [reservationCode, setReservationCode] = useState("");
  const [reservationId,   setReservationId]   = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const terrain = terrains.find(t => t.id === selectedTerrain);
  const slots   = generateSlots(selectedTerrain);
  const slot    = slots.find(s => s.id === selectedSlot);

  function updateField(field, value) { setForm(f => ({ ...f, [field]: value })); }

  function validate() {
    const e = {};
    if (!form.name.trim())                                                   e.name  = "الاسم مطلوب";
    if (!form.phone.trim() || !/^[0-9+]{9,14}$/.test(form.phone.replace(/\s/g,""))) e.phone = "رقم هاتف غير صحيح";
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))                     e.email = "البريد الإلكتروني غير صحيح";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext2() { if (validate()) setStep(3); }

  function handleSubmit() {
    if (!user) { setShowAuthModal(true); return; }
    if (!validate()) return;
    setReservationCode(randomCode());
    setReservationId(randomId());
    setSubmitted(true);
  }

  // ── Success screen ──
  if (submitted) {
    return (
      <div className="res-page">
        <Navbar />
        <div className="success-screen">
          <div className="success-check">✓</div>
          <h2 className="success-title">تم تأكيد حجزك!</h2>
          <p className="success-sub">
            مرحباً <strong>{form.name}</strong>، تم الحجز بنجاح في{" "}
            <strong>{terrain?.name}</strong> الساعة <strong>{slot?.label}</strong>
          </p>
          <BoardingPassTicket
            terrain={terrain}
            slot={slot}
            form={form}
            reservationCode={reservationCode}
            reservationId={reservationId}
          />
          <button className="btn btn--primary" onClick={() => navigate("/")}>
            العودة للرئيسية
          </button>
        </div>
        <Footer />
        <Styles />
      </div>
    );
  }

  // ── Wizard ──
  return (
    <div className="res-page">
      <Navbar />

      {showAuthModal && (
        <AuthModal
          terrainName={terrain?.name}
          terrainId={selectedTerrain}
          slotId={selectedSlot}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      <div className="res-container">
        {/* Page heading */}
        <div className="res-heading">
          <span className="res-badge">حجز ملعب</span>
          <h1 className="res-title">احجز ملعبك الآن</h1>
        </div>

        <Stepper step={step} onBack={setStep} />

        <div className="res-layout">
          {/* Main wizard panel */}
          <div className="res-main">
            {step === 0 && (
              <StepTerrain
                selectedTerrain={selectedTerrain}
                onSelect={setSelectedTerrain}
                onNext={() => setStep(1)}
              />
            )}
            {step === 1 && (
              <StepTime
                slots={slots}
                selectedSlot={selectedSlot}
                onSelect={setSelectedSlot}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && (
              <StepInfo
                form={form}
                onChange={updateField}
                errors={errors}
                onNext={handleNext2}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <StepConfirm
                terrain={terrain}
                slot={slot}
                form={form}
                onBack={(s) => setStep(s)}
                onSubmit={handleSubmit}
              />
            )}
          </div>

          {/* Sidebar */}
          <BookingSummary terrain={terrain} slot={slot} />
        </div>
      </div>

      <Footer />
      <Styles />
    </div>
  );
}

// ─── All styles in one place ──────────────────────────────────────────────────
function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');

      /* ── CSS Variables ── */
      :root {
        --green-dark:   #1a3d14;
        --green-mid:    #2d6a21;
        --green-light:  #5cb844;
        --green-pale:   #f0f7ee;
        --green-border: #c8e6c0;
        --text-muted:   #5a8a50;
        --text-hint:    #a0c090;
        --bg-page:      #f4f8f3;
        --radius-sm:    8px;
        --radius-md:    14px;
        --radius-lg:    20px;
        --shadow-card:  0 2px 16px rgba(45,106,33,.07);
      }

      * { box-sizing: border-box; }

      /* ── Page wrapper ── */
      .res-page {
        background: var(--bg-page);
        min-height: 100vh;
        font-family: 'Cairo', sans-serif;
        direction: rtl;
      }

      .res-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 110px 60px 80px;
        direction: rtl;
      }

      /* ── Heading ── */
      .res-heading { margin-bottom: 32px; }
      .res-badge {
        display: inline-block;
        background: rgba(45,106,33,.08);
        color: var(--green-mid);
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 2px;
        padding: 5px 16px;
        border-radius: 4px;
        border: 1px solid rgba(45,106,33,.18);
        margin-bottom: 10px;
      }
      .res-title {
        font-size: 36px;
        font-weight: 900;
        color: var(--green-dark);
        margin: 0;
      }

      /* ── Stepper ── */
      .stepper {
        display: flex;
        align-items: center;
        background: #fff;
        border: 1px solid var(--green-border);
        border-radius: var(--radius-md);
        padding: 14px 24px;
        margin-bottom: 28px;
        overflow-x: auto;
        box-shadow: var(--shadow-card);
        gap: 0;
      }
      .stepper-item {
        display: flex;
        align-items: center;
        flex: 1;
        min-width: 0;
      }
      .stepper-item:last-child { flex: none; }
      .stepper-circle {
        width: 32px; height: 32px;
        border-radius: 50%;
        border: 2px solid var(--green-border);
        background: var(--green-pale);
        display: flex; align-items: center; justify-content: center;
        font-size: 13px; font-weight: 800; color: var(--text-hint);
        flex-shrink: 0; transition: all .3s;
      }
      .stepper-circle.active {
        background: linear-gradient(135deg, var(--green-mid), var(--green-light));
        border-color: var(--green-light);
        color: #fff;
        box-shadow: 0 4px 12px rgba(45,106,33,.25);
      }
      .stepper-circle.done {
        background: linear-gradient(135deg, var(--green-mid), var(--green-light));
        border-color: var(--green-light);
        color: #fff;
      }
      .stepper-label {
        font-size: 13px; font-weight: 500;
        color: var(--text-hint);
        margin-right: 10px; white-space: nowrap;
      }
      .stepper-label.current { color: var(--green-mid); font-weight: 700; }
      .stepper-line {
        flex: 1; height: 2px;
        background: #e0f0da;
        margin: 0 12px;
        min-width: 16px;
        transition: background .3s;
      }
      .stepper-line.filled { background: var(--green-light); }

      /* ── Layout grid ── */
      .res-layout {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 28px;
        align-items: start;
      }

      /* ── Panel (shared white card) ── */
      .panel {
        background: #fff;
        border: 1px solid var(--green-border);
        border-radius: var(--radius-lg);
        padding: 32px;
        box-shadow: var(--shadow-card);
      }
      .panel__title {
        font-size: 22px; font-weight: 800; color: var(--green-dark);
        margin: 0 0 20px;
      }
      .panel__sub {
        color: var(--text-muted); font-size: 14px; margin: -12px 0 20px;
      }
      .panel__sub strong { color: var(--green-mid); }
      .panel__actions {
        display: flex; gap: 12px; margin-top: 28px;
      }

      /* ── Buttons ── */
      .btn {
        display: inline-flex; align-items: center; justify-content: center;
        gap: 6px; padding: 13px 28px;
        border-radius: 50px; font-size: 15px; font-weight: 700;
        font-family: 'Cairo', sans-serif;
        cursor: pointer; transition: all .2s; border: none; outline: none;
      }
      .btn:hover { transform: translateY(-2px); }
      .btn:disabled { opacity: .5; cursor: not-allowed; transform: none; }

      .btn--primary {
        background: linear-gradient(135deg, var(--green-mid), var(--green-light));
        color: #fff;
        box-shadow: 0 6px 20px rgba(45,106,33,.3);
        font-size: 16px; font-weight: 800;
      }
      .btn--outline {
        background: #fff; color: var(--text-muted);
        border: 1.5px solid var(--green-border);
      }
      .btn--outline:hover { border-color: var(--green-light); }
      .btn--ghost {
        background: none; border: none; color: var(--text-hint); font-size: 13px;
      }
      .btn--full { width: 100%; }
      .btn--cta { flex: 1; padding: 14px 44px; }
      .btn--xs { padding: 6px 14px; font-size: 12px; }

      /* ── Terrain grid ── */
      .terrains-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .terrain-card {
        border: 2px solid var(--green-border);
        border-radius: var(--radius-md);
        overflow: hidden;
        cursor: pointer;
        transition: all .25s;
        background: #fff;
      }
      .terrain-card:hover { box-shadow: 0 4px 20px rgba(45,106,33,.12); }
      .terrain-card--active {
        border-color: var(--green-light);
        background: rgba(45,106,33,.04);
        box-shadow: 0 4px 20px rgba(45,106,33,.15);
        transform: translateY(-3px);
      }
      .terrain-card__img-wrap { position: relative; height: 130px; }
      .terrain-card__img-wrap img { width: 100%; height: 100%; object-fit: cover; }
      .terrain-card__check {
        position: absolute; top: 10px; left: 10px;
        width: 24px; height: 24px; border-radius: 50%;
        background: var(--green-light);
        display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 13px; font-weight: 900;
      }
      .terrain-card__body { padding: 14px 16px; }
      .terrain-card__name { font-size: 15px; font-weight: 800; color: var(--green-dark); }
      .terrain-card__size { font-size: 12px; color: var(--text-muted); margin: 4px 0 8px; }
      .terrain-card__tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
      .tag {
        background: rgba(45,106,33,.07); border: 1px solid var(--green-border);
        color: var(--green-mid); font-size: 10px; padding: 2px 8px; border-radius: 5px;
      }
      .terrain-card__price { font-size: 18px; font-weight: 900; color: var(--green-mid); }
      .price-unit { font-size: 11px; font-weight: 400; color: var(--text-muted); }

      /* ── Slots ── */
      .slot-legend { display: flex; gap: 16px; margin-bottom: 16px; }
      .slot-legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--text-muted); }
      .slot-legend-dot { width: 16px; height: 16px; border-radius: 4px; }

      .slots-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 10px;
        margin-bottom: 28px;
      }
      .slot-btn {
        position: relative;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        min-height: 56px; padding: 14px 6px;
        border-radius: 10px; border: 1.5px solid var(--green-border);
        background: #fff; color: var(--green-dark);
        font-family: 'Cairo', sans-serif; font-size: 15px; font-weight: 700;
        cursor: pointer; transition: all .2s;
      }
      .slot-btn:hover:not(:disabled) { border-color: var(--green-light); }
      .slot-btn--active {
        border-color: var(--green-light) !important;
        background: rgba(45,106,33,.1) !important;
        color: var(--green-mid) !important;
        box-shadow: 0 2px 10px rgba(45,106,33,.2);
      }
      .slot-btn--taken { background: #f5f5f5; border-color: #eef5ec; color: #c0d4bc; cursor: not-allowed; }
      .slot-time { font-size: 15px; font-weight: 700; }
      .slot-taken-label {
        position: absolute; inset: 0; border-radius: 9px;
        display: flex; align-items: center; justify-content: center;
        font-size: 11px; color: #b0c8aa; background: rgba(245,245,245,.8); font-weight: 600;
      }

      /* ── Form ── */
      .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
      .field { margin-bottom: 18px; }
      .field-label { display: block; font-size: 13px; font-weight: 700; color: var(--green-mid); margin-bottom: 7px; }
      .field-label--opt { color: var(--text-hint); font-weight: 400; }
      .field-input {
        width: 100%; padding: 14px 18px;
        border-radius: 10px; border: 1.5px solid var(--green-border);
        background: #fff; font-size: 15px; font-family: 'Cairo', sans-serif;
        color: var(--green-dark); outline: none; direction: rtl;
        transition: border-color .2s, box-shadow .2s;
      }
      .field-input:focus { border-color: var(--green-light); box-shadow: 0 0 0 3px rgba(92,184,68,.15); }
      .field-input--error { border-color: #e57373; background: #fff5f5; }
      .field-error { font-size: 11px; color: #e57373; display: block; margin-top: 4px; }
      textarea.field-input { resize: vertical; min-height: 90px; }

      /* ── Confirm ── */
      .confirm-stack { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
      .confirm-row {
        display: flex; align-items: center; gap: 16px;
        background: var(--green-pale); border: 1px solid var(--green-border);
        border-radius: var(--radius-md); padding: 16px 20px;
      }
      .confirm-row__img { width: 72px; height: 50px; object-fit: cover; border-radius: 8px; flex-shrink: 0; }
      .confirm-row__label { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
      .confirm-row__name { font-size: 16px; font-weight: 800; color: var(--green-dark); }
      .confirm-row__sub  { font-size: 13px; color: var(--text-muted); }
      .confirm-row__info { flex: 1; }
      .confirm-personal {
        background: var(--green-pale); border: 1px solid var(--green-border);
        border-radius: var(--radius-md); padding: 16px 20px;
      }
      .confirm-personal__header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
      .confirm-personal__title { font-size: 14px; font-weight: 700; color: var(--green-mid); }
      .confirm-info-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #e8f5e0; }
      .confirm-info-label { color: var(--text-muted); font-size: 13px; }
      .confirm-info-value { color: var(--green-dark); font-size: 13px; font-weight: 600; }
      .confirm-total {
        display: flex; justify-content: space-between; align-items: center;
        background: rgba(45,106,33,.06); border: 1.5px solid rgba(92,184,68,.4);
        border-radius: var(--radius-md); padding: 18px 20px;
      }
      .confirm-total__label { font-size: 16px; font-weight: 700; color: var(--green-dark); }
      .confirm-total__value { font-size: 28px; font-weight: 900; color: var(--green-mid); }
      .confirm-total__unit { font-size: 13px; font-weight: 400; color: var(--text-muted); }
      .confirm-note { text-align: center; font-size: 12px; color: var(--text-hint); margin: 16px 0 0; }

      /* ── Summary sidebar ── */
      .summary-card {
        background: #fff;
        border: 1px solid var(--green-border);
        border-radius: var(--radius-lg);
        padding: 24px;
        box-shadow: var(--shadow-card);
        position: sticky;
        top: 100px;
      }
      .summary-card__title { font-size: 15px; font-weight: 800; color: var(--green-dark); margin-bottom: 18px; }
      .summary-card__img-wrap { border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
      .summary-card__img-wrap img { width: 100%; height: 120px; object-fit: cover; display: block; }
      .summary-card__terrain-name { font-size: 17px; font-weight: 800; color: var(--green-dark); margin-bottom: 4px; }
      .summary-card__terrain-sub  { font-size: 12px; color: var(--text-muted); margin-bottom: 16px; }
      .summary-card__divider { height: 1px; background: #e8f5e0; margin: 0 0 14px; }
      .summary-card__rows { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
      .summary-card__row { display: flex; justify-content: space-between; }
      .summary-card__row-label { font-size: 13px; color: var(--text-muted); }
      .summary-card__row-value { font-size: 13px; color: var(--green-dark); font-weight: 600; }
      .summary-card__row-value.muted { color: #c0d4bc; }
      .summary-card__total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
      .summary-card__total-label { font-size: 14px; font-weight: 700; color: var(--green-mid); }
      .summary-card__total-value { font-size: 26px; font-weight: 900; color: var(--green-mid); }
      .summary-card__total-unit  { font-size: 11px; font-weight: 400; color: var(--text-muted); }
      .summary-card__features { display: flex; flex-direction: column; gap: 8px; margin-bottom: 18px; }
      .summary-card__feature { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--text-muted); }
      .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green-light); flex-shrink: 0; }
      .summary-card__badges { padding: 14px 16px; background: var(--green-pale); border-radius: 10px; border: 1px solid #ddefd8; }
      .summary-badge { font-size: 12px; color: var(--green-mid); padding: 3px 0; font-weight: 600; }

      /* ── Auth modal ── */
      .modal-backdrop {
        position: fixed; inset: 0; z-index: 2000;
        display: flex; align-items: center; justify-content: center;
        background: rgba(0,0,0,.55); backdrop-filter: blur(8px);
        animation: fadeIn .3s ease;
      }
      .modal-box {
        background: #fff; border-radius: 24px;
        padding: 40px 36px; max-width: 400px; width: 90%;
        box-shadow: 0 25px 80px rgba(0,0,0,.3);
        text-align: center; direction: rtl;
        animation: slideUp .4s cubic-bezier(.22,1,.36,1);
        display: flex; flex-direction: column; gap: 10px;
      }
      .modal-icon { font-size: 36px; }
      .modal-title { font-size: 22px; font-weight: 900; color: var(--green-dark); margin: 0; }
      .modal-body  { font-size: 14px; color: var(--text-muted); line-height: 1.7; margin: 0; }
      .modal-body strong { color: var(--green-mid); }

      /* ── Boarding pass ticket ── */
      .ticket-wrap {
        background: #fff;
        border-radius: 20px;
        overflow: hidden;
        border: 1px solid var(--green-border);
        box-shadow: 0 8px 40px rgba(45,106,33,.13);
        max-width: 480px;
        margin: 24px auto;
        font-family: 'Cairo', sans-serif;
      }
      .ticket-header {
        background: linear-gradient(135deg, var(--green-mid), var(--green-light));
        padding: 28px 32px;
        color: #fff; text-align: center;
      }
      .ticket-header__label {
        font-size: 11px; font-weight: 700; letter-spacing: 3px;
        opacity: .85; text-transform: uppercase; margin-bottom: 8px;
      }
      .ticket-header__title { font-size: 28px; font-weight: 900; }
      .ticket-header__sub   { font-size: 13px; opacity: .8; margin-top: 4px; }

      /* Notch separator */
      .ticket-notch {
        display: flex; align-items: center;
        position: relative; overflow: visible;
        background: var(--bg-page);
      }
      .notch {
        width: 24px; height: 24px; border-radius: 50%;
        background: var(--bg-page); flex-shrink: 0;
        margin-top: -12px; margin-bottom: -12px;
        z-index: 1;
      }
      .notch--left  { margin-right: -12px; }
      .notch--right { margin-left: -12px; }
      .ticket-dashed-line {
        flex: 1; border-top: 2px dashed var(--green-border);
        background: #fff;
      }

      .ticket-body { background: #fff; padding: 24px 32px; }
      .ticket-info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 24px;
      }
      .ticket-info-item { display: flex; flex-direction: column; gap: 2px; }
      .ticket-info-label { font-size: 11px; color: var(--text-muted); font-weight: 600; letter-spacing: .5px; }
      .ticket-info-value { font-size: 14px; font-weight: 700; color: var(--green-dark); }

      .ticket-qr-section {
        display: flex; flex-direction: column; align-items: center;
        border-top: 1px dashed var(--green-border); padding-top: 20px;
      }
      .ticket-qr-img {
        width: 160px; height: 160px; border-radius: 12px;
        border: 2px solid var(--green-border); background: #fff; padding: 6px;
        margin-bottom: 8px;
      }
      .ticket-qr-hint { font-size: 11px; color: var(--text-muted); margin-bottom: 16px; }
      .ticket-pin-wrap { text-align: center; }
      .ticket-pin-label { font-size: 11px; color: var(--text-muted); font-weight: 600; margin-bottom: 4px; }
      .ticket-pin {
        font-size: 36px; font-weight: 900; letter-spacing: 8px;
        color: var(--green-mid); direction: ltr;
        background: var(--green-pale); border: 2px dashed var(--green-light);
        border-radius: 12px; padding: 12px 24px; display: inline-block;
      }

      .ticket-footer {
        background: var(--green-pale);
        border-top: 1px solid var(--green-border);
        padding: 16px 32px; text-align: center;
      }
      .ticket-footer-badge { font-size: 16px; font-weight: 800; color: var(--green-mid); margin-bottom: 4px; }
      .ticket-footer-note  { font-size: 11px; color: var(--text-muted); }

      .ticket-share { padding: 20px 32px; background: #fff; border-top: 1px solid var(--green-border); }
      .ticket-share-title { font-size: 13px; font-weight: 700; color: var(--green-mid); margin-bottom: 12px; text-align: center; }
      .ticket-share-btns { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; }
      .share-btn {
        color: #fff; border: none; padding: 9px 16px; border-radius: 50px;
        font-size: 12px; font-weight: 700; font-family: 'Cairo', sans-serif;
        cursor: pointer; transition: all .2s;
      }
      .share-btn:hover { transform: translateY(-2px); }

      /* ── Success screen ── */
      .success-screen {
        display: flex; flex-direction: column; align-items: center;
        padding: 120px 16px 60px;
        text-align: center;
      }
      .success-check {
        width: 80px; height: 80px; border-radius: 50%;
        background: linear-gradient(135deg, var(--green-mid), var(--green-light));
        display: flex; align-items: center; justify-content: center;
        font-size: 36px; color: #fff;
        box-shadow: 0 8px 24px rgba(45,106,33,.3);
        margin-bottom: 24px;
      }
      .success-title { font-size: 28px; font-weight: 900; color: var(--green-dark); margin: 0 0 12px; }
      .success-sub   { color: var(--text-muted); font-size: 15px; line-height: 1.8; max-width: 460px; margin: 0 0 8px; }

      /* ── Animations ── */
      @keyframes fadeIn  { from { opacity: 0; }  to { opacity: 1; } }
      @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

      /* ── Responsive: tablet ── */
      @media (max-width: 960px) {
        .res-layout {
          grid-template-columns: 1fr;
        }
        .summary-card {
          position: static;
          order: -1;
        }
        .res-container { padding: 100px 24px 60px; }
      }

      /* ── Responsive: mobile ── */
      @media (max-width: 600px) {
        .res-container { padding: 88px 0 48px; }
        .res-heading   { padding: 0 16px; }
        .stepper       { margin: 0 16px 20px; padding: 12px 14px; }
        .stepper-label { display: none; }

        .res-layout { display: flex; flex-direction: column; }
        .summary-card { margin: 0 16px; border-radius: var(--radius-md); }

        .panel {
          border-radius: 0; border-left: none; border-right: none;
          padding: 24px 16px; box-shadow: none;
        }

        .terrains-grid {
          display: flex; overflow-x: auto;
          gap: 12px; padding-bottom: 8px;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .terrains-grid::-webkit-scrollbar { display: none; }
        .terrain-card {
          min-width: 82vw; flex-shrink: 0;
          scroll-snap-align: center;
        }
        .terrain-card__img-wrap { height: 180px; }

        .slots-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .form-grid { grid-template-columns: 1fr; }

        .confirm-row { flex-wrap: wrap; }
        .confirm-row__img { width: 56px; height: 40px; }

        .ticket-wrap { border-radius: 0; border-left: none; border-right: none; }
        .ticket-info-grid { grid-template-columns: 1fr 1fr; }

        .res-title { font-size: 26px; }
      }
    `}</style>
  );
}