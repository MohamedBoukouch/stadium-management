import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [navHeight, setNavHeight] = useState(66);
  const navRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    else setUser(null);
  }, [location.pathname]);

  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 50);
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    window.addEventListener("resize", onResize);
    if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    return () => window.removeEventListener("resize", onResize);
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
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <>
      <style>{`
        /* NEVER hide the nav itself — only hide desktop/mobile parts inside it */

        /* Desktop-only elements: hide on mobile */
        @media (max-width: 768px) {
          .nav-desktop-links { display: none !important; }
          .nav-auth-desktop  { display: none !important; }
          .nav-hamburger     { display: flex !important; }
        }

        /* Mobile-only elements: hide on desktop */
        @media (min-width: 769px) {
          .nav-hamburger     { display: none !important; }
          .nav-mobile-menu   { display: none !important; }
        }

        /* Tablet tweaks */
        @media (max-width: 1024px) and (min-width: 769px) {
          .nav-desktop-links { gap: 24px !important; }
          .nav-auth-desktop  { gap: 8px !important; }
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* ── NAVBAR ── always visible, always solid white on mobile ── */}
      <nav
        ref={navRef}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: window.innerWidth <= 480
            ? "10px 16px"
            : window.innerWidth <= 768
              ? "12px 20px"
              : scrolled ? "12px 48px" : "18px 48px",
          /* solid on mobile so hero image never bleeds through */
          background: window.innerWidth <= 768
            ? "#ffffff"
            : scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid #c8e6c0",
          boxShadow: (window.innerWidth <= 768 || scrolled)
            ? "0 2px 24px rgba(45,106,33,0.08)"
            : "none",
          transition: "padding 0.4s, background 0.4s, box-shadow 0.4s",
          direction: "rtl",
          fontFamily: "'Cairo', sans-serif",
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: window.innerWidth <= 480 ? 32 : 42,
            height: window.innerWidth <= 480 ? 32 : 42,
            borderRadius: 12,
            background: "linear-gradient(135deg, #2d6a21, #5cb844)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: window.innerWidth <= 480 ? 16 : 22,
            boxShadow: "0 4px 16px rgba(45,106,33,0.25)", flexShrink: 0,
          }}>⚽</div>
          <div>
            <div style={{
              fontSize: window.innerWidth <= 480 ? 14 : window.innerWidth <= 768 ? 15 : 17,
              fontWeight: 900, color: "#1a3d14", lineHeight: 1.2,
            }}>الملعب الذهبي</div>
            <div style={{
              fontSize: window.innerWidth <= 768 ? 9 : 10,
              color: "#5cb844", letterSpacing: 1, fontWeight: 600,
            }}>ملعب اصطناعي</div>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div className="nav-desktop-links" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} style={{
              textDecoration: "none",
              color: isActive(l.to) ? "#2d6a21" : "#4a7a3a",
              fontSize: 15, fontWeight: isActive(l.to) ? 800 : 600,
              fontFamily: "'Cairo', sans-serif",
              transition: "color 0.2s", position: "relative", paddingBottom: 4,
            }}
              onMouseEnter={e => { e.target.style.color = "#2d6a21"; }}
              onMouseLeave={e => { if (!isActive(l.to)) e.target.style.color = "#4a7a3a"; }}
            >
              {l.label}
              {isActive(l.to) && (
                <span style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  height: 2, background: "linear-gradient(90deg, #5cb844, #2d6a21)", borderRadius: 2,
                }} />
              )}
            </Link>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="nav-auth-desktop" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(45,106,33,0.08)", border: "1.5px solid #c8e6c0",
                borderRadius: 50, padding: "6px 16px 6px 10px", cursor: "pointer",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: "linear-gradient(135deg, #2d6a21, #5cb844)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontSize: 14, fontWeight: 800,
                }}>{user.name?.charAt(0) || "👤"}</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif" }}>{user.name || "مستخدم"}</span>
                <span style={{ fontSize: 12, color: "#5a8a50", transform: showUserMenu ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
              </button>
              {showUserMenu && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", left: 0,
                  background: "#fff", border: "1px solid #c8e6c0", borderRadius: 14,
                  padding: "8px 0", boxShadow: "0 12px 40px rgba(45,106,33,0.12)",
                  minWidth: 180, zIndex: 1000, animation: "fadeIn 0.2s ease",
                }}>
                  <div style={{ padding: "10px 16px", borderBottom: "1px solid #f0f7ee" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1a3d14" }}>{user.name || "مستخدم"}</div>
                    <div style={{ fontSize: 11, color: "#5a8a50", marginTop: 2 }}>{user.email}</div>
                  </div>
                  {[
                    { label: "📋 حجوزاتي", path: "/reservations" },
                    { label: "⚙️ الإعدادات", path: "/profile" },
                  ].map(item => (
                    <button key={item.path} onClick={() => { setShowUserMenu(false); navigate(item.path); }} style={{
                      width: "100%", textAlign: "right", padding: "10px 16px",
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 14, fontFamily: "'Cairo', sans-serif", color: "#4a7a3a",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f0f7ee"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >{item.label}</button>
                  ))}
                  <div style={{ borderTop: "1px solid #f0f7ee", margin: "4px 0" }} />
                  <button onClick={handleLogout} style={{
                    width: "100%", textAlign: "right", padding: "10px 16px",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 14, fontFamily: "'Cairo', sans-serif", color: "#e57373",
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >🚪 تسجيل الخروج</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{
                textDecoration: "none", color: "#2d6a21", fontSize: 14, fontWeight: 700,
                fontFamily: "'Cairo', sans-serif", padding: "10px 20px", borderRadius: 10,
                border: "1.5px solid #c8e6c0", background: "transparent", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(45,106,33,0.06)"; e.currentTarget.style.borderColor = "#5cb844"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#c8e6c0"; }}
              >تسجيل الدخول</Link>
              <Link to="/signup" style={{
                textDecoration: "none", color: "#fff", fontSize: 14, fontWeight: 800,
                fontFamily: "'Cairo', sans-serif", padding: "10px 22px", borderRadius: 10,
                background: "linear-gradient(135deg, #2d6a21, #5cb844)",
                boxShadow: "0 4px 16px rgba(45,106,33,0.25)", whiteSpace: "nowrap",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(45,106,33,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(45,106,33,0.25)"; }}
              >إنشاء حساب</Link>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", /* CSS shows it on mobile via .nav-hamburger media query */
            flexDirection: "column", gap: 5,
            background: "none", border: "none", cursor: "pointer", padding: 8,
          }}
          aria-label="Toggle menu"
        >
          <span style={{ width: 24, height: 2.5, background: "#2d6a21", borderRadius: 2, display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ width: 24, height: 2.5, background: "#2d6a21", borderRadius: 2, display: "block", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 24, height: 2.5, background: "#2d6a21", borderRadius: 2, display: "block", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {/* ── MOBILE DROPDOWN MENU ── */}
      <div
        className="nav-mobile-menu"
        style={{
          display: menuOpen ? "flex" : "none",
          flexDirection: "column",
          position: "fixed",
          top: navHeight,
          left: 0, right: 0, zIndex: 998,
          background: "#ffffff",
          borderBottom: "1px solid #c8e6c0",
          boxShadow: "0 12px 40px rgba(45,106,33,0.1)",
          direction: "rtl", fontFamily: "'Cairo', sans-serif",
          animation: "slideDown 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
          maxHeight: `calc(100vh - ${navHeight}px)`,
          overflowY: "auto",
        }}
      >
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
            textDecoration: "none",
            color: isActive(l.to) ? "#2d6a21" : "#4a7a3a",
            fontSize: 16, fontWeight: isActive(l.to) ? 800 : 600,
            padding: "16px 24px", borderBottom: "1px solid #f0f7ee",
            background: isActive(l.to) ? "#f0f7ee" : "transparent",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              background: isActive(l.to) ? "#5cb844" : "transparent",
              border: isActive(l.to) ? "none" : "1.5px solid #c8e6c0",
            }} />
            {l.label}
          </Link>
        ))}

        <div style={{ padding: "20px 24px", borderTop: "2px solid #e8f5e0" }}>
          {user ? (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "linear-gradient(135deg, #2d6a21, #5cb844)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18, fontWeight: 800 }}>
                  {user.name?.charAt(0) || "👤"}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "#1a3d14" }}>{user.name || "مستخدم"}</div>
                  <div style={{ fontSize: 12, color: "#5a8a50" }}>{user.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button onClick={() => { setMenuOpen(false); navigate("/reservations"); }} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #c8e6c0", background: "#fff", color: "#2d6a21", fontSize: 14, fontWeight: 700, fontFamily: "'Cairo', sans-serif", cursor: "pointer" }}>📋 حجوزاتي</button>
                <button onClick={() => { setMenuOpen(false); navigate("/profile"); }} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #c8e6c0", background: "#fff", color: "#2d6a21", fontSize: 14, fontWeight: 700, fontFamily: "'Cairo', sans-serif", cursor: "pointer" }}>⚙️ الإعدادات</button>
                <button onClick={() => { setMenuOpen(false); handleLogout(); }} style={{ width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #e57373", background: "#fff", color: "#e57373", fontSize: 14, fontWeight: 700, fontFamily: "'Cairo', sans-serif", cursor: "pointer" }}>🚪 تسجيل الخروج</button>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={{ display: "block", textAlign: "center", textDecoration: "none", padding: "12px", borderRadius: 10, border: "1.5px solid #c8e6c0", color: "#2d6a21", fontSize: 15, fontWeight: 700, fontFamily: "'Cairo', sans-serif" }}>
                تسجيل الدخول
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} style={{ display: "block", textAlign: "center", textDecoration: "none", padding: "12px", borderRadius: 10, background: "linear-gradient(135deg, #2d6a21, #5cb844)", color: "#fff", fontSize: 15, fontWeight: 800, fontFamily: "'Cairo', sans-serif", boxShadow: "0 4px 16px rgba(45,106,33,0.25)" }}>
                إنشاء حساب جديد
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div onClick={() => setMenuOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 997, background: "rgba(0,0,0,0.2)" }} />
      )}
    </>
  );
}