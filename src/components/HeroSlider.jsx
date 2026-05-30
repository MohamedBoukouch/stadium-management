import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { terrains } from "../api/Terrains";

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const navigate = useNavigate();
  const DURATION = 5000;

  const goTo = (idx) => {
    setCurrent((idx + terrains.length) % terrains.length);
    setProgress(0);
  };

  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
      return;
    }
    progressRef.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 0;
        return p + 100 / (DURATION / 50);
      });
    }, 50);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % terrains.length);
      setProgress(0);
    }, DURATION);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [paused, current]);

  const t = terrains[current];

  return (
    <section
      style={{ position: "relative", height: "100vh", overflow: "hidden", direction: "rtl" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        @media (max-width: 768px) {
          .hero-info { bottom: 60px !important; right: 20px !important; left: 20px !important; max-width: 100% !important; }
          .hero-title { font-size: 34px !important; }
          .hero-cta-btn { padding: 12px 28px !important; font-size: 15px !important; }
          .hero-thumbnails { display: none !important; }
          .hero-counter { left: 20px !important; bottom: 60px !important; }
          .hero-dots { left: 20px !important; }
          .hero-arrows button { width: 36px !important; height: 36px !important; }
        }
        @media (max-width: 480px) {
          .hero-info { bottom: 40px !important; }
          .hero-title { font-size: 26px !important; }
          .hero-features { display: none !important; }
        }
      `}</style>

      {/* Slides */}
      {terrains.map((terrain, i) => (
        <div key={terrain.id} style={{
          position: "absolute", inset: 0,
          transition: "opacity 0.9s ease",
          opacity: i === current ? 1 : 0,
          zIndex: i === current ? 1 : 0,
        }}>
          <img
            src={terrain.image}
            alt={terrain.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55)" }}
          />
        </div>
      ))}

      {/* Gradient overlays */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(to top, rgba(240,247,238,0.85) 0%, rgba(240,247,238,0.3) 50%, rgba(240,247,238,0.05) 100%)",
      }} />

      {/* Bottom-right info */}
      <div className="hero-info" style={{
        position: "absolute", bottom: 80, right: 60, zIndex: 5,
        maxWidth: 420, textAlign: "right",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.85)", border: "1px solid rgba(92,184,68,0.5)",
          borderRadius: 50, padding: "6px 16px", marginBottom: 16,
          fontSize: 12, color: "#2d6a21", fontFamily: "'Cairo', sans-serif",
          backdropFilter: "blur(8px)",
        }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5cb844", display: "inline-block" }} />
          {t.type} · {t.size}
        </div>

        <h2 className="hero-title" style={{
          fontSize: 52, fontWeight: 900,
          color: "#1a3d14", lineHeight: 1.1,
          fontFamily: "'Cairo', sans-serif",
          marginBottom: 8,
          textShadow: "0 2px 20px rgba(255,255,255,0.4)",
        }}>
          {t.name}
        </h2>

        <div className="hero-features" style={{ display: "flex", gap: 10, marginBottom: 24, justifyContent: "flex-end", flexWrap: "wrap" }}>
          {t.features.map((f) => (
            <span key={f} style={{
              background: "rgba(255,255,255,0.75)", border: "1px solid rgba(45,106,33,0.2)",
              borderRadius: 6, padding: "4px 12px",
              fontSize: 12, color: "#2d6a21",
              fontFamily: "'Cairo', sans-serif",
              backdropFilter: "blur(4px)",
            }}>{f}</span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "flex-end" }}>
          <button
            onClick={() => navigate("/reservation")}
            className="hero-cta-btn"
            style={{
              background: "linear-gradient(135deg, #2d6a21, #5cb844)",
              color: "#fff", border: "none",
              padding: "16px 44px", borderRadius: 50,
              fontSize: 18, fontWeight: 800,
              fontFamily: "'Cairo', sans-serif",
              cursor: "pointer",
              boxShadow: "0 8px 28px rgba(45,106,33,0.4)",
              transition: "transform 0.2s, box-shadow 0.2s",
              letterSpacing: 0.5,
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 36px rgba(45,106,33,0.55)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(45,106,33,0.4)"; }}
          >
            ⚽ احجز هذا الملعب
          </button>
          <span style={{ color: "#2d6a21", fontSize: 22, fontWeight: 900, fontFamily: "'Cairo', sans-serif" }}>
            {t.price} <span style={{ fontSize: 13, fontWeight: 400, color: "#5a8a50" }}>{t.currency}</span>
          </span>
        </div>
      </div>

      {/* Left nav */}
      <div className="hero-dots" style={{
        position: "absolute", bottom: 80, left: 60, zIndex: 5,
        display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {terrains.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              width: 4,
              height: i === current ? 36 : 16,
              borderRadius: 4,
              border: "none", padding: 0,
              background: i === current ? "#2d6a21" : "rgba(45,106,33,0.3)",
              cursor: "pointer",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
        <div style={{ fontFamily: "'Cairo', sans-serif" }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: "#2d6a21" }}>
            {String(current + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 14, color: "rgba(45,106,33,0.4)", margin: "0 6px" }}>/</span>
          <span style={{ fontSize: 14, color: "rgba(45,106,33,0.4)" }}>
            {String(terrains.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Arrows */}
      <div className="hero-arrows">
        {[
          { side: "right", offset: "50%", action: () => goTo(current - 1), icon: "›" },
          { side: "left", offset: "50%", action: () => goTo(current + 1), icon: "‹" },
        ].map(({ side, offset, action, icon }) => (
          <button key={side} onClick={action} style={{
            position: "absolute", [side]: 24, top: offset,
            transform: "translateY(-50%)", zIndex: 5,
            width: 44, height: 44, borderRadius: "50%",
            background: "rgba(255,255,255,0.85)", border: "1px solid rgba(45,106,33,0.3)",
            color: "#2d6a21", fontSize: 26, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)",
            transition: "all 0.2s",
            boxShadow: "0 2px 12px rgba(45,106,33,0.15)",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "#2d6a21"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.85)"; e.currentTarget.style.color = "#2d6a21"; }}
          >{icon}</button>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, zIndex: 5,
        height: 3,
        width: `${progress}%`,
        background: "linear-gradient(90deg, #2d6a21, #5cb844)",
        transition: "width 0.05s linear",
      }} />

      {/* Thumbnails */}
      <div className="hero-thumbnails" style={{
        position: "absolute", top: "50%", left: 60, transform: "translateY(-50%)", zIndex: 5,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {terrains.map((terrain, i) => (
          <div
            key={terrain.id}
            onClick={() => goTo(i)}
            style={{
              width: 70, height: 48, borderRadius: 8, overflow: "hidden",
              cursor: "pointer",
              border: i === current ? "2px solid #5cb844" : "2px solid rgba(255,255,255,0.5)",
              opacity: i === current ? 1 : 0.6,
              transition: "all 0.3s",
              boxShadow: i === current ? "0 2px 10px rgba(45,106,33,0.3)" : "none",
            }}
          >
            <img src={terrain.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </section>
  );
}