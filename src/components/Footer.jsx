import { Link } from "react-router-dom";

/**
 * Footer Component - Site footer with brand, links, and copyright
 * 
 * Layout:
 * - PC (>768px): 4-column grid (brand + 3 link columns)
 * - Mobile (≤768px): Stacked sections, centered, better spacing
 * - Small Mobile (≤480px): Compact layout
 */

export default function Footer() {
  return (
    <footer style={{
      background: "#f0f7ee",
      borderTop: "1px solid #c8e6c0",
      padding: "60px 80px 36px",
      direction: "rtl",
    }}>
      {/* ═══════════════════════════════════════════════
          RESPONSIVE STYLES
      ═══════════════════════════════════════════════ */}
      <style>{`
        /* ========== TABLET (max-width: 900px) ========== */
        @media (max-width: 900px) {
          footer { padding: 48px 40px 28px !important; }
        }

        /* ========== MOBILE (max-width: 768px) ========== */
        @media (max-width: 768px) {
          footer { padding: 40px 24px 24px !important; }

          /* Grid → 2 columns: brand full-width top, links in 2-col grid */
          .footer-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 32px 20px !important; 
            margin-bottom: 36px !important;
          }

          /* Brand column: full width, centered */
          .footer-brand {
            grid-column: 1 / -1 !important;
            text-align: center !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
          }
          .footer-brand p {
            max-width: 100% !important;
            text-align: center !important;
            font-size: 13px !important;
          }

          /* Link columns: centered headers, centered links */
          .footer-links-col {
            text-align: center !important;
          }
          .footer-links-col .col-title {
            font-size: 14px !important;
            margin-bottom: 14px !important;
          }
          .footer-links-col a {
            font-size: 13px !important;
          }

          /* Bottom bar: stacked, centered */
          .footer-bottom { 
            flex-direction: column !important; 
            gap: 10px !important; 
            text-align: center !important;
            padding-top: 20px !important;
          }
          .footer-bottom span {
            font-size: 11px !important;
          }
        }

        /* ========== SMALL MOBILE (max-width: 480px) ========== */
        @media (max-width: 480px) {
          footer { padding: 32px 20px 20px !important; }

          /* All columns stack vertically */
          .footer-grid { 
            grid-template-columns: 1fr !important; 
            gap: 28px !important;
            text-align: center !important;
          }

          .footer-brand {
            margin-bottom: 8px !important;
          }
          .footer-brand .brand-row {
            justify-content: center !important;
          }

          .footer-links-col .col-title {
            font-size: 15px !important;
            margin-bottom: 12px !important;
            padding-bottom: 8px !important;
            border-bottom: 1px solid rgba(200,230,192,0.5) !important;
            display: inline-block !important;
          }
          .footer-links-col .links-list {
            display: flex !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 8px 16px !important;
          }
          .footer-links-col .links-list > div {
            margin-bottom: 0 !important;
          }

          .footer-bottom { 
            gap: 8px !important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════
          FOOTER GRID
          PC: 4 columns (brand | links | links | links)
          Tablet: 2 columns (brand full-width, links 2-col)
          Mobile: 1 column stacked
      ═══════════════════════════════════════════════ */}
      <div className="footer-grid" style={{
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr 1fr",
        gap: 40,
        marginBottom: 48,
      }}>

        {/* ─── BRAND COLUMN ─── */}
        <div className="footer-brand">
          <div className="brand-row" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: "linear-gradient(135deg, #2d6a21, #5cb844)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              flexShrink: 0,
            }}>⚽</div>
            <span style={{ fontSize: 16, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif" }}>
              الملعب الذهبي
            </span>
          </div>
          <p style={{ fontSize: 14, color: "#4a7a3a", fontFamily: "'Cairo', sans-serif", lineHeight: 1.8, maxWidth: 240 }}>
            ملاعب كرة القدم الاصطناعية الأحدث في المنطقة. احجز ملعبك أونلاين بكل سهولة.
          </p>
        </div>

        {/* ─── LINK COLUMNS ─── */}
        {[
          { title: "الملاعب", links: ["الملعب ألفا", "الملعب بيتا", "الملعب غاما"] },
          { title: "الخدمات", links: ["الحجز الفردي", "بطولات", "تدريب"] },
          { title: "معلومات", links: ["من نحن", "تواصل معنا", "شروط الاستخدام"] },
        ].map((col) => (
          <div key={col.title} className="footer-links-col">
            <div className="col-title" style={{ 
              fontSize: 14, fontWeight: 700, color: "#2d6a21", 
              fontFamily: "'Cairo', sans-serif", marginBottom: 16 
            }}>
              {col.title}
            </div>
            <div className="links-list">
              {col.links.map((l) => (
                <div key={l} style={{ marginBottom: 10 }}>
                  <Link 
                    to="#" 
                    style={{ 
                      fontSize: 13, color: "#5a8a50", 
                      fontFamily: "'Cairo', sans-serif", 
                      textDecoration: "none", 
                      transition: "color 0.2s" 
                    }}
                    onMouseEnter={e => e.target.style.color = "#2d6a21"}
                    onMouseLeave={e => e.target.style.color = "#5a8a50"}
                  >
                    {l}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════
          FOOTER BOTTOM - Copyright + Languages
          PC: Side by side
          Mobile: Stacked centered
      ═══════════════════════════════════════════════ */}
      <div className="footer-bottom" style={{
        borderTop: "1px solid #c8e6c0", 
        paddingTop: 24,
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
      }}>
        <span style={{ fontSize: 12, color: "#7ab870", fontFamily: "'Cairo', sans-serif" }}>
          © 2025 الملعب الذهبي. جميع الحقوق محفوظة
        </span>
        <span style={{ fontSize: 12, color: "#7ab870", fontFamily: "'Cairo', sans-serif" }}>
          متعدد اللغات · العربية · Français · English
        </span>
      </div>
    </footer>
  );
}