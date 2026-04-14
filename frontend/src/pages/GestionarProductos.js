import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

/* ── Estilos ── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .gp-wrap *, .gp-wrap *::before, .gp-wrap *::after { box-sizing: border-box; }
  .gp-wrap {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: linear-gradient(135deg, #eef2ff 0%, #f5f3ff 40%, #eff6ff 100%);
    position: relative; overflow-x: hidden;
  }
  @keyframes gp-orb {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(30px,-40px) scale(1.06); }
    66%      { transform: translate(-20px,25px) scale(.95); }
  }
  .gp-orb { position:fixed; border-radius:50%; pointer-events:none; z-index:0; animation:gp-orb linear infinite; }
  .gp-dots {
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:radial-gradient(circle,rgba(99,102,241,.11) 1px,transparent 1px);
    background-size:30px 30px;
  }

  /* Header */
  .gp-header {
    position:sticky; top:0; z-index:100;
    background:rgba(255,255,255,.7);
    backdrop-filter:blur(24px) saturate(180%);
    -webkit-backdrop-filter:blur(24px) saturate(180%);
    border-bottom:1px solid rgba(99,102,241,.12);
    box-shadow:0 2px 20px rgba(99,102,241,.07);
  }
  .gp-header-inner {
    max-width:1080px; margin:0 auto; padding:14px 28px;
    display:flex; align-items:center; justify-content:space-between; gap:16px;
  }
  .gp-logo {
    width:38px; height:38px; border-radius:12px; flex-shrink:0;
    background:linear-gradient(135deg,#6366f1,#818cf8);
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 16px rgba(99,102,241,.4); color:white;
  }
  .gp-htitle { font-family:'Syne',sans-serif; font-size:17px; font-weight:700; color:#1e1b4b; }
  .gp-hsub   { font-size:12px; color:#94a3b8; margin-top:1px; }

  /* Back btn */
  .gp-backbtn {
    display:flex; align-items:center; gap:8px;
    padding:8px 16px; border-radius:50px; cursor:pointer;
    background:rgba(255,255,255,.8); border:1px solid rgba(99,102,241,.18);
    font-size:13px; font-weight:500; color:#4b5563;
    transition:border-color .2s, box-shadow .2s;
    font-family:'DM Sans',sans-serif;
  }
  .gp-backbtn:hover { border-color:rgba(99,102,241,.4); box-shadow:0 4px 16px rgba(99,102,241,.12); color:#4338ca; }

  /* Main */
  .gp-main { max-width:1080px; margin:0 auto; padding:36px 28px 72px; position:relative; z-index:1; }

  /* Toolbar */
  .gp-toolbar {
    display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;
    margin-bottom:24px;
  }
  .gp-searchwrap { position:relative; }
  .gp-search {
    padding:10px 14px 10px 38px; border-radius:12px;
    border:1.5px solid rgba(99,102,241,.18);
    background:rgba(255,255,255,.8); font-size:13px; color:#1f2937; outline:none;
    font-family:'DM Sans',sans-serif; width:260px;
    transition:border-color .2s, box-shadow .2s;
  }
  .gp-search:focus { border-color:rgba(99,102,241,.5); box-shadow:0 0 0 3px rgba(99,102,241,.1); }
  .gp-search::placeholder { color:#c4c9d8; }
  .gp-searchico { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#a5b4fc; pointer-events:none; }
  .gp-count {
    font-size:12px; color:#94a3b8;
    background:rgba(255,255,255,.7); border:1px solid rgba(99,102,241,.12);
    border-radius:20px; padding:4px 12px;
  }

  /* Card glass */
  .gp-card {
    background:rgba(255,255,255,.75);
    backdrop-filter:blur(20px) saturate(160%);
    -webkit-backdrop-filter:blur(20px) saturate(160%);
    border:1px solid rgba(255,255,255,.9); border-radius:24px; overflow:hidden;
    box-shadow:0 4px 32px rgba(99,102,241,.1), inset 0 1px 0 rgba(255,255,255,.9);
  }

  /* Table */
  .gp-table { width:100%; border-collapse:collapse; }
  .gp-thead th {
    padding:14px 20px; text-align:left;
    font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase;
    color:#9ca3af; border-bottom:1px solid rgba(99,102,241,.08);
    background:rgba(248,250,255,.6);
  }
  .gp-tbody tr { transition:background .15s; }
  .gp-tbody tr:hover { background:rgba(99,102,241,.03); }
  .gp-tbody tr + tr td { border-top:1px solid rgba(99,102,241,.06); }
  .gp-tbody td { padding:16px 20px; font-size:14px; color:#374151; vertical-align:middle; }

  /* Producto img thumbnail */
  .gp-thumb {
    width:48px; height:48px; border-radius:12px; object-fit:cover;
    border:1px solid rgba(99,102,241,.12);
  }
  .gp-thumb-placeholder {
    width:48px; height:48px; border-radius:12px;
    background:linear-gradient(135deg,rgba(99,102,241,.1),rgba(167,139,250,.08));
    border:1px solid rgba(99,102,241,.12);
    display:flex; align-items:center; justify-content:center; color:#a5b4fc;
  }

  /* Badges */
  .gp-badge {
    display:inline-block; padding:3px 10px; border-radius:20px;
    font-size:11px; font-weight:600; letter-spacing:.04em;
  }

  /* Action buttons */
  .gp-actbtn {
    width:34px; height:34px; border-radius:10px; border:none; cursor:pointer;
    display:inline-flex; align-items:center; justify-content:center;
    transition:background .15s, transform .12s;
  }
  .gp-actbtn:active { transform:scale(.92); }
  .gp-edit  { background:rgba(99,102,241,.1);  color:#6366f1; }
  .gp-edit:hover  { background:rgba(99,102,241,.18); }
  .gp-del   { background:rgba(239,68,68,.09);  color:#ef4444; }
  .gp-del:hover   { background:rgba(239,68,68,.16); }

  /* Empty state */
  .gp-empty {
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:80px 24px; gap:14px;
  }
  .gp-emptyico {
    width:72px; height:72px; border-radius:50%;
    background:rgba(255,255,255,.7); border:1px solid rgba(99,102,241,.12);
    display:flex; align-items:center; justify-content:center; color:#c7d2fe;
  }

  /* ── MODAL EDITAR ── */
  .gp-overlay {
    position:fixed; inset:0; z-index:200;
    background:rgba(15,10,40,.45);
    backdrop-filter:blur(18px) saturate(140%);
    -webkit-backdrop-filter:blur(18px) saturate(140%);
    display:flex; align-items:center; justify-content:center; padding:24px;
  }
  .gp-modal {
    background:rgba(255,255,255,.96);
    border:1px solid rgba(99,102,241,.15); border-radius:28px;
    width:100%; max-width:560px; max-height:90vh; overflow-y:auto;
    box-shadow:0 32px 80px rgba(99,102,241,.2), 0 8px 24px rgba(0,0,0,.06);
  }
  .gp-modalhead {
    padding:24px 28px 18px;
    border-bottom:1px solid rgba(99,102,241,.08);
    display:flex; align-items:center; justify-content:space-between;
  }
  .gp-modaltitle { font-family:'Syne',sans-serif; font-size:18px; font-weight:700; color:#1e1b4b; }
  .gp-closebtn {
    width:32px; height:32px; border-radius:50%; border:none; cursor:pointer;
    background:rgba(99,102,241,.07); color:#9ca3af;
    display:flex; align-items:center; justify-content:center;
    transition:background .15s, color .15s;
  }
  .gp-closebtn:hover { background:rgba(99,102,241,.14); color:#6366f1; }

  .gp-mbody { padding:24px 28px 28px; }
  .gp-mgrid { display:grid; grid-template-columns:1fr 1fr; gap:16px 18px; }
  .gp-mfield { display:flex; flex-direction:column; gap:6px; }
  .gp-mlabel { font-size:11px; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:#6b7280; }
  .gp-minput {
    background:rgba(248,250,255,.9); border:1.5px solid rgba(99,102,241,.14);
    border-radius:12px; padding:11px 13px; font-size:14px; color:#1f2937; outline:none;
    font-family:'DM Sans',sans-serif; width:100%;
    transition:border-color .2s, box-shadow .2s;
  }
  .gp-minput:focus { border-color:rgba(99,102,241,.5); box-shadow:0 0 0 3px rgba(99,102,241,.1); }
  .gp-minput::placeholder { color:#c4c9d8; }
  .gp-mspan { grid-column:1/-1; }
  .gp-mtextarea { resize:none; min-height:80px; line-height:1.6; }
  .gp-mfileinput {
    background:rgba(248,250,255,.9); border:1.5px dashed rgba(99,102,241,.3);
    border-radius:12px; padding:11px 13px; font-size:13px; color:#6366f1;
    font-family:'DM Sans',sans-serif; width:100%; cursor:pointer;
    transition:border-color .2s;
  }
  .gp-mfooter {
    display:flex; gap:10px; margin-top:24px;
  }
  .gp-mcancel {
    flex:1; padding:13px; border-radius:14px; cursor:pointer;
    background:rgba(99,102,241,.06); border:1px solid rgba(99,102,241,.14);
    color:#6b7280; font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif;
    transition:background .15s;
  }
  .gp-mcancel:hover { background:rgba(99,102,241,.1); }
  .gp-msave {
    flex:1; padding:13px; border-radius:14px; cursor:pointer; border:none;
    background:linear-gradient(135deg,#4f46e5,#818cf8);
    color:white; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif;
    box-shadow:0 6px 20px rgba(99,102,241,.35);
    transition:transform .15s, box-shadow .2s;
  }
  .gp-msave:hover { transform:translateY(-1px); box-shadow:0 10px 28px rgba(99,102,241,.45); }

  /* ── MODAL CONFIRMAR DELETE ── */
  .gp-delmodal {
    background:rgba(255,255,255,.96);
    border:1px solid rgba(239,68,68,.15); border-radius:28px; padding:36px;
    width:100%; max-width:360px; text-align:center;
    box-shadow:0 32px 80px rgba(239,68,68,.15), 0 8px 24px rgba(0,0,0,.06);
  }
  .gp-delicon {
    width:64px; height:64px; border-radius:20px; margin:0 auto 20px;
    background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.18);
    display:flex; align-items:center; justify-content:center;
  }
  .gp-deltitle { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#1e1b4b; margin-bottom:8px; }
  .gp-delsub   { font-size:14px; color:#9ca3af; line-height:1.55; margin-bottom:28px; }
  .gp-delbtns  { display:flex; gap:10px; }
  .gp-delcancel {
    flex:1; padding:13px; border-radius:14px; cursor:pointer;
    background:rgba(99,102,241,.06); border:1px solid rgba(99,102,241,.14);
    color:#6b7280; font-size:14px; font-weight:600; font-family:'DM Sans',sans-serif;
    transition:background .15s;
  }
  .gp-delcancel:hover { background:rgba(99,102,241,.1); }
  .gp-delconfirm {
    flex:1; padding:13px; border-radius:14px; cursor:pointer; border:none;
    background:linear-gradient(135deg,#b91c1c,#ef4444);
    color:white; font-size:14px; font-weight:700; font-family:'DM Sans',sans-serif;
    box-shadow:0 6px 20px rgba(239,68,68,.3);
    transition:transform .15s, box-shadow .2s;
  }
  .gp-delconfirm:hover { transform:translateY(-1px); box-shadow:0 10px 28px rgba(239,68,68,.45); }

  /* Loading spinner */
  @keyframes gp-spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  .gp-spinner { animation:gp-spin .9s linear infinite; }
`;

let _injected = false;
function injectStyles() {
  if (_injected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = STYLES;
  document.head.appendChild(el);
  _injected = true;
}

/* ── Icons ── */
const IcoBolt  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const IcoBack  = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>;
const IcoEdit  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IcoDel   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IcoBox   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>;
const IcoSearch= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>;
const IcoClose = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const IcoWarn  = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const IcoImg   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;

/* ════════════════════════════════════════════ */
function GestionarProductos() {
  injectStyles();
  const navigate = useNavigate();

  const [productos, setProductos]       = useState([]);
  const [loading, setLoading]           = useState(true);
  const [busqueda, setBusqueda]         = useState("");
  const [editando, setEditando]         = useState(null);   // producto en edición
  const [eliminando, setEliminando]     = useState(null);   // producto a eliminar
  const [guardando, setGuardando]       = useState(false);
  const [eliminandoId, setEliminandoId] = useState(false);
  const [form, setForm]                 = useState({});
  const [nuevaImagen, setNuevaImagen]   = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));

  /* ── Cargar productos del proveedor ── */
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:8000/api/productos/proveedor/${user.id}`)
      .then(r => r.json())
      .then(data => { setProductos(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  /* ── Abrir modal edición ── */
  function abrirEdicion(p) {
    setForm({
      nombre:      p.nombre      || "",
      categoria:   p.categoria   || "",
      marca:       p.marca       || "",
      modelo:      p.modelo      || "",
      precio:      p.precio      || "",
      stock:       p.stock       || "",
      descripcion: p.descripcion || "",
    });
    setNuevaImagen(null);
    setEditando(p);
  }

  /* ── Guardar edición ── */
  async function guardarEdicion(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      const fd = new FormData();
      fd.append("nombre",      form.nombre);
      fd.append("categoria",   form.categoria);
      fd.append("marca",       form.marca || "");
      fd.append("modelo",      form.modelo || "");
      fd.append("precio",      form.precio);
      fd.append("stock",       form.stock || 0);
      fd.append("descripcion", form.descripcion || "");
      if (nuevaImagen) fd.append("imagen", nuevaImagen);

      const res = await fetch(`http://localhost:8000/api/productos/${editando.id}`, {
        method: "POST",   // Laravel acepta POST para FormData con archivos
        body: fd,
      });

      if (!res.ok) {
        const err = await res.json();
        const msg = Object.values(err.messages || {}).flat().join("\n");
        throw new Error(msg || "Error al actualizar");
      }

      const data = await res.json();
      // Actualizar lista local
      setProductos(prev => prev.map(p => p.id === editando.id ? data.producto : p));
      setEditando(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  }

  /* ── Confirmar eliminación ── */
  async function confirmarEliminar() {
    setEliminandoId(true);
    try {
      const res = await fetch(`http://localhost:8000/api/productos/${eliminando.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar");
      // Quitar de lista local
      setProductos(prev => prev.filter(p => p.id !== eliminando.id));
      setEliminando(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setEliminandoId(false);
    }
  }

  const filtrados = productos.filter(p =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.marca?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const inicial = user?.name?.charAt(0).toUpperCase() || "?";

  return (
    <div className="gp-wrap">
      <div className="gp-dots" />
      <div className="gp-orb" style={{ width:600,height:600,top:-160,left:-160, background:"radial-gradient(circle,rgba(99,102,241,.13) 0%,transparent 70%)", animationDuration:"18s" }} />
      <div className="gp-orb" style={{ width:480,height:480,bottom:-110,right:-90, background:"radial-gradient(circle,rgba(167,139,250,.1) 0%,transparent 70%)", animationDuration:"24s", animationDirection:"reverse" }} />

      {/* ── HEADER ── */}
      <header className="gp-header">
        <div className="gp-header-inner">
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <div className="gp-logo"><IcoBolt /></div>
            <div>
              <p className="gp-htitle">Gestionar Productos</p>
              <p className="gp-hsub">Edita o elimina tus productos publicados</p>
            </div>
          </div>
          <button className="gp-backbtn" onClick={() => navigate(-1)}>
            <IcoBack /> Volver al panel
          </button>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="gp-main">

        {/* Toolbar */}
        <div className="gp-toolbar">
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div className="gp-searchwrap">
              <span className="gp-searchico"><IcoSearch /></span>
              <input
                className="gp-search"
                type="text"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
              />
            </div>
          </div>
          <span className="gp-count">
            {loading ? "Cargando..." : `${filtrados.length} producto${filtrados.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {/* Tabla */}
        <motion.div
          className="gp-card"
          initial={{ opacity:0, y:20 }}
          animate={{ opacity:1, y:0 }}
          transition={{ duration:.45, ease:[.25,.46,.45,.94] }}
        >
          {loading ? (
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:80, gap:10, color:"#a5b4fc" }}>
              <svg className="gp-spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
              <span style={{ fontSize:14, color:"#9ca3af" }}>Cargando productos...</span>
            </div>
          ) : filtrados.length === 0 ? (
            <div className="gp-empty">
              <div className="gp-emptyico"><IcoBox /></div>
              <p style={{ fontSize:15, fontWeight:500, color:"#9ca3af" }}>
                {busqueda ? "Sin resultados para tu búsqueda" : "Aún no tienes productos publicados"}
              </p>
              <button
                onClick={() => navigate(-1)}
                style={{ padding:"9px 20px", borderRadius:12, border:"none", cursor:"pointer",
                  background:"linear-gradient(135deg,#4f46e5,#818cf8)", color:"white",
                  fontSize:13, fontWeight:600, fontFamily:"'DM Sans',sans-serif",
                  boxShadow:"0 6px 18px rgba(99,102,241,.3)" }}
              >
                Publicar primer producto
              </button>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table className="gp-table">
                <thead className="gp-thead">
                  <tr>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th style={{ textAlign:"center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody className="gp-tbody">
                  <AnimatePresence>
                    {filtrados.map((p, i) => (
                      <motion.tr key={p.id}
                        initial={{ opacity:0, y:8 }}
                        animate={{ opacity:1, y:0 }}
                        exit={{ opacity:0, x:-20 }}
                        transition={{ delay: i * 0.04, duration:.3 }}>
                        {/* Imagen + nombre */}
                        <td>
                          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                            {p.imagen
                              ? <img src={`http://localhost:8000/productos/${p.imagen}`} alt={p.nombre} className="gp-thumb" />
                              : <div className="gp-thumb-placeholder"><IcoImg /></div>
                            }
                            <div>
                              <p style={{ fontWeight:600, color:"#1e1b4b", fontSize:14 }}>{p.nombre}</p>
                              <p style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{p.marca} {p.modelo}</p>
                            </div>
                          </div>
                        </td>
                        {/* Categoría */}
                        <td>
                          <span className="gp-badge" style={{ background:"rgba(99,102,241,.1)", color:"#6366f1" }}>
                            {p.categoria}
                          </span>
                        </td>
                        {/* Precio */}
                        <td>
                          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#1e1b4b" }}>
                            {Number(p.precio).toLocaleString("es-MX", { style:"currency", currency:"MXN", minimumFractionDigits:0 })}
                          </span>
                        </td>
                        {/* Stock */}
                        <td>
                          <span className="gp-badge" style={{
                            background: p.stock > 10 ? "rgba(16,185,129,.1)" : p.stock > 0 ? "rgba(245,158,11,.1)" : "rgba(239,68,68,.1)",
                            color:      p.stock > 10 ? "#059669"              : p.stock > 0 ? "#d97706"             : "#ef4444",
                          }}>
                            {p.stock} uds
                          </span>
                        </td>
                        {/* Acciones */}
                        <td>
                          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
                            <motion.button whileTap={{ scale:.9 }} className="gp-actbtn gp-edit" onClick={() => abrirEdicion(p)} title="Editar">
                              <IcoEdit />
                            </motion.button>
                            <motion.button whileTap={{ scale:.9 }} className="gp-actbtn gp-del" onClick={() => setEliminando(p)} title="Eliminar">
                              <IcoDel />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── MODAL EDITAR ── */}
      <AnimatePresence>
        {editando && (
          <motion.div className="gp-overlay"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setEditando(null)}>
            <motion.div className="gp-modal"
              initial={{ scale:.92, opacity:0, y:20 }}
              animate={{ scale:1,   opacity:1, y:0  }}
              exit={{    scale:.92, opacity:0, y:12 }}
              transition={{ duration:.28, ease:[.25,.46,.45,.94] }}
              onClick={e => e.stopPropagation()}>

              <div className="gp-modalhead">
                <p className="gp-modaltitle">Editar producto</p>
                <button className="gp-closebtn" onClick={() => setEditando(null)}><IcoClose /></button>
              </div>

              <form className="gp-mbody" onSubmit={guardarEdicion}>
                <div className="gp-mgrid">

                  <div className="gp-mfield gp-mspan">
                    <label className="gp-mlabel">Nombre</label>
                    <input className="gp-minput" type="text" value={form.nombre}
                      onChange={e => setForm({...form, nombre: e.target.value})} required />
                  </div>

                  <div className="gp-mfield">
                    <label className="gp-mlabel">Categoría</label>
                    <input className="gp-minput" type="text" value={form.categoria}
                      onChange={e => setForm({...form, categoria: e.target.value})} required />
                  </div>

                  <div className="gp-mfield">
                    <label className="gp-mlabel">Marca</label>
                    <input className="gp-minput" type="text" value={form.marca}
                      onChange={e => setForm({...form, marca: e.target.value})} />
                  </div>

                  <div className="gp-mfield">
                    <label className="gp-mlabel">Modelo</label>
                    <input className="gp-minput" type="text" value={form.modelo}
                      onChange={e => setForm({...form, modelo: e.target.value})} />
                  </div>

                  <div className="gp-mfield">
                    <label className="gp-mlabel">Precio</label>
                    <input className="gp-minput" type="number" value={form.precio}
                      onChange={e => setForm({...form, precio: e.target.value})} required />
                  </div>

                  <div className="gp-mfield">
                    <label className="gp-mlabel">Stock</label>
                    <input className="gp-minput" type="number" value={form.stock}
                      onChange={e => setForm({...form, stock: e.target.value})} />
                  </div>

                  <div className="gp-mfield gp-mspan">
                    <label className="gp-mlabel">Descripción</label>
                    <textarea className="gp-minput gp-mtextarea" value={form.descripcion}
                      onChange={e => setForm({...form, descripcion: e.target.value})} />
                  </div>

                  <div className="gp-mfield gp-mspan">
                    <label className="gp-mlabel">Imagen (dejar vacío para mantener la actual)</label>
                    {editando.imagen && (
                      <img src={`http://localhost:8000/productos/${editando.imagen}`}
                        alt="actual" style={{ width:80, height:80, objectFit:"cover", borderRadius:10, marginBottom:8, border:"1px solid rgba(99,102,241,.15)" }} />
                    )}
                    <input type="file" accept="image/*" className="gp-mfileinput"
                      onChange={e => setNuevaImagen(e.target.files[0] || null)} />
                  </div>

                </div>

                <div className="gp-mfooter">
                  <button type="button" className="gp-mcancel" onClick={() => setEditando(null)}>Cancelar</button>
                  <button type="submit" className="gp-msave" disabled={guardando}>
                    {guardando ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MODAL CONFIRMAR ELIMINAR ── */}
      <AnimatePresence>
        {eliminando && (
          <motion.div className="gp-overlay"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={() => setEliminando(null)}>
            <motion.div className="gp-delmodal"
              initial={{ scale:.88, opacity:0, y:20 }}
              animate={{ scale:1,   opacity:1, y:0  }}
              exit={{    scale:.88, opacity:0, y:12 }}
              transition={{ duration:.26, ease:[.25,.46,.45,.94] }}
              onClick={e => e.stopPropagation()}>

              <div className="gp-delicon"><IcoWarn /></div>
              <p className="gp-deltitle">¿Eliminar producto?</p>
              <p className="gp-delsub">
                <strong style={{ color:"#1e1b4b" }}>"{eliminando.nombre}"</strong> será eliminado permanentemente de la base de datos. Esta acción no se puede deshacer.
              </p>
              <div className="gp-delbtns">
                <button className="gp-delcancel" onClick={() => setEliminando(null)}>Cancelar</button>
                <button className="gp-delconfirm" onClick={confirmarEliminar} disabled={eliminandoId}>
                  {eliminandoId ? "Eliminando..." : "Sí, eliminar"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GestionarProductos;