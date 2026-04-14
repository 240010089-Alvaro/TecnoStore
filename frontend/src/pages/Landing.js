import { useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

/* ══════════════════════════════════════════
   IMÁGENES REALES — Unsplash Source API
   (no requiere API key, carga directa)
══════════════════════════════════════════ */
const PRODUCTOS = [
  {
    id: 1,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80",
    cat: "Laptops", name: "MacBook Pro M3", price: "$42,999", badge: "Nuevo",
    badgeColor: "#22d3ee",
  },
  {
    id: 2,
    img: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&q=80",
    cat: "Smartphones", name: "iPhone 16 Pro Max", price: "$35,500", badge: "Hot",
    badgeColor: "#f59e0b",
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    cat: "Audio", name: "Sony WH-1000XM5", price: "$8,999", badge: "Oferta",
    badgeColor: "#34d399",
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80",
    cat: "Wearables", name: "Apple Watch Ultra 2", price: "$16,500", badge: "Nuevo",
    badgeColor: "#22d3ee",
  },
  {
    id: 5,
    img: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    cat: "Laptops", name: "Dell XPS 15 OLED", price: "$38,000", badge: "Top",
    badgeColor: "#818cf8",
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=600&q=80",
    cat: "Audio", name: "AirPods Pro 2da Gen", price: "$6,499", badge: "Oferta",
    badgeColor: "#34d399",
  },
  {
    id: 7,
    img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&q=80",
    cat: "Gaming", name: "Razer BlackWidow V4", price: "$4,299", badge: "Hot",
    badgeColor: "#f59e0b",
  },
];

/* ══════════════════════════════════════════
   CSS GLOBAL
══════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ld2-root {
    font-family: 'DM Sans', sans-serif;
    background: #050810;
    min-height: 100vh;
    overflow-x: hidden;
    cursor: none;
  }

  /* ── Cursor magnético ── */
  .ld2-cur { position:fixed; z-index:9999; pointer-events:none; mix-blend-mode:difference; }
  .ld2-cur-dot {
    width:8px; height:8px; border-radius:50%;
    background:#fff; transform:translate(-50%,-50%);
  }
  .ld2-cur-ring {
    position:fixed; z-index:9998; pointer-events:none;
    width:40px; height:40px; border-radius:50%;
    border:1px solid rgba(99,179,237,.5);
    transform:translate(-50%,-50%);
    transition:width .3s,height .3s,border-color .3s;
  }

  /* ── Canvas partículas ── */
  #ld2-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }

  /* ── Grid hexagonal ── */
  .ld2-hex-grid {
    position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.07;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-2l26-15V18L28 2 2 18v30l26 15z' fill='none' stroke='%234299e1' stroke-width='.5'/%3E%3C/svg%3E");
    background-size: 56px 100px;
  }

  /* ── Scan line ── */
  @keyframes ld2-scan { 0%{top:-4px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100vh;opacity:0} }
  .ld2-scan { position:fixed; left:0; right:0; height:2px; z-index:2; pointer-events:none;
    background:linear-gradient(90deg,transparent,rgba(99,179,237,.12),rgba(99,179,237,.35),rgba(99,179,237,.12),transparent);
    animation:ld2-scan 10s linear infinite; }

  /* ── Noise ── */
  .ld2-noise {
    position:fixed; inset:0; z-index:1; pointer-events:none; opacity:.03;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px;
  }

  /* ── Orbs ── */
  @keyframes ld2-orb { 0%,100%{transform:translate(0,0)scale(1)} 33%{transform:translate(50px,-70px)scale(1.12)} 66%{transform:translate(-35px,40px)scale(.9)} }
  .ld2-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; animation:ld2-orb linear infinite; }

  /* ════ NAVBAR ════ */
  .ld2-nav {
    position:fixed; top:0; left:0; right:0; z-index:100;
    padding:18px 48px;
    display:flex; align-items:center; justify-content:space-between;
    background:rgba(5,8,16,.7);
    backdrop-filter:blur(24px) saturate(160%);
    -webkit-backdrop-filter:blur(24px) saturate(160%);
    border-bottom:1px solid rgba(255,255,255,.05);
  }
  .ld2-nav-logo { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#fff; letter-spacing:-.02em; display:flex; align-items:center; gap:10px; }
  .ld2-nav-logo-mark { width:32px; height:32px; border-radius:9px; background:linear-gradient(135deg,#3b82f6,#06b6d4); display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(59,130,246,.4); }
  .ld2-nav-links { display:flex; align-items:center; gap:32px; }
  .ld2-nav-link { font-size:13px; font-weight:500; color:rgba(203,213,224,.55); letter-spacing:.02em; text-decoration:none; transition:color .2s; border:none; background:none; cursor:none; }
  .ld2-nav-link:hover { color:#fff; }
  .ld2-nav-btn {
    padding:9px 22px; border-radius:10px; font-size:13px; font-weight:600;
    background:linear-gradient(135deg,#3b82f6,#06b6d4); color:white; border:none; cursor:none;
    font-family:'DM Sans',sans-serif; box-shadow:0 0 24px rgba(59,130,246,.3);
    transition:box-shadow .2s, transform .15s;
  }
  .ld2-nav-btn:hover { box-shadow:0 0 40px rgba(59,130,246,.5); transform:translateY(-1px); }

  /* ════ HERO ════ */
  .ld2-hero {
    position:relative; z-index:10; min-height:100vh;
    display:grid; grid-template-columns:1fr 1fr; gap:0; align-items:center;
    padding:120px 80px 80px;
    max-width:1400px; margin:0 auto;
  }
  @media(max-width:900px){ .ld2-hero{ grid-template-columns:1fr; padding:120px 28px 60px; text-align:center; } }

  /* Left */
  .ld2-hero-left { display:flex; flex-direction:column; gap:0; }

  .ld2-hero-eyebrow {
    display:inline-flex; align-items:center; gap:8px; margin-bottom:28px;
    padding:5px 14px 5px 8px; border-radius:50px;
    background:rgba(59,130,246,.08); border:1px solid rgba(59,130,246,.2);
    font-family:'JetBrains Mono',monospace; font-size:11px; color:#60a5fa; letter-spacing:.1em; text-transform:uppercase;
    width:fit-content;
  }
  .ld2-hero-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#3b82f6; animation:ld2-pulse 2s ease-in-out infinite; }
  @keyframes ld2-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.8)} }

  .ld2-hero-title {
    font-family:'Syne',sans-serif;
    font-size:clamp(44px,6vw,88px); font-weight:800; line-height:.92; letter-spacing:-.04em;
    color:#fff; margin-bottom:24px;
  }
  .ld2-hero-title .grad {
    background:linear-gradient(90deg,#3b82f6 0%,#06b6d4 40%,#818cf8 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .ld2-hero-title .outline {
    -webkit-text-stroke:1.5px rgba(255,255,255,.25);
    -webkit-text-fill-color:transparent;
  }

  .ld2-hero-sub { font-size:17px; color:rgba(148,163,184,.6); line-height:1.72; max-width:440px; margin-bottom:40px; }

  .ld2-hero-actions { display:flex; gap:14px; flex-wrap:wrap; }
  .ld2-btn-main {
    padding:16px 38px; border-radius:14px; border:none; cursor:none;
    font-family:'Syne',sans-serif; font-size:15px; font-weight:700; letter-spacing:.02em;
    color:#fff; position:relative; overflow:hidden;
    background:linear-gradient(135deg,#1d4ed8,#3b82f6,#06b6d4);
    background-size:200% auto;
    box-shadow:0 0 0 1px rgba(59,130,246,.3), 0 8px 32px rgba(59,130,246,.3);
    transition:background-position .4s, box-shadow .2s, transform .15s;
  }
  .ld2-btn-main:hover { background-position:right; box-shadow:0 0 0 1px rgba(59,130,246,.5),0 16px 48px rgba(59,130,246,.45); transform:translateY(-2px); }
  .ld2-btn-main::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,transparent 50%,rgba(255,255,255,.12) 100%); pointer-events:none; }
  .ld2-btn-ghost {
    padding:16px 32px; border-radius:14px; cursor:none;
    font-family:'Syne',sans-serif; font-size:15px; font-weight:600;
    background:transparent; border:1px solid rgba(255,255,255,.1); color:rgba(203,213,224,.65);
    transition:border-color .2s, color .2s, background .2s;
  }
  .ld2-btn-ghost:hover { border-color:rgba(59,130,246,.5); color:#fff; background:rgba(59,130,246,.06); }

  /* Stats row */
  .ld2-hero-stats { display:flex; gap:32px; margin-top:52px; padding-top:40px; border-top:1px solid rgba(255,255,255,.06); flex-wrap:wrap; }
  .ld2-stat-item { }
  .ld2-stat-num { font-family:'Syne',sans-serif; font-size:30px; font-weight:800; color:#fff; line-height:1; }
  .ld2-stat-num .acc { color:#38bdf8; }
  .ld2-stat-lbl { font-size:12px; color:rgba(100,116,139,.8); margin-top:4px; letter-spacing:.06em; text-transform:uppercase; }

  /* Right — floating device mockup */
  .ld2-hero-right { position:relative; display:flex; align-items:center; justify-content:center; height:580px; }
  .ld2-mockup-wrap { position:relative; width:320px; }
  .ld2-mockup {
    width:320px; border-radius:32px; overflow:hidden;
    border:1px solid rgba(255,255,255,.1);
    box-shadow:0 0 0 1px rgba(59,130,246,.15), 0 40px 100px rgba(0,0,0,.7), 0 0 80px rgba(59,130,246,.12);
    position:relative; z-index:2;
  }
  .ld2-mockup img { width:100%; height:420px; object-fit:cover; display:block; }
  .ld2-mockup-bar { background:rgba(10,14,25,.95); padding:14px 18px; display:flex; align-items:center; justify-content:space-between; border-top:1px solid rgba(255,255,255,.06); }
  .ld2-mockup-tag { font-family:'JetBrains Mono',monospace; font-size:11px; color:#60a5fa; letter-spacing:.08em; }
  .ld2-mockup-price { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#fff; }

  /* Floating chips */
  .ld2-chip {
    position:absolute; z-index:3;
    background:rgba(10,14,25,.9); border:1px solid rgba(255,255,255,.1);
    border-radius:16px; padding:10px 14px;
    backdrop-filter:blur(16px); box-shadow:0 8px 32px rgba(0,0,0,.5);
    white-space:nowrap;
  }
  .ld2-chip-label { font-size:10px; color:rgba(100,116,139,.7); letter-spacing:.08em; text-transform:uppercase; margin-bottom:2px; }
  .ld2-chip-value { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:#fff; }

  /* Glow rings detrás del mockup */
  @keyframes ld2-ring-pulse { 0%,100%{transform:scale(1);opacity:.3} 50%{transform:scale(1.08);opacity:.6} }
  .ld2-ring { position:absolute; border-radius:50%; border:1px solid; animation:ld2-ring-pulse ease-in-out infinite; z-index:1; }

  /* ════ MARQUEE ════ */
  .ld2-marquee-section { position:relative; z-index:10; padding:48px 0; overflow:hidden; border-top:1px solid rgba(255,255,255,.04); border-bottom:1px solid rgba(255,255,255,.04); }
  @keyframes ld2-marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .ld2-marquee-track { display:flex; width:max-content; animation:ld2-marquee 24s linear infinite; }
  .ld2-marquee-track:hover { animation-play-state:paused; }
  .ld2-marquee-item { display:flex; align-items:center; gap:10px; padding:0 36px; font-family:'Syne',sans-serif; font-size:14px; font-weight:600; color:rgba(100,116,139,.5); letter-spacing:.06em; white-space:nowrap; }
  .ld2-marquee-sep { width:4px; height:4px; border-radius:50%; background:rgba(59,130,246,.4); }

  /* ════ PRODUCTOS GRID ════ */
  .ld2-prods-section { position:relative; z-index:10; padding:100px 80px; max-width:1400px; margin:0 auto; }
  @media(max-width:900px){ .ld2-prods-section{ padding:80px 24px; } }
  .ld2-section-eyebrow { font-family:'JetBrains Mono',monospace; font-size:12px; color:#60a5fa; letter-spacing:.16em; text-transform:uppercase; margin-bottom:14px; }
  .ld2-section-title { font-family:'Syne',sans-serif; font-size:clamp(28px,4vw,52px); font-weight:800; color:#fff; letter-spacing:-.03em; margin-bottom:60px; line-height:1.05; }
  .ld2-section-title em { font-style:normal; background:linear-gradient(90deg,#3b82f6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  .ld2-prods-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px; }

  /* Tarjeta de producto */
  .ld2-pcard {
    position:relative; border-radius:20px; overflow:hidden; cursor:none;
    background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.07);
    transition:border-color .3s, box-shadow .3s, transform .3s;
  }
  .ld2-pcard:hover { border-color:rgba(59,130,246,.35); box-shadow:0 0 0 1px rgba(59,130,246,.15),0 20px 60px rgba(0,0,0,.5); transform:translateY(-6px); }
  .ld2-pcard-img { position:relative; height:220px; overflow:hidden; }
  .ld2-pcard-img img { width:100%; height:100%; object-fit:cover; transition:transform .5s ease; }
  .ld2-pcard:hover .ld2-pcard-img img { transform:scale(1.06); }
  .ld2-pcard-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(5,8,16,.85) 0%,transparent 55%); }
  .ld2-pcard-badge { position:absolute; top:12px; left:12px; padding:4px 10px; border-radius:20px; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.08em; }
  .ld2-pcard-body { padding:16px 18px 20px; }
  .ld2-pcard-cat { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(96,165,250,.8); margin-bottom:5px; }
  .ld2-pcard-name { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#f0f9ff; margin-bottom:14px; line-height:1.2; }
  .ld2-pcard-footer { display:flex; align-items:center; justify-content:space-between; }
  .ld2-pcard-price { font-family:'Syne',sans-serif; font-size:18px; font-weight:800; color:#fff; }
  .ld2-pcard-addwrap { position:relative; }
  .ld2-pcard-add {
    width:38px; height:38px; border-radius:50%; border:1px solid rgba(59,130,246,.35);
    background:rgba(59,130,246,.1); color:#60a5fa; cursor:none;
    display:flex; align-items:center; justify-content:center;
    transition:background .2s, border-color .2s, transform .15s;
  }
  .ld2-pcard-add:hover { background:rgba(59,130,246,.22); border-color:rgba(59,130,246,.6); transform:scale(1.1); }
  @keyframes ld2-ring-pop { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
  .ld2-add-ring { position:absolute; inset:0; border-radius:50%; border:1.5px solid #3b82f6; animation:ld2-ring-pop .6s ease-out forwards; pointer-events:none; }

  /* ════ FEATURES ════ */
  .ld2-feat-section { position:relative; z-index:10; padding:0 80px 100px; max-width:1400px; margin:0 auto; }
  @media(max-width:900px){ .ld2-feat-section{ padding:0 24px 80px; } }
  .ld2-feat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:16px; }
  .ld2-feat-card {
    padding:28px; border-radius:20px; position:relative; overflow:hidden;
    background:rgba(255,255,255,.025); border:1px solid rgba(255,255,255,.06);
    transition:border-color .3s, box-shadow .3s;
  }
  .ld2-feat-card::before {
    content:''; position:absolute; inset:0; opacity:0;
    background:radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(59,130,246,.08) 0%,transparent 60%);
    transition:opacity .3s; pointer-events:none;
  }
  .ld2-feat-card:hover { border-color:rgba(59,130,246,.2); box-shadow:0 8px 40px rgba(0,0,0,.3); }
  .ld2-feat-card:hover::before { opacity:1; }
  .ld2-feat-ico { width:48px; height:48px; border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:18px; }
  .ld2-feat-title { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#f0f9ff; margin-bottom:8px; }
  .ld2-feat-desc { font-size:13px; color:rgba(100,116,139,.75); line-height:1.65; }

  /* ════ FOOTER CTA ════ */
  .ld2-footer-section {
    position:relative; z-index:10; text-align:center; padding:80px 24px 100px;
    border-top:1px solid rgba(255,255,255,.05);
  }
  .ld2-footer-title { font-family:'Syne',sans-serif; font-size:clamp(32px,5vw,72px); font-weight:800; color:#fff; letter-spacing:-.04em; line-height:1; margin-bottom:12px; }
  .ld2-footer-title .grad { background:linear-gradient(90deg,#3b82f6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .ld2-footer-sub { font-size:16px; color:rgba(100,116,139,.7); margin-bottom:40px; }
  .ld2-footer-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
  .ld2-footer-copy { margin-top:80px; font-size:12px; color:rgba(100,116,139,.35); letter-spacing:.06em; font-family:'JetBrains Mono',monospace; }

  /* Scroll indicator */
  @keyframes ld2-wheel { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(8px);opacity:0} }
  .ld2-scroll { position:absolute; bottom:30px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; align-items:center; gap:5px; z-index:10; }
  .ld2-scroll-mouse { width:20px; height:32px; border-radius:10px; border:1px solid rgba(255,255,255,.2); display:flex; justify-content:center; padding-top:4px; }
  .ld2-scroll-wheel { width:2px; height:5px; background:#3b82f6; border-radius:1px; animation:ld2-wheel 1.5s ease-in-out infinite; }
  .ld2-scroll-lbl { font-size:9px; color:rgba(255,255,255,.2); letter-spacing:.14em; text-transform:uppercase; font-family:'JetBrains Mono',monospace; }
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

/* ── Canvas partículas ── */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    const onResize = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    const pts = Array.from({ length: 90 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-.5)*.25, vy: (Math.random()-.5)*.25,
      r: Math.random()*1.4+.3, a: Math.random()*.6+.1,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(59,130,246,${p.a*.35})`; ctx.fill();
        for (let j = i+1; j < pts.length; j++) {
          const q = pts[j], dx = p.x-q.x, dy = p.y-q.y;
          const d = Math.sqrt(dx*dx+dy*dy);
          if (d < 110) {
            ctx.beginPath(); ctx.moveTo(p.x,p.y); ctx.lineTo(q.x,q.y);
            ctx.strokeStyle = `rgba(59,130,246,${.1*(1-d/110)})`; ctx.lineWidth=.5; ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);
  return <canvas id="ld2-canvas" ref={ref} />;
}

/* ── Cursor ── */
function Cursor() {
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x,{stiffness:500,damping:38}), ry = useSpring(y,{stiffness:500,damping:38});
  const rrx = useSpring(x,{stiffness:100,damping:20}), rry = useSpring(y,{stiffness:100,damping:20});
  useEffect(() => {
    const m = e => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, []);
  return (
    <>
      <motion.div className="ld2-cur" style={{ left:rx, top:ry }}><div className="ld2-cur-dot" /></motion.div>
      <motion.div className="ld2-cur-ring" style={{ left:rrx, top:rry }} />
    </>
  );
}

/* ── Counter ── */
function Counter({ to, suffix="" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      let n = 0; const s = to/60;
      const t = setInterval(() => { n += s; if (n >= to) { setV(to); clearInterval(t); } else setV(Math.floor(n)); }, 18);
      obs.disconnect();
    }, { threshold:.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

/* ── Producto Card ── */
function PCard({ p, i }) {
  const [added, setAdded] = useState(false);
  return (
    <motion.div className="ld2-pcard"
      initial={{ opacity:0, y:36 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:.15 }}
      transition={{ duration:.55, delay:i*.08, ease:[.25,.46,.45,.94] }}>
      <div className="ld2-pcard-img">
        <img src={p.img} alt={p.name} loading="lazy" />
        <div className="ld2-pcard-img-overlay" />
        <span className="ld2-pcard-badge" style={{ background:`${p.badgeColor}22`, border:`1px solid ${p.badgeColor}44`, color:p.badgeColor }}>
          {p.badge}
        </span>
      </div>
      <div className="ld2-pcard-body">
        <p className="ld2-pcard-cat">{p.cat}</p>
        <p className="ld2-pcard-name">{p.name}</p>
        <div className="ld2-pcard-footer">
          <span className="ld2-pcard-price">{p.price}</span>
          <div className="ld2-pcard-addwrap">
            {added && <div className="ld2-add-ring" />}
            <motion.button className="ld2-pcard-add" whileTap={{ scale:.88 }}
              onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 700); }}>
              <AnimatePresence mode="wait">
                {added
                  ? <motion.svg key="c" initial={{scale:0,rotate:-90}} animate={{scale:1,rotate:0}} exit={{scale:0}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></motion.svg>
                  : <motion.svg key="p" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></motion.svg>
                }
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Feature card con mouse glow ── */
function FeatCard({ ico, color, title, desc, delay }) {
  const ref = useRef(null);
  const onMove = useCallback(e => {
    const r = ref.current?.getBoundingClientRect(); if (!r) return;
    ref.current.style.setProperty("--mx", `${((e.clientX-r.left)/r.width*100).toFixed(1)}%`);
    ref.current.style.setProperty("--my", `${((e.clientY-r.top)/r.height*100).toFixed(1)}%`);
  }, []);
  return (
    <motion.div ref={ref} className="ld2-feat-card" onMouseMove={onMove}
      initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:.2 }}
      transition={{ duration:.5, delay, ease:[.25,.46,.45,.94] }}>
      <div className="ld2-feat-ico" style={{ background:`${color}18`, border:`1px solid ${color}30` }}>{ico}</div>
      <p className="ld2-feat-title">{title}</p>
      <p className="ld2-feat-desc">{desc}</p>
    </motion.div>
  );
}

/* ════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════ */
function Landing() {
  injectCSS();
  const navigate = useNavigate();
  const [heroImg, setHeroImg] = useState(0);

  // Rota imagen del mockup hero
  useEffect(() => {
    const t = setInterval(() => setHeroImg(i => (i+1) % PRODUCTOS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const MARQUEE_ITEMS = ["MacBook Pro","iPhone 16","Sony WH-1000XM5","Samsung Galaxy S25","AirPods Pro","LG OLED","Razer Gaming","DJI Drone","iPad Pro","RTX 5090","PS5 Pro","Meta Quest 3","Apple Watch Ultra"];

  const FEATURES = [
    { ico:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, color:"#3b82f6", title:"Pagos Blindados", delay:.05, desc:"Cifrado SSL y autenticación de dos factores en cada transacción." },
    { ico:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.8"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>, color:"#06b6d4", title:"Tech de Punta", delay:.1, desc:"Los últimos lanzamientos disponibles antes que en cualquier otra tienda." },
    { ico:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, color:"#34d399", title:"Envío Express", delay:.15, desc:"24-48h con rastreo en tiempo real directo desde tu dashboard." },
    { ico:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>, color:"#f59e0b", title:"Garantía Oficial", delay:.2, desc:"Todos los productos con garantía del fabricante y soporte dedicado." },
    { ico:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, color:"#818cf8", title:"Red de Proveedores", delay:.25, desc:"Más de 340 vendedores verificados compitiendo por el mejor precio." },
    { ico:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>, color:"#f472b6", title:"Soporte 24/7", delay:.3, desc:"Chat en vivo, email y teléfono disponibles toda la semana sin excepción." },
  ];

  return (
    <div className="ld2-root">
      <Cursor />
      <Particles />
      <div className="ld2-hex-grid" />
      <div className="ld2-scan" />
      <div className="ld2-noise" />

      {/* Orbs */}
      <div className="ld2-orb" style={{ width:800,height:800,top:-250,left:-300, background:"radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%)", animationDuration:"24s" }} />
      <div className="ld2-orb" style={{ width:600,height:600,bottom:-180,right:-200, background:"radial-gradient(circle,rgba(6,182,212,.08) 0%,transparent 70%)", animationDuration:"30s", animationDirection:"reverse" }} />
      <div className="ld2-orb" style={{ width:450,height:450,top:"38%",left:"58%", background:"radial-gradient(circle,rgba(129,140,248,.06) 0%,transparent 70%)", animationDuration:"38s", animationDelay:"8s" }} />

      {/* ── NAVBAR ── */}
      <motion.nav className="ld2-nav"
        initial={{ y:-60, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:.6, ease:[.25,.46,.45,.94] }}>
        <div className="ld2-nav-logo">
          <div className="ld2-nav-logo-mark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          TecnoStore
        </div>
        <div className="ld2-nav-links">
          <button className="ld2-nav-link" onClick={() => navigate("/productos")}>Catálogo</button>
          <button className="ld2-nav-link" onClick={() => navigate("/login")}>Iniciar sesión</button>
          <motion.button className="ld2-nav-btn" whileTap={{ scale:.95 }} onClick={() => navigate("/login")}>
            Registrarse →
          </motion.button>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <section className="ld2-hero">

        {/* Izquierda */}
        <div className="ld2-hero-left">
          <motion.div className="ld2-hero-eyebrow"
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:.6, delay:.2 }}>
            <span className="ld2-hero-eyebrow-dot" />
            Marketplace de tecnología · México
          </motion.div>

          <motion.h1 className="ld2-hero-title"
            initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.7, delay:.3, ease:[.25,.46,.45,.94] }}>
            <span className="grad">Compra</span><br />
            <span className="outline">tecnología</span><br />
            sin límites
          </motion.h1>

          <motion.p className="ld2-hero-sub"
            initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.6, delay:.45 }}>
            El marketplace más completo de México para comprar y vender tecnología de forma rápida, segura y con los mejores precios.
          </motion.p>

          <motion.div className="ld2-hero-actions"
            initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ duration:.6, delay:.55 }}>
            <motion.button className="ld2-btn-main" whileTap={{ scale:.96 }} onClick={() => navigate("/login")}>
              Empezar ahora &nbsp;→
            </motion.button>
            <motion.button className="ld2-btn-ghost" whileTap={{ scale:.96 }} onClick={() => navigate("/productos")}>
              Ver productos
            </motion.button>
          </motion.div>

          <motion.div className="ld2-hero-stats"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.8 }}>
            {[{to:12400,s:"+",l:"Productos"},{to:8200,s:"+",l:"Clientes"},{to:340,s:"+",l:"Proveedores"},{to:99,s:"%",l:"Satisfacción"}].map(({to,s,l})=>(
              <div key={l} className="ld2-stat-item">
                <div className="ld2-stat-num"><Counter to={to} suffix={s} /></div>
                <div className="ld2-stat-lbl">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Derecha — mockup flotante */}
        <motion.div className="ld2-hero-right"
          initial={{ opacity:0, x:48 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:.8, delay:.4, ease:[.25,.46,.45,.94] }}>

          {/* Anillos de glow */}
          <div className="ld2-ring" style={{ width:420,height:420,top:"50%",left:"50%",marginLeft:-210,marginTop:-210, borderColor:"rgba(59,130,246,.12)", animationDuration:"4s" }} />
          <div className="ld2-ring" style={{ width:560,height:560,top:"50%",left:"50%",marginLeft:-280,marginTop:-280, borderColor:"rgba(59,130,246,.06)", animationDuration:"6s", animationDelay:"1s" }} />

          {/* Mockup principal */}
          <motion.div className="ld2-mockup-wrap"
            animate={{ y:[-8,8,-8] }}
            transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}>
            <div className="ld2-mockup">
              <AnimatePresence mode="wait">
                <motion.img key={heroImg}
                  src={PRODUCTOS[heroImg].img} alt={PRODUCTOS[heroImg].name}
                  initial={{ opacity:0, scale:1.06 }} animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:.96 }}
                  transition={{ duration:.6 }} />
              </AnimatePresence>
              <div className="ld2-mockup-bar">
                <div>
                  <div className="ld2-mockup-tag">{PRODUCTOS[heroImg].cat}</div>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:14, fontWeight:700, color:"#f0f9ff", marginTop:2 }}>
                    {PRODUCTOS[heroImg].name}
                  </div>
                </div>
                <div className="ld2-mockup-price">{PRODUCTOS[heroImg].price}</div>
              </div>
            </div>

            {/* Chips flotantes */}
            <motion.div className="ld2-chip" style={{ top:-16, right:-48 }}
              animate={{ y:[-4,4,-4] }} transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut", delay:.5 }}>
              <div className="ld2-chip-label">Envío express</div>
              <div className="ld2-chip-value">24 horas </div>
            </motion.div>

            <motion.div className="ld2-chip" style={{ bottom:80, left:-52 }}
              animate={{ y:[4,-4,4] }} transition={{ duration:4, repeat:Infinity, ease:"easeInOut", delay:1 }}>
              <div className="ld2-chip-label">Garantía</div>
              <div className="ld2-chip-value">1 año ✓</div>
            </motion.div>

            <motion.div className="ld2-chip" style={{ bottom:-10, right:-20 }}
              animate={{ y:[-3,5,-3] }} transition={{ duration:3.2, repeat:Infinity, ease:"easeInOut", delay:2 }}>
              <div className="ld2-chip-label">Pago seguro</div>
              <div className="ld2-chip-value" style={{ color:"#34d399" }}>SSL ● activo</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll */}
        <div className="ld2-scroll">
          <div className="ld2-scroll-mouse"><div className="ld2-scroll-wheel" /></div>
          <span className="ld2-scroll-lbl">Scroll</span>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="ld2-marquee-section">
        <div className="ld2-marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <div key={i} className="ld2-marquee-item">
              {item}
              <span className="ld2-marquee-sep" />
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTOS ── */}
      <section className="ld2-prods-section">
        <motion.p className="ld2-section-eyebrow"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          Catálogo destacado
        </motion.p>
        <motion.h2 className="ld2-section-title"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.5, delay:.1 }}>
          Productos <em>premium</em><br />al mejor precio
        </motion.h2>
        <div className="ld2-prods-grid">
          {PRODUCTOS.map((p, i) => <PCard key={p.id} p={p} i={i} />)}
        </div>

        <motion.div style={{ textAlign:"center", marginTop:48 }}
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <motion.button className="ld2-btn-ghost" whileTap={{ scale:.96 }}
            onClick={() => navigate("/productos")}
            style={{ padding:"14px 36px", borderRadius:14 }}>
            Ver catálogo completo →
          </motion.button>
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="ld2-feat-section">
        <motion.p className="ld2-section-eyebrow"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          ¿Por qué TecnoStore?
        </motion.p>
        <motion.h2 className="ld2-section-title"
          initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.5, delay:.1 }}>
          Todo lo que necesitas,<br />en <em>un solo lugar</em>
        </motion.h2>
        <div className="ld2-feat-grid">
          {FEATURES.map(f => <FeatCard key={f.title} {...f} />)}
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <section className="ld2-footer-section">
        <motion.p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:"rgba(59,130,246,.6)", letterSpacing:".16em", textTransform:"uppercase", marginBottom:20 }}
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          Únete hoy
        </motion.p>
        <motion.h2 className="ld2-footer-title"
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:.55 }}>
          La tecnología del futuro<br /><span className="grad">está aquí ahora</span>
        </motion.h2>
        <motion.p className="ld2-footer-sub"
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
          transition={{ delay:.2 }}>
          Crea tu cuenta gratis y empieza a comprar o vender hoy mismo.
        </motion.p>
        <motion.div className="ld2-footer-btns"
          initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ delay:.3 }}>
          <motion.button className="ld2-btn-main" whileTap={{ scale:.96 }} onClick={() => navigate("/login")}>
            Crear cuenta gratis &nbsp;→
          </motion.button>
          <motion.button className="ld2-btn-ghost" whileTap={{ scale:.96 }} onClick={() => navigate("/login")}
            style={{ padding:"16px 32px", borderRadius:14 }}>
            Soy proveedor
          </motion.button>
        </motion.div>
        <p className="ld2-footer-copy">© 2026 TecnoStore · Hecho en México 🇲🇽</p>
      </section>
    </div>
  );
}

export default Landing;