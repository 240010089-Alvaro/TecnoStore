import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ══════════════════════════════════════
   ESTILOS GLOBALES
══════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  .lg-wrap *, .lg-wrap *::before, .lg-wrap *::after { box-sizing: border-box; margin:0; padding:0; }

  .lg-wrap {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    display: flex;
    background: #050810;
    overflow: hidden;
    position: relative;
  }

  /* ── Orbs ── */
  @keyframes lg-orb { 0%,100%{transform:translate(0,0)scale(1)} 33%{transform:translate(45px,-60px)scale(1.1)} 66%{transform:translate(-30px,35px)scale(.92)} }
  .lg-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; animation:lg-orb linear infinite; }

  /* ── Grid hexagonal ── */
  .lg-hex {
    position:fixed; inset:0; z-index:0; pointer-events:none; opacity:.055;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V16L28 0l28 16v34L28 66zm0-2l26-15V18L28 2 2 18v30l26 15z' fill='none' stroke='%234299e1' stroke-width='.5'/%3E%3C/svg%3E");
    background-size:56px 100px;
  }

  /* ── Noise ── */
  .lg-noise {
    position:fixed; inset:0; z-index:1; pointer-events:none; opacity:.025;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px;
  }

  /* ── Scan line ── */
  @keyframes lg-scan { 0%{top:-2px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100vh;opacity:0} }
  .lg-scan { position:fixed; left:0; right:0; height:1.5px; z-index:2; pointer-events:none;
    background:linear-gradient(90deg,transparent,rgba(59,130,246,.1),rgba(59,130,246,.3),rgba(59,130,246,.1),transparent);
    animation:lg-scan 9s linear infinite; }

  /* ══ LAYOUT DOS COLUMNAS ══ */
  .lg-left {
    flex:1; display:flex; flex-direction:column; justify-content:center; padding:80px;
    position:relative; z-index:10;
    border-right:1px solid rgba(255,255,255,.04);
  }
  @media(max-width:900px){ .lg-left{ display:none; } }

  .lg-right {
    width:480px; flex-shrink:0; display:flex; align-items:center; justify-content:center;
    padding:40px 48px; position:relative; z-index:10;
    background:rgba(255,255,255,.018);
    border-left:1px solid rgba(255,255,255,.05);
  }
  @media(max-width:900px){ .lg-right{ width:100%; padding:32px 24px; border:none; background:transparent; } }

  /* Izquierda — branding */
  .lg-brand-logo {
    display:flex; align-items:center; gap:12px; margin-bottom:64px;
  }
  .lg-brand-mark {
    width:40px; height:40px; border-radius:12px; flex-shrink:0;
    background:linear-gradient(135deg,#3b82f6,#06b6d4);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 0 24px rgba(59,130,246,.4);
  }
  .lg-brand-name { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; color:#fff; letter-spacing:-.02em; }

  .lg-brand-headline {
    font-family:'Syne',sans-serif;
    font-size:clamp(38px,5vw,64px); font-weight:800; line-height:.95; letter-spacing:-.04em; color:#fff;
    margin-bottom:20px;
  }
  .lg-brand-headline .gr { background:linear-gradient(90deg,#3b82f6,#06b6d4); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .lg-brand-sub { font-size:16px; color:rgba(100,116,139,.7); line-height:1.7; max-width:400px; margin-bottom:56px; }

  /* Testimonial / trust chips */
  .lg-trust { display:flex; flex-direction:column; gap:12px; }
  .lg-trust-item {
    display:flex; align-items:center; gap:12px;
    padding:14px 18px; border-radius:16px;
    background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.06);
  }
  .lg-trust-ico { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .lg-trust-title { font-size:13px; font-weight:600; color:#f0f9ff; margin-bottom:1px; }
  .lg-trust-sub { font-size:11px; color:rgba(100,116,139,.7); }

  /* ══ FORMULARIO ══ */
  .lg-form-wrap { width:100%; max-width:360px; }

  .lg-form-title { font-family:'Syne',sans-serif; font-size:28px; font-weight:800; color:#f0f9ff; letter-spacing:-.02em; margin-bottom:6px; }
  .lg-form-sub { font-size:14px; color:rgba(100,116,139,.7); margin-bottom:32px; line-height:1.5; }

  /* Selector rol */
  .lg-rol-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px; }
  .lg-rol-btn {
    padding:12px 16px; border-radius:14px; cursor:pointer; border:none; text-align:center;
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    display:flex; align-items:center; justify-content:center; gap:7px;
    transition:all .2s;
  }
  .lg-rol-cliente {
    background:rgba(59,130,246,.08); border:1.5px solid rgba(59,130,246,.2); color:rgba(148,163,184,.65);
  }
  .lg-rol-cliente.active {
    background:rgba(59,130,246,.18); border-color:rgba(59,130,246,.55); color:#93c5fd;
    box-shadow:0 0 24px rgba(59,130,246,.2);
  }
  .lg-rol-proveedor {
    background:rgba(168,85,247,.06); border:1.5px solid rgba(168,85,247,.18); color:rgba(148,163,184,.65);
  }
  .lg-rol-proveedor.active {
    background:rgba(168,85,247,.16); border-color:rgba(168,85,247,.5); color:#c4b5fd;
    box-shadow:0 0 24px rgba(168,85,247,.18);
  }

  /* Inputs */
  .lg-field { display:flex; flex-direction:column; gap:5px; }
  .lg-label { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:rgba(100,116,139,.7); }
  .lg-input {
    background:rgba(255,255,255,.04); border:1.5px solid rgba(255,255,255,.07);
    border-radius:12px; padding:12px 14px; font-size:14px; color:#f0f9ff; outline:none;
    font-family:'DM Sans',sans-serif; width:100%;
    transition:border-color .2s, box-shadow .2s, background .2s;
  }
  .lg-input::placeholder { color:rgba(100,116,139,.45); }
  .lg-input:focus { border-color:rgba(59,130,246,.5); box-shadow:0 0 0 3px rgba(59,130,246,.1); background:rgba(255,255,255,.06); }
  .lg-input.err { border-color:rgba(239,68,68,.5); box-shadow:0 0 0 3px rgba(239,68,68,.08); }

  .lg-error-msg { font-size:11px; color:#f87171; margin-top:2px; font-family:'JetBrains Mono',monospace; }

  /* Divider */
  .lg-divider { height:1px; background:rgba(255,255,255,.05); margin:4px 0; }

  /* Submit */
  .lg-submit {
    width:100%; padding:14px; border-radius:14px; border:none; cursor:pointer;
    font-family:'Syne',sans-serif; font-size:15px; font-weight:700; letter-spacing:.02em;
    color:#fff; position:relative; overflow:hidden;
    transition:box-shadow .2s, transform .15s;
  }
  .lg-submit-cliente { background:linear-gradient(135deg,#1d4ed8,#3b82f6,#06b6d4); box-shadow:0 0 0 1px rgba(59,130,246,.3),0 8px 28px rgba(59,130,246,.28); }
  .lg-submit-cliente:hover { box-shadow:0 0 0 1px rgba(59,130,246,.5),0 12px 40px rgba(59,130,246,.45); transform:translateY(-1px); }
  .lg-submit-proveedor { background:linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7); box-shadow:0 0 0 1px rgba(139,92,246,.3),0 8px 28px rgba(139,92,246,.25); }
  .lg-submit-proveedor:hover { box-shadow:0 0 0 1px rgba(139,92,246,.5),0 12px 40px rgba(139,92,246,.42); transform:translateY(-1px); }
  .lg-submit::after { content:''; position:absolute; inset:0; background:linear-gradient(135deg,transparent 50%,rgba(255,255,255,.1) 100%); pointer-events:none; }

  /* Toggle */
  .lg-toggle { text-align:center; margin-top:20px; font-size:13px; color:rgba(100,116,139,.65); }
  .lg-toggle span { cursor:pointer; font-weight:600; color:#60a5fa; transition:color .2s; }
  .lg-toggle span:hover { color:#93c5fd; }

  /* Modal error */
  .lg-modal-bg { position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,.6); backdrop-filter:blur(12px); }
  .lg-modal-box {
    background:rgba(15,20,35,.95); border:1px solid rgba(239,68,68,.25); border-radius:24px;
    padding:32px 40px; text-align:center;
    box-shadow:0 0 0 1px rgba(239,68,68,.1),0 32px 80px rgba(0,0,0,.5);
  }
  .lg-modal-ico { width:56px; height:56px; border-radius:18px; margin:0 auto 16px; background:rgba(239,68,68,.1); border:1px solid rgba(239,68,68,.2); display:flex; align-items:center; justify-content:center; }
  .lg-modal-title { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#f0f9ff; margin-bottom:6px; }
  .lg-modal-sub { font-size:13px; color:rgba(100,116,139,.7); }

  /* Separador "o" */
  .lg-or { display:flex; align-items:center; gap:12px; color:rgba(100,116,139,.4); font-size:11px; letter-spacing:.08em; text-transform:uppercase; font-family:'JetBrains Mono',monospace; }
  .lg-or::before, .lg-or::after { content:''; flex:1; height:1px; background:rgba(255,255,255,.05); }

  /* Pulse dot animado */
  @keyframes lg-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.7)} }
  .lg-pulse-dot { width:6px; height:6px; border-radius:50%; background:#3b82f6; animation:lg-pulse 2s ease-in-out infinite; flex-shrink:0; }
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

/* ════════════════════════════════════════
   COMPONENTE PRINCIPAL
════════════════════════════════════════ */
function Login() {
  injectCSS();

  /* ── Estado original ── */
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "", email: "", password: "", rol: "cliente",
    empresa: "", telefono: "", direccion: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [showErrorModal, setShowErrorModal] = useState(false);

  /* ── handleChange original ── */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /* ── handleSubmit original ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin
        ? form.rol === "proveedor"
          ? "http://localhost:8000/api/login-proveedor"
          : "http://localhost:8000/api/login"
        : form.rol === "proveedor"
          ? "http://localhost:8000/api/register-proveedor"
          : "http://localhost:8000/api/register";

      const cleanEmail = form.email.trim();
      const cleanPassword = form.password.trim();

      const data = isLogin
        ? { email: cleanEmail, password: cleanPassword }
        : form.rol === "proveedor"
          ? { name: form.name.trim(), email: cleanEmail, password: cleanPassword, empresa: form.empresa.trim(), telefono: form.telefono.trim(), direccion: form.direccion.trim() }
          : { name: form.name.trim(), email: cleanEmail, password: cleanPassword };

      console.log("URL:", url);
      console.log("ROL:", form.rol);
      console.log("DATA:", data);
      console.log("PASSWORD:", "[" + cleanPassword + "]");

      const res = await axios.post(url, data);
      console.log("RESPUESTA:", res.data);

      localStorage.setItem("user", JSON.stringify(res.data.user ?? res.data.proveedor));
      navigate(form.rol === "proveedor" ? "/proveedor" : "/PantallaInicio");

    } catch (err) {
      console.error(err);
      if (err.response) {
        const message = err.response.data.message || "";
        if (message.toLowerCase().includes("email")) {
          setErrors({ email: "El correo no existe" });
        } else if (message.toLowerCase().includes("password")) {
          setErrors({ password: "Contraseña incorrecta" });
        } else {
          setShowErrorModal(true);
          setTimeout(() => setShowErrorModal(false), 1000);
        }
      } else {
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 1000);
      }
    }
  };

  /* ── Animaciones originales ── */
  const modalVariants = {
    hidden: { scale: 0.5, opacity: 0, y: -50 },
    visible: { scale: [1.2, 0.95, 1], opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { scale: 0.5, opacity: 0, y: -50, transition: { duration: 0.3 } },
  };

  const isProveedor = form.rol === "proveedor";

  return (
    <div className="lg-wrap">
      {/* Fondo */}
      <div className="lg-hex" />
      <div className="lg-noise" />
      <div className="lg-scan" />
      <div className="lg-orb" style={{ width:700,height:700,top:-220,left:-220, background:"radial-gradient(circle,rgba(59,130,246,.1) 0%,transparent 70%)", animationDuration:"22s" }} />
      <div className="lg-orb" style={{ width:550,height:550,bottom:-160,right:320, background:"radial-gradient(circle,rgba(6,182,212,.08) 0%,transparent 70%)", animationDuration:"28s", animationDirection:"reverse" }} />
      <div className="lg-orb" style={{ width:400,height:400,top:"30%",right:0, background:"radial-gradient(circle,rgba(168,85,247,.07) 0%,transparent 70%)", animationDuration:"34s", animationDelay:"6s" }} />

      {/* ══ COLUMNA IZQUIERDA — Branding ══ */}
      <div className="lg-left">
        <motion.div className="lg-brand-logo"
          initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.6, delay:.1 }}>
          <div className="lg-brand-mark">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span className="lg-brand-name">TecnoStore</span>
        </motion.div>

        <motion.h1 className="lg-brand-headline"
          initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.7, delay:.2, ease:[.25,.46,.45,.94] }}>
          Tu tienda<br /><span className="gr">tecnológica</span><br />de confianza
        </motion.h1>

        <motion.p className="lg-brand-sub"
          initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          transition={{ duration:.6, delay:.35 }}>
          Compra y vende gadgets, laptops, smartphones y más con total seguridad y los mejores precios del mercado.
        </motion.p>

        <motion.div className="lg-trust"
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          transition={{ duration:.7, delay:.5 }}>
          {[
            { color:"#3b82f6", bg:"rgba(59,130,246,.12)", ico:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title:"Pagos 100% seguros", sub:"Cifrado SSL en cada transacción" },
            { color:"#34d399", bg:"rgba(52,211,153,.1)",  ico:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8"><path d="M5 12h14M12 5l7 7-7 7"/></svg>, title:"Envío express", sub:"Entrega en 24-48 horas con rastreo" },
            { color:"#f59e0b", bg:"rgba(245,158,11,.1)",  ico:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>, title:"+8,200 usuarios felices", sub:"Calificación promedio 4.9/5 estrellas" },
          ].map(({ color, bg, ico, title, sub }) => (
            <div key={title} className="lg-trust-item">
              <div className="lg-trust-ico" style={{ background:bg, border:`1px solid ${color}30` }}>{ico}</div>
              <div>
                <p className="lg-trust-title">{title}</p>
                <p className="lg-trust-sub">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ══ COLUMNA DERECHA — Formulario ══ */}
      <div className="lg-right">
        <motion.div className="lg-form-wrap"
          initial={{ opacity:0, x:32 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:.65, delay:.15, ease:[.25,.46,.45,.94] }}>

          {/* Logo móvil */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32, justifyContent:"center" }}
            className="lg-mobile-logo">
            <div className="lg-brand-mark" style={{ width:34,height:34,borderRadius:10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:800, color:"#fff" }}>TecnoStore</span>
          </div>

          {/* Título */}
          <AnimatePresence mode="wait">
            <motion.div key={isLogin ? "login" : "register"}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }}
              transition={{ duration:.25 }}>
              <p className="lg-form-title">{isLogin ? "Bienvenido de vuelta" : "Crear cuenta"}</p>
              <p className="lg-form-sub">
                {isLogin
                  ? "Ingresa tus credenciales para continuar"
                  : `Regístrate como ${isProveedor ? "proveedor" : "cliente"} para empezar`}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ── Selector rol ── */}
          <div className="lg-rol-grid">
            <button
              type="button"
              className={`lg-rol-btn lg-rol-cliente${form.rol === "cliente" ? " active" : ""}`}
              onClick={() => setForm({ ...form, rol: "cliente" })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
              Cliente
            </button>
            <button
              type="button"
              className={`lg-rol-btn lg-rol-proveedor${form.rol === "proveedor" ? " active" : ""}`}
              onClick={() => setForm({ ...form, rol: "proveedor" })}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
              Proveedor
            </button>
          </div>

          {/* ── Formulario ── */}
          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>

            <AnimatePresence>
              {!isLogin && (
                <motion.div className="lg-field"
                  initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                  transition={{ duration:.25 }}>
                  <label className="lg-label">Nombre</label>
                  <input className="lg-input" type="text" name="name" placeholder="Tu nombre completo" onChange={handleChange} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="lg-field">
              <label className="lg-label">Correo electrónico</label>
              <input className={`lg-input${errors.email ? " err" : ""}`} type="email" name="email" placeholder="correo@ejemplo.com" onChange={handleChange} />
              {errors.email && <span className="lg-error-msg">⚠ {errors.email}</span>}
            </div>

            <div className="lg-field">
              <label className="lg-label">Contraseña</label>
              <input className={`lg-input${errors.password ? " err" : ""}`} type="password" name="password" placeholder="••••••••" onChange={handleChange} />
              {errors.password && <span className="lg-error-msg">⚠ {errors.password}</span>}
            </div>

            <AnimatePresence>
              {!isLogin && isProveedor && (
                <motion.div
                  initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} exit={{ opacity:0, height:0 }}
                  transition={{ duration:.28 }}
                  style={{ display:"flex", flexDirection:"column", gap:14, overflow:"hidden" }}>
                  <div className="lg-divider" />
                  <div className="lg-field">
                    <label className="lg-label">Empresa</label>
                    <input className="lg-input" type="text" name="empresa" placeholder="Nombre de tu empresa" onChange={handleChange} />
                  </div>
                  <div className="lg-field">
                    <label className="lg-label">Teléfono</label>
                    <input className="lg-input" type="text" name="telefono" placeholder="+52 000 000 0000" onChange={handleChange} />
                  </div>
                  <div className="lg-field">
                    <label className="lg-label">Dirección</label>
                    <input className="lg-input" type="text" name="direccion" placeholder="Ciudad, Estado" onChange={handleChange} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              className={`lg-submit ${isProveedor ? "lg-submit-proveedor" : "lg-submit-cliente"}`}
              whileTap={{ scale:.97 }}
              style={{ marginTop:4 }}>
              {isLogin
                ? `Entrar como ${isProveedor ? "Proveedor" : "Cliente"}`
                : `Registrarme como ${isProveedor ? "Proveedor" : "Cliente"}`}
              &nbsp;→
            </motion.button>
          </form>

          {/* Toggle */}
          <p className="lg-toggle">
            {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Crear cuenta" : "Iniciar sesión"}
            </span>
          </p>

          {/* Badge de seguridad */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:28,
            padding:"10px 18px", borderRadius:12,
            background:"rgba(255,255,255,.025)", border:"1px solid rgba(255,255,255,.05)" }}>
            <span className="lg-pulse-dot" />
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:"rgba(100,116,139,.55)", letterSpacing:".1em", textTransform:"uppercase" }}>
              Conexión segura · SSL activo
            </span>
          </div>
        </motion.div>
      </div>

      {/* ══ MODAL ERROR (original) ══ */}
      <AnimatePresence>
        {showErrorModal && (
          <motion.div className="lg-modal-bg"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}>
            <motion.div className="lg-modal-box"
              variants={modalVariants} initial="hidden" animate="visible" exit="exit">
              <div className="lg-modal-ico">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                  <circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>
                </svg>
              </div>
              <p className="lg-modal-title">Credenciales incorrectas</p>
              <p className="lg-modal-sub">Verifica tu correo y contraseña</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Login;