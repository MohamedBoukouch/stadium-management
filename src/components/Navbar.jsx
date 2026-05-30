import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { to: "/", label: "الرئيسية" },
    { to: "/terrains", label: "الملاعب" },
    { to: "/reservation", label: "الحجز" },
    { to: "/about", label: "من نحن" },
  ];

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
          .nav-mobile-menu { display: ${menuOpen ? "flex" : "none"} !important; }
          nav { padding: 14px 20px !important; }
        }
        @media (min-width: 769px) {
          .nav-hamburger { display: none !important; }
          .nav-mobile-menu { display: none !important; }
        }
      `}</style>

      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
        padding: scrolled ? "12px 48px" : "20px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: scrolled ? "1px solid #c8e6c0" : "1px solid rgba(200,230,192,0.4)",
        boxShadow: scrolled ? "0 2px 20px rgba(45,106,33,0.08)" : "none",
        transition: "all 0.4s ease",
        direction: "rtl",
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #2d6a21, #5cb844)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, boxShadow: "0 4px 14px rgba(45,106,33,0.3)",
          }}>⚽</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>الملعب الذهبي</div>
            <div style={{ fontSize: 10, color: "#5cb844", letterSpacing: 1, fontFamily: "'Cairo', sans-serif" }}>ملعب اصطناعي</div>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{ display: "flex", alignItems: "center", gap: 36 }}>
          {links.map((l) => (
            <Link key={l.to} to={l.to} style={{
              textDecoration: "none",
              color: location.pathname === l.to ? "#2d6a21" : "#4a7a3a",
              fontSize: 15, fontWeight: 600,
              fontFamily: "'Cairo', sans-serif",
              transition: "color 0.2s",
              borderBottom: location.pathname === l.to ? "2px solid #5cb844" : "2px solid transparent",
              paddingBottom: 2,
            }}>
              {l.label}
            </Link>
          ))}
          <Link to="/reservation" style={{
            textDecoration: "none",
            background: "#2d6a21", color: "#fff",
            padding: "10px 24px", borderRadius: 8,
            fontSize: 14, fontWeight: 700,
            fontFamily: "'Cairo', sans-serif",
            transition: "background 0.2s",
            boxShadow: "0 4px 14px rgba(45,106,33,0.3)",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "#3d8a2e"}
            onMouseLeave={e => e.currentTarget.style.background = "#2d6a21"}
          >
            احجز الآن ←
          </Link>
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} style={{
          display: "none", flexDirection: "column", gap: 5,
          background: "none", border: "none", cursor: "pointer", padding: 8,
        }}>
          <span style={{ width: 26, height: 2, background: "#2d6a21", borderRadius: 2, display: "block", transition: "all 0.3s",
            transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ width: 26, height: 2, background: "#2d6a21", borderRadius: 2, display: "block", transition: "all 0.3s",
            opacity: menuOpen ? 0 : 1 }} />
          <span style={{ width: 26, height: 2, background: "#2d6a21", borderRadius: 2, display: "block", transition: "all 0.3s",
            transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className="nav-mobile-menu" style={{
        display: "none", flexDirection: "column", gap: 0,
        position: "fixed", top: 68, left: 0, right: 0, zIndex: 998,
        background: "#fff", borderBottom: "1px solid #c8e6c0",
        boxShadow: "0 8px 24px rgba(45,106,33,0.1)",
        direction: "rtl",
      }}>
        {links.map((l) => (
          <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)} style={{
            textDecoration: "none",
            color: location.pathname === l.to ? "#2d6a21" : "#4a7a3a",
            fontSize: 16, fontWeight: 600,
            fontFamily: "'Cairo', sans-serif",
            padding: "16px 24px",
            borderBottom: "1px solid #f0f7ee",
            background: location.pathname === l.to ? "#f0f7ee" : "transparent",
          }}>{l.label}</Link>
        ))}
        <div style={{ padding: "16px 24px" }}>
          <Link to="/reservation" onClick={() => setMenuOpen(false)} style={{
            textDecoration: "none", display: "block", textAlign: "center",
            background: "#2d6a21", color: "#fff",
            padding: "12px 24px", borderRadius: 8,
            fontSize: 15, fontWeight: 700,
            fontFamily: "'Cairo', sans-serif",
          }}>احجز الآن ←</Link>
        </div>
      </div>
    </>
  );
}