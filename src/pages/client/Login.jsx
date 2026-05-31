import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/**
 * Login Component
 * Modern glassmorphism login form with RTL support
 */
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "بريد إلكتروني غير صحيح";
    if (!form.password) e.password = "كلمة المرور مطلوبة";
    else if (form.password.length < 6) e.password = "6 أحرف على الأقل";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem("user", JSON.stringify({ email: form.email, name: "مستخدم" }));
      setLoading(false);
      navigate("/");
    }, 1500);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a1f0a 0%, #1a3d14 50%, #2d6a21 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      direction: "rtl",
      fontFamily: "'Cairo', sans-serif",
    }}>
      <style>{`
        @media (max-width: 480px) {
          .login-card { padding: 32px 24px !important; border-radius: 20px !important; }
          .login-title { font-size: 24px !important; }
          .login-input { padding: 12px 14px !important; font-size: 14px !important; }
          .login-btn { padding: 14px !important; font-size: 15px !important; }
        }
      `}</style>

      <div className="login-card" style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderRadius: 24,
        padding: "48px 40px",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 25px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: "linear-gradient(135deg, #2d6a21, #5cb844)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 16px", boxShadow: "0 8px 24px rgba(45,106,33,0.3)",
          }}>⚽</div>
          <h1 className="login-title" style={{
            fontSize: 28, fontWeight: 900, color: "#1a3d14",
            margin: 0, fontFamily: "'Cairo', sans-serif",
          }}>تسجيل الدخول</h1>
          <p style={{ color: "#5a8a50", fontSize: 14, marginTop: 8, marginBottom: 0 }}>
            أهلاً بك مجدداً في الملعب الذهبي
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Email */}
          <div>
            <label style={{
              display: "block", fontSize: 13, fontWeight: 700,
              color: "#2d6a21", marginBottom: 6, fontFamily: "'Cairo', sans-serif",
            }}>البريد الإلكتروني</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="login-input"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 12,
                border: `1.5px solid ${errors.email ? "#e57373" : "#c8e6c0"}`,
                background: errors.email ? "#fff5f5" : "#f8fbf7",
                fontSize: 15, fontFamily: "'Cairo', sans-serif", color: "#1a3d14",
                outline: "none", transition: "all 0.2s", boxSizing: "border-box",
                direction: "ltr", textAlign: "left",
              }}
              onFocus={e => { e.target.style.borderColor = "#5cb844"; e.target.style.boxShadow = "0 0 0 3px rgba(92,184,68,0.15)"; }}
              onBlur={e => { e.target.style.borderColor = errors.email ? "#e57373" : "#c8e6c0"; e.target.style.boxShadow = "none"; }}
            />
            {errors.email && <span style={{ fontSize: 12, color: "#e57373", marginTop: 4, display: "block" }}>{errors.email}</span>}
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: "block", fontSize: 13, fontWeight: 700,
              color: "#2d6a21", marginBottom: 6, fontFamily: "'Cairo', sans-serif",
            }}>كلمة المرور</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="login-input"
                style={{
                  width: "100%", padding: "14px 44px 14px 16px", borderRadius: 12,
                  border: `1.5px solid ${errors.password ? "#e57373" : "#c8e6c0"}`,
                  background: errors.password ? "#fff5f5" : "#f8fbf7",
                  fontSize: 15, fontFamily: "'Cairo', sans-serif", color: "#1a3d14",
                  outline: "none", transition: "all 0.2s", boxSizing: "border-box",
                  direction: "ltr",
                }}
                onFocus={e => { e.target.style.borderColor = "#5cb844"; e.target.style.boxShadow = "0 0 0 3px rgba(92,184,68,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = errors.password ? "#e57373" : "#c8e6c0"; e.target.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 18, color: "#5a8a50", padding: 4,
                }}
              >{showPassword ? "🙈" : "👁️"}</button>
            </div>
            {errors.password && <span style={{ fontSize: 12, color: "#e57373", marginTop: 4, display: "block" }}>{errors.password}</span>}
          </div>

          {/* Forgot password */}
          <div style={{ textAlign: "left" }}>
            <Link to="/forgot-password" style={{
              fontSize: 13, color: "#5cb844", textDecoration: "none",
              fontWeight: 600, fontFamily: "'Cairo', sans-serif",
            }}>نسيت كلمة المرور؟</Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="login-btn"
            style={{
              width: "100%", padding: "16px", borderRadius: 12,
              border: "none", background: loading ? "#a0c090" : "linear-gradient(135deg, #2d6a21, #5cb844)",
              color: "#fff", fontSize: 16, fontWeight: 800,
              fontFamily: "'Cairo', sans-serif", cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 6px 24px rgba(45,106,33,0.3)",
              transition: "all 0.3s", display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            {loading ? (
              <>
                <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول →"
            )}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e8f5e0" }} />
          <span style={{ fontSize: 12, color: "#a0c090", fontFamily: "'Cairo', sans-serif" }}>أو</span>
          <div style={{ flex: 1, height: 1, background: "#e8f5e0" }} />
        </div>

        {/* Social login */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[
            { icon: "G", label: "Google", color: "#fff", border: "#ddd", text: "#555" },
            { icon: "f", label: "Facebook", color: "#1877F2", border: "#1877F2", text: "#fff" },
          ].map(({ icon, label, color, border, text }) => (
            <button key={label} style={{
              flex: 1, padding: "12px", borderRadius: 10,
              border: `1.5px solid ${border}`, background: color,
              color: text, fontSize: 14, fontWeight: 700,
              fontFamily: "'Cairo', sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
            }}>
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Signup link */}
        <p style={{ textAlign: "center", fontSize: 14, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", margin: 0 }}>
          ليس لديك حساب؟{" "}
          <Link to="/signup" style={{ color: "#2d6a21", fontWeight: 800, textDecoration: "none" }}>
            أنشئ حساباً الآن
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}