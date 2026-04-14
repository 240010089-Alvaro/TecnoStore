import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .pc-root * { font-family: 'Outfit', sans-serif; box-sizing: border-box; }

  @keyframes pc-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  @keyframes pc-pulse-ring {
    0%   { transform: scale(1);   opacity: .6; }
    100% { transform: scale(1.9); opacity: 0;  }
  }
  @keyframes pc-float {
    0%,100% { transform: translateY(0px)  rotate(0deg);    }
    33%      { transform: translateY(-6px) rotate(2deg);    }
    66%      { transform: translateY(3px)  rotate(-1.5deg); }
  }
  @keyframes pc-spin-slow {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }

  /* ── Tarjeta principal: blanca, sólida, limpia ── */
  .pc-card { transform-style: preserve-3d; perspective: 1000px; }

  .pc-card-inner {
    position: relative;
    background: #ffffff;
    border: 1px solid #e8ecf4;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transform-style: preserve-3d;
    transition: box-shadow .25s ease, border-color .25s ease;
  }
  .pc-card-inner:hover {
    border-color: #c7d7f0;
    box-shadow:
      0 8px 32px rgba(49,130,206,.12),
      0 2px 8px rgba(49,130,206,.08);
  }

  .pc-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; letter-spacing: .08em;
  }

  .pc-float-icon { animation: pc-float 4s ease-in-out infinite; }

  .pc-ring {
    position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(99,179,237,.55);
    animation: pc-pulse-ring 2.2s cubic-bezier(.4,0,.6,1) infinite;
    pointer-events: none;
  }

  /* Shimmer en el nombre al hover */
  .pc-shimmer-text {
    background: linear-gradient(90deg, #1a202c 35%, #3182ce 50%, #1a202c 65%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .pc-card-inner:hover .pc-shimmer-text {
    animation: pc-shimmer 1.8s linear infinite;
  }

  /* ── Proveedor strip en la tarjeta ── */
  .pc-prov-strip {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 16px;
    background: #f8faff;
    border-top: 1px solid #edf0f7;
  }
  .pc-prov-avatar {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, #3182ce, #63b3ed);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white;
  }

  /* ── Modal ── */
  .pc-modal-backdrop {
    position: fixed; inset: 0; z-index: 9998;
    background: rgba(203,213,224,.55);
    backdrop-filter: blur(20px) saturate(160%);
    -webkit-backdrop-filter: blur(20px) saturate(160%);
  }
  .pc-modal-wrap {
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: flex-end; justify-content: center; padding: 0;
  }
  @media (min-width:640px) {
    .pc-modal-wrap { align-items: center; padding: 1.5rem; }
  }
  .pc-modal-box {
    width: 100%; max-width: 480px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 28px 28px 0 0; overflow: hidden;
    box-shadow: 0 32px 80px rgba(0,0,0,.14), 0 8px 24px rgba(0,0,0,.06);
  }
  @media (min-width:640px) { .pc-modal-box { border-radius: 28px; } }

  /* Chips del proveedor en modal */
  .pc-chip {
    background: #f0f7ff;
    border: 1px solid #bee3f8;
    border-radius: 12px; padding: 10px 14px;
  }

  /* Botón agregar carrito */
  .pc-add-btn {
    width: 100%; padding: 15px; border-radius: 16px;
    background: linear-gradient(135deg, #2b6cb0 0%, #4299e1 60%, #63b3ed 100%);
    color: white; font-weight: 700; font-size: 15px; letter-spacing: .03em;
    border: none; cursor: pointer; position: relative; overflow: hidden;
    transition: transform .15s, box-shadow .2s;
    font-family: 'Outfit', sans-serif;
  }
  .pc-add-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 36px rgba(49,130,206,.4); }
  .pc-add-btn:active { transform: scale(.97); }
  .pc-add-btn::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,.18) 100%);
    pointer-events: none;
  }
`;

let cssInjected = false;
function injectCSS() {
  if (cssInjected || typeof document === "undefined") return;
  const el = document.createElement("style");
  el.textContent = GLOBAL_CSS;
  document.head.appendChild(el);
  cssInjected = true;
}

/* ── Tilt 3D ── */
function Card3D({ children, onClick }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-.5, .5], [6, -6]), { stiffness: 260, damping: 28 });
  const rotY = useSpring(useTransform(mx, [-.5, .5], [-6,  6]), { stiffness: 260, damping: 28 });

  return (
    <motion.div
      ref={ref}
      className="pc-card"
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
      onMouseMove={e => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        mx.set((e.clientX - r.left) / r.width  - .5);
        my.set((e.clientY - r.top)  / r.height - .5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}

/* ── Color por categoría ── */
const CAT_COLORS = {
  Laptops:     ["#2b6cb0","#63b3ed"],
  Smartphones: ["#6b46c1","#b794f4"],
  Audio:       ["#b7791f","#f6ad55"],
  Monitores:   ["#276749","#68d391"],
  Accesorios:  ["#9b2c2c","#fc8181"],
  Wearables:   ["#2c5282","#76e4f7"],
};

/* ════════════════════════════════════ */
function ProductoCard({ producto, index = 0 }) {
  injectCSS();

  const [showModal, setShowModal] = useState(false);
  const [proveedor, setProveedor] = useState(null);
  const [imgError,  setImgError]  = useState(false);
  const [added,     setAdded]     = useState(false);

  // Carga proveedor al montar la tarjeta (para mostrarlo en el strip)
  useEffect(() => {
    if (producto.proveedor_id) {
      fetch(`http://localhost:8000/api/proveedores/${producto.proveedor_id}`)
        .then(r => r.json())
        .then(setProveedor)
        .catch(console.error);
    }
  }, [producto.proveedor_id]);

  const price = Number(producto.precio).toLocaleString("es-MX", {
    style: "currency", currency: "MXN", minimumFractionDigits: 0,
  });

  const [c1, c2] = CAT_COLORS[producto.categoria] ?? ["#2b6cb0","#63b3ed"];
  const provIni  = proveedor?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <div className="pc-root">
      {/* ── TARJETA ── */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: .95 }}
        animate={{ opacity: 1, y: 0,  scale: 1   }}
        transition={{ duration: .45, delay: index * .06, ease: [.25,.46,.45,.94] }}
      >
        <Card3D onClick={() => setShowModal(true)}>
          <div className="pc-card-inner">

            {/* ── Imagen ── */}
            <div style={{ position:'relative', height:190, overflow:'hidden', background:`linear-gradient(145deg,${c1}0d,${c2}18)` }}>
              {producto.imagen && !imgError ? (
                <img
                  src={`http://localhost:8000/productos/${producto.imagen}`}
                  alt={producto.nombre}
                  onError={() => setImgError(true)}
                  style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .45s ease' }}
                />
              ) : (
                <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div className="pc-float-icon" style={{ color:c1, opacity:.2 }}>
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                    </svg>
                  </div>
                </div>
              )}

              {/* Badge categoría */}
              {producto.categoria && (
                <span className="pc-badge"
                  style={{ position:'absolute', top:10, left:10, padding:'3px 10px', borderRadius:20,
                    background:'rgba(255,255,255,.92)', color:c1, border:`1px solid ${c1}33` }}>
                  {producto.categoria}
                </span>
              )}

              {/* Gradiente inferior suave */}
              <div style={{ position:'absolute', inset:0,
                background:'linear-gradient(to top, rgba(255,255,255,.5) 0%, transparent 45%)',
                pointerEvents:'none' }} />
            </div>

            {/* ── Cuerpo ── */}
            <div style={{ padding:'14px 16px 16px' }}>
              <p style={{ fontSize:11, fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'#718096', marginBottom:3 }}>
                {producto.marca}
              </p>
              <h2 className="pc-shimmer-text"
                style={{ fontSize:15, fontWeight:700, lineHeight:1.3, marginBottom:3 }}>
                {producto.nombre}
              </h2>
              <p style={{ fontSize:11, color:'#a0aec0', marginBottom:14, fontFamily:"'JetBrains Mono',monospace" }}>
                {producto.modelo}
              </p>

              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div>
                  <p style={{ fontSize:10, color:'#a0aec0', marginBottom:1, letterSpacing:'.08em', textTransform:'uppercase' }}>Precio</p>
                  <p style={{ fontSize:20, fontWeight:800, color:'#1a202c', letterSpacing:'-.02em', lineHeight:1 }}>{price}</p>
                </div>

                {/* Botón + carrito */}
                <motion.button whileTap={{ scale:.88 }}
                  onClick={e => { e.stopPropagation(); setAdded(true); setTimeout(() => setAdded(false), 2000); }}
                  style={{ position:'relative', width:40, height:40, borderRadius:'50%',
                    border:`1.5px solid ${c1}44`, background:`${c1}0f`,
                    color:c1, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                  {added && <div className="pc-ring" style={{ width:40, height:40 }} />}
                  <AnimatePresence mode="wait">
                    {added
                      ? <motion.svg key="c" initial={{scale:0,rotate:-90}} animate={{scale:1,rotate:0}} exit={{scale:0}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></motion.svg>
                      : <motion.svg key="p" initial={{scale:0,rotate:90}}  animate={{scale:1,rotate:0}} exit={{scale:0}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></motion.svg>
                    }
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>

            {/* ── Strip proveedor ── */}
            <div className="pc-prov-strip">
              {proveedor ? (
                <>
                  <div className="pc-prov-avatar">{provIni}</div>
                  <div style={{ minWidth:0 }}>
                    <p style={{ fontSize:11, fontWeight:600, color:'#2d3748', lineHeight:1.2,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {proveedor.name}
                    </p>
                    <p style={{ fontSize:10, color:'#718096', lineHeight:1.2,
                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      {proveedor.empresa}
                    </p>
                  </div>
                </>
              ) : (
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <svg style={{ animation:'pc-spin-slow 1s linear infinite', color:'#a0aec0' }}
                    width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                  </svg>
                  <span style={{ fontSize:11, color:'#a0aec0' }}>Cargando proveedor...</span>
                </div>
              )}
            </div>

          </div>
        </Card3D>
      </motion.div>

      {/* ── MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div className="pc-modal-backdrop"
              initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
              onClick={() => setShowModal(false)} />

            <div className="pc-modal-wrap">
              <motion.div className="pc-modal-box"
                initial={{ opacity:0, y:48, scale:.97 }}
                animate={{ opacity:1, y:0,  scale:1   }}
                exit={{    opacity:0, y:32, scale:.97  }}
                transition={{ duration:.32, ease:[.25,.46,.45,.94] }}
                onClick={e => e.stopPropagation()}>

                {/* Handle móvil */}
                <div className="sm:hidden" style={{ width:36,height:4,borderRadius:2,background:'#e2e8f0',margin:'12px auto 0' }} />

                {/* Imagen modal */}
                <div style={{ position:'relative', height:220,
                  background:`linear-gradient(145deg,${c1}0d,${c2}18)`, overflow:'hidden' }}>
                  {producto.imagen && !imgError
                    ? <img src={`http://localhost:8000/productos/${producto.imagen}`} alt={producto.nombre}
                        style={{ width:'100%',height:'100%',objectFit:'cover' }} />
                    : <div style={{ width:'100%',height:'100%',display:'flex',alignItems:'center',justifyContent:'center' }}>
                        <div className="pc-float-icon" style={{ color:c1, opacity:.18 }}>
                          <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                          </svg>
                        </div>
                      </div>
                  }
                  <div style={{ position:'absolute',inset:0,
                    background:'linear-gradient(to top,rgba(255,255,255,.9) 0%,transparent 50%)',pointerEvents:'none' }} />

                  <button onClick={() => setShowModal(false)}
                    style={{ position:'absolute',top:12,right:12,width:32,height:32,borderRadius:'50%',
                      background:'rgba(255,255,255,.9)',border:'1px solid #e2e8f0',
                      display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',color:'#718096' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 6L6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                {/* Contenido modal */}
                <div style={{ padding:'20px 22px 26px' }}>
                  <p style={{ fontSize:11,fontWeight:600,letterSpacing:'.14em',textTransform:'uppercase',color:'#718096',marginBottom:4 }}>
                    {producto.marca}
                    {producto.modelo && <span style={{ fontFamily:"'JetBrains Mono',monospace" }}> · {producto.modelo}</span>}
                  </p>
                  <h2 style={{ fontSize:22,fontWeight:800,color:'#1a202c',letterSpacing:'-.02em',marginBottom:6,lineHeight:1.2 }}>
                    {producto.nombre}
                  </h2>
                  <p style={{ fontSize:28,fontWeight:800,letterSpacing:'-.03em',marginBottom:14,lineHeight:1,
                    background:`linear-gradient(90deg,${c1},${c2})`,
                    WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                    {price}
                  </p>

                  {producto.descripcion && (
                    <p style={{ fontSize:14,color:'#718096',lineHeight:1.65,marginBottom:18 }}>
                      {producto.descripcion}
                    </p>
                  )}

                  {/* ── Proveedor en modal ── */}
                  <div style={{ background:'#f8faff', border:'1px solid #e8f0fe', borderRadius:16, padding:'14px 16px', marginBottom:18 }}>
                    <p style={{ fontSize:11,fontWeight:600,letterSpacing:'.12em',textTransform:'uppercase',color:'#a0aec0',marginBottom:12 }}>
                      Proveedor
                    </p>
                    {proveedor ? (
                      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                        <div style={{ width:42,height:42,borderRadius:'50%',flexShrink:0,
                          background:`linear-gradient(135deg,${c1},${c2})`,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:17,fontWeight:700,color:'white' }}>
                          {provIni}
                        </div>
                        <div>
                          <p style={{ fontSize:14,fontWeight:700,color:'#1a202c',lineHeight:1.2 }}>{proveedor.name}</p>
                          <p style={{ fontSize:12,color:'#718096' }}>{proveedor.empresa}</p>
                        </div>
                      </div>
                    ) : null}

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                      {proveedor ? (
                        [["Email", proveedor.email], ["Teléfono", proveedor.telefono]].map(([lbl, val]) => (
                          <div key={lbl} className="pc-chip">
                            <p style={{ fontSize:10,color:'#63b3ed',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:2 }}>{lbl}</p>
                            <p style={{ fontSize:12,fontWeight:600,color:'#2b6cb0',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{val || "—"}</p>
                          </div>
                        ))
                      ) : (
                        <div style={{ gridColumn:'1/-1', display:'flex', alignItems:'center', gap:8, color:'#a0aec0', fontSize:13 }}>
                          <svg style={{ animation:'pc-spin-slow 1s linear infinite' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                          </svg>
                          Cargando proveedor...
                        </div>
                      )}
                    </div>
                  </div>

                  <button className="pc-add-btn">Agregar al carrito &nbsp;→</button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProductoCard;