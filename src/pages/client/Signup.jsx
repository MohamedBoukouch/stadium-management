import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Signup Component
 * Modern registration form with validation and RTL support
 */
export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.length < 2) e.name = "الاسم الكامل مطلوب (حرفان على الأقل)";
    if (!form.email.trim()) e.email = "البريد الإلكتروني مطلوب";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "بريد إلكتروني غير صحيح";
    if (!form.phone.trim()) e.phone = "رقم الهاتف مطلوب";
    else if (!/^[0-9+]{9,14}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "رقم هاتف غير صحيح";
    if (!form.password) e.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 6) e.password = "6 أحرف على الأقل";
    if (form.password !== form.confirmPassword) e.confirmPassword = "كلمتا المرور غير متطابقتين";
    if (!form.agreeTerms) e.agreeTerms = "يجب الموافقة على الشروط";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({
        email: form.email,
        name: form.name,
        phone: form.phone,
      }));
      setLoading(false);
      navigate("/");
    }, 1500);
  };

  const inputBase = (err) => ({
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: `1.5px solid ${err ? "#e57373" : "#c8e6c0"}`,
    background: err ? "#fff5f5" : "#f8fbf7",
    fontSize: 15, fontFamily: "'Cairo', sans-serif", color: "#1a3d14",
    outline: "none", transition: "all 0.2s", boxSizing: "border-box",
  });

  const labelStyle = {
    display: "block", fontSize: 13, fontWeight: 700,
    color: "#2d6a21", marginBottom: 6, fontFamily: "'Cairo', sans-serif",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1f0a 0%, #1a3d14 50%, #2d6a21 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px", direction: "rtl", fontFamily: "'Cairo', sans-serif",
    }}>
      <style>{`
        @media (max-width: 480px) {
          .signup-card { padding: 28px 20px !important; border-radius: 20px !important; }
          .signup-title { font-size: 22px !important; }
          .signup-input { padding: 12px 14px !important; font-size: 14px !important; }
          .signup-btn { padding: 14px !important; font-size: 15px !important; }
          .signup-row { flex-direction: column !important; gap: 0 !important; }
        }
      `}</style>

      <div className="signup-card" style={{
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)",
        borderRadius: 24, padding: "44px 40px", width: "100%", maxWidth: 480,
        boxShadow: "0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "linear-gradient(135deg, #2d6a21, #5cb844)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, margin: "0 auto 14px", boxShadow: "0 8px 24px rgba(45,106,33,0.3)",
          }}>⚽</div>
          <h1 className="signup-title" style={{
            fontSize: 26, fontWeight: 900, color: "#1a3d14",
            margin: 0, fontFamily: "'Cairo', sans-serif",
          }}>إنشاء حساب جديد</h1>
          <p style={{ color: "#5a8a50", fontSize: 14, marginTop: 6, marginBottom: 0 }}>
            انضم إلى الملعب الذهبي واحجز ملعبك بسهولة
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Name + Phone row */}
          <div className="signup-row" style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>الاسم الكامل *</label>
              <input
                type="text"
                placeholder="محمد الأمين"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="signup-input"
                style={inputBase(errors.name)}
                onFocus={e => { e.target.style.borderColor = "#5cb844"; e.target.style.boxShadow = "0 0 0 3px rgba(92,184,68,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = errors.name ? "#e57373" : "#c8e6c0"; e.target.style.boxShadow = "none"; }}
              />
              {errors.name && <span style={{ fontSize: 12, color: "#e57373", marginTop: 4, display: "block" }}>{errors.name}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>رقم الهاتف *</label>
              <input
                type="tel"
                placeholder="+212 6xx xxx xxx"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="signup-input"
                style={{ ...inputBase(errors.phone), direction: "ltr", textAlign: "left" }}
                onFocus={e => { e.target.style.borderColor = "#5cb844"; e.target.style.boxShadow = "0 0 0 3px rgba(92,184,68,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = errors.phone ? "#e57373" : "#c8e6c0"; e.target.style.boxShadow = "none"; }}
              />
              {errors.phone && <span style={{ fontSize: 12, color: "#e57373", marginTop: 4, display: "block" }}>{errors.phone}</span>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelStyle}>البريد الإلكتروني *</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="signup-input"
              style={{ ...inputBase(errors.email), direction: "ltr", textAlign: "left" }}
              onFocus={e => { e.target.style.borderColor = "#5cb844"; e.target.style.boxShadow = "0 0 0 3px rgba(92,184,68,0.15)"; }}
              onBlur={e => { e.target.style.borderColor = errors.email ? "#e57373" : "#c8e6c0"; e.target.style.boxShadow = "none"; }}
            />
            {errors.email && <span style={{ fontSize: 12, color: "#e57373", marginTop: 4, display: "block" }}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div>
            <label style={labelStyle}>كلمة المرور *</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="signup-input"
                style={{ ...inputBase(errors.password), padding: "14px 44px 14px 16px", direction: "ltr" }}
                onFocus={e => { e.target.style.borderColor = "#5cb844"; e.target.style.boxShadow = "0 0 0 3px rgba(92,184,68,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = errors.password ? "#e57373" : "#c8e6c0"; e.target.style.boxShadow = "none"; }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#5a8a50", padding: 4,
              }}>{showPassword ? "🙈" : "👁️"}</button>
            </div>
            {errors.password && <span style={{ fontSize: 12, color: "#e57373", marginTop: 4, display: "block" }}>{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={labelStyle}>تأكيد كلمة المرور *</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                className="signup-input"
                style={{ ...inputBase(errors.confirmPassword), padding: "14px 44px 14px 16px", direction: "ltr" }}
                onFocus={e => { e.target.style.borderColor = "#5cb844"; e.target.style.boxShadow = "0 0 0 3px rgba(92,184,68,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = errors.confirmPassword ? "#e57373" : "#c8e6c0"; e.target.style.boxShadow = "none"; }}
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{
                position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#5a8a50", padding: 4,
              }}>{showConfirm ? "🙈" : "👁️"}</button>
            </div>
            {errors.confirmPassword && <span style={{ fontSize: 12, color: "#e57373", marginTop: 4, display: "block" }}>{errors.confirmPassword}</span>}
          </div>

          {/* Terms checkbox */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <input
              type="checkbox"
              id="terms"
              checked={form.agreeTerms}
              onChange={e => setForm({ ...form, agreeTerms: e.target.checked })}
              style={{
                width: 20, height: 20, accentColor: "#2d6a21",
                marginTop: 2, cursor: "pointer",
              }}
            />
            <label htmlFor="terms" style={{
              fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif",
              lineHeight: 1.6, cursor: "pointer",
            }}>
              أوافق على{" "}
              <Link to="/terms" style={{ color: "#2d6a21", fontWeight: 700, textDecoration: "none" }}>شروط الاستخدام</Link>
              {" "}و{" "}
              <Link to="/privacy" style={{ color: "#2d6a21", fontWeight: 700, textDecoration: "none" }}>سياسة الخصوصية</Link>
            </label>
          </div>
          {errors.agreeTerms && <span style={{ fontSize: 12, color: "#e57373", marginTop: -8, display: "block" }}>{errors.agreeTerms}</span>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="signup-btn"
            style={{
              width: "100%", padding: "16px", borderRadius: 12,
              border: "none", background: loading ? "#a0c090" : "linear-gradient(135deg, #2d6a21, #5cb844)",
              color: "#fff", fontSize: 16, fontWeight: 800,
              fontFamily: "'Cairo', sans-serif", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 24px rgba(45,106,33,0.3)", transition: "all 0.3s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {loading ? (
              <>
                <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                جاري إنشاء الحساب...
              </>
            ) : (
              "إنشاء الحساب →"
            )}
          </button>
        </form>

        {/* Login link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", margin: "20px 0 0" }}>
          لديك حساب بالفعل؟{" "}
          <Link to="/login" style={{ color: "#2d6a21", fontWeight: 800, textDecoration: "none" }}>
            تسجيل الدخول
          </Link>
        </p>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}