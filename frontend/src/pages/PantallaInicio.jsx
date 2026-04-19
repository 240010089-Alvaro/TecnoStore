import React, { useState, useEffect, useRef } from "react";
import { 
  IonContent, 
  IonPage, 
  useIonRouter,
  IonModal,
  IonIcon,
  IonPopover
} from '@ionic/react';
import { 
  flashOutline, 
  cartOutline, 
  chevronDownOutline, 
  personOutline, 
  listOutline, 
  logOutOutline,
  closeOutline,
  addOutline
} from 'ionicons/icons';
import { useCart } from '../context/CartContext';
import CartModal from '../components/CartModal';
import ClientSettingsModal from '../components/ClientSettingsModal';
import './PantallaInicio.css';

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

const PantallaInicio = () => {
  const router = useIonRouter();
  const [user, setUser] = useState(null);
  const { cartItemCount } = useCart();
  const [showCart, setShowCart] = useState(false);
  
  // Ionic Overlays states
  const [popoverState, setPopoverState] = useState({ show: false, event: undefined });
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    if (!u) {
      router.push("/login", "back", "replace");
      return;
    }
    setUser(u);
  }, []);

  const inicial = user?.name?.charAt(0).toUpperCase() ?? "?";

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.replace("/"); // Recargo duro para asegurar destrucción de estado de sesión
  };

  return (
    <IonPage>
      <IonContent fullscreen className="pi-ion-content">
        <div className="pi-wrap">
          {/* Fondo */}
          <div className="pi-hex" />
          <div className="pi-noise" />
          <div className="pi-scan" />
          <div className="pi-orb pi-orb-1" />
          <div className="pi-orb pi-orb-2" />
          <div className="pi-orb pi-orb-3" />

          {/* NAVBAR */}
          <nav className="pi-nav">
            <div className="pi-nav-logo" onClick={() => router.push("/PantallaInicio")} style={{ display:'flex', alignItems:'center', gap:'15px' }}>
              <img src="/Logo-TecnoStore.png" alt="TecnoStore Logo" style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
              <span className="pi-nav-brand">TecnoStore</span>
            </div>

            <div className="pi-nav-links">
              <button className="pi-nav-link active">Inicio</button>
              <button className="pi-nav-link" onClick={() => router.push("/productos")}>Productos</button>
              <button className="pi-nav-link">Categorías</button>
              <button className="pi-nav-link">Ofertas</button>
            </div>

            <div className="pi-nav-right">
              <div className="pi-cart-btn" onClick={() => setShowCart(true)}>
                <IonIcon icon={cartOutline} style={{ fontSize: '20px' }} />
                {cartItemCount > 0 && (
                  <span className="pi-cart-badge">{cartItemCount}</span>
                )}
              </div>

              <div className="pi-avatar-btn" onClick={(e) => setPopoverState({ show: true, event: e.nativeEvent })}>
                {user?.avatar ? (
                  <img src={`http://localhost:8000/avatars/${user.avatar}`} alt="Avatar" className="pi-avatar-img" />
                ) : (
                  <div className="pi-avatar">{inicial}</div>
                )}
                <span className="pi-avatar-name">{user?.name?.split(" ")[0] ?? "Usuario"}</span>
                <IonIcon icon={chevronDownOutline} style={{ color: 'rgba(148,163,184,.5)', fontSize: '14px' }} />
              </div>
            </div>
          </nav>

          {/* HERO */}
          <section className="pi-hero">
            <div className="pi-hero-left">
              <div className="pi-hero-eyebrow">
                <span className="pi-eyebrow-dot" />
                Nuevas ofertas cada semana
              </div>

              <h1 className="pi-hero-title">
                La tecnología<br /><span className="gr">que necesitas</span>
              </h1>

              <p className="pi-hero-sub">
                Descubre los últimos productos en tecnología con los mejores precios del mercado, envío express y garantía oficial.
              </p>

              <div className="pi-hero-btns">
                <button className="pi-btn-primary" onClick={() => router.push("/productos")}>
                  Explorar productos <img src="/Logo-TecnoStore.png" alt="Logo" style={{ width: '28px', height: '28px', marginLeft: '10px' }}/>
                </button>
                <button className="pi-btn-ghost">
                  Ver ofertas
                </button>
              </div>

              <div className="pi-hero-stats">
                {[{n:"500+",l:"Productos"},{n:"50k+",l:"Clientes"},{n:"4.9★",l:"Rating"}].map(({ n, l }) => (
                  <div key={l} className="pi-stat-item">
                    <div className="pi-stat-num">{n}</div>
                    <div className="pi-stat-lbl">{l}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pi-hero-img-wrap">
              <div className="pi-hero-img">
                <img src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=85" alt="MacBook" />
              </div>

              <div className="pi-chip pi-chip-1">
                <div className="pi-chip-lbl">Envío gratis</div>
                <div className="pi-chip-val">En compras +$500 🚀</div>
              </div>

              <div className="pi-chip pi-chip-2">
                <div className="pi-chip-lbl">Garantía</div>
                <div className="pi-chip-val" style={{ color:"#34d399" }}>1 año ✓</div>
              </div>
            </div>
          </section>

          {/* MARQUEE */}
          <div className="pi-marquee">
            <div className="pi-marquee-track">
              {[...MARQUEE, ...MARQUEE].map((item, i) => (
                <div key={i} className="pi-marquee-item">
                  {item}<span className="pi-mq-dot" />
                </div>
              ))}
            </div>
          </div>

          {/* CATEGORÍAS */}
          <section className="pi-section">
            <p className="pi-section-eye">Explorar</p>
            <h2 className="pi-section-title">Categorías <em>populares</em></h2>
            <div className="pi-cats-grid">
              {CATS.map(({ emoji, name, count, color, bg }) => (
                <div key={name} className="pi-cat-card" onClick={() => router.push("/productos")}>
                  <div className="pi-cat-ico" style={{ background:bg, border:`1px solid ${color}30` }}>{emoji}</div>
                  <p className="pi-cat-name">{name}</p>
                  <p className="pi-cat-count">{count} items</p>
                </div>
              ))}
            </div>
          </section>

          {/* FEATURED */}
          <section className="pi-section">
            <p className="pi-section-eye">Destacados</p>
            <h2 className="pi-section-title">Productos <em>premium</em></h2>
            <div className="pi-feat-grid">
              {FEATURED.map((p, i) => (
                <div key={i} className="pi-feat-card" onClick={() => router.push("/productos")}>
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
                        <IonIcon icon={addOutline} style={{ fontSize: '20px' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign:"center", marginTop: 40 }}>
              <button className="pi-btn-ghost" onClick={() => router.push("/productos")}>
                Ver catálogo completo →
              </button>
            </div>
          </section>
        </div>

        {/* Ionic Overlays */}
        {/* Menú Avartar Premium (Popover) */}
        <IonPopover
          isOpen={popoverState.show}
          event={popoverState.event}
          onDidDismiss={() => setPopoverState({ show: false, event: undefined })}
          className="user-menu-popover"
          alignment="end"
          side="bottom"
          keyboardClose={false}
        >
          <div className="ump-container">
            <div className="ump-header">
              <span className="ump-name">{user?.name ?? 'Usuario'}</span>
              <span className="ump-email">{user?.email ?? ''}</span>
            </div>
            
            <div className="ump-divider" />
            
            <div className="ump-actions">
              <button 
                className="ump-btn" 
                onClick={() => { setPopoverState({ show: false }); setShowProfileModal(true); }}
              >
                <div className="ump-btn-icon"><IonIcon icon={personOutline} /></div>
                <span>Mi perfil</span>
              </button>
              
              <button 
                className="ump-btn" 
                onClick={() => { setPopoverState({ show: false }); router.push('/productos'); }}
              >
                <div className="ump-btn-icon"><IonIcon icon={listOutline} /></div>
                <span>Ir al catálogo</span>
              </button>
            </div>
            
            <div className="ump-divider" />
            
            <div className="ump-actions">
              <button 
                className="ump-btn ump-danger" 
                onClick={() => { setPopoverState({ show: false }); setShowLogoutAlert(true); }}
              >
                <div className="ump-btn-icon"><IonIcon icon={logOutOutline} /></div>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </IonPopover>

        {/* Modal Confirmación Logout Premium Centrado */}
        <IonModal 
          isOpen={showLogoutAlert} 
          onDidDismiss={() => setShowLogoutAlert(false)} 
          className="logout-modal-premium center-modal"
          backdropDismiss={true}
        >
          <div className="lm-container">
            <div className="lm-icon-wrapper">
              <div className="lm-icon-bg pulse-anim">
                <IonIcon icon={logOutOutline} className="lm-icon" />
              </div>
            </div>
            
            <h2 className="lm-title">¿Cerrar sesión?</h2>
            <p className="lm-subtitle">
              Estás a punto de salir de tu cuenta personal. Tendrás que ingresar tus credenciales nuevamente para acceder.
            </p>
            
            <div className="lm-actions">
              <button className="lm-btn lm-btn-cancel" onClick={() => setShowLogoutAlert(false)}>
                Mejor me quedo
              </button>
              <button className="lm-btn lm-btn-confirm" onClick={handleLogout}>
                Sí, salir
                <IonIcon icon={logOutOutline} style={{ marginLeft: '6px' }} />
              </button>
            </div>
          </div>
        </IonModal>

        {/* Client Settings Modal */}
        <ClientSettingsModal 
          isOpen={showProfileModal} 
          onDismiss={() => setShowProfileModal(false)} 
          user={user}
          onUpdateUser={(updatedUser) => setUser(updatedUser)}
        />

        {/* Cart Modal — uses same context as Productos page */}
        <CartModal isOpen={showCart} onDismiss={() => setShowCart(false)} />

      </IonContent>
    </IonPage>
  );
};

export default PantallaInicio;
