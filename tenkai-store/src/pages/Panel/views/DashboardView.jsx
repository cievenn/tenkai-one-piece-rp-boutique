import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCircle, FaServer, FaGamepad, FaShoppingCart, 
  FaCoins, FaSkull, FaBullhorn, FaMedal, FaSignal, 
  FaCrosshairs, FaPlay, FaUsers, FaAngleRight,
  FaExpand, FaTimes
} from 'react-icons/fa';

export default function DashboardView({ variants, announcements = [], serverPlayersCount = 0 }) {
  
  const [openModal, setOpenModal] = useState(null); // 'fortune' | 'prime' | null

  // ---------------- DONNÉES TOP 3 (MINIATURES) ----------------
  const topPrimes = [
    { rank: 1, name: "M. D. LUFFY", amount: "1.5B ฿", color: "#FFD700", bg: "rgba(255, 215, 0, 0.08)", border: "rgba(255, 215, 0, 0.3)", avatar: "https://i.pravatar.cc/150?u=Luffy" }, 
    { rank: 2, name: "T. LAW", amount: "1.2B ฿", color: "#E0E0E0", bg: "rgba(224, 224, 224, 0.05)", border: "rgba(224, 224, 224, 0.2)", avatar: "https://i.pravatar.cc/150?u=Law" }, 
    { rank: 3, name: "E. KID", amount: "1.15B ฿", color: "#CD7F32", bg: "rgba(205, 127, 50, 0.05)", border: "rgba(205, 127, 50, 0.2)", avatar: "https://i.pravatar.cc/150?u=Kid" }  
  ];

  // ---------------- DONNÉES COMPLÈTES (POUR LES MODALES) ----------------
  const fullPrimes = [
    { rank: 1, name: "MONKEY D. LUFFY", amount: "1,500,000,000 ฿", color: "#FFD700", bg: "rgba(255, 215, 0, 0.08)", border: "rgba(255, 215, 0, 0.3)", avatar: "https://i.pravatar.cc/150?u=Luffy" }, 
    { rank: 2, name: "TRAFALGAR LAW", amount: "1,200,000,000 ฿", color: "#E0E0E0", bg: "rgba(224, 224, 224, 0.05)", border: "rgba(224, 224, 224, 0.2)", avatar: "https://i.pravatar.cc/150?u=Law" }, 
    { rank: 3, name: "EUSTASS KID", amount: "1,150,000,000 ฿", color: "#CD7F32", bg: "rgba(205, 127, 50, 0.05)", border: "rgba(205, 127, 50, 0.2)", avatar: "https://i.pravatar.cc/150?u=Kid" },
    { rank: 4, name: "ZORO RORONOA", amount: "1,111,000,000 ฿", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Zoro" },
    { rank: 5, name: "JINBE", amount: "1,057,000,000 ฿", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Jinbe" },
    { rank: 6, name: "SANJI VINSMOKE", amount: "1,032,000,000 ฿", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Sanji" }
  ];

  const fullFortunes = [
    { rank: 1, name: "GOL D. ROGER", amount: "15,000,000 ฿", color: "#FFD700", bg: "rgba(255, 215, 0, 0.08)", border: "rgba(255, 215, 0, 0.3)", avatar: "https://i.pravatar.cc/150?u=Roger" },
    { rank: 2, name: "GILD TESORO", amount: "12,500,000 ฿", color: "#E0E0E0", bg: "rgba(224, 224, 224, 0.05)", border: "rgba(224, 224, 224, 0.2)", avatar: "https://i.pravatar.cc/150?u=Tesoro" },
    { rank: 3, name: "CROCODILE", amount: "8,200,000 ฿", color: "#CD7F32", bg: "rgba(205, 127, 50, 0.05)", border: "rgba(205, 127, 50, 0.2)", avatar: "https://i.pravatar.cc/150?u=Crocodile" },
    { rank: 4, name: "DOFLAMINGO", amount: "7,500,000 ฿", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Doflamingo" },
    { rank: 5, name: "NAMI", amount: "5,000,000 ฿", color: "var(--cyan-neon)", bg: "rgba(0, 229, 255, 0.05)", border: "rgba(0, 229, 255, 0.2)", avatar: "https://i.pravatar.cc/150?u=Nami" }
  ];

  return (
    <motion.div 
      variants={variants} 
      initial="hidden" 
      animate="visible" 
      exit="exit" 
      className="view-container"
      // 🔒 VERROUILLAGE ABSOLU : Aucun scroll autorisé, 100% visible
      style={{ position: 'absolute', inset: 0, padding: '1.5rem 2.5rem', boxSizing: 'border-box', overflow: 'hidden' }}
    >
      
      {/* --- CSS ULTRA-PREMIUM LOCAL --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .tk-premium-card {
          position: relative;
          background: linear-gradient(145deg, rgba(12, 18, 30, 0.6) 0%, rgba(4, 8, 14, 0.9) 100%);
          backdrop-filter: blur(30px) saturate(150%);
          border-radius: 20px;
          box-shadow: inset 1px 1px 1px rgba(255, 255, 255, 0.1), inset -1px -1px 2px rgba(0, 0, 0, 0.8), 0 20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0, 229, 255, 0.05);
          overflow: visible; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); z-index: 1;
        }
        .tk-premium-card:hover { transform: translateY(-4px); z-index: 10; }
        
        .tk-premium-inner { position: absolute; inset: 0; border-radius: 20px; overflow: hidden; z-index: -1; border-top: 1px solid rgba(0, 229, 255, 0.5); }
        .tk-premium-card:hover .tk-premium-inner { box-shadow: 0 30px 50px rgba(0,0,0,0.9), 0 0 40px rgba(0, 229, 255, 0.15); border-top: 1px solid rgba(0, 229, 255, 0.8); }

        .tk-tech-grid { position: absolute; inset: 0; pointer-events: none; z-index: 1; background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 15px 15px; }

        /* BOUTON PLAY ULTIME */
        .tk-btn-play {
          position: relative; overflow: hidden; background: linear-gradient(135deg, var(--cyan-neon) 0%, #0055ff 100%);
          color: #02040A; border: none; border-radius: 12px; font-weight: 900; font-family: 'Rajdhani', sans-serif;
          cursor: pointer; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 25px rgba(0, 229, 255, 0.4), inset 0 2px 0 rgba(255,255,255,0.5);
          display: flex; align-items: center; gap: 10px; letter-spacing: 1px;
        }
        .tk-btn-play::after { content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent); transition: 0.5s ease-in-out; transform: skewX(-25deg); }
        .tk-btn-play:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 35px rgba(0, 229, 255, 0.6), inset 0 2px 0 rgba(255,255,255,0.7); }
        .tk-btn-play:hover::after { left: 150%; }

        .tk-crosshair { position: absolute; font-size: 10px; color: rgba(0,229,255,0.4); z-index: 5; pointer-events: none; }
        .tk-crosshair.tl { top: 15px; left: 15px; } .tk-crosshair.tr { top: 15px; right: 15px; }
        .tk-crosshair.bl { bottom: 15px; left: 15px; } .tk-crosshair.br { bottom: 15px; right: 15px; }

        .tk-list-row { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .tk-list-row:hover { transform: translateX(6px); background-color: rgba(255, 255, 255, 0.05) !important; box-shadow: 0 5px 15px rgba(0,0,0,0.5); }

        /* Bouton Holographique "Voir Tout" */
        .tk-view-more-btn {
          position: absolute; top: 15px; right: 15px; z-index: 20;
          display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 8px; 
          font-size: 0.65rem; font-weight: 800; color: var(--text-muted); 
          cursor: pointer; transition: 0.3s; letter-spacing: 1px; backdrop-filter: blur(5px);
        }
        .tk-view-more-btn:hover { background: rgba(0, 229, 255, 0.15); border-color: var(--cyan-neon); color: var(--cyan-neon); transform: scale(1.05); }
        
        /* Modal Scroll Custom */
        .tk-modal-scroll::-webkit-scrollbar { width: 6px; }
        .tk-modal-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
        .tk-modal-scroll::-webkit-scrollbar-thumb { background: rgba(0, 229, 255, 0.3); border-radius: 10px; }
        .tk-modal-scroll::-webkit-scrollbar-thumb:hover { background: var(--cyan-neon); }
      `}} />

      {/* LE GRID SYSTÈME PRINCIPAL (ASYMÉTRIE AAA) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gridTemplateRows: 'minmax(0, 1.4fr) minmax(0, 1fr)', gap: '1.5rem', height: '100%' }}>
        
        {/* 1. HERO BANNER (Haut Gauche) */}
        <div className="tk-premium-card" style={{ gridColumn: '1 / span 8', gridRow: '1', display: 'flex', alignItems: 'center', padding: '1.5rem 2.5rem', minHeight: 0 }}>
          <div className="tk-premium-inner" style={{ background: '#02050A' }}>
            <div className="tk-tech-grid" />
            <img src="/bg_op.webp" alt="BG" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, mixBlendMode: 'screen', filter: 'contrast(1.1) saturate(1.2)' }} onError={(e)=>e.target.style.display='none'} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2,4,8,0.95) 0%, rgba(2,4,8,0.5) 60%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,4,8,1) 0%, rgba(2,4,8,0.1) 70%, transparent 100%)' }} />
          </div>
          
          <FaCrosshairs className="tk-crosshair tl" /> <FaCrosshairs className="tk-crosshair tr" />

          {/* PERSONNAGE GÉRÉ POUR NE PAS CASSER L'ÉCRAN */}
          <img src="/render_accueil.webp" className="tk-oob-char" style={{ right: '-2%', height: '115%', maxWidth: '50%', bottom: '0', objectPosition: 'bottom right', filter: 'drop-shadow(-20px 20px 30px rgba(0,0,0,0.9)) drop-shadow(0 0 25px rgba(0,229,255,0.3))' }} alt="Hero" onError={(e)=>e.target.style.display='none'} />

          <div style={{ position: 'relative', zIndex: 10, width: '65%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 230, 118, 0.15)', border: '1px solid rgba(0, 230, 118, 0.4)', padding: '5px 12px', borderRadius: '8px', color: '#00e676', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', boxShadow: '0 0 15px rgba(0,230,118,0.2)', backdropFilter: 'blur(5px)' }}>
                <FaCircle style={{ fontSize: '6px', animation: 'pulse 2s infinite' }}/> SYS_ONLINE
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 229, 255, 0.15)', border: '1px solid rgba(0, 229, 255, 0.3)', padding: '5px 12px', borderRadius: '8px', color: 'var(--cyan-neon)', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', backdropFilter: 'blur(5px)' }}>
                <FaServer /> V 2.0.4
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '5px 12px', borderRadius: '8px', color: '#FFF', fontSize: '0.65rem', fontWeight: 800, letterSpacing: '1px', backdropFilter: 'blur(5px)' }}>
                <FaSignal color="var(--text-muted)"/> 12MS
              </div>
            </div>
            
            <div>
              <div className="tk-tech-font" style={{ color: 'var(--cyan-neon)', fontSize: '0.75rem', letterSpacing: '3px', marginBottom: '4px', textShadow: '0 0 10px rgba(0,229,255,0.5)' }}>// PROTOCOLE D'IMMERSION ACTIVÉ</div>
              <h1 className="tk-text-metal" style={{ fontSize: 'clamp(2.5rem, 3.5vw, 4.2rem)', lineHeight: 1, margin: 0, letterSpacing: '2px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.8))' }}>
                TENKAI <br/>
                <span style={{ background: 'linear-gradient(180deg, var(--cyan-neon) 0%, #0066cc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.6))' }}>ONE PIECE</span>
              </h1>
            </div>
            
            <div style={{ marginTop: '10px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button className="tk-btn-play" style={{ padding: '12px 24px', fontSize: '1rem' }}><FaPlay fontSize="0.9rem" /> REJOINDRE</button>
              <button className="tk-btn-secondary" style={{ padding: '12px 20px', fontSize: '0.95rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}><FaShoppingCart /> BOUTIQUE</button>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px', background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4))', padding: '8px 15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(15px)', boxShadow: 'inset 0 0 15px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'relative', width: '35px', height: '35px', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cyan-neon)', border: '1px solid rgba(0,229,255,0.3)', boxShadow: '0 0 15px rgba(0,229,255,0.2)' }}>
                  <FaUsers fontSize="1rem" />
                  <div style={{ position: 'absolute', top: '-3px', right: '-3px', width: '8px', height: '8px', background: '#00e676', borderRadius: '50%', boxShadow: '0 0 10px #00e676', border: '2px solid #040914' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <span className="tk-text-muted tk-tech-font" style={{ fontSize: '0.6rem', letterSpacing: '2px', lineHeight: 1 }}>RESEAU_LOCAL</span>
                  <span className="tk-text-metal" style={{ fontSize: '1.2rem', lineHeight: 1, marginTop: '4px' }}>{serverPlayersCount} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ 128</span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TRANSMISSIONS (Prend TOUTE la Droite - 4 Cols, 2 Lignes) */}
        <div className="tk-premium-card" style={{ gridColumn: '9 / span 4', gridRow: '1 / 3', padding: '1.5rem', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="tk-premium-inner" style={{ borderTopColor: '#ff4757', background: 'radial-gradient(circle at top right, rgba(255,71,87,0.05), transparent 70%)' }}>
             <div className="tk-tech-grid" style={{ opacity: 0.4 }} />
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 51%)', backgroundSize: '100% 4px', mixBlendMode: 'overlay' }} />
          </div>
          <FaCrosshairs className="tk-crosshair tr" style={{ color: 'rgba(255,71,87,0.4)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', position: 'relative', zIndex: 10, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBullhorn color="#ff4757" style={{ filter: 'drop-shadow(0 0 8px rgba(255,71,87,0.6))' }} />
              <h3 className="tk-text-metal" style={{ fontSize: '1.1rem', margin: 0 }}>FEED_INTERCEPTÉ</h3>
            </div>
            
            <div className="tk-tech-font" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ff4757', fontSize: '0.65rem', background: 'rgba(255, 71, 87, 0.1)', padding: '4px 8px', borderRadius: '6px', border: '1px solid rgba(255, 71, 87, 0.3)' }}>
              <FaCircle style={{fontSize: '5px', animation: 'pulse 1.5s infinite'}}/> EN DIRECT
            </div>
          </div>
          
          <div style={{ height: '1px', width: '100%', background: 'linear-gradient(90deg, rgba(255,71,87,0.4), transparent)', marginBottom: '15px' }} />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 10, flex: 1, overflow: 'hidden' }}>
            {announcements.slice(0, 3).map((ann, idx) => {
              const typeColor = ann.type === 'RP' ? '#c471ed' : ann.type === 'STAFF' ? 'var(--cyan-neon)' : '#00e676';
              return (
                <div key={ann.id} className="tk-list-row" style={{ position: 'relative', background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `3px solid ${typeColor}`, borderRadius: '12px', padding: '1.2rem', cursor: 'pointer', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="tk-tech-font" style={{ position: 'absolute', right: '10px', top: '0', fontSize: '3rem', color: 'rgba(255,255,255,0.02)', fontWeight: 900, pointerEvents: 'none' }}>0{idx+1}</div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', position: 'relative', zIndex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ color: typeColor, fontSize: '0.65rem', fontWeight: 900, letterSpacing: '1px', background: `${typeColor}20`, padding: '2px 6px', borderRadius: '6px', border: `1px solid ${typeColor}40` }}>[{ann.type}]</div>
                      <span className="tk-tech-font" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', letterSpacing: '1px' }}>T-MINUS 12:0{idx}</span>
                    </div>
                    <FaAngleRight color="rgba(255,255,255,0.2)" fontSize="0.9rem" />
                  </div>
                  
                  <div style={{ color: '#FFF', fontWeight: 800, fontSize: '0.9rem', marginBottom: '4px', position: 'relative', zIndex: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ann.title}</div>
                  <p className="tk-text-muted" style={{ fontSize: '0.75rem', margin: 0, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', position: 'relative', zIndex: 2 }}>{ann.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. TOP FORTUNE (Bas Gauche - 4 Colonnes) */}
        <div className="tk-premium-card" style={{ gridColumn: '1 / span 4', gridRow: '2', padding: '1.5rem', display: 'flex', alignItems: 'center', minHeight: 0 }}>
          <div onClick={() => setOpenModal('fortune')} className="tk-view-more-btn"><FaExpand /> VOIR TOUT</div>
          <div className="tk-premium-inner" style={{ borderTopColor: 'rgba(255, 215, 0, 0.4)' }}>
            <div className="tk-tech-grid" style={{ opacity: 0.3 }} />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at bottom left, rgba(255,215,0,0.1), transparent 70%)', zIndex: 0 }} />
          </div>
          
          <FaCrosshairs className="tk-crosshair bl" style={{ color: 'rgba(255,215,0,0.3)' }} />
          
          <div style={{ position: 'relative', zIndex: 10, width: '70%', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div className="tk-tech-font" style={{ color: '#FFD700', fontSize: '0.65rem', letterSpacing: '2px', fontWeight: 900 }}>// CIBLE ALPHA</div>
            <div className="tk-text-metal" style={{ fontSize: '1.3rem', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>GOL D. ROGER</div>
            
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '6px', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255, 215, 0, 0.2)', padding: '6px 12px', borderRadius: '10px', boxShadow: 'inset 0 0 10px rgba(255,215,0,0.1)' }}>
              <FaCoins color="#FFD700" fontSize="1rem" />
              <span className="tk-tech-font" style={{ fontSize: '1.2rem', fontWeight: 900, background: 'linear-gradient(180deg, #FFD700 0%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.3))', lineHeight: 1 }}>15M ฿</span>
            </div>
          </div>
          <img src="/render_roger.webp" className="tk-oob-char" style={{ right: '-15px', height: '135%', bottom: '0', objectPosition: 'bottom left', filter: 'drop-shadow(-10px 10px 15px rgba(0,0,0,0.8))' }} alt="Roger" onError={(e)=>e.target.style.display='none'} />
        </div>

        {/* 4. PRIME LEADERBOARD (Bas Centre - 4 Colonnes) */}
        <div className="tk-premium-card" style={{ gridColumn: '5 / span 4', gridRow: '2', padding: '1.2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
          <div onClick={() => setOpenModal('prime')} className="tk-view-more-btn"><FaExpand /> VOIR TOUT</div>
          <div className="tk-premium-inner" style={{ borderTopColor: 'rgba(220, 20, 60, 0.3)' }}>
            <div className="tk-tech-grid" style={{ opacity: 0.3 }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at bottom right, rgba(220,20,60,0.08), transparent 80%)', zIndex: 0 }} />
            <div style={{ position: 'absolute', right: '5%', top: '30%', fontSize: '4rem', fontFamily: 'Montserrat', fontWeight: 900, color: 'rgba(255, 255, 255, 0.02)', transform: 'rotate(-10deg)', pointerEvents: 'none', zIndex: 0 }}>WANTED</div>
          </div>
          
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
               <FaMedal color="#DC143C" fontSize="1rem" style={{ filter: 'drop-shadow(0 0 5px rgba(220,20,60,0.5))' }}/>
               <h3 className="tk-text-metal" style={{ margin: 0, fontSize: '1rem', color: '#FFF' }}>CLASSEMENT PRIMES</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {topPrimes.map((prime) => (
                <div key={prime.rank} className="tk-list-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: prime.bg, padding: '6px 10px', borderRadius: '10px', border: `1px solid ${prime.border}`, borderLeft: `3px solid ${prime.color}`, backdropFilter: 'blur(5px)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <div className="tk-tech-font" style={{ color: prime.color, fontWeight: 900, fontSize: '1rem', width: '16px', textShadow: `0 0 10px ${prime.glow}` }}>#{prime.rank}</div>
                    
                    <div style={{ width: '22px', height: '22px', borderRadius: '6px', border: `1px solid ${prime.border}`, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={prime.avatar} alt={prime.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }} />
                    </div>

                    <div className="tk-tech-font" style={{ color: 'var(--text-main)', fontSize: '0.85rem', letterSpacing: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prime.name}</div>
                  </div>
                  
                  <div className="tk-tech-font" style={{ color: prime.color, fontWeight: 800, fontSize: '0.95rem', flexShrink: 0, textShadow: `0 0 10px ${prime.glow}` }}>{prime.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* =======================================================
          MODALES DE CLASSEMENT (POP-UPS)
      ======================================================= */}
      <AnimatePresence>
        {openModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(2,4,8,0.85)', backdropFilter: 'blur(15px)' }} onClick={() => setOpenModal(null)}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 20 }} 
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()} 
              className="tk-premium-card" 
              style={{ width: '600px', height: '70vh', maxHeight: '700px', display: 'flex', flexDirection: 'column', padding: '2.5rem', borderTop: `2px solid ${openModal === 'fortune' ? '#FFD700' : '#DC143C'}`, overflow: 'hidden' }}
            >
              <div className="tk-premium-inner" style={{ background: '#02040A' }}>
                 <div className="tk-tech-grid" style={{ opacity: 0.3 }} />
                 <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: `radial-gradient(circle at top, ${openModal === 'fortune' ? 'rgba(255,215,0,0.05)' : 'rgba(220,20,60,0.05)'}, transparent 60%)`, pointerEvents: 'none' }} />
              </div>

              {/* HEADER MODAL */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  {openModal === 'fortune' ? <FaCoins color="#FFD700" fontSize="2rem" style={{ filter: 'drop-shadow(0 0 10px rgba(255,215,0,0.5))' }} /> : <FaSkull color="#DC143C" fontSize="2rem" style={{ filter: 'drop-shadow(0 0 10px rgba(220,20,60,0.5))' }} />}
                  <h2 className="tk-text-metal" style={{ fontSize: '1.8rem', margin: 0, letterSpacing: '2px' }}>
                    {openModal === 'fortune' ? 'TOP_FORTUNES_GLOBAL' : 'BASE_DE_DONNÉES_PRIMES'}
                  </h2>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', cursor: 'pointer', color: 'var(--text-muted)', transition: '0.3s' }} onMouseOver={(e)=>{e.currentTarget.style.color='#ff4757'; e.currentTarget.style.background='rgba(255,71,87,0.1)'}} onMouseOut={(e)=>{e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='rgba(255,255,255,0.05)'}} onClick={() => setOpenModal(null)}>
                  <FaTimes fontSize="1.2rem" />
                </div>
              </div>

              {/* LISTE SCROLLABLE (Utilisation de la scrollbar custom du site) */}
              <div className="tk-modal-scroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '10px' }}>
                {(openModal === 'fortune' ? fullFortunes : fullPrimes).map(item => (
                   <div key={item.rank} className="tk-list-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: item.bg || 'rgba(255,255,255,0.02)', padding: '15px 20px', borderRadius: '14px', border: `1px solid ${item.border || 'rgba(255,255,255,0.05)'}`, borderLeft: `4px solid ${item.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <div className="tk-tech-font" style={{ color: item.color, fontWeight: 900, fontSize: '1.3rem', width: '30px', textAlign: 'center', textShadow: `0 0 10px ${item.color}80` }}>#{item.rank}</div>
                      
                      {item.avatar && (
                        <div style={{ width: '35px', height: '35px', borderRadius: '8px', border: `1px solid ${item.border}`, overflow: 'hidden', flexShrink: 0, boxShadow: `0 0 10px ${item.color}40` }}>
                          <img src={item.avatar} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      )}

                      <div className="tk-tech-font" style={{ color: '#FFF', fontSize: '1.1rem', letterSpacing: '1px' }}>{item.name}</div>
                    </div>
                    <div className="tk-tech-font" style={{ color: item.color, fontWeight: 800, fontSize: '1.2rem', textShadow: `0 0 10px ${item.color}60` }}>
                      {item.amount} {openModal === 'fortune' ? '' : <span style={{fontSize: '0.8rem', opacity: 0.8}}>฿</span>}
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