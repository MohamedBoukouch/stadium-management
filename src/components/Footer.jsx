import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{
      background: "#f0f7ee",
      borderTop: "1px solid #c8e6c0",
      padding: "60px 80px 36px",
      direction: "rtl",
    }}>
      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .footer-bottom { flex-direction: column !important; gap: 10px !important; text-align: center !important; }
          footer { padding: 40px 24px 28px !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div className="footer-grid" style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 40,
        marginBottom: 48,
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: "linear-gradient(135deg, #2d6a21, #5cb844)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>⚽</div>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>الملعب الذهبي</span>
          </div>
          <p style={{ fontSize: 14, color: "#4a7a3a", fontFamily: "'Cairo', sans-serif", lineHeight: 1.8, maxWidth: 240 }}>
            ملاعب كرة القدم الاصطناعية الأحدث في المنطقة. احجز ملعبك أونلاين بكل سهولة.
          </p>
        </div>

        {/* Links */}
        {[
          { title: "الملاعب", links: ["الملعب ألفا", "الملعب بيتا", "الملعب غاما"] },
          { title: "الخدمات", links: ["الحجز الفردي", "بطولات", "تدريب"] },
          { title: "معلومات", links: ["من نحن", "تواصل معنا", "شروط الاستخدام"] },
        ].map((col) => (
          <div key={col.title}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#2d6a21", fontFamily: "'Cairo', sans-serif", marginBottom: 16 }}>{col.title}</div>
            {col.links.map((l) => (
              <div key={l} style={{ marginBottom: 10 }}>
                <Link to="#" style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = "#2d6a21"}
                  onMouseLeave={e => e.target.style.color = "#5a8a50"}
                >{l}</Link>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-bottom" style={{
        borderTop: "1px solid #c8e6c0", paddingTop: 24,
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: "#7ab870", fontFamily: "'Cairo', sans-serif" }}>© 2025 الملعب الذهبي. جميع الحقوق محفوظة</span>
        <span style={{ fontSize: 12, color: "#7ab870", fontFamily: "'Cairo', sans-serif" }}>متعدد اللغات · العربية · Français · English</span>
      </div>
    </footer>
  );
}