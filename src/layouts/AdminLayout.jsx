import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: "▦", path: "/admin" },
  { id: "reservations", label: "الحجوزات", icon: "📅", path: "/admin/reservations", badge: 8 },
  { id: "terrains", label: "الملاعب", icon: "⚽", path: "/admin/terrains" },
  { id: "users", label: "المستخدمون", icon: "👥", path: "/admin/users" },
  { id: "reports", label: "التقارير", icon: "📊", path: "/admin/reports" },
  { id: "settings", label: "الإعدادات", icon: "⚙️", path: "/admin/settings" },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const font = "'Cairo', sans-serif";
  const border = "#e0ede0";
  const green = "#2d6a21";
  const bg = "#f4f8f3";

  const isActive = (path) => location.pathname === path;

  // ── Date actuelle en arabe ──
  const now = new Date();
  const dateAr = now.toLocaleDateString("ar-MA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: bg, fontFamily: font, direction: "rtl" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #c8e6c0; border-radius: 10px; }
        .nav-item-layout { transition: all 0.2s; }
        .nav-item-layout:hover { background: rgba(92,184,68,0.12) !important; }
      `}</style>

      {/* ─── SIDEBAR ─── */}
      <aside style={{
        width: sidebarOpen ? 240 : 72,
        minHeight: "100vh",
        background: "#0f2a0c",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.3s cubic-bezier(0.22,1,0.36,1)",
        overflow: "hidden",
        flexShrink: 0,
        position: "sticky",
        top: 0,
        height: "100vh",
        borderLeft: "1px solid rgba(92,184,68,0.12)",
      }}>

        {/* Logo */}
        <div style={{
          padding: sidebarOpen ? "24px 20px 20px" : "24px 16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 12,
          minHeight: 80,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "linear-gradient(135deg, #2d6a21, #5cb844)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20, flexShrink: 0,
            boxShadow: "0 4px 16px rgba(92,184,68,0.3)",
          }}>⚽</div>
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 14, fontWeight: 900, color: "#fff", lineHeight: 1.2, whiteSpace: "nowrap" }}>الملعب الذهبي</div>
              <div style={{ fontSize: 10, color: "#5cb844", fontWeight: 600, letterSpacing: 0.5, whiteSpace: "nowrap" }}>لوحة المدير</div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: "16px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(item => (
            <button
              key={item.id}
              className="nav-item-layout"
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center",
                gap: sidebarOpen ? 12 : 0,
                justifyContent: sidebarOpen ? "flex-start" : "center",
                padding: sidebarOpen ? "10px 14px" : "12px",
                borderRadius: 10, border: "none", cursor: "pointer",
                background: isActive(item.path)
                  ? "linear-gradient(135deg, rgba(45,106,33,0.7), rgba(92,184,68,0.5))"
                  : "transparent",
                borderRight: isActive(item.path) ? "3px solid #5cb844" : "3px solid transparent",
                width: "100%",
                position: "relative",
                fontFamily: font,
              }}
            >
              <span style={{ fontSize: 17, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && (
                <span style={{
                  fontSize: 13,
                  fontWeight: isActive(item.path) ? 700 : 500,
                  color: isActive(item.path) ? "#fff" : "rgba(255,255,255,0.65)",
                  whiteSpace: "nowrap",
                }}>{item.label}</span>
              )}
              {item.badge && sidebarOpen && (
                <span style={{
                  marginRight: "auto",
                  background: "#5cb844", color: "#fff",
                  fontSize: 10, fontWeight: 800,
                  padding: "2px 7px", borderRadius: 20,
                }}>{item.badge}</span>
              )}
              {item.badge && !sidebarOpen && (
                <span style={{
                  position: "absolute", top: 6, left: 6,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#5cb844",
                }} />
              )}
            </button>
          ))}
        </nav>

        {/* Admin User */}
        <div style={{
          padding: sidebarOpen ? "16px" : "16px 10px",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #2d6a21, #5cb844)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0,
          }}>م</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>المدير العام</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>admin@mala3ib.ma</div>
            </div>
          )}
        </div>
      </aside>

      {/* ─── MAIN AREA ─── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Top Bar */}
        <header style={{
          height: 64,
          background: "#ffffff",
          borderBottom: `1px solid ${border}`,
          display: "flex", alignItems: "center",
          padding: "0 28px", gap: 16,
          position: "sticky", top: 0, zIndex: 100,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          flexShrink: 0,
        }}>

          {/* Toggle Sidebar */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 4.5,
              padding: 6, borderRadius: 8,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{ width: 20, height: 2, background: green, borderRadius: 2, display: "block" }} />
            ))}
          </button>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#8aaa80" }}>الرئيسية</span>
            <span style={{ fontSize: 12, color: "#c8e6c0" }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: green }}>
              {navItems.find(n => n.path === location.pathname)?.label || "لوحة التحكم"}
            </span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Notifications */}
          <div style={{ position: "relative" }}>
            <button style={{
              width: 38, height: 38, borderRadius: 10,
              background: bg, border: `1px solid ${border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 16,
            }}>🔔</button>
            <span style={{
              position: "absolute", top: -3, left: -3,
              width: 16, height: 16, borderRadius: "50%",
              background: "#e53935", color: "#fff",
              fontSize: 9, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>3</span>
          </div>

          {/* Date actuelle */}
          <div style={{
            background: "rgba(45,106,33,0.07)",
            border: "1px solid #c8e6c0",
            borderRadius: 10, padding: "6px 14px",
            fontSize: 12, color: green, fontWeight: 700,
            fontFamily: font, whiteSpace: "nowrap",
          }}>
            {dateAr}
          </div>

        </header>

        {/* ─── PAGE CONTENT ─── */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default AdminLayout;