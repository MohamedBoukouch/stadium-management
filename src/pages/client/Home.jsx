import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import HeroSlider from "../../components/HeroSlider";
import StatsBar from "../../components/Statsbar";
import AvailableSlots from "../../components/Availableslots";
import TerrainCard from "../../components/Terraincard";
import Footer from "../../components/Footer";
import { terrains } from "../../api/Terrains";

const features = [
  { icon: "🌿", title: "عشب اصطناعي الجيل ٥", desc: "أرضية احترافية معتمدة دولياً تقلل الإصابات" },
  { icon: "💡", title: "إضاءة LED احترافية", desc: "رؤية مثالية ليلاً ونهاراً بكثافة 800 لوكس" },
  { icon: "📅", title: "حجز أونلاين فوري", desc: "احجز في ثوانٍ واستلم تأكيداً فورياً على هاتفك" },
  { icon: "🚿", title: "مرافق متكاملة", desc: "غرف تبديل، دُشات ساخنة، كافيتيريا" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper" style={{ background: "#f8fbf7", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');

        /* ========== NAVBAR SPACING FIX ========== */
        .home-wrapper { padding-top: 78px; }
        @media (max-width: 768px) {
          .home-wrapper { padding-top: 66px !important; }
        }
        @media (max-width: 480px) {
          .home-wrapper { padding-top: 58px !important; }
        }

        @media (max-width: 900px) {
          .terrains-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .terrains-section { padding: 60px 40px 80px !important; }
          .features-section { padding: 60px 40px !important; }
          .cta-section { padding: 80px 40px !important; }
        }
        @media (max-width: 600px) {
          .terrains-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .terrains-section { padding: 48px 20px 60px !important; }
          .features-section { padding: 48px 20px !important; }
          .cta-section { padding: 60px 20px !important; }
          .cta-title { font-size: 34px !important; }
          .cta-btn { padding: 16px 40px !important; font-size: 16px !important; }
          .section-title { font-size: 28px !important; }
        }
        @media (max-width: 400px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Navbar />

      {/* Hero Slider */}
      <HeroSlider />

      {/* Stats */}
      <StatsBar />

      {/* Available Slots */}
      <AvailableSlots />

      {/* Terrains section */}
      <section className="terrains-section" style={{
        padding: "80px 80px 100px",
        background: "#ffffff",
        direction: "rtl",
        borderTop: "1px solid #c8e6c0",
      }}>
        <style>{`
          /* ========== MOBILE (max-width: 768px) ========== */
          @media (max-width: 768px) {
            .terrains-section { padding: 48px 20px 60px !important; }
            .terrains-section .section-title { font-size: 26px !important; }

            /* Grid → Horizontal scroll row */
            .terrains-grid {
              display: flex !important;
              flex-wrap: nowrap !important;
              overflow-x: auto !important;
              gap: 16px !important;
              max-width: 100% !important;
              padding-bottom: 12px !important;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
            .terrains-grid::-webkit-scrollbar { display: none; }

            /* Each card: fixed width for consistent scroll */
            .terrains-grid > * {
              flex: 0 0 280px !important;
              min-width: 280px !important;
              max-width: 280px !important;
            }
          }

          /* ========== SMALL MOBILE (max-width: 480px) ========== */
          @media (max-width: 480px) {
            .terrains-section { padding: 36px 16px 48px !important; }
            .terrains-section .section-title { font-size: 22px !important; }
            .terrains-grid > * {
              flex: 0 0 260px !important;
              min-width: 260px !important;
              max-width: 260px !important;
            }
          }
        `}</style>

        {/* Section Header */}
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <span style={{
            display: "inline-block",
            background: "rgba(45,106,33,0.08)", color: "#2d6a21",
            fontSize: 11, fontWeight: 700, letterSpacing: 2,
            padding: "5px 16px", borderRadius: 4,
            border: "1px solid rgba(45,106,33,0.18)",
            fontFamily: "'Cairo', sans-serif", marginBottom: 12,
          }}>ملاعبنا</span>
          <h2 className="section-title" style={{ fontSize: 40, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", margin: "0 0 10px" }}>
            اختر ملعبك
          </h2>
          <p style={{ color: "#5a8a50", fontSize: 15, fontFamily: "'Cairo', sans-serif" }}>
            ثلاثة ملاعب بأحجام مختلفة لتناسب جميع الاحتياجات
          </p>
        </div>

        {/* Terrains Cards - Grid on PC, Horizontal Scroll Row on Mobile */}
        <div className="terrains-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, maxWidth: 1100, margin: "0 auto" }}>
          {terrains.map((t) => <TerrainCard key={t.id} terrain={t} />)}
        </div>
      </section>

      {/* Features */}
      <section className="features-section" style={{
        padding: "80px 80px",
        background: "#f8fbf7",
        borderTop: "1px solid #c8e6c0",
        direction: "rtl",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <h2 className="section-title" style={{ fontSize: 40, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", margin: 0 }}>
              لماذا تختارنا؟
            </h2>
          </div>
          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "#ffffff", border: "1px solid #c8e6c0",
                borderRadius: 18, padding: "30px 22px", textAlign: "center",
                transition: "all 0.3s",
                boxShadow: "0 2px 8px rgba(45,106,33,0.04)",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#5cb844"; e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(45,106,33,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#c8e6c0"; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(45,106,33,0.04)"; }}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: "50%",
                  background: "rgba(45,106,33,0.08)", border: "1px solid #c8e6c0",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, margin: "0 auto 16px",
                }}>{f.icon}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#5a8a50", fontFamily: "'Cairo', sans-serif", lineHeight: 1.8 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="cta-section" style={{
        padding: "100px 80px",
        textAlign: "center",
        background: "linear-gradient(135deg, #f0f7ee 0%, #e8f5e0 50%, #f0f7ee 100%)",
        borderTop: "1px solid #c8e6c0",
        direction: "rtl",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 500, height: 500, borderRadius: "50%",
          border: "1px solid rgba(45,106,33,0.1)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 300, height: 300, borderRadius: "50%",
          border: "1px solid rgba(45,106,33,0.08)",
          pointerEvents: "none",
        }} />
        <h2 className="cta-title" style={{ fontSize: 50, fontWeight: 900, color: "#1a3d14", fontFamily: "'Cairo', sans-serif", marginBottom: 16 }}>
          هل أنت مستعد للعب؟
        </h2>
        <p style={{ color: "#5a8a50", fontSize: 18, fontFamily: "'Cairo', sans-serif", marginBottom: 44 }}>
          لا تضيع وقتك — احجز ملعبك الآن في ثوانٍ
        </p>
        <button
          className="cta-btn"
          onClick={() => navigate("/reservation")}
          style={{
            background: "linear-gradient(135deg, #2d6a21, #5cb844)",
            color: "#fff", border: "none",
            padding: "20px 64px", borderRadius: 50,
            fontSize: 20, fontWeight: 800,
            fontFamily: "'Cairo', sans-serif",
            cursor: "pointer",
            boxShadow: "0 10px 36px rgba(45,106,33,0.35)",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(45,106,33,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(45,106,33,0.35)"; }}
        >⚽ احجز ملعبك الآن</button>
        <div style={{ marginTop: 24, fontSize: 13, color: "#7ab870", fontFamily: "'Cairo', sans-serif" }}>
          تأكيد فوري · بدون رسوم إضافية · إلغاء مجاني
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;