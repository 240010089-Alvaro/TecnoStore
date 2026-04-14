import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";

/* ── Estilos inyectados una vez ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .pp-wrap *, .pp-wrap *::before, .pp-wrap *::after { box-sizing: border-box; }

  .pp-wrap {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 40%, #eff6ff 100%);
    position: relative;
    overflow-x: hidden;
  }

  @keyframes pp-orb {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.06); }
    66%      { transform: translate(-20px,25px) scale(.95); }
  }
  .pp-orb {
    position: fixed; border-radius: 50%; pointer-events: none; z-index: 0;
    animation: pp-orb linear infinite;
  }
  .pp-dots {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle, rgba(99,102,241,.11) 1px, transparent 1px);
    background-size: 30px 30px;
  }

  /* Header */
  .pp-header {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,.7);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid rgba(99,102,241,.12);
    box-shadow: 0 2px 20px rgba(99,102,241,.07);
  }
  .pp-header-inner {
    max-width: 1080px; margin: 0 auto;
    padding: 14px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .pp-logo {
    width: 38px; height: 38px; border-radius: 12px; flex-shrink: 0;
    background: linear-gradient(135deg, #6366f1, #818cf8);
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 16px rgba(99,102,241,.4);
    color: white;
  }
  .pp-htitle { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; color:#1e1b4b; letter-spacing:-.01em; }
  .pp-hsub   { font-size:12px; color:#94a3b8; margin-top:1px; }

  /* Avatar btn */
  .pp-avbtn {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 14px 6px 6px; border-radius: 50px; cursor: pointer;
    background: rgba(255,255,255,.8);
    border: 1px solid rgba(99,102,241,.18);
    box-shadow: 0 2px 8px rgba(99,102,241,.07);
    transition: border-color .2s, box-shadow .2s;
    position: relative;
  }
  .pp-avbtn:hover { border-color:rgba(99,102,241,.4); box-shadow:0 4px 20px rgba(99,102,241,.14); }
  .pp-av {
    width:34px; height:34px; border-radius:50%; flex-shrink:0;
    background: linear-gradient(135deg,#6366f1,#a78bfa);
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:white;
    box-shadow: 0 0 14px rgba(99,102,241,.35);
  }
  .pp-avname { font-size:13px; font-weight:500; color:#374151; }
  .pp-chev { color:#9ca3af; display:flex; transition:transform .2s; }
  .pp-chev.open { transform:rotate(180deg); }

  /* Dropdown */
  .pp-drop {
    position:absolute; right:0; top:calc(100% + 10px); width:196px;
    background:rgba(255,255,255,.96);
    backdrop-filter:blur(20px); -webkit-backdrop-filter:blur(20px);
    border:1px solid rgba(99,102,241,.14); border-radius:16px; overflow:hidden;
    box-shadow:0 16px 48px rgba(99,102,241,.16),0 4px 12px rgba(0,0,0,.06);
  }
  .pp-ditem {
    width:100%; text-align:left; padding:13px 18px;
    font-size:13px; font-weight:500; cursor:pointer; border:none;
    background:transparent; color:#4b5563;
    display:flex; align-items:center; gap:10px;
    transition:background .14s,color .14s;
    font-family:'DM Sans',sans-serif;
  }
  .pp-ditem:hover { background:rgba(99,102,241,.06); color:#4338ca; }
  .pp-dsep { height:1px; background:rgba(99,102,241,.08); }
  .pp-ddanger { color:#ef4444; }
  .pp-ddanger:hover { background:rgba(239,68,68,.06); color:#dc2626; }

  /* Main grid */
  .pp-main {
    max-width:1080px; margin:0 auto;
    padding:36px 28px 72px;
    position:relative; z-index:1;
    display:grid; grid-template-columns:1fr 300px; gap:28px; align-items:start;
  }
  @media(max-width:820px){ .pp-main{ grid-template-columns:1fr; } }

  /* Glass card */
  .pp-card {
    background:rgba(255,255,255,.75);
    backdrop-filter:blur(20px) saturate(160%);
    -webkit-backdrop-filter:blur(20px) saturate(160%);
    border:1px solid rgba(255,255,255,.9);
    border-radius:24px; overflow:hidden;
    box-shadow:0 4px 32px rgba(99,102,241,.1), inset 0 1px 0 rgba(255,255,255,.9);
  }
  .pp-cardhead {
    padding:22px 26px 18px;
    border-bottom:1px solid rgba(99,102,241,.07);
    display:flex; align-items:center; gap:14px;
  }
  .pp-cardicon {
    width:40px; height:40px; border-radius:12px; flex-shrink:0;
    display:flex; align-items:center; justify-content:center;
    background:linear-gradient(135deg,rgba(99,102,241,.14),rgba(167,139,250,.1));
    border:1px solid rgba(99,102,241,.15); color:#6366f1;
  }
  .pp-cardtitle { font-family:'Syne',sans-serif; font-size:16px; font-weight:700; color:#1e1b4b; }
  .pp-cardsub   { font-size:12px; color:#9ca3af; margin-top:1px; }

  /* Inputs */
  .pp-grid2 { display:grid; grid-template-columns:1fr 1fr; gap:18px 20px; }
  .pp-field  { display:flex; flex-direction:column; gap:6px; }
  .pp-label  { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#6b7280; }
  .pp-input  {
    background:rgba(248,250,255,.9);
    border:1.5px solid rgba(99,102,241,.14);
    border-radius:12px; padding:12px 14px;
    font-size:14px; color:#1f2937; outline:none;
    font-family:'DM Sans',sans-serif; width:100%;
    transition:border-color .2s,box-shadow .2s,background .2s;
  }
  .pp-input::placeholder { color:#c4c9d8; }
  .pp-input:focus {
    border-color:rgba(99,102,241,.5);
    box-shadow:0 0 0 3px rgba(99,102,241,.1);
    background:#fff;
  }
  .pp-textarea { resize:none; min-height:96px; line-height:1.6; }
  .pp-span { grid-column:1/-1; }

  /* File input */
  .pp-fileinput {
    background:rgba(248,250,255,.9);
    border:1.5px dashed rgba(99,102,241,.3);
    border-radius:12px; padding:14px;
    font-size:13px; color:#6366f1; outline:none;
    font-family:'DM Sans',sans-serif; width:100%; cursor:pointer;
    transition:border-color .2s,background .2s;
  }
  .pp-fileinput:hover { border-color:rgba(99,102,241,.5); background:rgba(99,102,241,.04); }

  /* Submit */
  .pp-submit {
    width:100%; padding:15px; border-radius:16px; border:none; cursor:pointer;
    font-family:'Syne',sans-serif; font-size:15px; font-weight:700; letter-spacing:.03em;
    color:white; position:relative; overflow:hidden;
    background:linear-gradient(135deg,#4f46e5 0%,#6366f1 50%,#818cf8 100%);
    box-shadow:0 8px 28px rgba(99,102,241,.38);
    transition:transform .15s,box-shadow .2s;
  }
  .pp-submit:hover { transform:translateY(-2px); box-shadow:0 14px 40px rgba(99,102,241,.52); }
  .pp-submit:active { transform:scale(.98); }
  .pp-submit::after {
    content:''; position:absolute; inset:0;
    background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.18) 100%);
    pointer-events:none;
  }

  /* Sidebar */
  .pp-avlg {
    width:54px; height:54px; border-radius:50%; flex-shrink:0;
    background:linear-gradient(135deg,#6366f1,#a78bfa);
    display:flex; align-items:center; justify-content:center;
    font-family:'Syne',sans-serif; font-size:22px; font-weight:700; color:white;
    box-shadow:0 0 22px rgba(99,102,241,.3);
  }
  .pp-statcard {
    background:rgba(255,255,255,.7);
    border:1px solid rgba(99,102,241,.1);
    border-radius:14px; padding:14px 16px;
    display:flex; align-items:center; gap:12px;
  }
  .pp-sticon { width:38px; height:38px; border-radius:11px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .pp-stlabel { font-size:10px; color:#9ca3af; font-weight:600; letter-spacing:.08em; text-transform:uppercase; }
  .pp-stval   { font-family:'Syne',sans-serif; font-size:19px; font-weight:700; color:#1e1b4b; margin-top:1px; }
  .pp-tip {
    display:flex; gap:10px; align-items:flex-start;
    padding:10px 12px; border-radius:11px;
    background:rgba(255,255,255,.6); border:1px solid rgba(99,102,241,.08);
    font-size:12px; color:#6b7280; line-height:1.55;
  }
  .pp-tipdot { width:6px; height:6px; border-radius:50%; flex-shrink:0; margin-top:5px; }

  /* Modal */
  .pp-modalbg {
    position:fixed; inset:0;
    background:rgba(15,10,40,.45);
    backdrop-filter:blur(18px) saturate(140%);
    -webkit-backdrop-filter:blur(18px) saturate(140%);
    z-index:200; display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .pp-modalbox {
    background:rgba(255,255,255,.96);
    border:1px solid rgba(99,102,241,.15); border-radius:28px; padding:36px;
    width:100%; max-width:380px; text-align:center;
    box-shadow:0 32px 80px rgba(99,102,241,.2),0 8px 24px rgba(0,0,0,.06);
  }
  .pp-modalicon {
    width:64px; height:64px; border-radius:20px; margin:0 auto 20px;
    background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.18);
    display:flex; align-items:center; justify-content:center;
  }
  .pp-modaltitle { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#1e1b4b; margin-bottom:8px; }
  .pp-modalsub   { font-size:14px; color:#9ca3af; line-height:1.55; margin-bottom:28px; }
  .pp-modalbtns  { display:flex; gap:10px; }
  .pp-modalcancel {
    flex:1; padding:13px; border-radius:14px; cursor:pointer;
    background:rgba(99,102,241,.06); border:1px solid rgba(99,102,241,.14);
    color:#6b7280; font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif;
    transition:background .15s;
  }
  .pp-modalcancel:hover { background:rgba(99,102,241,.1); }
  .pp-modalexit {
    flex:1; padding:13px; border-radius:14px; cursor:pointer; border:none;
    background:linear-gradient(135deg,#b91c1c,#ef4444);
    color:white; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif;
    box-shadow:0 6px 20px rgba(239,68,68,.3);
    transition:transform .15s,box-shadow .2s;
  }
  .pp-modalexit:hover { transform:translateY(-1px); box-shadow:0 10px 28px rgba(239,68,68,.45); }
`;

let _injected = false;
function injectStyles() {
  if (_injected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = STYLES;
  document.head.appendChild(el);
  _injected = true;
}

/* ── SVG Icons ── */
const IcoBolt = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IcoBox = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IcoUser = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IcoOut = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IcoChev = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const IcoDollar = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);
const IcoLayers = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);
const IcoX = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ef4444"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

/* ════════════════════════════════════════════════ */
function PanelProveedor() {
  injectStyles();

  const navigate = useNavigate();

  /* ── ESTADO ORIGINAL ── */
  const [producto, setProducto] = useState({
    nombre: "",
    categoria: "",
    marca: "",
    modelo: "",
    precio: "",
    stock: "",
    descripcion: "",
    imagen: null,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [proveedor, setProveedor] = useState(null);

  // 🔥 Obtener usuario logueado
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setProveedor(user);
  }, []);

  /* ── handleChange ORIGINAL ── */
  const handleChange = async (e) => {
    if (e.target.name === "imagen") {
      const file = e.target.files[0];
      if (file) {
        const options = { maxSizeMB: 2, maxWidthOrHeight: 1920 };
        const compressedFile = await imageCompression(file, options);
        setProducto({ ...producto, imagen: compressedFile });
      }
    } else {
      setProducto({ ...producto, [e.target.name]: e.target.value });
    }
  };

  /* ── handleSubmit ORIGINAL ── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) throw new Error("No hay usuario logueado");

      const formData = new FormData();
      formData.append("nombre", producto.nombre);
      formData.append("categoria", producto.categoria);
      formData.append("marca", producto.marca || "");
      formData.append("modelo", producto.modelo || "");
      formData.append("precio", producto.precio);
      formData.append("stock", producto.stock || 0);
      formData.append("descripcion", producto.descripcion || "");
      formData.append("proveedor_id", user.id);

      if (producto.imagen) {
        formData.append("imagen", producto.imagen);
      }

      const res = await fetch("http://localhost:8000/api/productos", {
        method: "POST",
        body: formData, // ¡Importante! No JSON.stringify
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error de validación:", errorData);
        const messages = Object.values(errorData.messages || {})
          .flat()
          .join("\n");
        throw new Error(messages || "Error de validación");
      }

      const data = await res.json();
      console.log("Producto creado:", data);
      alert("Producto publicado 🚀");

      setProducto({
        nombre: "",
        categoria: "",
        marca: "",
        modelo: "",
        precio: "",
        stock: "",
        descripcion: "",
        imagen: null,
      });
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al publicar el producto");
    }
  };

  /* ── cerrarSesion ORIGINAL ── */
  const cerrarSesion = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  // 🔥 Inicial del nombre
  const inicial = proveedor?.name?.charAt(0).toUpperCase() || "?";

  /* ── RENDER ── */
  return (
    <div className="pp-wrap">
      {/* Fondo decorativo */}
      <div className="pp-dots" />
      <div
        className="pp-orb"
        style={{
          width: 600,
          height: 600,
          top: -160,
          left: -160,
          background:
            "radial-gradient(circle,rgba(99,102,241,.13) 0%,transparent 70%)",
          animationDuration: "18s",
        }}
      />
      <div
        className="pp-orb"
        style={{
          width: 480,
          height: 480,
          bottom: -110,
          right: -90,
          background:
            "radial-gradient(circle,rgba(167,139,250,.1) 0%,transparent 70%)",
          animationDuration: "24s",
          animationDirection: "reverse",
        }}
      />
      <div
        className="pp-orb"
        style={{
          width: 360,
          height: 360,
          top: "40%",
          left: "55%",
          background:
            "radial-gradient(circle,rgba(99,102,241,.07) 0%,transparent 70%)",
          animationDuration: "30s",
          animationDelay: "5s",
        }}
      />

      {/* ── HEADER ── */}
      <header className="pp-header">
        <div className="pp-header-inner">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div className="pp-logo">
              <IcoBolt />
            </div>
            <div>
              <p className="pp-htitle">Panel de Proveedor</p>
              <p className="pp-hsub">Administra tus productos fácilmente</p>
            </div>
          </div>

          {/* PERFIL */}
          <div style={{ position: "relative" }}>
            <div className="pp-avbtn" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="pp-av">{inicial}</div>
              <span className="pp-avname">
                {proveedor?.name || "Proveedor"}
              </span>
              <span className={`pp-chev${menuOpen ? " open" : ""}`}>
                <IcoChev />
              </span>
            </div>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="pp-drop"
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <button
                    className="pp-ditem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/gestionar-productos");
                    }}
                  >
                    <IcoBox /> Gestionar productos
                  </button>
                  <div className="pp-dsep" />
                  <button
                    className="pp-ditem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/perfil-proveedor");
                    }}
                  >
                    <IcoUser /> Ver perfil
                  </button>
                  <div className="pp-dsep" />
                  <button
                    className="pp-ditem pp-ddanger"
                    onClick={() => {
                      setMenuOpen(false);
                      setShowLogoutModal(true);
                    }}
                  >
                    <IcoOut /> Cerrar sesión
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="pp-main">
        {/* ── FORMULARIO ── */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.48, ease: [0.25, 0.46, 0.45, 0.94] }}
          encType="multipart/form-data"
        >
          <div className="pp-card">
            <div className="pp-cardhead">
              <div className="pp-cardicon">
                <IcoBox />
              </div>
              <div>
                <p className="pp-cardtitle">Nuevo Producto</p>
                <p className="pp-cardsub">Completa los datos para publicar</p>
              </div>
            </div>

            <div style={{ padding: "26px 28px 32px" }}>
              <div className="pp-grid2">
                {/* nombre — span completo */}
                <div className="pp-field pp-span">
                  <label className="pp-label">Nombre del producto</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del producto"
                    onChange={handleChange}
                    className="pp-input"
                  />
                </div>

                <div className="pp-field">
                  <label className="pp-label">Categoría</label>
                  <input
                    type="text"
                    name="categoria"
                    placeholder="Categoría"
                    onChange={handleChange}
                    className="pp-input"
                  />
                </div>

                <div className="pp-field">
                  <label className="pp-label">Marca</label>
                  <input
                    type="text"
                    name="marca"
                    placeholder="Marca"
                    onChange={handleChange}
                    className="pp-input"
                  />
                </div>

                <div className="pp-field">
                  <label className="pp-label">Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    placeholder="Modelo"
                    onChange={handleChange}
                    className="pp-input"
                  />
                </div>

                <div className="pp-field">
                  <label className="pp-label">Precio</label>
                  <input
                    type="number"
                    name="precio"
                    placeholder="Precio"
                    onChange={handleChange}
                    className="pp-input"
                  />
                </div>

                <div className="pp-field">
                  <label className="pp-label">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    placeholder="Stock"
                    onChange={handleChange}
                    className="pp-input"
                  />
                </div>

                {/* Imagen — mismo handler que el original */}
                <div className="pp-field pp-span" style={{ marginTop: 4 }}>
                  <label className="pp-label">Imagen del producto</label>
                  <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={(e) =>
                      setProducto({ ...producto, imagen: e.target.files[0] })
                    }
                    className="pp-fileinput"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="pp-field" style={{ marginTop: 18 }}>
                <label className="pp-label">Descripción del producto</label>
                <textarea
                  name="descripcion"
                  placeholder="Descripción del producto"
                  onChange={handleChange}
                  className="pp-input pp-textarea"
                />
              </div>

              {/* Submit */}
              <div style={{ marginTop: 24 }}>
                <button className="pp-submit">Publicar Producto &nbsp;→</button>
              </div>
            </div>
          </div>
        </motion.form>

        {/* ── SIDEBAR ── */}
        <motion.div
          initial={{ opacity: 0, x: 18 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            delay: 0.18,
            duration: 0.48,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {/* Perfil */}
          <div className="pp-card" style={{ padding: "22px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 18,
              }}
            >
              <div className="pp-avlg">{inicial}</div>
              <div>
                <p
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#1e1b4b",
                  }}
                >
                  {proveedor?.name || "Proveedor"}
                </p>
                <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                  {proveedor?.empresa || "Tu empresa"}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[
                ["Email", proveedor?.email],
                ["Teléfono", proveedor?.telefono],
              ].map(([lbl, val]) => (
                <div
                  key={lbl}
                  style={{
                    background: "rgba(255,255,255,.7)",
                    border: "1px solid rgba(99,102,241,.1)",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: "#a5b4fc",
                      textTransform: "uppercase",
                      letterSpacing: ".1em",
                      marginBottom: 3,
                    }}
                  >
                    {lbl}
                  </p>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#4338ca",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {val || "—"}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="pp-card" style={{ padding: "20px 22px" }}>
            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#9ca3af",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Resumen
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                {
                  Ico: IcoBox,
                  bg: "rgba(99,102,241,.1)",
                  bd: "rgba(99,102,241,.2)",
                  col: "#6366f1",
                  label: "Productos",
                  val: "—",
                },
                {
                  Ico: IcoDollar,
                  bg: "rgba(16,185,129,.09)",
                  bd: "rgba(16,185,129,.2)",
                  col: "#059669",
                  label: "Ventas hoy",
                  val: "—",
                },
                {
                  Ico: IcoLayers,
                  bg: "rgba(245,158,11,.1)",
                  bd: "rgba(245,158,11,.2)",
                  col: "#d97706",
                  label: "Categorías",
                  val: "—",
                },
              ].map(({ Ico, bg, bd, col, label, val }) => (
                <div key={label} className="pp-statcard">
                  <div
                    className="pp-sticon"
                    style={{
                      background: bg,
                      border: `1px solid ${bd}`,
                      color: col,
                    }}
                  >
                    <Ico />
                  </div>
                  <div>
                    <p className="pp-stlabel">{label}</p>
                    <p className="pp-stval">{val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="pp-card" style={{ padding: "20px 22px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                marginBottom: 14,
              }}
            >
              <span style={{ color: "#f59e0b", display: "flex" }}>
                <IcoBolt />
              </span>
              <p
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#1e1b4b",
                }}
              >
                Tips para vender más
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                {
                  color: "#6366f1",
                  text: "Usa imágenes en alta resolución sobre fondo blanco",
                },
                {
                  color: "#10b981",
                  text: "Incluye especificaciones técnicas detalladas",
                },
                {
                  color: "#f59e0b",
                  text: "El precio competitivo aumenta 3× las ventas",
                },
                {
                  color: "#ec4899",
                  text: "Actualiza el stock para mayor visibilidad",
                },
              ].map(({ color, text }) => (
                <div key={text} className="pp-tip">
                  <div className="pp-tipdot" style={{ background: color }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── MODAL LOGOUT ── */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            className="pp-modalbg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.88, opacity: 0, y: 12 }}
              transition={{ duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="pp-modalbox"
            >
              <div className="pp-modalicon">
                <IcoX />
              </div>
              <p className="pp-modaltitle">¿Cerrar sesión?</p>
              <p className="pp-modalsub">Se cerrará tu sesión actual</p>
              <div className="pp-modalbtns">
                <button
                  className="pp-modalcancel"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancelar
                </button>
                <button className="pp-modalexit" onClick={cerrarSesion}>
                  Sí, salir
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default PanelProveedor;
