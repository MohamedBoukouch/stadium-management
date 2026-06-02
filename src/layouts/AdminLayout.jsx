import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  IconLayoutDashboard,
  IconCalendarStats,
  IconBuildingStadium,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconBell,
  IconBallFootball,
  IconCalendar,
  IconChevronDown,
} from "@tabler/icons-react";

const navItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: <IconLayoutDashboard size={18} />, path: "/admin" },
  { id: "reservations", label: "الحجوزات", icon: <IconCalendarStats size={18} />, path: "/admin/reservations", badge: 8 },
  { id: "terrains", label: "الملاعب", icon: <IconBuildingStadium size={18} />, path: "/admin/terrains" },
  { id: "users", label: "المستخدمون", icon: <IconUsers size={18} />, path: "/admin/users" },
  { id: "reports", label: "التقارير", icon: <IconChartBar size={18} />, path: "/admin/reports" },
  { id: "settings", label: "الإعدادات", icon: <IconSettings size={18} />, path: "/admin/settings" },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const font = "'Cairo', sans-serif";
  const isActive = (path) => location.pathname === path;
  const currentPage = navItems.find(n => n.path === location.pathname)?.label || "لوحة التحكم";

  const now = new Date();
  const dateAr = now.toLocaleDateString("ar-MA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: font, direction: "rtl", background: "#f9fafb" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;900&display=swap');
        * { box-sizing: border-box; }
        .nav-item { transition: all 0.15s; cursor: pointer; }
        .nav-item:hover { background: rgba(255,255,255,0.1) !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: collapsed ? 64 : 230,
        minHeight: "100vh",
        background: "#0f2a0c",
        display: "flex", flexDirection: "column",
        transition: "width 0.3s ease",
        overflow: "hidden", flexShrink: 0,
        position: "sticky", top: 0, height: "100vh",
      }}>

        {/* Logo */}
        <div style={{
          padding: "16px 14px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", gap: 12,
          minHeight: 76,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: "#166534",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid rgba(255,255,255,0.15)",
          }}>
            <IconBallFootball size={24} color="white" />
          </div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: "#fff", lineHeight: 1.3, whiteSpace: "nowrap" }}>حجز الملاعب</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2, whiteSpace: "nowrap" }}>نظام إدارة الحجوزات</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(item => (
            <div
              key={item.id}
              className="nav-item"
              onClick={() => navigate(item.path)}
              style={{
                display: "flex", alignItems: "center",
                gap: collapsed ? 0 : 12,
                justifyContent: collapsed ? "center" : "flex-start",
                padding: collapsed ? "11px 0" : "11px 14px",
                borderRadius: 10,
                background: isActive(item.path) ? "#166534" : "transparent",
                position: "relative",
              }}
            >
              <span style={{
                color: isActive(item.path) ? "#fff" : "rgba(255,255,255,0.5)",
                flexShrink: 0,
              }}>
                {item.icon}
              </span>
              {!collapsed && (
                <span style={{
                  fontSize: 13, fontWeight: isActive(item.path) ? 700 : 400,
                  color: isActive(item.path) ? "#fff" : "rgba(255,255,255,0.6)",
                  whiteSpace: "nowrap", flex: 1,
                }}>{item.label}</span>
              )}
              {item.badge && !collapsed && (
                <span style={{
                  background: "#dc2626", color: "#fff",
                  fontSize: 10, fontWeight: 800,
                  padding: "1px 7px", borderRadius: 20,
                  minWidth: 20, textAlign: "center",
                }}>{item.badge}</span>
              )}
              {item.badge && collapsed && (
                <span style={{
                  position: "absolute", top: 6, left: 6,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#dc2626",
                }} />
              )}
            </div>
          ))}
        </nav>

        {/* User */}
        <div style={{
          padding: collapsed ? "12px 10px" : "12px 14px",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          display: "flex", alignItems: "center", gap: 10,
          cursor: "pointer",
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
            background: "#166534",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, fontWeight: 900, color: "#fff",
            border: "2px solid rgba(255,255,255,0.2)",
          }}>م</div>
          {!collapsed && (
            <>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", whiteSpace: "nowrap" }}>المدير العام</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>admin@fields.ma</div>
              </div>
              <IconChevronDown size={14} color="rgba(255,255,255,0.4)" />
            </>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Navbar */}
        <header style={{
          height: 60, background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center",
          padding: "0 24px", gap: 14,
          position: "sticky", top: 0, zIndex: 100,
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
          flexShrink: 0,
        }}>
          {/* Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              background: "none", border: "1px solid #e5e7eb", borderRadius: 8,
              padding: "6px 8px", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: 4,
            }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{ width: 16, height: 2, background: "#6b7280", borderRadius: 2, display: "block" }} />
            ))}
          </button>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#6b7280" }}>
            <span>الرئيسية</span>
            <span style={{ color: "#d1d5db" }}>›</span>
            <span style={{ fontWeight: 700, color: "#14532d" }}>{currentPage}</span>
          </div>

          <div style={{ flex: 1 }} />

          {/* Date */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "6px 14px", borderRadius: 8,
            border: "1px solid #e5e7eb", background: "#f9fafb",
            fontSize: 12, fontWeight: 600, color: "#374151",
            fontFamily: font,
          }}>
            <IconCalendar size={14} color="#6b7280" />
            {dateAr}
          </div>

          {/* Bell */}
          <div style={{ position: "relative" }}>
            <button style={{
              width: 38, height: 38, borderRadius: 10,
              border: "1px solid #e5e7eb", background: "#f9fafb",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
            }}>
              <IconBell size={17} color="#6b7280" />
            </button>
            <span style={{
              position: "absolute", top: -3, left: -3,
              width: 17, height: 17, borderRadius: "50%",
              background: "#dc2626", color: "#fff",
              fontSize: 9, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "2px solid #fff",
            }}>3</span>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
