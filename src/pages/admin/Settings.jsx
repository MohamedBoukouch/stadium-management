import { useState } from "react";
import {
  IconUser,
  IconBuilding,
  IconClock,
  IconCalendarEvent,
  IconBell,
  IconCamera,
  IconEye,
  IconEyeOff,
  IconDeviceFloppy,
} from "@tabler/icons-react";

// ─── Sub Components (OUTSIDE main) ────────────────────────────

const SectionCard = ({ title, icon, children }) => (
  <div style={{
    background: "#fff", borderRadius: 14,
    border: "1px solid #e8f0e8", overflow: "hidden",
    marginBottom: 16,
  }}>
    <div style={{
      padding: "14px 20px",
      borderBottom: "1px solid #e8f0e8",
      display: "flex", alignItems: "center", gap: 10,
      background: "#f8fbf7",
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: "#edf7ea", color: "#2d6a21",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{icon}</div>
      <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>{title}</div>
    </div>
    <div style={{ padding: 20 }}>{children}</div>
  </div>
);

const Field = ({ label, children, half }) => (
  <div style={{ marginBottom: 14, width: half ? "calc(50% - 6px)" : "100%" }}>
    <div style={{ fontSize: 11, fontWeight: 700, color: "#5a8a50", marginBottom: 5 }}>{label}</div>
    {children}
  </div>
);

const Toggle = ({ value, onChange, label, sub }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 14px", background: "#f8fbf7",
    borderRadius: 10, border: "1px solid #e8f0e8", marginBottom: 10,
  }}>
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>{label}</div>
      {sub && <div style={{ fontSize: 10, color: "#8aaa80", marginTop: 2 }}>{sub}</div>}
    </div>
    <div
      onClick={() => onChange(!value)}
      style={{
        width: 42, height: 24, borderRadius: 12, cursor: "pointer",
        background: value ? "#2d6a21" : "#ddd",
        position: "relative", transition: "background .2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3,
        left: value ? 20 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff", transition: "left .2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.15)",
      }} />
    </div>
  </div>
);

const SaveBtn = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 7,
      padding: "9px 20px", borderRadius: 10, border: "none",
      background: "linear-gradient(135deg,#2d6a21,#5cb844)",
      color: "#fff", fontSize: 12, fontWeight: 800,
      fontFamily: "'Cairo',sans-serif", cursor: "pointer",
      boxShadow: "0 4px 14px rgba(45,106,33,0.3)",
    }}
  >
    <IconDeviceFloppy size={15} />
    حفظ التغييرات
  </button>
);

// ─── Main Component ────────────────────────────────────────────
const Settings = () => {
  const font = "'Cairo', sans-serif";
  const border = "#e8f0e8";
  const bg = "#f4f8f3";

  const inputStyle = {
    width: "100%", padding: "9px 12px", borderRadius: 9,
    border: `1px solid ${border}`, background: bg,
    fontFamily: font, fontSize: 12, color: "#1a3d14",
    outline: "none", direction: "rtl",
  };

  // ─── State: Profile ───
  const [profile, setProfile] = useState({
    name: "المدير العام",
    email: "admin@mala3ib.ma",
    phone: "0612345678",
    photo: null,
  });
  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  });
  const [showPass, setShowPass] = useState({
    current: false, newPass: false, confirm: false,
  });

  // ─── State: Establishment ───
  const [estab, setEstab] = useState({
    name: "الملعب الذهبي",
    address: "شارع محمد الخامس، مراكش",
    city: "مراكش",
    phone: "0524123456",
    email: "contact@mala3ib.ma",
    logo: null,
  });

  // ─── State: Working Hours ───
  const days = ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"];
  const [hours, setHours] = useState(
    days.map((d, i) => ({ day: d, open: i < 6, from: "08:00", to: "23:00" }))
  );

  // ─── State: Booking Settings ───
  const [booking, setBooking] = useState({
    minDuration: "60",
    cancelDelay: "24",
    
    
    autoConfirm: false,
  });

  // ─── State: Notifications ───
  const [notifs, setNotifs] = useState({
    newReservation: true,
    dailyReport: true,
    maintenance: true,
    cancellation: true,
    whatsapp: false,
    email: true,
  });

  // ─── Save Handlers ───
  const handleSave = (section) => {
    alert(`✅ تم حفظ ${section} بنجاح`);
  };

  // ─── Profile Photo Upload ───
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfile(p => ({ ...p, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  // ─── Logo Upload ───
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEstab(p => ({ ...p, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ padding: 24, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
        .set-input:focus { border-color: #2d6a21 !important; box-shadow: 0 0 0 3px rgba(45,106,33,0.1); }
        .field-row { display: flex; gap: 12px; flex-wrap: wrap; }
      `}</style>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: "#1a3d14" }}>الإعدادات</h1>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#7ab870" }}>إدارة إعدادات الحساب والمنصة</p>
      </div>

      {/* ══════════════════════════════
          SECTION 1 — الملف الشخصي
      ══════════════════════════════ */}
      <SectionCard title="الملف الشخصي" icon={<IconUser size={16} />}>

        {/* Photo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
          <div style={{ position: "relative" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: profile.photo ? "none" : "linear-gradient(135deg,#2d6a21,#5cb844)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 900, color: "#fff",
              overflow: "hidden", border: "3px solid #c8e6c0",
            }}>
              {profile.photo
                ? <img src={profile.photo} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "م"
              }
            </div>
            <label style={{
              position: "absolute", bottom: 0, left: 0,
              width: 24, height: 24, borderRadius: "50%",
              background: "#2d6a21", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer",
              border: "2px solid #fff",
            }}>
              <IconCamera size={12} color="#fff" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
            </label>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#1a3d14" }}>{profile.name}</div>
            <div style={{ fontSize: 11, color: "#8aaa80", marginTop: 2 }}>{profile.email}</div>
            <div style={{ fontSize: 10, color: "#7ab870", marginTop: 2 }}>انقر على الصورة لتغييرها</div>
          </div>
        </div>

        {/* Fields */}
        <div className="field-row">
          <Field label="الاسم الكامل" half>
            <input
              className="set-input"
              style={inputStyle}
              value={profile.name}
              onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}
            />
          </Field>
          <Field label="رقم الهاتف" half>
            <input
              className="set-input"
              style={inputStyle}
              value={profile.phone}
              onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
            />
          </Field>
        </div>
        <Field label="البريد الإلكتروني">
          <input
            className="set-input"
            style={inputStyle}
            value={profile.email}
            onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
          />
        </Field>

        {/* Change Password */}
        <div style={{ borderTop: "1px solid #e8f0e8", paddingTop: 16, marginTop: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#1a3d14", marginBottom: 12 }}>تغيير كلمة المرور</div>
          <div className="field-row">
            {[
              { key: "current", label: "كلمة المرور الحالية" },
              { key: "newPass", label: "كلمة المرور الجديدة" },
              { key: "confirm", label: "تأكيد كلمة المرور" },
            ].map(f => (
              <Field key={f.key} label={f.label} half>
                <div style={{ position: "relative" }}>
                  <input
                    className="set-input"
                    type={showPass[f.key] ? "text" : "password"}
                    style={{ ...inputStyle, paddingLeft: 36 }}
                    value={passwords[f.key]}
                    onChange={e => setPasswords(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder="••••••••"
                  />
                  <button
                    onClick={() => setShowPass(s => ({ ...s, [f.key]: !s[f.key] }))}
                    style={{ position: "absolute", top: "50%", left: 10, transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#8aaa80" }}
                  >
                    {showPass[f.key] ? <IconEyeOff size={15} /> : <IconEye size={15} />}
                  </button>
                </div>
              </Field>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <SaveBtn onClick={() => handleSave("الملف الشخصي")} />
        </div>
      </SectionCard>

      {/* ══════════════════════════════
          SECTION 2 — معلومات المؤسسة
      ══════════════════════════════ */}
      <SectionCard title="معلومات المؤسسة" icon={<IconBuilding size={16} />}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <label style={{ cursor: "pointer" }}>
            <div style={{
              width: 72, height: 72, borderRadius: 12,
              background: estab.logo ? "none" : "linear-gradient(135deg,#2d6a21,#5cb844)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, border: "2px dashed #c8e6c0", overflow: "hidden",
            }}>
              {estab.logo
                ? <img src={estab.logo} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : "⚽"
              }
            </div>
            <input type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
          </label>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#1a3d14" }}>{estab.name}</div>
            <div style={{ fontSize: 10, color: "#7ab870", marginTop: 3 }}>انقر لتغيير الشعار</div>
          </div>
        </div>

        <div className="field-row">
          <Field label="اسم المؤسسة" half>
            <input className="set-input" style={inputStyle} value={estab.name} onChange={e => setEstab(p => ({ ...p, name: e.target.value }))} />
          </Field>
          <Field label="المدينة" half>
            <select className="set-input" style={inputStyle} value={estab.city} onChange={e => setEstab(p => ({ ...p, city: e.target.value }))}>
              {["مراكش", "الدار البيضاء", "الرباط", "فاس", "أكادير", "طنجة", "مكناس"].map(c => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="العنوان الكامل">
          <input className="set-input" style={inputStyle} value={estab.address} onChange={e => setEstab(p => ({ ...p, address: e.target.value }))} />
        </Field>
        <div className="field-row">
          <Field label="الهاتف" half>
            <input className="set-input" style={inputStyle} value={estab.phone} onChange={e => setEstab(p => ({ ...p, phone: e.target.value }))} />
          </Field>
          <Field label="البريد الإلكتروني" half>
            <input className="set-input" style={inputStyle} value={estab.email} onChange={e => setEstab(p => ({ ...p, email: e.target.value }))} />
          </Field>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-start" }}>
          <SaveBtn onClick={() => handleSave("معلومات المؤسسة")} />
        </div>
      </SectionCard>

      {/* ══════════════════════════════
          SECTION 3 — ساعات العمل
      ══════════════════════════════ */}
      <SectionCard title="ساعات العمل" icon={<IconClock size={16} />}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hours.map((h, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "100px 60px 1fr",
              alignItems: "center", gap: 12,
              padding: "10px 14px", background: bg,
              borderRadius: 10, border: `1px solid ${border}`,
              opacity: h.open ? 1 : 0.5,
            }}>
              {/* Day Name */}
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1a3d14" }}>{h.day}</span>

              {/* Toggle */}
              <div
                onClick={() => setHours(prev => prev.map((d, j) => j === i ? { ...d, open: !d.open } : d))}
                style={{
                  width: 40, height: 22, borderRadius: 11, cursor: "pointer",
                  background: h.open ? "#2d6a21" : "#ccc",
                  position: "relative", transition: "background .2s",
                }}
              >
                <div style={{
                  position: "absolute", top: 3,
                  left: h.open ? 18 : 3,
                  width: 16, height: 16, borderRadius: "50%",
                  background: "#fff", transition: "left .2s",
                }} />
              </div>

              {/* Time Range */}
              {h.open ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="time" value={h.from}
                    onChange={e => setHours(prev => prev.map((d, j) => j === i ? { ...d, from: e.target.value } : d))}
                    style={{ ...inputStyle, width: 110, padding: "6px 10px" }}
                  />
                  <span style={{ fontSize: 11, color: "#8aaa80" }}>←</span>
                  <input
                    type="time" value={h.to}
                    onChange={e => setHours(prev => prev.map((d, j) => j === i ? { ...d, to: e.target.value } : d))}
                    style={{ ...inputStyle, width: 110, padding: "6px 10px" }}
                  />
                </div>
              ) : (
                <span style={{ fontSize: 11, color: "#aaa", fontStyle: "italic" }}>مغلق</span>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 16 }}>
          <SaveBtn onClick={() => handleSave("ساعات العمل")} />
        </div>
      </SectionCard>

      {/* ══════════════════════════════
          SECTION 4 — إعدادات الحجز
      ══════════════════════════════ */}
      <SectionCard title="إعدادات الحجز" icon={<IconCalendarEvent size={16} />}>

        <div className="field-row">
          <Field label="الحد الأدنى للحجز (بالدقائق)" half>
            <select className="set-input" style={inputStyle} value={booking.minDuration} onChange={e => setBooking(b => ({ ...b, minDuration: e.target.value }))}>
              <option value="60">ساعة واحدة (60 د)</option>
              <option value="90">ساعة ونصف (90 د)</option>
              <option value="120">ساعتان (120 د)</option>
            </select>
          </Field>
          <Field label="مهلة الإلغاء (بالساعات)" half>
            <select className="set-input" style={inputStyle} value={booking.cancelDelay} onChange={e => setBooking(b => ({ ...b, cancelDelay: e.target.value }))}>
              <option value="6">6 ساعات</option>
              <option value="12">12 ساعة</option>
              <option value="24">24 ساعة</option>
              <option value="48">48 ساعة</option>
            </select>
          </Field>
        </div>

        <Toggle
          value={booking.autoConfirm}
          onChange={v => setBooking(b => ({ ...b, autoConfirm: v }))}
          label="تأكيد الحجز تلقائياً"
          sub="سيتم تأكيد الحجوزات مباشرة دون انتظار موافقتك"
        />

        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 8 }}>
          <SaveBtn onClick={() => handleSave("إعدادات الحجز")} />
        </div>
      </SectionCard>

      {/* ══════════════════════════════
          SECTION 5 — الإشعارات
      ══════════════════════════════ */}
      <SectionCard title="الإشعارات" icon={<IconBell size={16} />}>

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#8aaa80", marginBottom: 10, letterSpacing: 0.5 }}>إشعارات المنصة</div>
          <Toggle value={notifs.newReservation} onChange={v => setNotifs(n => ({ ...n, newReservation: v }))} label="حجز جديد" sub="إشعار عند كل حجز جديد من عميل" />
          <Toggle value={notifs.cancellation} onChange={v => setNotifs(n => ({ ...n, cancellation: v }))} label="إلغاء حجز" sub="إشعار عند إلغاء حجز من طرف العميل" />
          <Toggle value={notifs.maintenance} onChange={v => setNotifs(n => ({ ...n, maintenance: v }))} label="تذكير الصيانة" sub="تنبيه عند اقتراب موعد صيانة الملعب" />
        </div>

        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#8aaa80", marginBottom: 10, letterSpacing: 0.5 }}>قنوات التواصل</div>
          <Toggle value={notifs.email} onChange={v => setNotifs(n => ({ ...n, email: v }))} label="إشعارات البريد الإلكتروني" sub="استلام الإشعارات على بريدك الإلكتروني" />
          <Toggle value={notifs.dailyReport} onChange={v => setNotifs(n => ({ ...n, dailyReport: v }))} label="تقرير يومي بالبريد" sub="ملخص يومي لحجوزات وإيرادات اليوم" />
          <Toggle value={notifs.whatsapp} onChange={v => setNotifs(n => ({ ...n, whatsapp: v }))} label="إشعارات واتساب" sub="استلام الإشعارات عبر واتساب (قريباً)" />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-start", marginTop: 8 }}>
          <SaveBtn onClick={() => handleSave("الإشعارات")} />
        </div>
      </SectionCard>

    </div>
  );
};

export default Settings;
