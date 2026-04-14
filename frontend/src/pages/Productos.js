import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProductoCard from "../components/ProductoCard";

const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .pg-root { font-family: 'Outfit', sans-serif; }

  @keyframes pg-skeleton {
    0%,100% { opacity:.4; }
    50%      { opacity:.75; }
  }

  /* Fondo blanco puro, limpio */
  .pg-bg {
    min-height: 100vh;
    background: #f7f9fc;
    position: relative; overflow-x: hidden;
  }

  /* Header */
  .pg-header {
    position: sticky; top: 0; z-index: 50;
    background: rgba(255,255,255,.92);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    border-bottom: 1px solid #e8ecf4;
    box-shadow: 0 2px 16px rgba(0,0,0,.04);
  }

  /* Buscador */
  .pg-search {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 10px 14px 10px 38px;
    font-size: 14px; font-family: 'Outfit', sans-serif;
    color: #1a202c; outline: none; width: 100%;
    transition: border-color .2s, box-shadow .2s;
  }
  .pg-search::placeholder { color: #a0aec0; }
  .pg-search:focus {
    border-color: #63b3ed;
    box-shadow: 0 0 0 3px rgba(99,179,237,.12);
  }

  /* Pills de categoría */
  .pg-pill {
    position: relative; font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500;
    padding: 7px 16px; border-radius: 50px; cursor: pointer;
    border: 1px solid transparent; transition: color .2s;
    background: none;
  }
  .pg-pill-inactive {
    color: #718096;
    background: #ffffff;
    border-color: #e2e8f0;
  }
  .pg-pill-inactive:hover { color: #3182ce; border-color: #bee3f8; background: #ebf8ff; }
  .pg-pill-active { color: white; border-color: transparent; }

  /* Skeleton */
  .pg-skeleton { animation: pg-skeleton 1.4s ease-in-out infinite; }
  .pg-skel-card {
    background: #ffffff;
    border: 1px solid #e8ecf4;
    border-radius: 20px; overflow: hidden;
  }

  /* Stat badge */
  .pg-stat {
    display: inline-flex; align-items: center; gap: 5px;
    font-size: 12px; color: #718096;
    background: #ffffff; border: 1px solid #e2e8f0;
    border-radius: 20px; padding: 4px 12px;
  }
`;

let pgCssInjected = false;
function injectPageCSS() {
  if (pgCssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = PAGE_CSS;
  document.head.appendChild(el);
  pgCssInjected = true;
}

function Productos() {
  injectPageCSS();

  const navigate = useNavigate();
  const [productos, setProductos]             = useState([]);
  const [categorias, setCategorias]           = useState([]);
  const [categoriaSeleccionada, setCategoria] = useState("Todos");
  const [loading, setLoading]                 = useState(true);
  const [busqueda, setBusqueda]               = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/productos")
      .then(r => r.json())
      .then(data => {
        setProductos(data);
        setCategorias(["Todos", ...new Set(data.map(p => p.categoria).filter(Boolean))]);
        setLoading(false);
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, []);

  const filtrados = productos
    .filter(p => categoriaSeleccionada === "Todos" || p.categoria === categoriaSeleccionada)
    .filter(p => {
      const q = busqueda.toLowerCase().trim();
      return !q || p.nombre?.toLowerCase().includes(q) || p.marca?.toLowerCase().includes(q);
    });

  return (
    <div className="pg-root pg-bg">

      {/* ── Header ── */}
      <header className="pg-header">
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'14px 24px',
          display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:12 }}>

          {/* Izquierda: volver + título */}
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <motion.button whileTap={{ scale:.9 }} onClick={() => navigate(-1)}
              style={{ width:36, height:36, borderRadius:'50%', background:'#ffffff',
                border:'1px solid #e2e8f0', display:'flex', alignItems:'center',
                justifyContent:'center', cursor:'pointer', color:'#4a5568' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </motion.button>

            <div>
              <h1 style={{ fontSize:21, fontWeight:800, color:'#1a202c', letterSpacing:'-.02em', lineHeight:1 }}>
                Catálogo
              </h1>
              <div style={{ display:'flex', gap:6, marginTop:4 }}>
                <span className="pg-stat">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
                    <circle cx="12" cy="12" r="1"/>
                  </svg>
                  {loading ? "—" : `${filtrados.length} productos`}
                </span>
              </div>
            </div>
          </div>

          {/* Buscador */}
          <div style={{ position:'relative', width:'100%', maxWidth:280 }}>
            <svg style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)',
              color:'#a0aec0', pointerEvents:'none' }}
              width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="pg-search"
              type="text"
              placeholder="Buscar productos o marcas..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* ── Contenido ── */}
      <main style={{ maxWidth:1280, margin:'0 auto', padding:'24px 24px 60px' }}>

        {/* Filtros de categoría */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
          {categorias.map(cat => (
            <motion.button key={cat} whileTap={{ scale:.94 }} onClick={() => setCategoria(cat)}
              className={`pg-pill ${categoriaSeleccionada === cat ? "pg-pill-active" : "pg-pill-inactive"}`}>
              {categoriaSeleccionada === cat && (
                <motion.span layoutId="pill-bg"
                  style={{ position:'absolute', inset:0, borderRadius:50,
                    background:'linear-gradient(135deg,#2b6cb0,#4299e1)', zIndex:0 }}
                  transition={{ type:'spring', stiffness:360, damping:32 }}
                />
              )}
              <span style={{ position:'relative', zIndex:1 }}>{cat}</span>
            </motion.button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:18 }}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="pg-skel-card">
                <div className="pg-skeleton" style={{ height:190, background:'#edf0f7' }} />
                <div style={{ padding:'14px 16px 16px', display:'flex', flexDirection:'column', gap:8 }}>
                  <div className="pg-skeleton" style={{ height:10, width:'35%', borderRadius:6, background:'#e2e8f0' }} />
                  <div className="pg-skeleton" style={{ height:13, width:'75%', borderRadius:6, background:'#e2e8f0' }} />
                  <div className="pg-skeleton" style={{ height:10, width:'50%', borderRadius:6, background:'#edf0f7' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:4 }}>
                    <div className="pg-skeleton" style={{ height:16, width:'38%', borderRadius:6, background:'#e2e8f0' }} />
                    <div className="pg-skeleton" style={{ width:40, height:40, borderRadius:'50%', background:'#edf0f7' }} />
                  </div>
                </div>
                {/* strip proveedor skeleton */}
                <div style={{ padding:'10px 16px', borderTop:'1px solid #edf0f7', display:'flex', gap:8, alignItems:'center' }}>
                  <div className="pg-skeleton" style={{ width:26, height:26, borderRadius:'50%', background:'#e2e8f0', flexShrink:0 }} />
                  <div style={{ flex:1, display:'flex', flexDirection:'column', gap:5 }}>
                    <div className="pg-skeleton" style={{ height:9, width:'60%', borderRadius:4, background:'#e2e8f0' }} />
                    <div className="pg-skeleton" style={{ height:8, width:'40%', borderRadius:4, background:'#edf0f7' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={categoriaSeleccionada + busqueda}
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:.16 }}>
              {filtrados.length > 0 ? (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:18 }}>
                  {filtrados.map((p, i) => (
                    <ProductoCard key={p.id} producto={p} index={i} />
                  ))}
                </div>
              ) : (
                <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center',
                    justifyContent:'center', paddingTop:88, paddingBottom:88, gap:14 }}>
                  <div style={{ width:68, height:68, borderRadius:'50%', background:'#ffffff',
                    border:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <p style={{ fontSize:14, color:'#a0aec0', fontWeight:500 }}>
                    Sin resultados para <strong style={{ color:'#718096' }}>"{busqueda || categoriaSeleccionada}"</strong>
                  </p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>
    </div>
  );
}

export default Productos;