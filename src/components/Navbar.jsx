import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/**
 * Navbar Component
 * Fixed navigation with scroll effect, mobile hamburger menu,
 * and authentication-aware login/signup buttons.
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check auth status on mount and route change
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowUserMenu(false);
    navigate("/");
  };

  const navLinks = [
    { to: "/", label: "الرئيسية" },
    { to: "/terrains", label: "الملاعب" },
    { to: "/reservation", label: "الحجز" },
    { to: "/about", label: "من نحن" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{`
        /* ========== MOBILE (≤768px) ========== */
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-auth-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu { display: flex !important; }
          nav { padding: 12px 20px !important; }
          .nav-logo-text { font-size: 15px !important; }
          .nav-logo-sub { font-size: 9px !important; }
        }

        /* ========== TABLET (769-1024px) ========== */
        @media (max-width: 1024px) and (min-width: 769px) {
          .nav-desktop-links { gap: 24px !important; }
          .nav-auth-desktop { gap: 8px !important; }
          nav { padding: 14px 32px !important; }
        }

        /* ========== DESKTOP (>1024px) ========== */
        @media (min-width: 1025px) {
          .nav-hamburger { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }

        /* ========== SMALL MOBILE (≤480px) ========== */
        @media (max-width: 480px) {
          nav { padding: 10px 16px !important; }
          .nav-logo-icon { width: 32px !important; height: 32px !important; font-size: 16px !important; }
          .nav-logo-text { font-size: 14px !important; }
        }
      `}</style>

      {/* ─── MAIN NAVBAR ─── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        padding: scrolled ? "12px 48px" : "18px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid #c8e6c0" : "1px solid rgba(200,230,192,0.3)",
        boxShadow: scrolled ? "0 2px 24px rgba(45,106,33,0.08)" : "none",
        transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        direction: "rtl",
        fontFamily: "'Cairo', sans-serif",
      }}>

        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div className="nav-logo-icon" style={{
            width: 42, height: 42, borderRadius: 12,
            background: "linear-gradient(135deg, #2d6a21, #5cb844)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 16px rgba(45,106,33,0.25)",
            flexShrink: 0, transition: "transform 0.3s",
          }}>⚽</div>
          <div>
            <div className="nav-logo-text" style={{ fontSize: 17, fontWeight: 900, color: "#1a3d14", lineHeight: 1.2 }}>
              الملعب الذهبي
            </div>
            <div className="nav-logo-sub" style={{ fontSize: 10, color: "#5cb844", letterSpacing: 1, fontWeight: 600 }}>
              ملعب اصطناعي
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              style={{
                textDecoration: "none",
                color: isActive(l.to) ? "#2d6a21" : "#4a7a3a",
                fontSize: 15, fontWeight: isActive(l.to) ? 800 : 600,
                fontFamily: "'Cairo', sans-serif",
                transition: "color 0.2s",
                position: "relative",
                paddingBottom: 4,
              }}
              onMouseEnter={e => { e.target.style.color = "#2d6a21"; }}
              onMouseLeave={e => { if (!isActive(l.to)) e.target.style.color = "#4a7a3a"; }}
            >
              {l.label}
              {isActive(l.to) && (
                <span style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 2, background: "linear-gradient(90deg, #5cb844, #2d6a21)",
                  borderRadius: 2,
                }} />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="nav-auth-desktop" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            /* ── Logged In: User Avatar + Dropdown ── */
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "rgba(45,106,33,0.08)", border: "1.5px solid #c8e6c0",
                  borderRadius: 50, padding: "6px 16px 6px 10px",
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2d6a21, #5cb844)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 14, fontWeight: 800,
                }}>
                  {user.name?.charAt(0) || "👤"}
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>
                  {user.name || "مستخدم"}
                </span>
                <span style={{ fontSize: 12, color: "#5a8a50", transition: "transform 0.2s", transform: showUserMenu ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0,
                  background: "#fff", border: "1px solid #c8e6c0",
                  borderRadius: 14, padding: "8px 0",
                  boxShadow: "0 12px 40px rgba(45,106,33,0.12)",
                  minWidth: 180, zIndex: 1000,
                  animation: "fadeIn 0.2s ease",
                }}>
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid #f0f7ee" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a3d14" }}>{user.name || "مستخدم"}</div>
                    <div style={{ fontSize: 11, color: "#5a8a50", marginTop: 2 }}>{user.email}</div>
                  </div>
                  <button onClick={() => { setShowUserMenu(false); navigate("/reservations"); }} style={{
                    width: "100%", textAlign: "right", padding: "10px 16px",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, fontFamily: "'Cairo', sans-serif", color: "#4a7a3a",
                    transition: "background 0.2s",
                  }} onMouseEnter={e => e.currentTarget.style.background = "#f0f7ee"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    📋 حجوزاتي
                  </button>
                  <button onClick={() => { setShowUserMenu(false); navigate("/profile"); }} style={{
                    width: "100%", textAlign: "right", padding: "10px 16px",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, fontFamily: "'Cairo', sans-serif", color: "#4a7a3a",
                    transition: "background 0.2s",
                  }} onMouseEnter={e => e.currentTarget.style.background = "#f0f7ee"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    ⚙️ الإعدادات
                  </button>
                  <div style={{ borderTop: "1px solid #f0f7ee", margin: "4px 0" }} />
                  <button onClick={handleLogout} style={{
                    width: "100%", textAlign: "right", padding: "10px 16px",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, fontFamily: "'Cairo', sans-serif", color: "#e57373",
                    transition: "background 0.2s",
                  }} onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    🚪 تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Not Logged In: Login + Signup ── */
            <>
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  color: "#2d6a21", fontSize: 14, fontWeight: 700,
                  fontFamily: "'Cairo', sans-serif",
                  padding: "10px 20px", borderRadius: 10,
                  border: "1.5px solid #c8e6c0",
                  background: "transparent",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(45,106,33,0.06)";
                  e.currentTarget.style.borderColor = "#5cb844";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#c8e6c0";
                }}
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/signup"
                style={{
                  textDecoration: "none",
                  color: "#fff", fontSize: 14, fontWeight: 800,
                  fontFamily: "'Cairo', sans-serif",
                  padding: "10px 22px", borderRadius: 10,
                  background: "linear-gradient(135deg, #2d6a21, #5cb844)",
                  boxShadow: "0 4px 16px rgba(45,106,33,0.25)",
                  transition: "all 0.3s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 24px rgba(45,106,33,0.35)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,106,33,0.25)";
                }}
              >
                إنشاء حساب
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Button */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", flexDirection: "column", gap: 5,
            background: "none", border: "none", cursor: "pointer",
            padding: 8, zIndex: 1001,
          }}
          aria-label="Toggle menu"
        >
          <span style={{
            width: 24, height: 2.5, background: "#2d6a21", borderRadius: 2,
            display: "block", transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none",
          }} />
          <span style={{
            width: 24, height: 2.5, background: "#2d6a21", borderRadius: 2,
            display: "block", transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            opacity: menuOpen ? 0 : 1,
            transform: menuOpen ? "translateX(-10px)" : "none",
          }} />
          <span style={{
            width: 24, height: 2.5, background: "#2d6a21", borderRadius: 2,
            display: "block", transition: "all 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none",
          }} />
        </button>
      </nav>

      {/* ─── MOBILE MENU ─── */}
      <div
        className="nav-mobile-menu"
        style={{
          display: menuOpen ? "flex" : "none",
          flexDirection: "column",
          position: "fixed", top: 66, left: 0, right: 0, zIndex: 998,
          background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)",
          borderBottom: "1px solid #c8e6c0",
          boxShadow: "0 12px 40px rgba(45,106,33,0.1)",
          direction: "rtl", fontFamily: "'Cairo', sans-serif",
          animation: menuOpen ? "slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
        }}
      >
        {/* Nav Links */}
        {navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            onClick={() => setMenuOpen(false)}
            style={{
              textDecoration: "none",
              color: isActive(l.to) ? "#2d6a21" : "#4a7a3a",
              fontSize: 16, fontWeight: isActive(l.to) ? 800 : 600,
              padding: "16px 24px",
              borderBottom: "1px solid #f0f7ee",
              background: isActive(l.to) ? "#f0f7ee" : "transparent",
              transition: "background 0.2s",
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: isActive(l.to) ? "#5cb844" : "transparent",
              border: isActive(l.to) ? "none" : "1.5px solid #c8e6c0",
            }} />
            {l.label}
          </Link>
        ))}

        {/* Mobile Auth Section */}
        <div style={{ padding: "20px 24px", borderTop: "2px solid #e8f5e0" }}>
          {user ? (
            <div>
              <div style={{
                display: "flex", alignItems: "center", gap: 12, marginBottom: 16,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2d6a21, #5cb844)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 18, fontWeight: 800,
                }}>
                  {user.name?.charAt(0) || "👤"}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a3d14" }}>{user.name || "مستخدم"}</div>
                  <div style={{ fontSize: 12, color: "#5a8a50" }}>{user.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => { setMenuOpen(false); navigate("/reservations"); }} style={{
                  width: "100%", padding: "12px", borderRadius: 10,
                  border: "1.5px solid #c8e6c0", background: "#fff",
                  color: "#2d6a21", fontSize: 14, fontWeight: 700,
                  fontFamily: "'Cairo', sans-serif", cursor: "pointer",
                }}>📋 حجوزاتي</button>
                <button onClick={() => { setMenuOpen(false); navigate("/profile"); }} style={{
                  width: "100%", padding: "12px", borderRadius: 10,
                  border: "1.5px solid #c8e6c0", background: "#fff",
                  color: "#2d6a21", fontSize: 14, fontWeight: 700,
                  fontFamily: "'Cairo', sans-serif", cursor: "pointer",
                }}>⚙️ الإعدادات</button>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} style={{
                  width: "100%", padding: "12px", borderRadius: 10,
                  border: "1.5px solid #e57373", background: "#fff",
                  color: "#e57373", fontSize: 14, fontWeight: 700,
                  fontFamily: "'Cairo', sans-serif", cursor: "pointer",
                }}>🚪 تسجيل الخروج</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  padding: "12px", borderRadius: 10,
                  border: "1.5px solid #c8e6c0", color: "#2d6a21",
                  fontSize: 15, fontWeight: 700, fontFamily: "'Cairo', sans-serif",
                }}
              >
                تسجيل الدخول
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block", textAlign: "center", textDecoration: "none",
                  padding: "12px", borderRadius: 10,
                  background: "linear-gradient(135deg, #2d6a21, #5cb844)",
                  color: "#fff", fontSize: 15, fontWeight: 800,
                  fontFamily: "'Cairo', sans-serif",
                  boxShadow: "0 4px 16px rgba(45,106,33,0.25)",
                }}
              >
                إنشاء حساب جديد
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay when mobile menu open */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 997,
            background: "rgba(0,0,0,0.2)", backdropFilter: "blur(2px)",
          }}
        />
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}