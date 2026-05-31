import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { terrains } from "../api/Terrains";

/**
 * ═══════════════════════════════════════════════════════════════
 *  HeroSlider — Cinematic Terrain Showcase
 * ═══════════════════════════════════════════════════════════════
 * 
 *  A bold, editorial-style slider inspired by high-end sports brands.
 *  No boxes. No cards. Just immersive imagery with floating typography
 *  and minimal, elegant controls.
 * 
 *  Design Language:
 *  • Full-bleed imagery with subtle parallax feel
 *  • Oversized typography breaking out of containers
 *  • Thin-line UI elements (dots, progress, counter)
 *  • Content anchored to edges, never boxed
 *  • Mobile: Stacked edge-to-edge, thumb-friendly
 * 
 *  Interactions:
 *  • Auto-play (6s) with pause on hover/touch
 *  • Swipe gestures on mobile
 *  • Keyboard arrow navigation
 *  • Smooth cross-fade transitions
 * ═══════════════════════════════════════════════════════════════
 */

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isAnimating, setIsAnimating] = useState(false);

  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const navigate = useNavigate();

  const DURATION = 6000;
  const TICK = 50;
  const total = terrains.length;
  const t = terrains[current];

  // ── Navigation ──
  const goTo = useCallback((idx, dir = 1) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    const safe = ((idx % total) + total) % total;
    setCurrent(safe);
    setProgress(0);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, total]);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  // ── Auto-play ──
  useEffect(() => {
    if (paused) {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
      return;
    }
    progressRef.current = setInterval(() => {
      setProgress(p => p >= 100 ? 0 : p + 100 / (DURATION / TICK));
    }, TICK);
    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % total);
      setProgress(0);
      setDirection(1);
    }, DURATION);
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(progressRef.current);
    };
  }, [paused, current, total]);

  // ── Keyboard ──
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") prev();
      if (e.key === "ArrowLeft") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // ── Touch Swipe ──
  const touchStart = useRef(0);
  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX; setPaused(true); };
  const onTouchEnd = (e) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (diff > 60) next();
    else if (diff < -60) prev();
    setPaused(false);
  };

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "500px",
        overflow: "hidden",
        direction: "rtl",
        background: "#0a1208",
        fontFamily: "'Cairo', sans-serif",
      }}
    >
      <style>{`
        /* ─── Slide Transitions ─── */
        .slide-layer {
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .slide-active {
          opacity: 1;
          transform: scale(1);
        }
        .slide-inactive {
          opacity: 0;
          transform: scale(1.05);
        }

        /* ─── Text Reveal Animation ─── */
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal-1 { animation: revealUp 0.7s 0.1s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .reveal-2 { animation: revealUp 0.7s 0.25s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .reveal-3 { animation: revealUp 0.7s 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .reveal-4 { animation: revealUp 0.7s 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }

        /* ─── Pulse Dot ─── */
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(92, 184, 68, 0.4); }
          50% { box-shadow: 0 0 0 8px rgba(92, 184, 68, 0); }
        }
        .pulse-dot {
          animation: pulse 2s ease-in-out infinite;
        }

        /* ─── Progress Glow ─── */
        .progress-glow {
          box-shadow: 0 0 12px rgba(92, 184, 68, 0.5), 0 0 4px rgba(92, 184, 68, 0.8);
        }

        /* ─── Hover Lift ─── */
        .hover-lift {
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
                      box-shadow 0.3s ease;
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px rgba(45, 106, 33, 0.35);
        }

        /* ═══════════ DESKTOP (>1024px) ═══════════ */
        @media (min-width: 1025px) {
          .hero-title { font-size: clamp(48px, 6vw, 80px) !important; }
          .hero-meta  { font-size: 15px !important; }
          .hero-price { font-size: 28px !important; }
          .hero-cta   { padding: 16px 48px !important; font-size: 15px !important; }
          .side-dots  { display: flex !important; }
          .top-bar    { display: flex !important; }
          .edge-arrows{ display: flex !important; }
          .mob-counter{ display: none !important; }
          .mob-swipe  { display: none !important; }
        }

        /* ═══════════ TABLET (768-1024px) ═══════════ */
        @media (max-width: 1024px) and (min-width: 769px) {
          .hero-title { font-size: 42px !important; }
          .hero-meta  { font-size: 14px !important; }
          .hero-price { font-size: 24px !important; }
          .hero-cta   { padding: 14px 40px !important; font-size: 14px !important; }
          .side-dots  { display: none !important; }
          .top-bar    { display: flex !important; }
          .edge-arrows{ display: flex !important; }
          .mob-counter{ display: none !important; }
          .mob-swipe  { display: none !important; }
        }

        /* ═══════════ MOBILE (≤768px) ═══════════ */
        @media (max-width: 768px) {
          .hero-title { 
            font-size: clamp(28px, 8vw, 42px) !important; 
            text-align: center !important;
          }
          .hero-meta  { 
            font-size: 13px !important; 
            text-align: center !important;
            justify-content: center !important;
          }
          .hero-features { justify-content: center !important; }
          .hero-price-row {
            flex-direction: column !important;
            align-items: center !important;
            gap: 20px !important;
          }
          .hero-price { 
            font-size: 32px !important; 
            order: -1 !important;
          }
          .hero-cta {
            width: 100% !important;
            max-width: 320px !important;
            padding: 14px 0 !important;
            font-size: 14px !important;
          }

          /* Hide desktop chrome */
          .side-dots  { display: none !important; }
          .top-bar    { display: none !important; }
          .edge-arrows{ display: none !important; }

          /* Show mobile chrome */
          .mob-counter{ display: flex !important; }
          .mob-swipe  { display: block !important; }
          .mob-arrows { display: flex !important; }

          /* Content centered vertically */
          .content-anchor {
            top: 50% !important;
            right: 50% !important;
            transform: translate(50%, -50%) !important;
            text-align: center !important;
            align-items: center !important;
            width: 90% !important;
            max-width: 400px !important;
          }

          /* Bottom progress bar thicker */
          .progress-glow { height: 4px !important; }
        }

        /* ═══════════ SMALL MOBILE (≤480px) ═══════════ */
        @media (max-width: 480px) {
          .hero-title { font-size: 26px !important; }
          .hero-meta  { display: none !important; }
          .hero-features { display: none !important; }
          .hero-price { font-size: 26px !important; }
          .hero-cta   { font-size: 13px !important; max-width: 280px !important; }
          .mob-counter{ padding: 5px 14px !important; }
          .mob-counter .curr { font-size: 14px !important; }
        }

        /* ═══════════ TINY (≤360px) ═══════════ */
        @media (max-width: 360px) {
          .hero-title { font-size: 22px !important; }
          .hero-price { font-size: 22px !important; }
          .hero-cta   { font-size: 12px !important; padding: 12px 0 !important; }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════
          BACKGROUND SLIDES — Full bleed, no containers
      ═══════════════════════════════════════════════════════ */}
      {terrains.map((terrain, i) => (
        <div
          key={terrain.id}
          className={`slide-layer ${i === current ? "slide-active" : "slide-inactive"}`}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: i === current ? 1 : 0,
          }}
        >
          <img
            src={terrain.image}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.45) saturate(1.1)",
            }}
          />
        </div>
      ))}

      {/* Gradient overlays — layered for depth */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(180deg, rgba(10,18,8,0.4) 0%, transparent 30%, transparent 60%, rgba(10,18,8,0.7) 100%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        background: "linear-gradient(90deg, rgba(10,18,8,0.3) 0%, transparent 40%, transparent 60%, rgba(10,18,8,0.2) 100%)",
        pointerEvents: "none",
      }} />

      {/* ═══════════════════════════════════════════════════════
          TOP BAR — Minimal counter + progress (desktop)
      ═══════════════════════════════════════════════════════ */}
      <div className="top-bar" style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
        display: "none", alignItems: "center", justifyContent: "space-between",
        padding: "28px 40px", direction: "ltr",
      }}>
        {/* Left: Slide counter */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, fontFamily: "'Cairo', sans-serif" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>
            {String(current + 1).padStart(2, "0")}
          </span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>/</span>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
            {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Center: Thin progress line */}
        <div style={{
          position: "absolute", left: "50%", transform: "translateX(-50%)",
          width: "30%", maxWidth: 200, height: 1,
          background: "rgba(255,255,255,0.15)", borderRadius: 1,
        }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: "#5cb844", borderRadius: 1,
            transition: "width 0.05s linear",
          }} />
        </div>

        {/* Right: Pause indicator */}
        <div style={{
          width: 6, height: 6, borderRadius: "50%",
          background: paused ? "#e74c3c" : "#5cb844",
          transition: "background 0.3s",
        }} />
      </div>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT — Floating, edge-anchored (desktop)
          Centered (mobile)
      ═══════════════════════════════════════════════════════ */}
      <div
        className="content-anchor"
        style={{
          position: "absolute",
          bottom: "12vh",
          right: "6vw",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          textAlign: "right",
          maxWidth: 600,
        }}
      >
        {/* Meta line — type · size · live dot */}
        <div className="hero-meta reveal-1" style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 16, color: "rgba(255,255,255,0.7)",
          fontSize: 15, fontWeight: 500, letterSpacing: 1,
        }}>
          <span className="pulse-dot" style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#5cb844", display: "inline-block",
          }} />
          <span>{t.type}</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
          <span>{t.size}</span>
        </div>

        {/* Title — massive, breaking out */}
        <h2 className="hero-title reveal-2" style={{
          fontSize: "clamp(48px, 6vw, 80px)",
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.05,
          margin: "0 0 16px",
          textShadow: "0 4px 30px rgba(0,0,0,0.4)",
          letterSpacing: "-0.02em",
        }}>
          {t.name}
        </h2>

        {/* Feature pills — minimal */}
        <div className="hero-features reveal-3" style={{
          display: "flex", gap: 10, marginBottom: 28,
          flexWrap: "wrap", justifyContent: "flex-end",
        }}>
          {t.features.map((f) => (
            <span key={f} style={{
              fontSize: 11, color: "rgba(255,255,255,0.6)",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "4px 14px", borderRadius: 20,
              backdropFilter: "blur(4px)",
            }}>
              {f}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="hero-price-row reveal-4" style={{
          display: "flex", alignItems: "center", gap: 24,
        }}>
          <button
            onClick={() => navigate("/reservation")}
            className="hero-cta hover-lift"
            style={{
              background: "#fff", color: "#1a3d14",
              border: "none", padding: "16px 48px",
              borderRadius: 50, fontSize: 15,
              fontWeight: 800, fontFamily: "'Cairo', sans-serif",
              cursor: "pointer", letterSpacing: 0.5,
              whiteSpace: "nowrap",
            }}
          >
            احجز الآن
          </button>

          <span className="hero-price" style={{
            color: "#fff", fontSize: 28,
            fontWeight: 900, fontFamily: "'Cairo', sans-serif",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}>
            {t.price}
            <span style={{ fontSize: 14, fontWeight: 400, color: "rgba(255,255,255,0.5)", marginRight: 4 }}>
              {t.currency}
            </span>
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SIDE DOTS — Vertical minimal indicators (desktop)
      ═══════════════════════════════════════════════════════ */}
      <div className="side-dots" style={{
        position: "absolute", right: "2.5vw", top: "50%",
        transform: "translateY(-50%)", zIndex: 5,
        display: "none", flexDirection: "column", gap: 14,
        alignItems: "center",
      }}>
        {terrains.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > current ? 1 : -1)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? 3 : 2,
              height: i === current ? 32 : 12,
              borderRadius: 2, border: "none", padding: 0,
              background: i === current ? "#5cb844" : "rgba(255,255,255,0.25)",
              cursor: "pointer",
              transition: "all 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          />
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          EDGE ARROWS — Minimal circle buttons (desktop)
      ═══════════════════════════════════════════════════════ */}
      <div className="edge-arrows" style={{
        position: "absolute", bottom: "12vh", left: "6vw", zIndex: 5,
        display: "none", alignItems: "center", gap: 12,
      }}>
        <button
          onClick={prev}
          aria-label="Previous"
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)", fontSize: 18,
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        >‹</button>
        <button
          onClick={next}
          aria-label="Next"
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.7)", fontSize: 18,
            cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
            transition: "all 0.3s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
        >›</button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE COUNTER — Floating pill top-center
      ═══════════════════════════════════════════════════════ */}
      <div className="mob-counter" style={{
        position: "absolute", top: 24, left: "50%",
        transform: "translateX(-50%)", zIndex: 10,
        display: "none", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        padding: "6px 18px", borderRadius: 20,
        fontFamily: "'Cairo', sans-serif",
      }}>
        <span className="curr" style={{ fontSize: 16, fontWeight: 900, color: "#fff" }}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <div style={{ width: 20, height: 2, background: "rgba(255,255,255,0.2)", borderRadius: 1, position: "relative", overflow: "hidden" }}>
          <div style={{
            position: "absolute", inset: 0,
            width: `${progress}%`, background: "#5cb844",
            transition: "width 0.05s linear",
          }} />
        </div>
        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          {String(total).padStart(2, "0")}
        </span>
      </div>

      {/* ═══════════════════════════════════════════════════════
          MOBILE ARROWS — Bottom corners
      ═══════════════════════════════════════════════════════ */}
      <div className="mob-arrows" style={{
        position: "absolute", bottom: 32, zIndex: 5,
        display: "none", width: "100%",
        justifyContent: "space-between", padding: "0 20px",
        pointerEvents: "none",
      }}>
        <button
          onClick={prev}
          style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)", pointerEvents: "auto",
          }}
        >‹</button>
        <button
          onClick={next}
          style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#fff", fontSize: 20, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(8px)", pointerEvents: "auto",
          }}
        >›</button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SWIPE HINT — Mobile only
      ═══════════════════════════════════════════════════════ */}
      <div className="mob-swipe" style={{
        position: "absolute", bottom: 92, left: "50%",
        transform: "translateX(-50%)", zIndex: 5,
        display: "none", color: "rgba(255,255,255,0.35)",
        fontSize: 11, fontFamily: "'Cairo', sans-serif",
        letterSpacing: 1,
      }}>
        اسحب للتنقل
      </div>

      {/* ═══════════════════════════════════════════════════════
          BOTTOM PROGRESS — Full width glow bar
      ═══════════════════════════════════════════════════════ */}
      <div className="progress-glow" style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        zIndex: 5, height: 2,
        background: "rgba(255,255,255,0.08)",
      }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: "linear-gradient(90deg, #5cb844, #8ee07a)",
          transition: "width 0.05s linear",
          boxShadow: "0 0 12px rgba(92,184,68,0.5), 0 0 4px rgba(92,184,68,0.8)",
        }} />
      </div>
    </section>
  );
}