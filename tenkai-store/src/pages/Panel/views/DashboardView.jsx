import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCircle, FaServer, FaShoppingCart, 
  FaSkull, FaWater, FaMedal, 
  FaCompass, FaUsers, FaAngleRight,
  FaTimes, FaCrown,
  FaGlobe, FaCrosshairs, FaAnchor, FaMapMarkedAlt, FaWind
} from 'react-icons/fa';

export default function DashboardView({ announcements = [], serverPlayersCount = 0 }) {
  
  const [openModal, setOpenModal] = useState(null);

  // ---------------- DONNÉES (Thème Bleu/Cyan) ----------------
  const topPrimes = [
    { rank: 1, name: "M. D. LUFFY", amount: "1.5B", color: "#00E5FF", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.3)", avatar: "https://i.pravatar.cc/150?u=Luffy" }, 
    { rank: 2, name: "T. LAW", amount: "1.2B", color: "#00b8ff", bg: "rgba(0, 184, 255, 0.03)", border: "rgba(0, 184, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Law" }, 
    { rank: 3, name: "E. KID", amount: "1.15B", color: "#0088ff", bg: "rgba(0, 136, 255, 0.03)", border: "rgba(0, 136, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Kid" }  
  ];

  const fullPrimes = [
    { rank: 1, name: "MONKEY D. LUFFY", amount: "1,500,000,000", color: "#00E5FF", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.3)", avatar: "https://i.pravatar.cc/150?u=Luffy" }, 
    { rank: 2, name: "TRAFALGAR LAW", amount: "1,200,000,000", color: "#00b8ff", bg: "rgba(0, 184, 255, 0.05)", border: "rgba(0, 184, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Law" }, 
    { rank: 3, name: "EUSTASS KID", amount: "1,150,000,000", color: "#0088ff", bg: "rgba(0, 136, 255, 0.05)", border: "rgba(0, 136, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Kid" },
    { rank: 4, name: "ZORO RORONOA", amount: "1,111,000,000", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Zoro" },
    { rank: 5, name: "JINBE", amount: "1,057,000,000", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Jinbe" },
    { rank: 6, name: "SANJI VINSMOKE", amount: "1,032,000,000", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Sanji" },
    { rank: 7, name: "NICO ROBIN", amount: "930,000,000", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Robin" },
    { rank: 8, name: "USOPP", amount: "500,000,000", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Usopp" },
    { rank: 9, name: "FRANKY", amount: "394,000,000", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Franky" },
    { rank: 10, name: "BROOK", amount: "383,000,000", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Brook" }
  ];

  const fullFortunes = [
    { rank: 1, name: "GOL D. ROGER", amount: "15,000,000", color: "#FFD700", bg: "rgba(255, 215, 0, 0.05)", border: "rgba(255, 215, 0, 0.3)", avatar: "https://i.pravatar.cc/150?u=Roger" },
    { rank: 2, name: "GILD TESORO", amount: "12,500,000", color: "#E0E0E0", bg: "rgba(224, 224, 224, 0.05)", border: "rgba(224, 224, 224, 0.2)", avatar: "https://i.pravatar.cc/150?u=Tesoro" },
    { rank: 3, name: "CROCODILE", amount: "8,200,000", color: "#CD7F32", bg: "rgba(205, 127, 50, 0.05)", border: "rgba(205, 127, 50, 0.2)", avatar: "https://i.pravatar.cc/150?u=Crocodile" },
    { rank: 4, name: "DOFLAMINGO", amount: "7,500,000", color: "#00E5FF", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Doflamingo" },
    { rank: 5, name: "NAMI", amount: "5,000,000", color: "#00E5FF", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Nami" },
    { rank: 6, name: "WARPOL", amount: "3,200,000", color: "#00E5FF", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Warpol" }
  ];

  // --- ANIMATIONS ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    exit: { opacity: 0, filter: 'blur(10px)', transition: { duration: 0.2 } }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { type: 'spring', stiffness: 350, damping: 25 } }
  };

  return (
    <motion.div 
      variants={containerVariants} 
      initial="hidden" 
      animate="visible" 
      exit="exit" 
      className="tk-view-root"
      style={{ position: 'absolute', inset: 0, padding: '2rem', boxSizing: 'border-box', overflow: 'hidden' }}
    >
      
      {/* --- CSS ONE PIECE HIGH-END --- */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&family=Orbitron:wght@400;600;800;900&display=swap');

        .tk-view-root, .tk-dash-card, .tk-data-row, p, span, h1, h2, h3, button {
          font-family: 'Outfit', sans-serif;
        }
        
        .tk-tech-font {
          font-family: 'Orbitron', sans-serif !important;
          letter-spacing: 1px;
        }
        
        .tk-text-metal {
          font-family: 'Outfit', sans-serif !important;
          font-weight: 900;
        }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

        .tk-dash-card {
          position: relative;
          background: linear-gradient(145deg, rgba(4, 10, 22, 0.8) 0%, rgba(2, 6, 14, 0.95) 100%);
          backdrop-filter: blur(30px) saturate(130%);
          border-radius: 16px;
          border: 1px solid rgba(0, 229, 255, 0.08);
          box-shadow: inset 1px 1px 2px rgba(255, 255, 255, 0.05), inset -1px -1px 2px rgba(0, 0, 0, 0.8), 0 15px 35px rgba(0,0,0,0.6);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          overflow: visible; z-index: 1;
        }
        
        .tk-dash-card.clickable { cursor: pointer; }
        .tk-dash-card.clickable:hover, .tk-dash-card:not(.clickable):hover { 
          transform: translateY(-4px); z-index: 10; 
          box-shadow: 0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0, 229, 255, 0.15), inset 1px 1px 2px rgba(255,255,255,0.1); 
        }
        .tk-dash-card.clickable:hover { border-color: rgba(0, 229, 255, 0.3); }
        
        .tk-dash-masked { position: absolute; inset: 0; border-radius: 16px; overflow: hidden; z-index: -1; }
        .tk-dash-masked::before { 
          content:''; position: absolute; top: 0; left: 0; width: 100%; height: 2px; 
          background: linear-gradient(90deg, transparent, rgba(0, 229, 255, 0.6), transparent); 
          opacity: 0.6; transition: 0.4s;
        }
        .tk-dash-card:hover .tk-dash-masked::before { opacity: 1; box-shadow: 0 0 20px rgba(0, 229, 255, 0.9); }

        .tk-nav-grid { 
          position: absolute; inset: 0; pointer-events: none; z-index: 1; 
          background-image: 
            linear-gradient(rgba(0, 229, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 229, 255, 0.04) 1px, transparent 1px);
          background-size: 40px 40px; 
          opacity: 0.6;
        }
        .tk-nav-grid::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(circle at center, transparent 20%, rgba(2,4,8,0.9) 100%);
        }

        /* BOUTON BOUTIQUE PRINCIPAL */
        .tk-btn-play {
          position: relative; overflow: hidden; 
          background: linear-gradient(135deg, var(--cyan-neon) 0%, #0066cc 100%);
          color: #02040A; border: none; border-radius: 12px; font-weight: 900;
          cursor: pointer; transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
          box-shadow: 0 8px 20px rgba(0, 229, 255, 0.3), inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -3px 0 rgba(0,0,0,0.3);
          display: flex; align-items: center; gap: 8px; letter-spacing: 1.5px;
        }
        .tk-btn-play::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); transition: 0.5s ease-in-out; transform: skewX(-25deg); }
        .tk-btn-play:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 12px 30px rgba(0, 229, 255, 0.6), inset 0 2px 0 rgba(255,255,255,0.7), inset 0 -3px 0 rgba(0,0,0,0.3); }
        .tk-btn-play:hover::after { left: 150%; }

        /* BOUTON "EN SAVOIR PLUS" DU FEED */
        .tk-link-btn {
          background: transparent; border: none; color: rgba(0, 229, 255, 0.5);
          font-size: 0.75rem; font-weight: 800; letter-spacing: 1.5px;
          cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 6px;
        }
        .tk-link-btn:hover {
          color: #00E5FF; transform: translateY(-2px); text-shadow: 0 0 10px rgba(0,229,255,0.4);
        }

        /* LIGNES DE DONNÉES */
        .tk-data-row { 
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden;
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
          border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 12px 16px;
          flex-shrink: 0;
        }
        .tk-data-row::before {
          content: ''; position: absolute; left: 0; top: 0; height: 100%; width: 3px;
          background: var(--cyan-neon); opacity: 0.5; transition: 0.3s;
        }
        .tk-data-row:hover { transform: translateX(6px); background: rgba(255, 255, 255, 0.08); border-color: rgba(255,255,255,0.15); box-shadow: 0 5px 15px rgba(0,0,0,0.5); }
        .tk-data-row:hover::before { opacity: 1; box-shadow: 0 0 10px var(--cyan-neon); }
        
        .tk-crosshair { position: absolute; font-size: 10px; color: rgba(0,229,255,0.4); z-index: 5; pointer-events: none; }
        .tk-crosshair.tl { top: 12px; left: 12px; } .tk-crosshair.tr { top: 12px; right: 12px; }
        .tk-crosshair.bl { bottom: 12px; left: 12px; } .tk-crosshair.br { bottom: 12px; right: 12px; }

        /* Custom Scrollbar Magnifique pour les modales */
        .tk-modal-scroll::-webkit-scrollbar { width: 5px; }
        .tk-modal-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; margin: 10px 0; }
        .tk-modal-scroll::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.3); border-radius: 10px; }
        .tk-modal-scroll::-webkit-scrollbar-thumb:hover { background: rgba(0, 229, 255, 0.6); }

        .tk-no-scroll::-webkit-scrollbar { display: none; }
        .tk-no-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="tk-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'minmax(0, 1.8fr) minmax(0, 1fr)', gap: '1.5rem', height: '100%', overflow: 'visible' }}>
        
        {/* =========================================
            1. HERO BANNER
        ========================================= */}
        <motion.div variants={cardVariants} style={{ gridColumn: '1 / span 8', gridRow: '1', position: 'relative', height: '100%' }}>
          <div className="tk-dash-card" style={{ height: '100%', padding: '2rem 3rem', display: 'flex', alignItems: 'center' }}>
            
            <div className="tk-dash-masked" style={{ background: '#010308' }}>
              <div className="tk-nav-grid" />
              <img src="/bg_op.webp" alt="BG" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, mixBlendMode: 'screen', filter: 'contrast(1.2) saturate(1.2)' }} onError={(e)=>e.target.style.display='none'} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(1,3,8,1) 0%, rgba(1,3,8,0.5) 45%, transparent 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(1,3,8,1) 0%, rgba(1,3,8,0) 80%)' }} />
            </div>
            
            <FaCompass className="tk-crosshair tl" /> <FaCompass className="tk-crosshair tr" />

            <img src="/boussole.png" alt="Boussole" style={{ position: 'absolute', right: '-2%', bottom: '-15%', height: '130%', opacity: 0.1, zIndex: 1, objectFit: 'contain', animation: 'spin-slow 120s linear infinite', mixBlendMode: 'screen', pointerEvents: 'none' }} onError={(e)=>e.target.style.display='none'} />
            
            <img 
              src="/render_accueil.webp" 
              alt="Hero" 
              style={{ 
                position: 'absolute', right: '0%', bottom: '0%', 
                maxHeight: '115%', maxWidth: '55%', width: 'auto', height: 'auto', 
                objectFit: 'contain', objectPosition: 'bottom right', 
                filter: 'drop-shadow(-20px 20px 30px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(0,229,255,0.3))', 
                zIndex: 10, pointerEvents: 'none' 
              }} 
              onError={(e)=>e.target.style.display='none'} 
            />

            <div style={{ position: 'relative', zIndex: 15, width: '65%', display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              
              {/* TITRE ÉPIQUE REFONDU */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: '20%', left: '-5%', width: '70%', height: '60%', background: 'rgba(0, 229, 255, 0.25)', filter: 'blur(50px)', zIndex: 0 }} />
                
                <h1 style={{ display: 'flex', flexDirection: 'column', margin: 0, position: 'relative', zIndex: 2 }}>
                  <span style={{ 
                    fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(2.2rem, 3.5vw, 3.5rem)', 
                    lineHeight: 1, letterSpacing: '8px', 
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #A0AAB5 100%)', 
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.8))'
                  }}>
                    TENKAI
                  </span>
                  <span style={{ 
                    fontFamily: 'Outfit', fontWeight: 900, fontSize: 'clamp(3.8rem, 5.5vw, 6.5rem)', 
                    lineHeight: 0.85, letterSpacing: '-1px', 
                    background: 'linear-gradient(180deg, #00E5FF 0%, #0055ff 100%)', 
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', 
                    filter: 'drop-shadow(0 0 15px rgba(0, 229, 255, 0.5)) drop-shadow(0 8px 10px rgba(0,0,0,0.8))',
                    transform: 'translateX(-2px)'
                  }}>
                    ONE PIECE
                  </span>
                </h1>
              </div>
              
              <div style={{ marginTop: '15px', display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                
                {/* SEUL BOUTON D'ACTION (BOUTIQUE) */}
                <button 
                  className="tk-btn-play" 
                  style={{ padding: '16px 36px', fontSize: '1.1rem' }}
                  onClick={() => window.location.href = '/boutique'}
                >
                  <FaShoppingCart fontSize="1.1rem" /> ACCÉDER À LA BOUTIQUE
                </button>

              </div>
            </div>
          </div>
        </motion.div>

        {/* =========================================
            2. RÉSEAU MUSHI
        ========================================= */}
        <motion.div variants={cardVariants} style={{ gridColumn: '9 / span 4', gridRow: '1 / 3', position: 'relative', height: '100%' }}>
          <div className="tk-dash-card" style={{ height: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            
            <div className="tk-dash-masked" style={{ background: 'radial-gradient(circle at top right, rgba(0, 229, 255, 0.05), transparent 60%)' }}>
               <div className="tk-nav-grid" style={{ opacity: 0.3 }} />
            </div>
            
            <FaCrosshairs className="tk-crosshair tr" />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', position: 'relative', zIndex: 10, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                  <FaWater color="#00E5FF" size="1.2rem" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.6))' }} />
                </div>
                <h3 className="tk-text-metal" style={{ fontSize: '1.1rem', margin: 0, letterSpacing: '1px' }}>RÉSEAU MUSHI</h3>
              </div>
              
              <div className="tk-tech-font" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)', padding: '4px 10px', borderRadius: '6px', color: '#00E5FF', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px' }}>
                <FaCircle style={{fontSize: '6px', animation: 'pulse 1s infinite', filter: 'drop-shadow(0 0 5px #00E5FF)'}}/> ÉCOUTE
              </div>
            </div>
            
            {/* Lignes d'annonces (Cliquables + Scrollable si besoin) */}
            <div className="tk-no-scroll" style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 10, flex: 1, overflowY: 'auto', paddingRight: '5px', paddingLeft: '5px' }}>
              {announcements.slice(0, 4).map((ann, idx) => {
                const typeColor = ann.type === 'RP' ? '#c471ed' : ann.type === 'STAFF' ? 'var(--cyan-neon)' : '#00e676';
                return (
                  <div key={ann.id} onClick={() => window.location.href='#'} className="tk-data-row" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer' }}>
                    <style dangerouslySetInnerHTML={{__html:`.tk-data-row-${idx}::before { background: ${typeColor}; } .tk-data-row-${idx}:hover::before { box-shadow: 0 0 10px ${typeColor}; }`}} />
                    
                    <div className="tk-tech-font" style={{ position: 'absolute', right: '10px', top: '-5px', fontSize: '3.5rem', color: 'rgba(255,255,255,0.04)', fontWeight: 900, pointerEvents: 'none', zIndex: 1 }}>0{idx+1}</div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', position: 'relative', zIndex: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ color: typeColor, fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1.5px', background: `${typeColor}15`, padding: '3px 6px', borderRadius: '6px', border: `1px solid ${typeColor}40`, boxShadow: `inset 0 0 8px ${typeColor}20` }}>[{ann.type}]</div>
                        <span className="tk-tech-font" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '1px' }}>LOG: 12:0{idx}</span>
                      </div>
                      <FaAngleRight color="rgba(255,255,255,0.3)" fontSize="0.9rem" />
                    </div>
                    
                    <div style={{ color: '#FFF', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px', position: 'relative', zIndex: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ann.title}</div>
                    <p className="tk-text-muted" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', fontWeight: 500, margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', position: 'relative', zIndex: 2 }}>{ann.desc}</p>
                  </div>
                );
              })}
            </div>
            
            {/* Nouveau bouton "En savoir plus" en bas */}
            <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
              <button className="tk-link-btn" onClick={() => window.location.href='#'}>
                TOUTES LES TRANSMISSIONS <FaAngleRight />
              </button>
            </div>
          </div>
        </motion.div>

        {/* =========================================
            3. TOP FORTUNE
        ========================================= */}
        <motion.div variants={cardVariants} style={{ gridColumn: '1 / span 4', gridRow: '2', position: 'relative', height: '100%' }}>
          <div className="tk-dash-card clickable" onClick={() => setOpenModal('fortune')} style={{ height: '100%', padding: '1.5rem', display: 'flex', alignItems: 'center' }}>
            
            <div className="tk-dash-masked" style={{ background: 'radial-gradient(circle at bottom left, rgba(0, 229, 255, 0.08), transparent 70%)' }}>
              <div className="tk-nav-grid" style={{ opacity: 0.5 }} />
            </div>
            
            <FaCrosshairs className="tk-crosshair bl" />

            <img src="/berry.png" alt="Berry BG" style={{ position: 'absolute', right: '10%', top: '10%', height: '120%', opacity: 0.05, zIndex: 1, objectFit: 'contain', animation: 'spin-slow 60s linear infinite', pointerEvents: 'none', filter: 'grayscale(50%)' }} onError={(e)=>e.target.style.display='none'} />
            
            <div style={{ position: 'relative', zIndex: 10, width: '65%', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCrown color="#00E5FF" fontSize="1rem" style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.6))' }} />
                <div className="tk-tech-font" style={{ color: '#00E5FF', fontSize: '0.8rem', letterSpacing: '3px', fontWeight: 900, textShadow: '0 0 10px rgba(0,229,255,0.4)' }}>TOP FORTUNE</div>
              </div>
              
              <div className="tk-text-metal" style={{ fontSize: '1.6rem', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.8))' }}>GOL D. ROGER</div>
              
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginTop: '4px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', padding: '8px 14px', borderRadius: '12px', boxShadow: 'inset 0 0 20px rgba(0, 229, 255, 0.15)' }}>
                <img src="/berry.png" alt="Berry" style={{ width: '22px', height: '22px', filter: 'drop-shadow(0 0 8px rgba(255,215,0,0.6))', animation: 'float 3s ease-in-out infinite' }} onError={(e)=>{e.target.style.display='none';}} />
                <span className="tk-tech-font" style={{ fontSize: '1.4rem', fontWeight: 900, background: 'linear-gradient(180deg, #FFD700 0%, #FFF 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.4))', lineHeight: 1 }}>15,000,000</span>
              </div>
            </div>
            
            <img src="/render_roger.webp" className="tk-oob-char" style={{ position: 'absolute', right: '0%', bottom: '0%', maxHeight: '145%', maxWidth: '50%', width: 'auto', height: 'auto', objectFit: 'contain', objectPosition: 'bottom right', filter: 'drop-shadow(-10px 10px 20px rgba(0,0,0,0.9)) drop-shadow(0 0 25px rgba(0,229,255,0.2))', zIndex: 10, pointerEvents: 'none' }} alt="Roger" onError={(e)=>e.target.style.display='none'} />
          </div>
        </motion.div>

        {/* =========================================
            4. PRIME LEADERBOARD (AUCUN SCROLL ICI)
        ========================================= */}
        <motion.div variants={cardVariants} style={{ gridColumn: '5 / span 4', gridRow: '2', position: 'relative', height: '100%' }}>
          <div className="tk-dash-card clickable" onClick={() => setOpenModal('prime')} style={{ height: '100%', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
            
            <div className="tk-dash-masked" style={{ background: 'radial-gradient(circle at bottom right, rgba(0, 229, 255, 0.08), transparent 80%)' }}>
              <div className="tk-nav-grid" style={{ opacity: 0.3 }} />
              <div style={{ position: 'absolute', right: '5%', top: '30%', fontSize: '4.5rem', fontFamily: 'Orbitron', fontWeight: 900, color: 'rgba(0, 229, 255, 0.03)', transform: 'rotate(-10deg)', pointerEvents: 'none', zIndex: 0 }}>WANTED</div>
            </div>
            
            <FaCrosshairs className="tk-crosshair br" />

            <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                 <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '6px', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                    <FaSkull color="#00E5FF" fontSize="1.1rem" style={{ filter: 'drop-shadow(0 0 8px rgba(0, 229, 255, 0.6))' }}/>
                 </div>
                 <h3 className="tk-text-metal" style={{ margin: 0, fontSize: '1.1rem', color: '#FFF' }}>ARCHIVES DES PRIMES</h3>
              </div>
              
              {/* PLUS DE SCROLL ICI. Uniquement le top 3 bien centré. */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflow: 'hidden', justifyContent: 'center' }}>
                {topPrimes.slice(0, 3).map((prime) => (
                  <div key={prime.rank} className="tk-data-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: prime.bg, border: `1px solid ${prime.border}`, padding: '6px 12px' }}>
                    <style dangerouslySetInnerHTML={{__html:`.tk-data-row-${prime.rank}::before { background: ${prime.color}; }`}} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                      <div className="tk-tech-font" style={{ color: prime.color, fontWeight: 900, fontSize: '0.9rem', width: '18px', textShadow: `0 0 8px ${prime.color}80` }}>#{prime.rank}</div>
                      
                      <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: `1px solid ${prime.border}`, overflow: 'hidden', flexShrink: 0, boxShadow: `0 0 10px ${prime.color}30` }}>
                        <img src={prime.avatar} alt={prime.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
                      </div>

                      <div className="tk-tech-font" style={{ color: 'var(--text-main)', fontSize: '0.85rem', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prime.name}</div>
                    </div>
                    
                    <div className="tk-tech-font" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: prime.color, fontWeight: 800, fontSize: '0.9rem', flexShrink: 0, textShadow: `0 0 8px ${prime.color}60` }}>
                      {prime.amount} <img src="/berry.png" alt="B" style={{ width: '12px', opacity: 0.8 }} onError={(e)=>e.target.style.display='none'}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* =======================================================
          MODALES DE CLASSEMENT (AVEC SCROLL)
      ======================================================= */}
      <AnimatePresence>
        {openModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(1, 2, 5, 0.85)', backdropFilter: 'blur(20px)' }} onClick={() => setOpenModal(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20, filter: 'blur(10px)' }} 
              animate={{ scale: 1, opacity: 1, y: 0, filter: 'blur(0px)' }} 
              exit={{ scale: 0.95, opacity: 0, y: 15, filter: 'blur(5px)' }} 
              transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()} 
              style={{ 
                position: 'relative', width: '550px', height: '70vh', maxHeight: '750px', display: 'flex', flexDirection: 'column', 
                padding: '2rem', borderRadius: '24px', border: `1px solid rgba(0,229,255,0.2)`, 
                borderTop: `2px solid ${openModal === 'fortune' ? '#FFD700' : '#00E5FF'}`, 
                background: 'linear-gradient(145deg, rgba(8, 12, 22, 0.95) 0%, rgba(2, 4, 8, 0.98) 100%)',
                boxShadow: `0 30px 60px rgba(0,0,0,0.9), 0 0 40px ${openModal === 'fortune' ? 'rgba(0,229,255,0.15)' : 'rgba(0,229,255,0.15)'}, inset 1px 1px 2px rgba(255,255,255,0.05)`,
                overflow: 'hidden' 
              }}
            >
              <div className="tk-dash-masked">
                 <div className="tk-nav-grid" style={{ opacity: 0.4 }} />
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `radial-gradient(circle at top, ${openModal === 'fortune' ? 'rgba(0,229,255,0.08)' : 'rgba(0,229,255,0.08)'}, transparent 60%)`, pointerEvents: 'none' }} />
              </div>

              {/* HEADER MODAL */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.2rem', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10, flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ background: openModal === 'fortune' ? 'rgba(255,215,0,0.1)' : 'rgba(0,229,255,0.1)', padding: '10px', borderRadius: '12px', border: `1px solid ${openModal === 'fortune' ? 'rgba(255,215,0,0.3)' : 'rgba(0,229,255,0.3)'}` }}>
                    {openModal === 'fortune' ? <FaCrown color="#FFD700" fontSize="1.8rem" style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.6))' }} /> : <FaSkull color="#00E5FF" fontSize="1.8rem" style={{ filter: 'drop-shadow(0 0 10px rgba(0,229,255,0.6))' }} />}
                  </div>
                  <div>
                    <h2 className="tk-text-metal" style={{ fontSize: '1.4rem', margin: 0, letterSpacing: '2px', lineHeight: 1 }}>
                      {openModal === 'fortune' ? 'FORTUNES MONDIALES' : 'AFFICHES WANTED'}
                    </h2>
                    <div className="tk-tech-font" style={{ color: openModal === 'fortune' ? '#FFD700' : '#00E5FF', fontSize: '0.8rem', letterSpacing: '1px', marginTop: '4px' }}>// REGISTRE DE LA MARINE</div>
                  </div>
                </div>
                
                <button 
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: '0.3s' }} 
                  onMouseOver={(e)=>{e.currentTarget.style.color='#00E5FF'; e.currentTarget.style.background='rgba(0,229,255,0.1)'; e.currentTarget.style.borderColor='rgba(0,229,255,0.3)'; e.currentTarget.style.transform='scale(1.05)';}} 
                  onMouseOut={(e)=>{e.currentTarget.style.color='rgba(255,255,255,0.5)'; e.currentTarget.style.background='rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'; e.currentTarget.style.transform='scale(1)';}} 
                  onClick={() => setOpenModal(null)}
                >
                  <FaTimes fontSize="1.2rem" />
                </button>
              </div>

              {/* LISTE SCROLLABLE ACTIVE POUR LA MODALE */}
              <div className="tk-modal-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '10px', paddingTop: '10px', paddingBottom: '10px', position: 'relative', zIndex: 10 }}>
                {(openModal === 'fortune' ? fullFortunes : fullPrimes).map(item => (
                   <div key={item.rank} className="tk-data-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: item.bg || 'rgba(255,255,255,0.02)', border: `1px solid ${item.border || 'rgba(255,255,255,0.05)'}` }}>
                    
                    <style dangerouslySetInnerHTML={{__html:`.tk-modal-row-${item.rank}::before { background: ${item.color}; }`}} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <div className="tk-tech-font" style={{ color: item.color, fontWeight: 900, fontSize: '1.2rem', width: '30px', textAlign: 'center', textShadow: `0 0 10px ${item.color}80` }}>#{item.rank}</div>
                      
                      {item.avatar && (
                        <div style={{ width: '40px', height: '40px', borderRadius: '8px', border: `2px solid ${item.border}`, overflow: 'hidden', flexShrink: 0, boxShadow: `0 0 15px ${item.color}40` }}>
                          <img src={item.avatar} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}

                      <div className="tk-tech-font" style={{ color: '#FFF', fontSize: '1.1rem', letterSpacing: '1px' }}>{item.name}</div>
                    </div>
                    
                    <div className="tk-tech-font" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: item.color, fontWeight: 800, fontSize: '1.2rem', textShadow: `0 0 10px ${item.color}60` }}>
                      {item.amount} <img src="/berry.png" alt="B" style={{ width: '16px', opacity: 0.9 }} onError={(e)=>e.target.style.display='none'}/>
                    </div>
                  </div>
                ))}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}