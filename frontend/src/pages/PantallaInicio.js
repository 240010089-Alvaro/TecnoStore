import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ══════════════════════════════════════
   ESTILOS GLOBALES
══════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .pi-wrap *, .pi-wrap *::before, .pi-wrap *::after { box-sizing: border-box; }

  .pi-wrap {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #050810;
    color: #e2e8f0;
    overflow-x: hidden;
    position: relative;
  }

  /* Orbs */
  @keyframes pi-orb { 0%,100%{transform:translate(0,0)scale(1)} 33%{transform:translate(40px,-55px)scale(1.09)} 66%{transform:translate(-28px,32px)scale(.93)} }
  .pi-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; animation:pi-orb linear infinite; }

  /* Grid hex */
  .pi-hex { position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.05;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-2l26-15V18L28 2 2 18v30l26 15z' fill='none' stroke='%234299e1' stroke-width='.5'/%3E%3C/svg%3E");
    background-size:56px 100px; }

  /* Noise */
  .pi-noise { position:fixed; inset:0; z-index:1; pointer-events:none; opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px; }

  /* Scan */
  @keyframes pi-scan { 0%{top:-2px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100vh;opacity:0} }
  .pi-scan { position:fixed; left:0; right:0; height:1.5px; z-index:2; pointer-events:none;
    background:linear-gradient(90deg,transparent,rgba(59,130,246,.1),rgba(59,130,246,.28),rgba(59,130,246,.1),transparent);
    animation:pi-scan 10s linear infinite; }

  /* ══ NAVBAR ══ */
  .pi-nav {
    position:sticky; top:0; z-index:100;
    background:rgba(5,8,16,.8);
    backdrop-filter:blur(24px) saturate(160%);
    -webkit-backdrop-filter:blur(24px) saturate(160%);
    border-bottom:1px solid rgba(255,255,255,.05);
    padding:0 48px; height:66px;
    display:flex; align-items:center; justify-content:space-between; gap:24px;
  }
  @media(max-width:768px){ .pi-nav{ padding:0 20px; } }

  .pi-nav-logo { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .pi-nav-logomark { width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg,#3b82f6,#06b6d4); display:flex; align-items:center; justify-content:center; box-shadow:0 0 18px rgba(59,130,246,.4); flex-shrink:0; }
  .pi-nav-brand { font-family:'Syne',sans-serif; font-size:19px; font-weight:800; color:#fff; letter-spacing:-.02em; }

  .pi-nav-links { display:flex; align-items:center; gap:6px; }
  .pi-nav-link { padding:7px 14px; border-radius:10px; font-size:13px; font-weight:500; color:rgba(148,163,184,.65); background:none; border:none; cursor:pointer; transition:color .2s,background .2s; font-family:'DM Sans',sans-serif; }
  .pi-nav-link:hover { color:#fff; background:rgba(255,255,255,.05); }
  .pi-nav-link.active { color:#60a5fa; background:rgba(59,130,246,.08); }

  .pi-nav-right { display:flex; align-items:center; gap:10px; }

  /* Carrito badge */
  .pi-cart-btn { position:relative; width:38px; height:38px; border-radius:11px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); display:flex; align-items:center; justify-content:center; cursor:pointer; color:rgba(148,163,184,.7); transition:background .2s,border-color .2s,color .2s; }
  .pi-cart-btn:hover { background:rgba(255,255,255,.08); border-color:rgba(59,130,246,.3); color:#60a5fa; }
  .pi-cart-badge { position:absolute; top:-5px; right:-5px; width:16px; height:16px; border-radius:50%; background:#ef4444; font-size:9px; font-weight:700; color:#fff; display:flex; align-items:center; justify-content:center; border:1.5px solid #050810; }

  /* Avatar btn */
  .pi-avatar-btn { display:flex; align-items:center; gap:9px; padding:5px 12px 5px 5px; border-radius:50px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); cursor:pointer; transition:border-color .2s,background .2s; position:relative; }
  .pi-avatar-btn:hover { border-color:rgba(59,130,246,.35); background:rgba(255,255,255,.07); }
  .pi-avatar { width:30px; height:30px; border-radius:50%; background:linear-gradient(135deg,#3b82f6,#06b6d4); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:12px; font-weight:700; color:#fff; flex-shrink:0; }
  .pi-avatar-name { font-size:13px; font-weight:500; color:#cbd5e1; white-space:nowrap; }

  /* Dropdown */
  .pi-dropdown { position:absolute; right:0; top:calc(100%+10px); width:220px; background:rgba(8,12,22,.96); border:1px solid rgba(255,255,255,.08); border-radius:18px; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.6),0 0 0 1px rgba(59,130,246,.05); }
  .pi-dd-header { padding:16px 18px; border-bottom:1px solid rgba(255,255,255,.06); }
  .pi-dd-name { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:#f0f9ff; }
  .pi-dd-email { font-size:11px; color:rgba(100,116,139,.7); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-family:'JetBrains Mono',monospace; }
  .pi-dd-item { width:100%; text-align:left; padding:12px 18px; font-size:13px; font-weight:500; cursor:pointer; border:none; background:transparent; color:rgba(148,163,184,.7); display:flex; align-items:center; gap:10px; transition:background .14s,color .14s; font-family:'DM Sans',sans-serif; }
  .pi-dd-item:hover { background:rgba(59,130,246,.07); color:#e2e8f0; }
  .pi-dd-sep { height:1px; background:rgba(255,255,255,.05); }
  .pi-dd-danger { color:#f87171; }
  .pi-dd-danger:hover { background:rgba(239,68,68,.07); color:#fca5a5; }

  /* ══ HERO ══ */
  .pi-hero { position:relative; z-index:10; display:grid; grid-template-columns:1fr 1fr; gap:48px; align-items:center; padding:72px 80px 80px; max-width:1400px; margin:0 auto; }
  @media(max-width:900px){ .pi-hero{ grid-template-columns:1fr; padding:48px 24px 60px; } }

  .pi-hero-eyebrow { display:inline-flex; align-items:center; gap:8px; padding:5px 14px 5px 8px; border-radius:50px; background:rgba(59,130,246,.08); border:1px solid rgba(59,130,246,.2); font-family:'JetBrains Mono',monospace; font-size:11px; color:#60a5fa; letter-spacing:.1em; text-transform:uppercase; margin-bottom:24px; }
  @keyframes pi-blink { 0%,100%{opacity:1} 50%{opacity:.2} }
  .pi-eyebrow-dot { width:6px; height:6px; border-radius:50%; background:#3b82f6; animation:pi-blink 2s ease-in-out infinite; }

  .pi-hero-title { font-family:'Syne',sans-serif; font-size:clamp(40px,5.5vw,76px); font-weight:800; line-height:.92; letter-spacing:-.04em; color:#fff; margin-bottom:20px; }
  .pi-hero-title .gr { background:linear-gradient(90deg,#3b82f6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  .pi-hero-sub { font-size:17px; color:rgba(100,116,139,.75); line-height:1.72; max-width:420px; margin-bottom:36px; }

  .pi-hero-btns { display:flex; gap:12px; flex-wrap:wrap; }
  .pi-btn-primary { padding:14px 32px; border-radius:13px; border:none; cursor:pointer; font-family:'Syne',sans-serif; font-size:14px; font-weight:700; letter-spacing:.02em; color:#fff; background:linear-gradient(135deg,#1d4ed8,#3b82f6,#06b6d4); background-size:200% auto; box-shadow:0 0 0 1px rgba(59,130,246,.3),0 8px 28px rgba(59,130,246,.28); transition:box-shadow .2s,transform .15s; }
  .pi-btn-primary:hover { box-shadow:0 0 0 1px rgba(59,130,246,.5),0 12px 40px rgba(59,130,246,.45); transform:translateY(-2px); }
  .pi-btn-ghost { padding:14px 28px; border-radius:13px; cursor:pointer; font-family:'Syne',sans-serif; font-size:14px; font-weight:600; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); color:rgba(203,213,224,.65); transition:border-color .2s,color .2s,background .2s; }
  .pi-btn-ghost:hover { border-color:rgba(59,130,246,.4); color:#fff; background:rgba(59,130,246,.06); }

  .pi-hero-stats { display:flex; gap:28px; margin-top:44px; padding-top:36px; border-top:1px solid rgba(255,255,255,.06); flex-wrap:wrap; }
  .pi-stat-num { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:#fff; line-height:1; }
  .pi-stat-lbl { font-size:11px; color:rgba(100,116,139,.7); text-transform:uppercase; letter-spacing:.08em; margin-top:3px; }

  /* Hero imagen */
  .pi-hero-img-wrap { position:relative; }
  .pi-hero-img { width:100%; border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,.08); box-shadow:0 0 0 1px rgba(59,130,246,.1),0 40px 80px rgba(0,0,0,.6); }
  .pi-hero-img img { width:100%; height:420px; object-fit:cover; display:block; }

  /* Chip flotante */
  .pi-chip { position:absolute; background:rgba(8,12,22,.9); border:1px solid rgba(255,255,255,.1); border-radius:14px; padding:10px 14px; backdrop-filter:blur(16px); box-shadow:0 8px 32px rgba(0,0,0,.4); white-space:nowrap; }
  .pi-chip-lbl { font-size:10px; color:rgba(100,116,139,.65); text-transform:uppercase; letter-spacing:.08em; margin-bottom:1px; }
  .pi-chip-val { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#f0f9ff; }

  /* ══ MARQUEE ══ */
  .pi-marquee { position:relative; z-index:10; padding:36px 0; overflow:hidden; border-top:1px solid rgba(255,255,255,.04); border-bottom:1px solid rgba(255,255,255,.04); }
  @keyframes pi-mq { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .pi-marquee-track { display:flex; width:max-content; animation:pi-mq 22s linear infinite; }
  .pi-marquee-track:hover { animation-play-state:paused; }
  .pi-marquee-item { display:flex; align-items:center; gap:10px; padding:0 32px; font-family:'Syne',sans-serif; font-size:13px; font-weight:600; color:rgba(100,116,139,.4); letter-spacing:.06em; white-space:nowrap; }
  .pi-mq-dot { width:4px; height:4px; border-radius:50%; background:rgba(59,130,246,.35); }

  /* ══ CATEGORÍAS ══ */
  .pi-cats-section { position:relative; z-index:10; padding:80px 80px 60px; max-width:1400px; margin:0 auto; }
  @media(max-width:900px){ .pi-cats-section{ padding:60px 24px; } }
  .pi-section-eye { font-family:'JetBrains Mono',monospace; font-size:11px; color:#60a5fa; letter-spacing:.16em; text-transform:uppercase; margin-bottom:12px; }
  .pi-section-title { font-family:'Syne',sans-serif; font-size:clamp(24px,3.5vw,42px); font-weight:800; color:#fff; letter-spacing:-.03em; margin-bottom:48px; line-height:1.05; }
  .pi-section-title em { font-style:normal; background:linear-gradient(90deg,#3b82f6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }

  .pi-cats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(150px,1fr)); gap:14px; }
  .pi-cat-card { padding:22px 16px; border-radius:18px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); text-align:center; cursor:pointer; transition:border-color .25s,box-shadow .25s,transform .2s; }
  .pi-cat-card:hover { border-color:rgba(59,130,246,.35); box-shadow:0 0 0 1px rgba(59,130,246,.12),0 12px 36px rgba(0,0,0,.4); transform:translateY(-4px); }
  .pi-cat-ico { width:52px; height:52px; border-radius:14px; margin:0 auto 12px; display:flex; align-items:center; justify-content:center; font-size:22px; }
  .pi-cat-name { font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#f0f9ff; margin-bottom:3px; }
  .pi-cat-count { font-size:11px; color:rgba(100,116,139,.55); font-family:'JetBrains Mono',monospace; }

  /* ══ FEATURED ══ */
  .pi-feat-section { position:relative; z-index:10; padding:0 80px 80px; max-width:1400px; margin:0 auto; }
  @media(max-width:900px){ .pi-feat-section{ padding:0 24px 60px; } }
  .pi-feat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:16px; }

  .pi-feat-card { border-radius:20px; overflow:hidden; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); transition:border-color .25s,box-shadow .25s,transform .25s; cursor:pointer; }
  .pi-feat-card:hover { border-color:rgba(59,130,246,.3); box-shadow:0 0 0 1px rgba(59,130,246,.1),0 20px 50px rgba(0,0,0,.5); transform:translateY(-5px); }
  .pi-feat-img { position:relative; height:200px; overflow:hidden; }
  .pi-feat-img img { width:100%; height:100%; object-fit:cover; transition:transform .45s ease; }
  .pi-feat-card:hover .pi-feat-img img { transform:scale(1.06); }
  .pi-feat-img-overlay { position:absolute; inset:0; background:linear-gradient(to top,rgba(5,8,16,.85) 0%,transparent 55%); }
  .pi-feat-badge { position:absolute; top:10px; left:10px; padding:3px 10px; border-radius:20px; font-family:'JetBrains Mono',monospace; font-size:10px; font-weight:500; letter-spacing:.06em; }
  .pi-feat-body { padding:14px 16px 18px; }
  .pi-feat-cat { font-size:10px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:rgba(96,165,250,.8); margin-bottom:4px; }
  .pi-feat-name { font-family:'Syne',sans-serif; font-size:15px; font-weight:700; color:#f0f9ff; margin-bottom:12px; line-height:1.2; }
  .pi-feat-footer { display:flex; align-items:center; justify-content:space-between; }
  .pi-feat-price { font-family:'Syne',sans-serif; font-size:17px; font-weight:800; color:#fff; }
  .pi-feat-add { width:36px; height:36px; border-radius:50%; border:1px solid rgba(59,130,246,.3); background:rgba(59,130,246,.1); color:#60a5fa; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
  .pi-feat-add:hover { background:rgba(59,130,246,.22); border-color:rgba(59,130,246,.6); transform:scale(1.1); }

  /* ══ MODAL LOGOUT ══ */
  .pi-modal-bg { position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(0,0,0,.65); backdrop-filter:blur(18px); }
  .pi-modal-box { background:rgba(8,12,22,.96); border:1px solid rgba(255,255,255,.08); border-radius:28px; padding:36px; width:100%; max-width:360px; text-align:center; box-shadow:0 32px 80px rgba(0,0,0,.5); }
  .pi-modal-ico { width:60px; height:60px; border-radius:18px; margin:0 auto 18px; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.2); display:flex; align-items:center; justify-content:center; }
  .pi-modal-title { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#f0f9ff; margin-bottom:8px; }
  .pi-modal-sub { font-size:14px; color:rgba(100,116,139,.7); margin-bottom:28px; line-height:1.55; }
  .pi-modal-btns { display:flex; gap:10px; }
  .pi-modal-cancel { flex:1; padding:13px; border-radius:14px; cursor:pointer; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.09); color:rgba(148,163,184,.7); font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif; transition:background .15s; }
  .pi-modal-cancel:hover { background:rgba(255,255,255,.09); }
  .pi-modal-confirm { flex:1; padding:13px; border-radius:14px; cursor:pointer; border:none; background:linear-gradient(135deg,#b91c1c,#ef4444); color:#fff; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif; box-shadow:0 6px 20px rgba(239,68,68,.3); transition:transform .15s,box-shadow .2s; }
  .pi-modal-confirm:hover { transform:translateY(-1px); box-shadow:0 10px 28px rgba(239,68,68,.45); }

  /* ══ MODAL PERFIL ══ */
  .pi-profile-bg { position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center; padding:24px; background:rgba(0,0,0,.6); backdrop-filter:blur(20px); }
  .pi-profile-box { background:rgba(8,12,22,.97); border:1px solid rgba(255,255,255,.08); border-radius:28px; width:100%; max-width:420px; overflow:hidden; box-shadow:0 32px 80px rgba(0,0,0,.5),0 0 0 1px rgba(59,130,246,.05); }
  .pi-profile-header { padding:28px; background:linear-gradient(135deg,rgba(59,130,246,.12),rgba(6,182,212,.08)); border-bottom:1px solid rgba(255,255,255,.06); display:flex; align-items:center; gap:16px; position:relative; }
  .pi-profile-avatar-lg { width:64px; height:64px; border-radius:50%; flex-shrink:0; background:linear-gradient(135deg,#3b82f6,#06b6d4); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-size:26px; font-weight:800; color:#fff; box-shadow:0 0 28px rgba(59,130,246,.4); }
  .pi-profile-header-info h3 { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#f0f9ff; margin-bottom:4px; }
  .pi-profile-header-info p { font-size:12px; color:rgba(100,116,139,.65); font-family:'JetBrains Mono',monospace; }
  .pi-profile-close { position:absolute; top:16px; right:16px; width:30px; height:30px; border-radius:50%; background:rgba(255,255,255,.06); border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; color:rgba(148,163,184,.6); transition:background .15s,color .15s; }
  .pi-profile-close:hover { background:rgba(255,255,255,.1); color:#f0f9ff; }
  .pi-profile-body { padding:24px 28px 28px; }
  .pi-profile-field { margin-bottom:14px; }
  .pi-profile-label { font-size:10px; font-weight:600; letter-spacing:.12em; text-transform:uppercase; color:rgba(100,116,139,.55); margin-bottom:5px; }
  .pi-profile-value { font-size:14px; color:#e2e8f0; font-weight:500; padding:10px 14px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06); border-radius:11px; word-break:break-all; }
  .pi-profile-badge { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; border-radius:20px; background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.2); font-size:11px; color:#60a5fa; font-weight:600; margin-top:6px; }

  /* Shimmer en skeleton */
  @keyframes pi-shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

/* ── Datos categorías ── */
const CATS = [
  { emoji:"💻", name:"Laptops",     count:"120+", color:"#3b82f6", bg:"rgba(59,130,246,.12)"  },
  { emoji:"📱", name:"Smartphones", count:"85+",  color:"#8b5cf6", bg:"rgba(139,92,246,.12)"  },
  { emoji:"🎧", name:"Audio",       count:"64+",  color:"#f59e0b", bg:"rgba(245,158,11,.12)"  },
  { emoji:"⌚", name:"Wearables",   count:"42+",  color:"#06b6d4", bg:"rgba(6,182,212,.12)"   },
  { emoji:"🖥️", name:"Monitores",   count:"38+",  color:"#34d399", bg:"rgba(52,211,153,.12)"  },
  { emoji:"🎮", name:"Gaming",      count:"96+",  color:"#ef4444", bg:"rgba(239,68,68,.12)"   },
];

/* ── Productos featured ── */
const FEATURED = [
  { img:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80", cat:"Laptops",     name:"MacBook Pro M3",       price:"$42,999", badge:"Nuevo",  badgeColor:"#22d3ee" },
  { img:"https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&q=80", cat:"Smartphones", name:"iPhone 16 Pro Max",    price:"$35,500", badge:"Hot",    badgeColor:"#f59e0b" },
  { img:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80", cat:"Audio",       name:"Sony WH-1000XM5",      price:"$8,999",  badge:"Oferta", badgeColor:"#34d399" },
  { img:"https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80", cat:"Wearables",   name:"Apple Watch Ultra 2",  price:"$16,500", badge:"Nuevo",  badgeColor:"#22d3ee" },
];

const MARQUEE = ["MacBook Pro","iPhone 16","Sony XM5","Samsung S25","AirPods Pro","LG OLED","Razer Gaming","DJI Drone","iPad Pro","RTX 5090","PS5 Pro","Apple Watch Ultra"];

/* ════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════ */
function PantallaInicio() {
  injectCSS();
  const navigate = useNavigate();

  /* ── Estado original ── */
  const [showModal, setShowModal] = useState(false);

  /* ── Estado nuevo: perfil y dropdown ── */
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [user, setUser]               = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const inicial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const stagger = { hidden:{ opacity:0 }, show:{ opacity:1, transition:{ staggerChildren:.08 } } };
  const fadeUp  = { hidden:{ opacity:0, y:28 }, show:{ opacity:1, y:0, transition:{ duration:.5, ease:[.25,.46,.45,.94] } } };

  return (
    <div className="pi-wrap">
      {/* Fondo */}
      <div className="pi-hex" />
      <div className="pi-noise" />
      <div className="pi-scan" />
      <div className="pi-orb" style={{ width:700,height:700,top:-200,left:-200, background:"radial-gradient(circle,rgba(59,130,246,.09) 0%,transparent 70%)", animationDuration:"22s" }} />
      <div className="pi-orb" style={{ width:600,height:600,bottom:-160,right:-160, background:"radial-gradient(circle,rgba(6,182,212,.07) 0%,transparent 70%)", animationDuration:"28s", animationDirection:"reverse" }} />
      <div className="pi-orb" style={{ width:450,height:450,top:"35%",left:"55%", background:"radial-gradient(circle,rgba(139,92,246,.05) 0%,transparent 70%)", animationDuration:"35s", animationDelay:"7s" }} />

      {/* ══ NAVBAR ══ */}
      <motion.nav className="pi-nav"
        initial={{ y:-60, opacity:0 }} animate={{ y:0, opacity:1 }}
        transition={{ duration:.55, ease:[.25,.46,.45,.94] }}>

        {/* Logo */}
        <div className="pi-nav-logo" onClick={() => navigate("/PantallaInicio")} style={{ cursor:"pointer" }}>
          <div className="pi-nav-logomark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span className="pi-nav-brand">TecnoStore</span>
        </div>

        {/* Links */}
        <div className="pi-nav-links">
          <button className="pi-nav-link active">Inicio</button>
          <button className="pi-nav-link" onClick={() => navigate("/productos")}>Productos</button>
          <button className="pi-nav-link">Categorías</button>
          <button className="pi-nav-link">Ofertas</button>
        </div>

        {/* Derecha */}
        <div className="pi-nav-right">
          {/* Carrito */}
          <div className="pi-cart-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span className="pi-cart-badge">0</span>
          </div>

          {/* Avatar + menú */}
          <div style={{ position:"relative" }} ref={menuRef}>
            <div className="pi-avatar-btn" onClick={() => setMenuOpen(m => !m)}>
              <div className="pi-avatar">{inicial}</div>
              <span className="pi-avatar-name">{user?.name?.split(" ")[0] ?? "Usuario"}</span>
              <motion.svg animate={{ rotate: menuOpen ? 180 : 0 }} transition={{ duration:.2 }}
                width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(148,163,184,.5)" strokeWidth="2.2">
                <polyline points="6 9 12 15 18 9"/>
              </motion.svg>
            </div>

            <AnimatePresence>
              {menuOpen && (
                <motion.div className="pi-dropdown"
                  initial={{ opacity:0, y:-8, scale:.97 }}
                  animate={{ opacity:1, y:0, scale:1 }}
                  exit={{ opacity:0, y:-8, scale:.97 }}
                  transition={{ duration:.18, ease:"easeOut" }}>
                  <div className="pi-dd-header">
                    <p className="pi-dd-name">{user?.name ?? "Usuario"}</p>
                    <p className="pi-dd-email">{user?.email ?? ""}</p>
                  </div>
                  <button className="pi-dd-item" onClick={() => { setMenuOpen(false); setShowProfile(true); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Ver perfil
                  </button>
                  <button className="pi-dd-item" onClick={() => { setMenuOpen(false); navigate("/productos"); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                    Catálogo
                  </button>
                  <div className="pi-dd-sep" />
                  <button className="pi-dd-item pi-dd-danger" onClick={() => { setMenuOpen(false); setShowModal(true); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Cerrar sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>

      {/* ══ HERO ══ */}
      <section className="pi-hero">
        {/* Izquierda */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          <motion.div variants={fadeUp} className="pi-hero-eyebrow">
            <span className="pi-eyebrow-dot" />
            Nuevas ofertas cada semana
          </motion.div>

          <motion.h1 variants={fadeUp} className="pi-hero-title">
            La tecnología<br /><span className="gr">que necesitas</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="pi-hero-sub">
            Descubre los últimos productos en tecnología con los mejores precios del mercado, envío express y garantía oficial.
          </motion.p>

          <motion.div variants={fadeUp} className="pi-hero-btns">
            <motion.button className="pi-btn-primary" whileTap={{ scale:.96 }} onClick={() => navigate("/productos")}>
              Explorar productos &nbsp;→
            </motion.button>
            <motion.button className="pi-btn-ghost" whileTap={{ scale:.96 }}>
              Ver ofertas
            </motion.button>
          </motion.div>

          <motion.div variants={fadeUp} className="pi-hero-stats">
            {[{n:"500+",l:"Productos"},{n:"50k+",l:"Clientes"},{n:"4.9★",l:"Rating"}].map(({ n, l }) => (
              <div key={l}>
                <div className="pi-stat-num">{n}</div>
                <div className="pi-stat-lbl">{l}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Derecha — imagen */}
        <motion.div className="pi-hero-img-wrap"
          initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:.7, delay:.25, ease:[.25,.46,.45,.94] }}>

          {/* Anillo */}
          <motion.div style={{ position:"absolute", inset:-24, borderRadius:32, border:"1px solid rgba(59,130,246,.08)", zIndex:0 }}
            animate={{ scale:[1,1.02,1] }} transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }} />

          <motion.div className="pi-hero-img"
            animate={{ y:[-6,6,-6] }} transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}>
            <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=85" alt="MacBook" />
          </motion.div>

          {/* Chips */}
          <motion.div className="pi-chip" style={{ bottom:24, left:-20 }}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:.7 }}
            style2={{ bottom:24, left:-20 }}>
            <div className="pi-chip-lbl">Envío gratis</div>
            <div className="pi-chip-val">En compras +$500 🚀</div>
          </motion.div>

          <motion.div className="pi-chip" style={{ top:20, right:-20 }}
            initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:.85 }}>
            <div className="pi-chip-lbl">Garantía</div>
            <div className="pi-chip-val" style={{ color:"#34d399" }}>1 año ✓</div>
          </motion.div>
        </motion.div>
      </section>

      {/* ══ MARQUEE ══ */}
      <div className="pi-marquee">
        <div className="pi-marquee-track">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <div key={i} className="pi-marquee-item">
              {item}<span className="pi-mq-dot" />
            </div>
          ))}
        </div>
      </div>

      {/* ══ CATEGORÍAS ══ */}
      <section className="pi-cats-section">
        <p className="pi-section-eye">Explorar</p>
        <h2 className="pi-section-title">Categorías <em>populares</em></h2>
        <motion.div className="pi-cats-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true, amount:.15 }}>
          {CATS.map(({ emoji, name, count, color, bg }) => (
            <motion.div key={name} variants={fadeUp} className="pi-cat-card" onClick={() => navigate("/productos")}>
              <div className="pi-cat-ico" style={{ background:bg, border:`1px solid ${color}30` }}>{emoji}</div>
              <p className="pi-cat-name">{name}</p>
              <p className="pi-cat-count">{count} items</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ══ FEATURED ══ */}
      <section className="pi-feat-section">
        <p className="pi-section-eye">Destacados</p>
        <h2 className="pi-section-title">Productos <em>premium</em></h2>
        <motion.div className="pi-feat-grid" variants={stagger} initial="hidden" whileInView="show" viewport={{ once:true, amount:.1 }}>
          {FEATURED.map((p, i) => (
            <motion.div key={i} variants={fadeUp} className="pi-feat-card">
              <div className="pi-feat-img">
                <img src={p.img} alt={p.name} loading="lazy" />
                <div className="pi-feat-img-overlay" />
                <span className="pi-feat-badge" style={{ background:`${p.badgeColor}22`, border:`1px solid ${p.badgeColor}44`, color:p.badgeColor }}>
                  {p.badge}
                </span>
              </div>
              <div className="pi-feat-body">
                <p className="pi-feat-cat">{p.cat}</p>
                <p className="pi-feat-name">{p.name}</p>
                <div className="pi-feat-footer">
                  <span className="pi-feat-price">{p.price}</span>
                  <button className="pi-feat-add">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div style={{ textAlign:"center", marginTop:40 }}
          initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}>
          <motion.button className="pi-btn-ghost" whileTap={{ scale:.96 }}
            onClick={() => navigate("/productos")} style={{ padding:"13px 32px", borderRadius:13 }}>
            Ver catálogo completo →
          </motion.button>
        </motion.div>
      </section>

      {/* ══ MODAL LOGOUT (lógica original) ══ */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="pi-modal-bg"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setShowModal(false)}>
            <motion.div className="pi-modal-box"
              initial={{ scale:.88, opacity:0, y:24 }}
              animate={{ scale:1, opacity:1, y:0 }}
              exit={{ scale:.88, opacity:0, y:12 }}
              transition={{ type:"spring", stiffness:200 }}
              onClick={e => e.stopPropagation()}>
              <div className="pi-modal-ico">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </div>
              <p className="pi-modal-title">Cerrar sesión</p>
              <p className="pi-modal-sub">¿Estás seguro que deseas salir de tu cuenta?</p>
              <div className="pi-modal-btns">
                <button className="pi-modal-cancel" onClick={() => setShowModal(false)}>Cancelar</button>
                <button className="pi-modal-confirm" onClick={() => { localStorage.removeItem("user"); window.location.href = "/"; }}>
                  Sí, cerrar sesión
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ MODAL PERFIL ══ */}
      <AnimatePresence>
        {showProfile && (
          <motion.div className="pi-profile-bg"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setShowProfile(false)}>
            <motion.div className="pi-profile-box"
              initial={{ scale:.9, opacity:0, y:24 }}
              animate={{ scale:1, opacity:1, y:0 }}
              exit={{ scale:.9, opacity:0, y:12 }}
              transition={{ duration:.3, ease:[.25,.46,.45,.94] }}
              onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="pi-profile-header">
                <div className="pi-profile-avatar-lg">{inicial}</div>
                <div className="pi-profile-header-info">
                  <h3>{user?.name ?? "—"}</h3>
                  <p>{user?.email ?? "—"}</p>
                  <div className="pi-profile-badge" style={{ marginTop:8 }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Cliente
                  </div>
                </div>
                <button className="pi-profile-close" onClick={() => setShowProfile(false)}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Datos */}
              <div className="pi-profile-body">
                {[
                  { label:"ID de usuario", value:`#${user?.id ?? "—"}` },
                  { label:"Nombre completo", value: user?.name ?? "—" },
                  { label:"Correo electrónico", value: user?.email ?? "—" },
                  { label:"Miembro desde", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("es-MX", { year:"numeric", month:"long", day:"numeric" }) : "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="pi-profile-field">
                    <p className="pi-profile-label">{label}</p>
                    <p className="pi-profile-value">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PantallaInicio;